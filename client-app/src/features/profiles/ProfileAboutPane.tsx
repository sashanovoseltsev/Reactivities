import { observer } from "mobx-react-lite";
import { Button, Grid, Header, Tab } from "semantic-ui-react"
import UserProfile from "../../app/models/userProfile";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import ProfileAboutForm from "./ProfileAboutForm";
import LoadingComponent from "../../app/layout/LoadingComponent";

interface Props {
  profile: UserProfile;
}

const ProfileAboutPane = ({ profile }: Props) => {

  const { userProfileStore: { isCurrentUser, loadingProfile } } = useStore();
  const [isEditingMode, setEditingMode] = useState(false);



  return (
    <Tab.Pane>
      {loadingProfile
        ? <LoadingComponent />
        : <Grid>
          <Grid.Column width={16}>
            <Header icon={'user'} content={`About ${profile.displayName}`} floated='left' />
            {isCurrentUser &&
              <Button floated="right"
                basic
                onClick={() => setEditingMode(!isEditingMode)}
                content={isEditingMode ? 'Cancel' : 'Edit Profile'} />
            }
          </Grid.Column>
          <Grid.Column width={16}>
            {isEditingMode
              ? <ProfileAboutForm onSubmitCallback={() => setEditingMode(!isEditingMode)} />
              : <span style={{ whiteSpace: 'pre-wrap' }}>{profile.bio}</span>
            }
          </Grid.Column>
        </Grid>
      }
    </Tab.Pane>
  )
}

export default observer(ProfileAboutPane);