import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react"
import UserProfile from "../../app/models/userProfile";
import ProfilePhotosPane from "./ProfilePhotosPane";
import ProfileAboutPane from "./ProfileAboutPane";
import ProfileConnections, { ConnectionsType } from "./ProfileConnections";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: UserProfile
}

const ProfileContent = ({ profile }: Props) => {

  const { userProfileStore } = useStore();

  const panes = [
    { menuItem: 'About', render: () => <ProfileAboutPane profile={profile} /> },
    { menuItem: 'Photos', render: () => <ProfilePhotosPane profile={profile} /> },
    { menuItem: 'Events', render: () => <Tab.Pane>Events Content</Tab.Pane> },
    { menuItem: 'Followers', render: () => <ProfileConnections connectionsType={ConnectionsType.followers} /> },
    { menuItem: 'Following', render: () => <ProfileConnections connectionsType={ConnectionsType.followings} /> }
  ]

  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition='right'
      panes={panes}
      onTabChange={(_, data) => userProfileStore.setActiveTab(data.activeIndex as number)}
    />
  )
}

export default observer(ProfileContent);