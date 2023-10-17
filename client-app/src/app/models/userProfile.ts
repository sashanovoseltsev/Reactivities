export default interface UserProfile {
  userName: string;
  displayName: string;
  image?: string;
  bio?: string;
  photos?: Photo[];
  followers: number;
  followings: number;
  isFollowing: boolean;
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}