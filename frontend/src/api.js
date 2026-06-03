import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error.message;
    return Promise.reject(new Error(message));
  }
);

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const createProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const getRunReport = async (id) => {
  const response = await api.get(`/runs/${id}`);
  const testRun = response.data;
  const results = (testRun.testResults ?? []).map((result) =>
    Object.assign({}, result, {
      scenario: testRun.project.testScenarios.find(
        (s) => s.id === result.testScenarioId
      )
    })
  );
  return { project: testRun.project, testRun, results };
};

export const createScenario = async (projectId, data) => {
  const response = await api.post(`/projects/${projectId}/scenarios`, data);
  return response.data;
};

export const runTests = async (projectId) => {
  const response = await api.post(`/projects/${projectId}/run`);
  return response.data;
};

export const reviewTest = async (resultId, data) => {
  const response = await api.post(`/results/${resultId}/review`, data);
  return response.data;
};
