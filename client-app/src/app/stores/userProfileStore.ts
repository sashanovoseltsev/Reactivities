import { makeAutoObservable, reaction, runInAction } from "mobx";
import UserProfile, { Photo } from "../models/userProfile";
import agent from "../api/agent";
import { store } from "./store";

export default class UserProfileStore {
  userProfile: UserProfile | null = null;
  loadingProfile = false;
  uploading = false;
  loadingPhotos = false;
  loadingFollowers = false;
  followers: UserProfile[] = [];
  followings: UserProfile[] = [];
  activeTab = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 3) {
          this.loadFollowers();
          this.followings = [];
        } 
        else if (activeTab === 4)
        {
          this.loadFollowings();
          this.followers = [];
        }
        else {
          this.followers = [];
          this.followings = [];
        }
      }
    )
  }

  setActiveTab = (activeTab: number) => {
    this.activeTab = activeTab;
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

  updateProfile = async (profile: UserProfile) => {
    this.loadingProfile = true;
    try {
      await agent.Profiles.update(profile);
      runInAction(() => {
        this.updateProfileInfo(profile);
      })  
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingProfile = false;
      })
    }
  }

  private updateProfileInfo = (profile: UserProfile) => {
    this.userProfile = {...this.userProfile, ...profile};

    store.userStore.user!.displayName = profile.displayName;

    store.activityStore.activityRegistry.forEach((activity, _) => {
      if (activity.host.userName === profile.userName) {
        activity.host.displayName = profile.displayName;
      }

      activity.attendees.forEach(attendee => {
        if (attendee.userName === profile.userName) { 
          attendee.displayName = profile.displayName;
          attendee.bio = profile.bio;
        }
      })
    })
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
        this.updateMainPhotoUrl(this.userProfile?.userName!, photo);
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loadingPhotos = false)
    }
  }

  private updateMainPhotoUrl = (userName: string, photo: Photo) => {

    // Updates main photo info on current user profile
    this.userProfile!.photos!.find(p => p.isMain)!.isMain = false;
    this.userProfile!.photos!.find(p => p.id === photo.id)!.isMain = true;
    this.userProfile!.image = photo.url;

    // Update main photo info for current user on every loaded activity
    store.activityStore.activityRegistry
      .forEach((activity, _) => {
        if (activity.host.userName === userName) {
          activity.host.image = photo.url;
        }

        activity.attendees.forEach(attendee => {
          if (attendee.userName === userName) {
            attendee.image = photo.url;
          }
        })
      });
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

  loadFollowers = async () => {
    this.loadingFollowers = true;

    try {
      const followers = await agent.Follow.getFollowers(this.userProfile!.userName);
      runInAction(() => {
        this.followers = followers;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loadingFollowers = false)
    }
  }

  loadFollowings = async () => {
    this.loadingFollowers = true;

    try {
      const followings = await agent.Follow.getFollowings(this.userProfile!.userName);
      runInAction(() => {
        this.followings = followings;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => this.loadingFollowers = false)
    }
  }

  toggleFollow = async (profile: UserProfile) => {
    this.loadingFollowers = true
    try {
      await agent.Follow.followToggle(profile.userName);
      runInAction(() => {
        // is store.userStore.user follows profile.username
        const isFollowing = !profile.isFollowing;
        profile.isFollowing = isFollowing;

        // 1. if currently loaded user profile equals currently logged in user (on who's behalf we toggle follow)
        if (this.userProfile?.userName === store.userStore.user?.userName) {
          isFollowing
            ? this.userProfile!.followings++
            : this.userProfile!.followings--;

          this.followings = this.followings.filter(userProfile => userProfile.userName !== profile.userName);
        }

        const follower = this.followers.find(userProfile => userProfile.userName === profile.userName);
        if (follower) follower.followers += isFollowing ? 1 : -1;

        const following = this.followings.find(userProfile => userProfile.userName === profile.userName);
        if (following) following.followers += isFollowing ? 1 : -1;
        
        if (profile.userName === this.userProfile?.userName) {
          // 2. if currently loaded UserProfile equals the user we want to follow/unfollow then update same info
          this.userProfile!.isFollowing = isFollowing;
          isFollowing
            ? this.userProfile!.followers++
            : this.userProfile!.followers--;
        }

          // 3. on each activity in registry update same info in:
          // - host
          // - attendees
          Array.from(store.activityStore.activityRegistry.values()).forEach(activity => {
            if (activity.host.userName === profile.userName) {
              activity.host.isFollowing = isFollowing;
              isFollowing
                ? activity.host.followers++
                : activity.host.followers--;
            } else if (activity.host.userName === store.userStore.user?.userName) {
              isFollowing
                ? activity.host.followings++
                : activity.host.followings--;
            }

            activity.attendees.forEach(attendee => {
              if (attendee.userName === profile.userName) {
                attendee.isFollowing = isFollowing;
                isFollowing
                  ? attendee.followers++
                  : attendee.followers--;
              } else if (attendee.userName === store.userStore.user?.userName) {
                isFollowing
                  ? attendee.followings++
                  : attendee.followings--;
              }
            })
          })
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loadingFollowers = false;
      })
    }
  }
}