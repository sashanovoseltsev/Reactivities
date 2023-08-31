import { makeAutoObservable, runInAction } from "mobx";
import UserProfile from "../models/userProfile";
import agent from "../api/agent";
import { store } from "./store";

export default class UserProfileStore {
  userProfile: UserProfile | null = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isCurrentUser() {
    return store.userStore.user && this.userProfile 
    && store.userStore.user.userName === this.userProfile.userName;
  }

  loadProfile = async (username: string) => {
    this.loading = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.userProfile = profile;
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }

  }
}