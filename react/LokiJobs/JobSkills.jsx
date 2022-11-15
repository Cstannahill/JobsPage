import React from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import FormLogger from "../../Formik/FormLogger";

const JobSkills = (props) => {
  const { job } = props;
  const { techOptions } = props;
  const {
    // Formik HOC props
    // values,
    // touched,
    // errors,
    isSubmitting,
    // handleChange,
    // handleBlur,
    // handleSubmit,

    // Loki props
    backLabel,
    nextLabel,
    onBack,
    onNext,
    cantBack,
    // isInFinalStep,
  } = props;

  return (
    <Formik initialValues={job} enableReinitialize={true} onSubmit={onNext}>
      {({ values }) => (
        <Form className="p-1">
          <FormLogger />

          <div className="d-flex wrapper justify-content-center my-6">
            <div className="jobForm form-group col-5 my-5 px-4 py-3">
              <h3 className=" fw-bold text-center my-3">
                Skills, Pay, Company
              </h3>
              <label className="fw-bold" htmlFor="inputPay">
                Pay
              </label>

              <Field
                type="text"
                className="form-control jobInput formInputText my-3"
                name="pay"
                id="inputPay"
                placeholder="80,000"
              />

              <label className="fw-bold" htmlFor="inputTechCo">
                Tech Company
              </label>
              <Field
                component="select"
                type="text"
                className="form-control formInputText jobInput my-3"
                name="techCompanyId"
                id="inputTechCo"
                style={{
                  appearance: "menulist",
                }}
              >
                {techOptions.length >= 1 && techOptions}
              </Field>
              <label className="fw-bold" htmlFor="inputStatusId">
                {values?.skills && `Skills: ${values.skills.join(", ")}`}
              </label>
              <FieldArray name="skills">
                {({ push, remove }) => (
                  <div>
                    <button
                      className="btn btn-primary px-5 my-1"
                      type="button"
                      onClick={() => push("")}
                    >
                      Add
                    </button>
                    {values?.skills?.length >= 1 &&
                      values?.skills.map((skill, index) => (
                        <div
                          className="row my-2"
                          key={index}
                          style={{ width: "100%" }}
                        >
                          <div className="col-10">
                            <Field
                              name={`skills.${index}`}
                              className="form-control  formInputText jobSkillField"
                              placeholder="skills"
                            />
                          </div>
                          <div className="col-1">
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
                  disabled={isSubmitting}
                >
                  {nextLabel}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default JobSkills;
