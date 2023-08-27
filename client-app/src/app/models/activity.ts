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
    isCancelled: boolean,
    host?: UserProfile,
    attendees?: UserProfile[],
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
    this.isCancelled = isCancelled;
    
    const user = store.userStore.user;
    this.host = host ?? user!;
    this.hostUserName = this.host.userName;
    this.attendees = attendees ?? [user!];
    this.isHost = isHost ?? user!.userName === this.hostUserName;
    this.isGoing = isGoing ?? this.attendees.some(a => user!.userName === a.userName);
  }

  static FromActivity(a: Activity): Activity {
    return new Activity(a.id, a.title, a.date, a.description, a.category, a.city, a.venue, a.isCancelled, a.host, a.attendees);
  }

  static FromActivityFormValues(a: ActivityFormValues) {
    return new Activity(a.id ?? '', a.title, a.date, a.description, a.category, a.city, a.venue, false);
  }

  get dateFormatted() {
    return format(this.date!, dateFormat);
  }

  get dateTimeFormatted() {
    return format(this.date!, dateTimeFormat);
  }
}
