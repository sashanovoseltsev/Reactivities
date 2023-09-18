import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Route";

export default class UserStore {
  user: User | null = null;
  loadingUser: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (userInfo: UserFormValues) => {
    this.loadingUser = true;
    try {
      const user = await agent.Account.login(userInfo);
      runInAction(() => {
        store.commonStore.setToken(user.token);
        // reload activities to update host information
        store.activityStore.loadActivities();
        this.user = user;
        router.navigate('/activities');
        store.modalStore.closeModal();      
      })
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loadingUser = false;
      })
    }
    
  }

  register = async (userInfo: UserFormValues) => {
    this.loadingUser = true;
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
    } finally {
      runInAction(() => {
        this.loadingUser = false;
      })
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
    this.loadingUser = true;
    try {
      const user = await agent.Account.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      // we only log error instead of throwing here because,
      // in such case we will only render empty activites page with unauthorized toast
      console.log(error);
      // also set token to null. In such case it means that token is expired.
      store.commonStore.setToken(null);
    } finally {
      runInAction(() => {
        this.loadingUser = false;
      })
    }
  }

  setMainPhoto = (imageUrl: string) => {
    if (this.user) this.user.image = imageUrl;
  }
}