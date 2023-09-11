import { observer } from "mobx-react-lite";
import UserProfile from "../../app/models/userProfile";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

interface Props {
  userProfile: UserProfile;
}

const ProfileCard = ({ userProfile }: Props) => {

  const truncateBio = (bio?: string) => bio && bio.length > 40
    ? bio.slice(0, 40) + '...'
    : bio;

  return (
    <Card as={Link} to={`/profiles/${userProfile.userName}`}>
      <Image src={userProfile.image || '/assets/user.png'} />
      <Card.Content>
        <Card.Header>{userProfile.displayName}</Card.Header>
        <Card.Description>{truncateBio(userProfile.bio) || 'Bio goes here'}</Card.Description>
      </Card.Content>
      <Card.Content>
        <Icon name='user' />
        20 followers
      </Card.Content>
    </Card>
  )
}

export default observer(ProfileCard);