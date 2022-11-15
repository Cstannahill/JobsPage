import React, { useState, useEffect } from "react";
import jobsService from "../../services/jobsService";
import toastr from "toastr";
import { useLocation } from "react-router-dom";
import Loki from "react-loki";
import JobsInfo from "./LokiJobs/JobInfo";
import JobSkills from "./LokiJobs/JobSkills";
import "./loki.css";
import techService from "../../services/techService";
import { faCode, faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LokiJobs() {
  const [jobsFormData, setJobsFormData] = useState({
    title: "",
    description: "",
    summary: "",
    pay: "",
    slug: "",
    statusId: "",
    techCompanyId: "",
    techCompanyName: "",
    skills: [],
    id: "",
  });

  const [optionsData, setOptionsData] = useState({
    techCoOptions: [],
    currentTechCoOptions: [],
  });

  const location = useLocation();
  const { state } = useLocation();
  console.log(location);
  useEffect(() => {
    if (state?.type === "edit_Job" && state?.payload) {
      setJobsFormData((prevState) => {
        let newFormData = { ...prevState };
        newFormData = state.payload;
        console.log("stateChanged");
        setOptionsData((prevState) => {
          const newData = { ...prevState };

          return newData;
        });
        return newFormData;
      });
    }
  }, []);
  false && console.log(optionsData, setOptionsData);

  useEffect(() => {
    techService
      .getAllTechCo()
      .then(onGetTechCosSuccess)
      .catch(onGetTechCosError);
  }, []);

  const onGetTechCosSuccess = (response) => {
    console.log(response);
    setOptionsData((prevState) => {
      const newData = { ...prevState };
      newData.companies = response.items;
      newData.techCoOptions = newData.companies.map(mapCo);
      return newData;
    });
  };

  const mapCo = (co) => {
    return (
      <option value={co.id} key={`co1${co.id}`}>
        {co.name}
      </option>
    );
  };

  const onGetTechCosError = (err) => {
    console.log(err);
  };

  const onSubmitJobData = (values) => {
    if (jobsFormData.id !== "") {
      jobsService
        .updateJob(values.id, values)
        .then(onUpdateJobSuccess)
        .catch(onUpdateJobError);
    } else {
      jobsService.addJob(values).then(onAddJobSuccess).catch(onAddJobError);
    }
  };

  const onAddJobSuccess = (response) => {
    console.log("Add success", response);
    toastr.success("Job has been successfully added.");
    setJobsFormData((prevState) => {
      const newJobData = {
        ...prevState,
      };
      newJobData.id = response.id;
      console.log(newJobData);
      return newJobData;
    });
  };

  const onAddJobError = (error) => {
    console.warn("Add Error", error);
    toastr.error("There was an error adding your job.");
  };

  const onUpdateJobSuccess = (response) => {
    console.log("Update Success:", response);
    toastr.success("Job has been successfully updated.");
    setJobsFormData((prevState) => {
      console.log("updater onChange");
      let newJobData = {
        ...prevState,
      };
      newJobData = response;
      console.log(newJobData);
      return newJobData;
    });
  };

  const onUpdateJobError = (error) => {
    console.warn("Update Error", error);
    toastr.error("There was an error updating your job.");
  };

  const complexSteps = [
    {
      label: "Step 1",
      icon: <FontAwesomeIcon icon={faClipboard} className="mt-3 lokiCenter" />,
      component: <JobsInfo job={jobsFormData} />,
    },
    {
      label: "Step 2",
      icon: <FontAwesomeIcon icon={faCode} className="mt-3 lokiCenter" />,
      component: (
        <JobSkills job={jobsFormData} techOptions={optionsData.techCoOptions} />
      ),
    },
  ];

  const _mergeValues = (values) => {
    setJobsFormData((prevState) => {
      const newState = { ...prevState, ...values };
      return newState;
    });
  };

  const _finishWizard = (values) => {
    setJobsFormData((prevState) => {
      const newState = { ...prevState, ...values };
      console.log(newState, onSubmitJobData);
      onSubmitJobData(values);
      return newState;
    });
  };

  return (
    <>
      <div className="container col-6">
        <Loki
          steps={complexSteps}
          onNext={_mergeValues.bind()}
          onBack={_mergeValues.bind()}
          onFinish={_finishWizard.bind()}
          noActions
        />
      </div>
    </>
  );
}
export default LokiJobs;
