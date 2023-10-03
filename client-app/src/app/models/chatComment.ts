import { format } from "date-fns";
import { makeAutoObservable } from "mobx";
import { dateFormat, dateTimeFormat } from "../common/formats/dateFormats";

export class ChatComment {
  id: number;
  createdAt: Date;
  body: string;
  userName: string;
  displayName: string;
  image: string;

  constructor(comment: ChatComment) {
    makeAutoObservable(this);
    this.id = comment.id;
    this.body = comment.body;

    console.log(comment.createdAt.toString());
    // UTC 'Z' postfix is not returned frob DB...
    if (!comment.createdAt.toString().endsWith('Z')) {
      this.createdAt = new Date(comment.createdAt + "Z");
    } else {
      this.createdAt = new Date(comment.createdAt);
    }
    this.displayName = comment.displayName;
    this.userName = comment.userName;
    this.image = comment.image;
  }

  get dateFormatted() {
    return format(this.createdAt, dateFormat);
  }

  get dateTimeFormatted() {
    return format(this.createdAt, dateTimeFormat);
  }
}