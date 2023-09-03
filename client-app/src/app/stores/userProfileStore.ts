import { makeAutoObservable, runInAction } from "mobx";
import UserProfile, { Photo } from "../models/userProfile";
import agent from "../api/agent";
import { store } from "./store";

export default class UserProfileStore {
  userProfile: UserProfile | null = null;
  loadingProfile = false;
  uploading = false;
  loadingPhotos = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isCurrentUser() {
    return store.userStore.user && this.userProfile 
    && store.userStore.user.userName === this.userProfile.userName;
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.userProfile = profile;
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingProfile = false;
      })
    }

  }

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
        var response = await agent.Profiles.uploadPhoto(file);
        var photo = response.data;

        this.userProfile!.photos!.push(photo);

        if (!this.userProfile?.image) {
          photo.isMain = true;
          this.userProfile!.image = photo.url;
          store.userStore.setMainPhoto(photo.url);
        }
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.uploading = false);
    }
  }

  setMainPhoto = async (id: string) => {
    this.loadingPhotos = true;
    try {
      var photo = await agent.Profiles.setMainPhoto(id);
      store.userStore.setMainPhoto(photo.url);
      runInAction(() => {
        this.userProfile!.photos!.find(p => p.isMain)!.isMain = false;
        this.userProfile!.photos!.find(p => p.id === photo.id)!.isMain = true;
        this.userProfile!.image = photo.url;
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loadingPhotos = false)
    }
  }

  deletePhoto = async (photo: Photo) => {
    // deletion of main photo is prohibited
    if (photo.isMain) return;

    this.loadingPhotos = true;

    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.userProfile) {
          this.userProfile.photos = this.userProfile.photos?.filter(p => p.id !== photo.id);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loadingPhotos = false)
    }
  }
}