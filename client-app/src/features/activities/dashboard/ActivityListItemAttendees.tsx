import { FC } from "react"
import UserProfile from "../../../app/models/userProfile"
import { List, Image, Popup } from "semantic-ui-react"
import { observer } from "mobx-react-lite"
import { Link } from "react-router-dom"
import ProfileCard from "../../profiles/ProfileCard"

interface Props {
  attendees: UserProfile[]
}

const ActivityListItemAttendees: FC<Props> = ({ attendees }) => {
  const styles = {
    borderColor: 'orange',
    borderWidth: 2,
    padding: '1px',
  }

  return (
    <List horizontal>
      {attendees.map(a => (
        <Popup key={a.userName}
          trigger={
            <List.Item key={a.userName} as={Link} to={`/profiles/${a.userName}`}>
              <Image size="mini" circular src={a.image || '/assets/user.png'} bordered style={a.isFollowing ? styles : null} />
            </List.Item>}
          hoverable
        >
          <Popup.Content>
            <ProfileCard userProfile={a} />
          </Popup.Content>
        </Popup>

      ))}
    </List>
  )
}

export default observer(ActivityListItemAttendees);