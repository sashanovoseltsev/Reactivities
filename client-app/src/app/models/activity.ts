import { v4 } from "uuid";

export class Activity {
  id: string = v4();
  title: string = '';
  date: string = '';
  description: string = '';
  category: string = '';
  city: string = '';
  venue: string = '';
}
