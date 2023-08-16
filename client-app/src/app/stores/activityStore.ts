import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { dateFormat } from "../common/formats/dateFormats";
import { format } from "date-fns";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
      .sort((a, b) => a.date!.getTime() - b.date!.getTime());
  }

  get activitiesGroupedByDate() {
    return Array.from(this.activityRegistry.values()).reduce((activities, activity) => {
      const date = format(activity.date!, dateFormat);
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as {[key: string]: Activity[]})
  }

  loadActivities = async () => {
    this.setInitialLoading(true);
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach(activity => {
          this.addToActivityRegistry(activity);
        });
      })
      this.setInitialLoading(false);
    } catch (error) {
      console.log(error);
      this.setInitialLoading(false);
    }
  }

  // NOTE: doesn't add to registry!
  loadActivity = async (id: string) => {
    this.setInitialLoading(true);
    let activity = this.getActivityFromRegistry(id);

    if (!activity) {
      this.setInitialLoading(true);
      try {
        activity = await agent.Activities.details(id);
      } catch (error) {
        console.log(error);
      }
    }
    
    this.setInitialLoading(false);
    return activity;
  }

  createActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  private addToActivityRegistry = (activity: Activity) => {
    activity.date = new Date(activity.date!);
    this.activityRegistry.set(activity.id, activity);
  }

  private getActivityFromRegistry = (id: string) => {
    return this.activityRegistry.get(id);
  }

  private setInitialLoading = (state: boolean) => {
    this.loadingInitial = state;
  }
}