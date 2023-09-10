import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { store } from "./store";
import ActivityFormValues from "../models/activityFormValues";


// I personally don't like that data is updated locally in addition to server App commands/requests.
// This duplicates server-side logic.
// Possinle solution:
// 1) Reload data each time from server;
// 2) Reload only the modified data;
// -- TODO: describe in more details. Like notify store each time data is changed, and which data, and load only updated;
// 3) Use caching service like Redis.

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  initialLoading = false; // used when activities are not loaded from server OR when single activity is loaded (in form or in details view)
  loading = false; // used when manipulations to already loaded activities are done
  selectedActivity: Activity | null = null;
  modifiedActivityId: string | null = null; //TODO

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
      .sort((a, b) => a.date!.getTime() - b.date!.getTime());
  }

  get activitiesGroupedByDate() {
    return this.activitiesByDate.reduce((activities, activity) => {
      const date = activity.dateFormatted;
      activities[date] = activities[date] ? [...activities[date], activity] : [activity];
      return activities;
    }, {} as {[key: string]: Activity[]})
  }

  loadActivities = async () => {
    this.initialLoading = true;
    try {
      // TS specific! Even thoug we obtain instance of type Activity from API, on this step it is only a data shape, not actual instance with class methods.
      // In order to have access to class methods, propper instance should be created using class's constructor.
      const activities = (await agent.Activities.list()).map(a => Activity.FromActivity(a));
      runInAction(() => {
        activities.forEach(activity => {
          this.addOrUpdateToActivityRegistry(activity);
        });
      })
    } catch (error) {
      console.log(error);
    }
    runInAction(() => {
      this.initialLoading = false;
    });
  }

  loadActivity = async (id: string) => {
    this.initialLoading = true;

    // to keep activity details info up-to-date we load it from server each time it is requested
    try {
      // TS specific! See comment in loadActivities.
      return Activity.FromActivity(await agent.Activities.details(id));
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.initialLoading = false;
      });
    }
  }

  createActivity = async (formValues: ActivityFormValues) => {
    this.loading = true;
    try {
      await agent.Activities.create(formValues);
      const activity = Activity.FromActivityFormValues(formValues);
      runInAction(() => {
        // Only add to registry in case activities were loaded.
        // Otherwise it will be only 1 activity in the registry, 
        // as ActivityDashboard only loads all activities in case registy is empty
        if (this.activityRegistry.size > 0)
          this.addOrUpdateToActivityRegistry(activity);
        this.selectActivity(activity);
      })
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateActivity = async (formValues: ActivityFormValues) => {
    this.loading = true;

    try {
      await agent.Activities.update(formValues);
      runInAction(() => {
        const existingActivity = this.selectedActivity;
        const updatedActivity = Activity.FromActivity({...existingActivity, ...formValues} as Activity);
        // Only update in registry in case activities were loaded.
        if (this.activityRegistry.size > 0)
          this.addOrUpdateToActivityRegistry(updatedActivity);
        this.selectActivity(updatedActivity);
      })
    } catch (error) {
      console.log(error);
    }

    runInAction(() => {
      this.loading = false;
    });
  }

  deleteActivity = async (id: string) => {
    this.loading = true;

    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }

    runInAction(() => {
      this.loading = false;
    });
  }

  selectActivity = (activity: Activity) => {
    this.selectedActivity = activity;
  }

  updateAttendance = async () => {
    this.loading = true;
    
    const activity = this.selectedActivity;
    if (!activity) return;

    try {
      const user = store.userStore.user!;

      await agent.Activities.updateAttendance(this.selectedActivity!.id);

      runInAction(() => {
        if (this.selectedActivity!.isGoing) {
          this.selectedActivity!.attendees = this.selectedActivity!.attendees.filter(x => x.userName !== user?.userName);
        } else {
          const userProfile = {
            userName: user.userName,
            displayName: user.displayName,
            bio: undefined,
            image: user.image
          }
          this.selectedActivity!.attendees.push(userProfile);
        }
        this.selectedActivity!.isGoing = !this.selectedActivity!.isGoing;
        
        //this.selectActivity(activity);
      })
    } catch (error) {
      console.log(error);
    }

    runInAction(() => {
      this.loading = false;
    });
  }

  cancelActivity = async () => {
    this.loading = true;
    const activity = this.selectedActivity!;

    try {
      await agent.Activities.updateAttendance(activity.id);
      runInAction(() => {
        activity.isCancelled = !activity.isCancelled;
      })
      // Only update in registry in case activities were loaded.
      if (this.activityRegistry.size > 0)
        this.addOrUpdateToActivityRegistry(activity);

      this.selectActivity(activity);

    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  private addOrUpdateToActivityRegistry = (activity: Activity) => {
    this.activityRegistry.set(activity.id, activity);
  }

  private getActivityFromRegistry = (id: string) => {
    return this.activityRegistry.get(id);
  }
}