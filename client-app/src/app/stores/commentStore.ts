import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/chatComment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    if (store.activityStore.selectedActivity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:7007/chat?activityId=' + activityId, {
          accessTokenFactory: () => store.userStore.user?.token!
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection.start().catch(error => console.log('Error establish connection: ' + error));

      this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
        runInAction(() => this.comments = comments.map(c => new ChatComment(c)));
      })

      this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
        runInAction(() => this.comments.unshift(new ChatComment(comment)));
      })
    }
  }

  stopHubConnection = () => {
    this.hubConnection?.stop().catch(error => console.log('Error stopping hub connection: ', error));
  }

  clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  }

  addComment = async (values: {body: string, activityId?: string}) => {
    values.activityId = store.activityStore.selectedActivity?.id;
    try {
      await this.hubConnection?.invoke('SendComment', values);
    } catch (error) {
      console.log(error);
    }
  }
  
}