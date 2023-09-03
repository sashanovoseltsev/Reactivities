import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Route";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";
import ActivityFormValues from "../models/activityFormValues";
import UserProfile, { Photo } from "../models/userProfile";

const sleep = (delayMs: number) => new Promise(resolve => setTimeout(resolve, delayMs));

axios.defaults.baseURL = 'http://localhost:7007/api';

axios.interceptors.request.use(config => {
  const token = store.commonStore.jwtToken;
  if (token && config) config.headers.Authorization = `Bearer ${token}`;

  return config;
})

axios.interceptors.response.use(async response => {
  await sleep(500);
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
  create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
  update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del<void>(`/activities/${id}`),
  updateAttendance: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
  current: () => requests.get<User>('/account'),
  login: (userInfo: UserFormValues) => requests.post<User>('/account/login', userInfo),
  register: (userInfo: UserFormValues) => requests.post<User>('/account/register', userInfo)
}

const Profiles = {
  get: (username: string) => requests.get<UserProfile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    })
  },
  setMainPhoto: (photoId: string) => requests.post<Photo>(`/photos/${photoId}/setMain`, {}),
  deletePhoto: (photoId: string) => requests.del(`/photos/${photoId}`)
}

const agent = {
  Activities,
  Account,
  Profiles
}

export default agent;