// export interface Activity {
//   id: string;
//   title: string;
//   date: Date | null;
//   description: string;
//   category: string;
//   city: string;
//   venue: string;
// }

import { format } from "date-fns";
import { dateFormat, dateTimeFormat } from "../common/formats/dateFormats";
import UserProfile from "./userProfile";
import { store } from "../stores/store";
import ActivityFormValues from "./activityFormValues";

export class Activity {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  hostUserName: string;
  isCancelled: boolean;
  isGoing: boolean;
  isHost: boolean;
  host: UserProfile;
  attendees: UserProfile[];

  constructor(
    id: string,
    title: string,
    date: Date | null,
    description: string,
    category: string,
    city: string,
    venue: string,
    hostUserName: string,
    isCancelled: boolean,
    attendees: UserProfile[],
    isGoing?: boolean,
    isHost?: boolean
  ) {
    this.id = id;
    this.title = title;
    this.date = date ? new Date(date!) : null;
    this.description = description;
    this.category = category;
    this.city = city;
    this.venue = venue;
    this.hostUserName = hostUserName;
    this.isCancelled = isCancelled;
    this.attendees = attendees;

    const user = store.userStore.user;
    this.host = attendees.find(a => a.userName === this.hostUserName)!;
    this.isHost = isHost ?? user!.userName === this.hostUserName;
    this.isGoing = isGoing ?? attendees.some(a => user!.userName === a.userName);
  }

  static FromActivity(a: Activity): Activity {
    return new Activity(a.id, a.title, a.date, a.description, a.category, a.city, a.venue, a.hostUserName, a.isCancelled, a.attendees);
  }

  static FromActivityFormValues(a: ActivityFormValues) {
    const user = store.userStore.user!;
    return new Activity(a.id ?? '', a.title, a.date, a.description, a.category, a.city, a.venue, user.userName, false, [user]);
  }

  get dateFormatted() {
    return format(this.date!, dateFormat);
  }

  get dateTimeFormatted() {
    return format(this.date!, dateTimeFormat);
  }
}
