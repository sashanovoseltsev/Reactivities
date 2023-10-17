export interface User {
  userName: string;
  displayName: string;
  token: string;
  image?: string;
  followers: number;
  followings: number;
  isFollowing: boolean;
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName?: string;
  userName?: string;
}   