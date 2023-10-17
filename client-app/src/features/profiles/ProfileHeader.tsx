import { observer } from "mobx-react-lite";
import { Grid, Segment, Item, Header, Statistic, Divider } from "semantic-ui-react";
import UserProfile from "../../app/models/userProfile";
import FollowButton from "./FollowButton";

interface Props {
  profile: UserProfile
}

const ProfileHeader = ({ profile }: Props) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image avatar size="small" src={profile.image || '/assets/user.png'} />
              <Item.Content verticalAlign="middle">
                <Header as='h1'>{profile.displayName}</Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic label='Followers' value={profile.followers} />
            <Statistic label='Following' value={profile.followings} />
          </Statistic.Group>
          <Divider />
          <FollowButton profile={profile} />
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default observer(ProfileHeader);