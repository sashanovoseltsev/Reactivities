import { Card, Tab, Image, Header, Grid, Button } from "semantic-ui-react";
import UserProfile from "../../app/models/userProfile";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { useState } from "react";

interface Props {
  profile: UserProfile;
}

const ProfilePhotosPane = ({ profile }: Props) => {

  const { userProfileStore: { isCurrentUser } } = useStore();
  const [uploadMode, setUploadMode] = useState(false);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon={'photo'} content='Photos' />
          {isCurrentUser &&
            <Button
              floated='right'
              basic
              content={uploadMode ? 'Cancel Upload' : 'Add Photo'}
              onClick={() => setUploadMode(!uploadMode)}
            />}
        </Grid.Column>
        <Grid.Column width={16}>
          {uploadMode
            ? <p>Upload Widget Goes Here</p>
            : <Card.Group>
              {profile.photos?.map(p => (
                <Card key={p.id}>
                  <Image src={p.url} />
                </Card>
              ))}
            </Card.Group>
          }
        </Grid.Column>
      </Grid>

    </Tab.Pane>
  )
}

export default observer(ProfilePhotosPane);