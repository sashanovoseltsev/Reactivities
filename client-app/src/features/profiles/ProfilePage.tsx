import { useParams } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import { Grid } from "semantic-ui-react";
import ProfileContent from "./PofileContent";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";

const ProfilePage = () => {

  const { username } = useParams();

  const { userProfileStore: { loadingProfile: loading, loadProfile, userProfile } } = useStore();

  useEffect(() => {
    if (username) loadProfile(username);
  }, [username, loadProfile])

  if (loading || !userProfile) return <LoadingComponent content='Loading profile...' />

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={userProfile!} />
        <ProfileContent profile={userProfile!} />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ProfilePage);