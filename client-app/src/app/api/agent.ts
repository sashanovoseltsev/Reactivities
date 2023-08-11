import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

const sleep = (delayMs: number) => new Promise(resolve => setTimeout(resolve, delayMs));

axios.defaults.baseURL = 'http://localhost:7007/api';

axios.interceptors.response.use(async response => {
  try {
    await sleep(1000);
    return response;
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
})

// axios.interceptors.request.use(async request => {
//   console.log('request interceptor');
//   console.log(request.baseURL);
//   console.log(request.url);
//   console.log(request.method);

//   return request;
// });

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T> (url: string) => axios.get<T>(url).then(responseBody),
  post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
  list: () => requests.get<Activity[]>('/activities'),
  details: (id: string) => requests.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => requests.post<void>('/activities', activity),
  update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent = {
  Activities
}

export default agent;