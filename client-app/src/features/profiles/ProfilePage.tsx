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

  const { userProfileStore: { loadProfile, userProfile }, userStore: { isLoggedIn } } = useStore();



  useEffect(() => {
    if (username) loadProfile(username);
  }, [username, loadProfile])

  if (!isLoggedIn) {
    return null;
  } else {
    if (!userProfile) return <LoadingComponent content='Loading profile...' />
  }


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