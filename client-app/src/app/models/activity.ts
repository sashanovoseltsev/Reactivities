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

export class Activity {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;

  constructor(
    id: string,
    title: string,
    date: Date | null,
    description: string,
    category: string,
    city: string,
    venue: string
  ) {
    this.id = id;
    this.title = title;
    this.date = date ? new Date(date!) : null;
    this.description = description;
    this.category = category;
    this.city = city;
    this.venue = venue;
  }

  static FromActivity(a: Activity): Activity {
    return new Activity(a.id, a.title, a.date, a.description, a.category, a.city, a.venue);
  }

  get dateFormatted() {
    return format(this.date!, dateFormat);
  }

  get dateTimeFormatted() {
    return format(this.date!, dateTimeFormat);
  }
}
