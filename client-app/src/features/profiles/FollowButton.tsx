import { Reveal, Button } from "semantic-ui-react";
import UserProfile from "../../app/models/userProfile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent } from "react";
import { observer } from "mobx-react-lite";

interface Props {
  profile: UserProfile;
}

const FollowButton = ({ profile }: Props) => {
  const { userStore, userProfileStore } = useStore();
  const { toggleFollow, loadingFollowers } = userProfileStore;

  // omit displaying of follow btn when current user's profile is opened
  if (userStore.user?.userName === profile.userName) return null;

  function handleFollow(e: SyntheticEvent, userName: string): void {
    e.preventDefault();
    toggleFollow(profile);
  }

  return (
    <Reveal animated='move'>
      <Reveal.Content visible style={{ width: '100%' }}>
        <Button
          fluid
          color='teal'
          content={profile.isFollowing ? 'Following' : 'Not Following'}
        />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: '100%' }}>
        <Button
          basic fluid
          color={profile.isFollowing ? 'red' : 'green'}
          content={profile.isFollowing ? 'Unfollow' : 'Follow'}
          loading={loadingFollowers}
          onClick={(e) => handleFollow(e, profile.userName)}
        />
      </Reveal.Content>
    </Reveal>
  )
}

export default observer(FollowButton);

