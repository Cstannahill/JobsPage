import React, { useState, useEffect } from "react";
import jobsService from "../../services/jobsService";
import toastr from "toastr";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, FieldArray } from "formik";
import FormLogger from "../Formik/FormLogger";
import techService from "../../services/techService";

function JobsData() {
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
          newData.currentTechCoOptions = [state.payload].map(mapCurrentCo);
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

  const mapCurrentCo = (job) => {
    return (
      <option value={job.techCompanyId} key={`co${job.techCompanyId}`}>
        {job.techCompanyName}
      </option>
    );
  };
  const mapCo = (co) => {
    return (
      <option value={co.id} key={`co${co.id}`}>
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

  return (
    <React.Fragment>
      <main role="main">
        <div className="container">
          <h1 className="display-5 fw-bold text-center my-3">
            Job Information
          </h1>
          <Formik
            enableReinitialize={true}
            initialValues={jobsFormData}
            onSubmit={onSubmitJobData}
          >
            {({ values }) => (
              <Form>
                <FormLogger />
                <div className="d-flex wrapper justify-content-center my-6">
                  <div className="jobForm form-group col-5 my-3 px-4 py-3">
                    <label className="fw-bold" htmlFor="inputTitle">
                      Job title
                    </label>
                    <Field
                      type="text"
                      className="form-control jobInput my-3"
                      name="title"
                      id="inputTitle"
                      placeholder="Software Engineer"
                    />
                    <label className="fw-bold" htmlFor="inputDescription">
                      Description
                    </label>
                    <Field
                      type="text"
                      className="form-control jobInput my-3"
                      name="description"
                      id="inputDescription"
                      placeholder="The overall goal of the position is to etc."
                    />
                    <label className="fw-bold" htmlFor="inputSummary">
                      Summary
                    </label>
                    <Field
                      type="text"
                      className="form-control jobInput my-3"
                      name="summary"
                      id="inputSummary"
                      placeholder="Position x is responsible for doing y,z."
                    />
                    <label className="fw-bold" htmlFor="inputPay">
                      Pay
                    </label>
                    <Field
                      type="text"
                      className="form-control jobInput my-3"
                      name="pay"
                      id="inputPay"
                      placeholder="$80,000"
                    />
                    <label className="fw-bold" htmlFor="inputSlug">
                      Slug
                    </label>
                    <Field
                      type="text"
                      className="form-control jobInput  my-3"
                      name="slug"
                      id="inputSlug"
                      placeholder="xyz123992"
                    />
                    <label className="fw-bold" htmlFor="inputStatusId">
                      Status
                    </label>
                    <Field
                      component="select"
                      type="text"
                      className="form-control jobInput my-3"
                      name="statusId"
                      id="inputStatusId"
                      placeholder="Active, Flagged, Deleted, Not Set"
                      style={{
                        appearance: "menulist",
                      }}
                    >
                      <option value={0} key={`status${0}`}>
                        {"Not Set"}
                      </option>

                      <option value={1} key={`status${1}`}>
                        {"Active"}
                      </option>

                      <option value={2} key={`status${2}`}>
                        {" "}
                        {"Deleted"}
                      </option>

                      <option value={3} key={`status${3}`}>
                        {" "}
                        {"Flagged"}
                      </option>
                    </Field>
                    <label className="fw-bold" htmlFor="inputTechCo">
                      Tech Company
                    </label>
                    <Field
                      component="select"
                      type="text"
                      className="form-control jobInput my-3"
                      name="techCompanyId"
                      id="inputTechCo"
                      style={{
                        appearance: "menulist",
                      }}
                    >
                      {optionsData.techCoOptions.length >= 1 &&
                        optionsData.techCoOptions}
                    </Field>
                    <label className="fw-bold" htmlFor="inputSkills">
                      Skills
                    </label>
                    <FieldArray name="skills">
                      {({ push, remove }) => (
                        <div>
                          <button
                            className="btn btn-success addSkillButton"
                            type="button"
                            onClick={() => push("")}
                          >
                            Add
                          </button>
                          {values.skills.map((skill, index) => (
                            <div
                              className="row my-2"
                              key={index}
                              style={{ width: "100%" }}
                            >
                              <div className="col-10 my-1">
                                <Field
                                  type="text"
                                  name={`skills.${index}`}
                                  className="form-control jobInput jobSkillField"
                                  placeholder="skills"
                                />
                              </div>
                              <div className="col-1 skillBtnCol">
                                <button
                                  className="btn btn-danger"
                                  type="button"
                                  onClick={() => {
                                    remove(index);
                                  }}
                                >
                                  remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                    <button
                      type="submit"
                      className="btn btn-lg my-2 btn-silver submitFormButton col-12"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </React.Fragment>
  );
}

export default JobsData;
