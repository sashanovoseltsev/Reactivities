import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react"
import UserProfile from "../../app/models/userProfile";
import ProfilePhotosPane from "./ProfilePhotosPane";
import ProfileAboutPane from "./ProfileAboutPane";

interface Props {
  profile: UserProfile
}

const ProfileContent = ({ profile }: Props) => {

  const panes = [
    { menuItem: 'About', render: () => <ProfileAboutPane profile={profile} /> },
    { menuItem: 'Photos', render: () => <ProfilePhotosPane profile={profile} /> },
    { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
    { menuItem: 'Followers', render: () => <Tab.Pane>Followers Content</Tab.Pane> },
    { menuItem: 'Following', render: () => <Tab.Pane>Following Content</Tab.Pane> }
  ]

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
    />
  )
}

export default observer(ProfileContent);