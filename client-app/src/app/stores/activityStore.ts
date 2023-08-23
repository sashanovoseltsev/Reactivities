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
  loading = false;
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
    this.loading = true;
    try {
      const activities = (await agent.Activities.list()).map(a => Activity.FromActivity(a));
      runInAction(() => {
        activities.forEach(activity => {
          this.addToActivityRegistry(activity);
        });
      })
    } catch (error) {
      console.log(error);
    }
    runInAction(() => {
      this.loading = false;
    });
  }

  loadActivity = async (id: string) => {
    this.loading = true;
    let activity = this.getActivityFromRegistry(id);

    if (!activity) {
      try {
        activity = Activity.FromActivity(await agent.Activities.details(id));
      } catch (error) {
        console.log(error);
      }
    }
    
    runInAction(() => {
      this.loading = false;
    });
    return activity;
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
          this.addToActivityRegistry(activity);
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
          this.addToActivityRegistry(updatedActivity);
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

      await agent.Activities.updateAttendance(activity.id);

      runInAction(() => {
        if (activity.isGoing) {
          activity.attendees = activity.attendees.filter(x => x.userName !== user?.userName);
        } else {
          const userProfile = {
            userName: user.userName,
            displayName: user.displayName,
            bio: undefined,
            image: user.image
          }
          activity.attendees.push(userProfile);
        }
        activity.isGoing = !activity.isGoing;
        
        // we need to create new instance for selectedActivity to trigger re-render of activity details components.
        this.selectActivity(Activity.FromActivity(activity));
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
      activity.isCancelled = !activity.isCancelled;
      // Only update in registry in case activities were loaded.
      if (this.activityRegistry.size > 0)
        this.addToActivityRegistry(activity);
      this.selectActivity(Activity.FromActivity(activity));

    } catch (error) {
      console.log(error);
    }

    runInAction(() => {
      this.loading = false;
    });
  }

  private addToActivityRegistry = (activity: Activity) => {
    this.activityRegistry.set(activity.id, activity);
  }

  private getActivityFromRegistry = (id: string) => {
    return this.activityRegistry.get(id);
  }
}