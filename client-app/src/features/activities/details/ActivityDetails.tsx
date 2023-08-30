import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useStore } from '../../../app/stores/store';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

const ActivityDetails = () => {

  const { activityStore } = useStore();
  const { loadActivity, initialLoading, selectActivity, selectedActivity } = activityStore;

  const {id} = useParams();

  useEffect(() => {
    if (id) loadActivity(id).then(activity => selectActivity(activity!));

    // empty dependency for component initialization purposes
    // eslint-disable-next-line
  }, [])

  if (initialLoading || !selectedActivity) return <LoadingComponent />

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader />
        <ActivityDetailedInfo />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityDetails);