import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Route";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (userInfo: UserFormValues) => {
    try {
      const user = await agent.Account.login(userInfo);
      store.commonStore.setToken(user.token);
      runInAction(() => {
        this.user = user;
      })
      router.navigate('/activities');
      store.modalStore.closeModal();      
    } catch (error) {
      throw error;
    }
  }

  register = async (userInfo: UserFormValues) => {
    try {
      const user = await agent.Account.register(userInfo);
      store.commonStore.setToken(user.token);
      runInAction(() => {
        this.user = user;
      })
      router.navigate('/activities');
      store.modalStore.closeModal();      
    } catch (error) {
      throw error;
    }
  }

  logout = () => {
    if (store.commonStore.jwtToken) {
      store.commonStore.setToken(null);
      this.user = null;
      router.navigate('/');
    }
  }

  getCurrentUser = async () => {
    try {
      const user = await agent.Account.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      // we only log error instead of throwing here because,
      // in such case we will only render empty activites page with unauthorized toast
      console.log(error);
    }
  }
}