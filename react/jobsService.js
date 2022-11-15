import axios from "axios";

const jobEndpoint = "";

const getJobsPage = (index, size) => {
  const config = {
    method: "GET",
    url: `${jobEndpoint}/paginate/?pageIndex=${index}&&pageSize=${size}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then((response) => {
    return response.data.item;
  });
};

const getJobsSearch = (index, size, query) => {
  const config = {
    method: "GET",
    url: `${jobEndpoint}/search/?pageIndex=${index}&pageSize=${size}&query=${query}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then((response) => {
    return response.data.item.pagedItems;
  });
};

const updateJob = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${jobEndpoint}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(() => {
    return {
      ...payload,
      id: id,
    };
  });
};

const addJob = (payload) => {
  const config = {
    method: "POST",
    url: jobEndpoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then((response) => {
    return {
      ...payload,
      id: response.data.item,
    };
  });
};

const deleteJob = (id) => {
  const config = {
    method: "DELETE",
    url: `${jobEndpoint}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(() => {
    return id;
  });
};
const jobsService = {
  getJobsPage,
  getJobsSearch,
  updateJob,
  addJob,
  deleteJob,
};
export default jobsService;
