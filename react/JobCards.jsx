import React from "react";

function MapJobs(props) {
  const { job } = props;
  const onViewMoreClicked = () => {
    props.toggleModal(job);
  };

  const onEdit = () => {
    props.onEditClicked(job);
  };

  const onDelete = () => {
    props.onDeleteClicked(job);
  };

  return (
    <div className="card jobCard col-lg-3 text-dark col-md-6 col-sm-12 border border-secondary border-2 m-4">
      <img
        className="jobCard card-img-top"
        src={job.primaryImage.url}
        alt="alt"
        height={280}
      />
      <div className="d-flex flex-column justify-content-center card-body">
        <h5 className="card-title text-center fw-bold">${job.pay}</h5>
        <p className="card-text text-center fw-bold ">{job.title}</p>
        <button
          className="jobCard btn-sm btn-dark my-2"
          onClick={onViewMoreClicked}
        >
          View More
        </button>
        <button className="jobCard btn-sm btn-primary my-1" onClick={onEdit}>
          Edit
        </button>
        <button className="jobCard btn-sm btn-danger " onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default MapJobs;
