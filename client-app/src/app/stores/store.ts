import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";
import UserProfileStore from "./userProfileStore";
import CommentStore from "./commentStore";

interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
  userStore: UserStore;
  modalStore: ModalStore;
  userProfileStore: UserProfileStore;
  commentStore: CommentStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore(),
  userProfileStore: new UserProfileStore(),
  commentStore: new CommentStore()
}

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}