import React from "react";
import { Formik, Field, Form } from "formik";
import FormLogger from "../../Formik/FormLogger";

function JobsInfo(props) {
  console.log(props);
  const { job } = props;
  const {
    // Loki props
    backLabel,
    nextLabel,
    onBack,
    onNext,
    cantBack,
    // isInFinalStep,
  } = props;

  return (
    <>
      <Formik initialValues={job} enableReinitialize={true} onSubmit={onNext}>
        {({ isValid, isSubmitting, dirty }) => (
          <Form>
            <FormLogger />

            <div className="d-flex wrapper justify-content-center my-6">
              <div className="jobForm form-group col-5 my-5 px-4 py-3">
                <h3 className="fw-bold text-center my-3">Job Information</h3>
                <label className="fw-bold" htmlFor="inputTitle">
                  Job title
                </label>
                <Field
                  className="form-control jobInput formInputText my-3"
                  name="title"
                  id="inputTitle"
                  placeholder="Software Engineer"
                />
                <label className="fw-bold" htmlFor="inputDescription">
                  Description
                </label>
                <Field
                  type="text"
                  className="form-control jobInput formInputText my-3"
                  name="description"
                  id="inputDescription"
                  placeholder="The overall goal of the position is to etc."
                />
                <label className="fw-bold" htmlFor="inputSummary">
                  Summary
                </label>
                <Field
                  type="text"
                  className="form-control jobInput formInputText  my-3"
                  name="summary"
                  id="inputSummary"
                  placeholder="Position x is responsible for doing y,z."
                />

                <label className="fw-bold" htmlFor="inputSlug">
                  Slug
                </label>
                <Field
                  type="text"
                  className="form-control jobInput formInputText my-3"
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
                  className="form-control jobInput formInputText my-3"
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
                <div className="button-group text-center">
                  <button
                    type="button"
                    className="btn btn-lg btn-secondary mx-2"
                    onClick={onBack}
                    disabled={isSubmitting || cantBack}
                  >
                    {backLabel}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary mx-2"
                    disabled={!isValid || isSubmitting || !dirty}
                  >
                    {nextLabel}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default JobsInfo;
