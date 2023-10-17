import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";

export enum ConnectionsType {
  followers,
  followings,
}

interface Props {
  connectionsType: ConnectionsType
}
const ProfileConnections = ({ connectionsType }: Props) => {
  const { userProfileStore } = useStore();
  const { userProfile, loadingFollowers, followings, followers } = userProfileStore;

  const connections = connectionsType === ConnectionsType.followers
    ? followers
    : followings;

  const headerText = connectionsType === ConnectionsType.followers
    ? `People following ${userProfile?.displayName}`
    : `People followed by ${userProfile?.displayName}`;

  return (
    <Tab.Pane loading={loadingFollowers}>
      <Grid.Column style={{ marginBottom: '15px' }} width={16}>
        <Header icon='user' content={headerText} />
      </Grid.Column>
      <Grid.Column width={16}>
        <Card.Group itemsPerRow={4}>
          {connections.map(profile => (
            <ProfileCard key={profile.userName} userProfile={profile} />
          ))
          }
        </Card.Group>
      </Grid.Column>
    </Tab.Pane>

  );
}

export default observer(ProfileConnections);