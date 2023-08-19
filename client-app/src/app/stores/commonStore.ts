import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
  serverError: ServerError | null = null;
  jwtToken: string | null = localStorage.getItem('jwt');
  appLoaded: boolean = false;

  constructor() {
    makeAutoObservable(this);

    // reaction is only run when property jwtToken is changed.
    // In comparison to autorun?? which is executed on store instance initialization
    reaction(
      () => this.jwtToken, 
      token => {
        if (token) localStorage.setItem('jwt', token);
        else localStorage.removeItem('jwt');
      });
  }

  setServerError = (error: ServerError) => {
    this.serverError = error;
  }

  setToken = (token: string | null) => {
    this.jwtToken = token;
  }

  setAppLoaded = () => {
    this.appLoaded = true;
  }
}