import React, { useState, useEffect, useCallback } from "react";
import toastr from "toastr";
import { Link, useNavigate } from "react-router-dom";
import jobsService from "../../services/jobsService";
import JobCards from "./JobCards";
import "./jobs.css";
import SelectPagesForm from "../selectPage/SelectPagesForm";
import JobsModal from "../modal/JobsModal";
import swal from "@sweetalert/with-react";
import debug from "sabio-debug";
const _logger = debug.extend("Jobs");

function Jobs() {
  const [jobData, setJobData] = useState({
    arrayOfJobs: [],
    jobComponents: [],
  });
  const [pgValue, setPageValue] = useState({
    count: 9,
    pageSize: 6,
    pageIndex: 0,
    current: 1,
  });
  const [showCard, setShowCard] = useState({
    show: true,
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    show: false,
    title: "",
    company: "",
    description: "",
    pay: "",
    skills: "",
    summary: "",
  });
  const [searchQuery, setSearchQuery] = useState({
    query: "",
  });
  const navigate = useNavigate();

  const toggleModal = useCallback((job) => {
    //mapping job skills here initially to format it into an array of names(strings) and formatting grabbing only what is needed for display on modal to set in modalState to pass via props
    //receiving job by calling this function on the JobCard component from props(props.toggleModal(job)) to retrieve the prop of the specific job that was passed to the card initially during mapping
    _logger(job);
    const jobSkills = job.skills.map((skills) => skills.name);
    setModalState((prevState) => {
      const modalInfo = { ...prevState };
      modalInfo.title = job.title;
      modalInfo.company = job.techCompanyName;
      modalInfo.description = job.description;
      modalInfo.pay = job.pay;
      modalInfo.skills = jobSkills;
      modalInfo.summary = job.summary;
      modalInfo.isOpen = !prevState.isOpen;
      modalInfo.show = !prevState.show;
      _logger(modalInfo);
      return modalInfo;
    });
  }, []);

  const closeModal = () => {
    //onClick sent to modal for close button that ONLY changed visibility settings
    setModalState((prevState) => {
      const modalInfo = { ...prevState };
      modalInfo.isOpen = !prevState.isOpen;
      modalInfo.show = !prevState.show;
      return modalInfo;
    });
  };
  const onSearchQueryChange = (e) => {
    //updater function for searchQuery state when input is typed in
    _logger(searchQuery);
    const target = e.target;
    const targetVal = target.value;
    const targetName = target.name;
    setSearchQuery((prevState) => {
      const newQuery = { ...prevState };
      newQuery[targetName] = targetVal;
      return newQuery;
    });
  };

  const onSubmitSearch = (e) => {
    //makes call to getJobsSearch IF there is a query in state(input in search field) if not makes initial getJobsPage call allowing user to reset cards essentially if previously searched
    _logger(e);
    e.preventDefault();
    if (searchQuery.query) {
      jobsService
        .getJobsSearch(pgValue.pageIndex, pgValue.pageSize, searchQuery.query)
        .then(onGetJobsSearchSuccess)
        .catch(onGetJobsSearchError);
    } else {
      jobsService
        .getJobsPage(pgValue.pageIndex, pgValue.pageSize)
        .then(onGetJobsPageSuccess)
        .catch(onGetJobsPageError);
    }
  };

  const onDeleteRequest = useCallback((job) => {
    //retrieving job by calling this function via props on the JobCards page, using that ID to send for the deleteJob request
    _logger(job.id);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this job",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        jobsService
          .deleteJob(job.id)
          .then(onDeleteSuccess)
          .catch(onDeleteJobError);
      } else {
        swal("Your job has not been deleted.");
      }
    });
  }, []);

  const onDeleteSuccess = (response) => {
    //on successful response of the deleteJob call, updating job state by finding the index of the returned ID, finding the index of it in the array of jobs we have in state, splicing it out and remapping the JSX array of jobs to update the DOM
    _logger("DeleteSuccessHandler", response.id);
    setJobData((prevState) => {
      const newJobData = { ...prevState };
      newJobData.arrayOfJobs = [...newJobData.arrayOfJobs];
      const indxOf = newJobData.arrayOfJobs.findIndex((job) => {
        let result = false;
        if (job.id === response) {
          result = true;
        }
        return result;
      });
      if (indxOf >= 0) {
        newJobData.arrayOfJobs.splice(indxOf, 1);
        newJobData.jobComponents = newJobData.arrayOfJobs.map(mapJobs);
        swal("Job Deleted!", {
          icon: "success",
        });
      }
      return newJobData;
    });
  };

  const onDeleteJobError = (error) => {
    console.warn("error deleting job: ", error);
  };

  const onGetJobsSearchSuccess = (response) => {
    //setting the response of a getJobsSearch into state; array of job objects, and an array of JSX components to be displayed on the page
    toastr.success("Search Successful");
    _logger("Jobs By Search Success: ", response);
    let newArrayofJobs = response;
    setJobData((prevState) => {
      const newJobData = { ...prevState };
      newJobData.arrayOfJobs = newArrayofJobs;
      newJobData.jobComponents = newArrayofJobs.map(mapJobs);
      return newJobData;
    });
  };

  const onGetJobsSearchError = (error) => {
    toastr.error("There was an Error during the search.");
    console.warn("Error Searching For Jobs: ", error);
  };
  useEffect(() => {
    //use effect to make call to getJobsPage to initially retrieve jobs when the page loads as well as when the current page changes or the page size is changed
    jobsService
      .getJobsPage(pgValue.pageIndex, pgValue.pageSize)
      .then(onGetJobsPageSuccess)
      .catch(onGetJobsPageError);
  }, [pgValue.pageSize, pgValue.current]);

  const onEditRequest = useCallback((job) => {
    //mapping skills into array of names(strings), formatting the rest of state to be only what is needed and then navigating to Form page with it
    const skillToSend = job.skills.map((skill) => skill.name);
    const jobState = {
      title: job.title,
      description: job.description,
      summary: job.summary,
      pay: job.pay,
      slug: job.slug,
      statusId: job.statusId,
      techCompanyId: job.techCompanyId,
      techCompanyName: job.techCompanyName,
      skills: skillToSend,
      id: job.id,
    };
    const stateToSend = { type: "edit_Job", payload: jobState };
    navigate(`/jobs/${job.id}`, { state: stateToSend });
  }, []);

  const onGetJobsPageSuccess = (response) => {
    //updating jobData state to array of the jobs coming back, as well as mapping them into an array of JSX components to display on the page
    _logger("Get jobs page successful: ", response);
    let newArrayofJobs = response.pagedItems;
    setJobData((prevState) => {
      const updatedJobData = { ...prevState };
      updatedJobData.arrayOfJobs = newArrayofJobs;
      updatedJobData.jobComponents = newArrayofJobs.map(mapJobs);
      return updatedJobData;
    });
    setPageValue((prevState) => {
      const pageData = { ...prevState };
      pageData.count = response.totalCount;
      return pageData;
    });
  };

  const onGetJobsPageError = (error) => {
    console.warn("Error getting page: ", error);
    toastr.error("There was an error retrieving the job postings.");
  };

  const onPageChange = (page) => {
    //updates pageValue state properties of current and pageIndex for pagination component when page is changed
    setPageValue((prevState) => {
      const newPage = { ...prevState };
      newPage.current = page;
      newPage.pageIndex = newPage.current - 1;
      return newPage;
    });
  };
  const onSelectPageSize = (event) => {
    //updates state for the select page size component with the value selected
    const target = event.target;
    const newVal = target.value;
    setPageValue((prevState) => {
      const newValue = { ...prevState };
      _logger(newValue);
      newValue.pageSize = Number(newVal);

      return newValue;
    });
  };

  const onVisibilityClicked = () => {
    //sets showCard state to the opposite of what it was set to onClick allowing a toggle of conditionally rendering the cards
    setShowCard((prevState) => {
      const showState = { ...showCard };
      showState.show = !prevState.show;
      return showState;
    });
  };

  const mapJobs = (job) => {
    //initial mapping function to map each job to a card
    return (
      <JobCards
        job={job}
        key={job.id}
        toggleModal={toggleModal}
        onEditClicked={onEditRequest}
        onDeleteClicked={onDeleteRequest}
      />
    );
  };

  const renderJobs = () => {
    return (
      <div className="row flex-wrap d-flex card-deck justify-content-center">
        {jobData.jobComponents}
      </div>
    );
  };

  return (
    <React.Fragment>
      <main role="main" className="jobs">
        <div className="container jobs">
          <div className="formDiv d-flex align-items-center">
            <h5 className="mx-1">Search Jobs:</h5>
            <form className="form-inline jobsSearchForm ">
              <input
                className="form-control form-inline mx-1 jobsSearch"
                type="search"
                placeholder="Search"
                aria-label="Search"
                name="query"
                onChange={onSearchQueryChange}
              />
              <button
                className="btn btn-secondary searchJob mx-2 align-top"
                type="submit"
                onClick={onSubmitSearch}
              >
                Search
              </button>
            </form>

            <button
              className="btn btn-md btn-silver my-4 mx-2 rowButton"
              onClick={onVisibilityClicked}
            >
              {showCard.show && "Hide Jobs"}
              {!showCard.show && "Show Jobs"}
            </button>
            <Link
              className="btn btn-success rowButton mx-2"
              to={"new"}
              type="btn"
            >
              + Add Job
            </Link>
          </div>
          <div className="p-2 mb-4 rounded-3 eventHeader">
            <div className="container text-center jobs d-inline-block">
              <h1 className="display-5 fw-bold text-center text-dark jobs">
                Jobs
              </h1>
              <SelectPagesForm
                pgInfo={pgValue}
                changePageSize={onSelectPageSize}
                onPageChange={onPageChange}
              />
            </div>
          </div>
          {showCard.show && renderJobs()}
          <hr />
        </div>
        <JobsModal
          show={modalState.show}
          closeModal={closeModal}
          title={`${modalState.title}`}
          contentOne={`${modalState.company}`}
          contentTwo={`${modalState.description}`}
          contentThree={`${modalState.pay}`}
          contentFour={`${modalState.skills}`}
          contentFive={`${modalState.summary}`}
        />
      </main>
    </React.Fragment>
  );
}

export default Jobs;
