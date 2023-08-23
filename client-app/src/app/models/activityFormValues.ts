import { Activity } from "./activity";

export default class ActivityFormValues {
  id?: string = undefined;
  title: string = '';
  date: Date | null = null;
  description: string = '';
  category: string = '';
  city: string = '';
  venue: string = '';

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      this.id = activity.id;
      this.title = activity.title;
      this.date = activity.date;
      this.description = activity.description;
      this.category = activity.category;
      this.city = activity.city;
      this.venue = activity.venue;
    }
  }

  static FromActivity(activity: Activity): ActivityFormValues {
    let a = new ActivityFormValues();
    a.id = activity.id;
    a.title = activity.title;
    a.date = activity.date;
    a.description = activity.description;
    a.category = activity.category;
    a.city = activity.city;
    a.venue = activity.venue;

    return a;
  }
}