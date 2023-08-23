import { FC } from "react"
import UserProfile from "../../../app/models/userProfile"
import { List, Image, Popup } from "semantic-ui-react"
import { observer } from "mobx-react-lite"
import { Link } from "react-router-dom"
import ProfileCard from "../../profiles/ProfileCard"

interface Props {
  attendees: UserProfile[]
}

const ActivityListItemAttendees:FC<Props> = ({attendees}) => {
  return (
    <List horizontal>
      { attendees.map(a => (
        <Popup key={a.userName}
          trigger={
            <List.Item key={a.userName} as={Link} to={`/profiles/${a.userName}`}>
              <Image size="mini" circular src={a.image || '/assets/user.png'}/>
            </List.Item>}
          hoverable
        >
          <Popup.Content>
            <ProfileCard userProfile={a}/>
          </Popup.Content>
        </Popup>

      ))}
    </List>
  )
}

export default observer(ActivityListItemAttendees);