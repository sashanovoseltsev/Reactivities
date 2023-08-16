import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Route";

const sleep = (delayMs: number) => new Promise(resolve => setTimeout(resolve, delayMs));

axios.defaults.baseURL = 'http://localhost:7007/api';

axios.interceptors.response.use(async response => {
  await sleep(1000);
  return response;
}, (error: AxiosError) => {
  const { data, status, config } = error.response as AxiosResponse;
  switch (status) {
    case 400:
      if (config.method === 'get' && data.errors?.hasOwnProperty('id')) {
        router.navigate('/not-found');
      }
      if (data.errors) {
        var modalStateErrors = [];
        for (var key in data.errors) {
          data.errors[key] && modalStateErrors.push(data.errors[key]);
        }
        throw modalStateErrors.flat();
      } else {
        toast.error('bad request');
      }
      break;
    case 401:
      toast.error('unauthorised');
      break;
    case 403:
      toast.error('forbidden');
      break;
    case 404:
      router.navigate('/not-found');
      break;
    case 500:
      router.navigate('/server-error')
      break;
  }

  return Promise.reject(error);
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