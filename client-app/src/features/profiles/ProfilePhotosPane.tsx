import { Card, Tab, Image, Header, Grid, Button } from "semantic-ui-react";
import UserProfile, { Photo } from "../../app/models/userProfile";
import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props {
  profile: UserProfile;
}

const ProfilePhotosPane = ({ profile }: Props) => {

  const {
    userProfileStore: { isCurrentUser, uploadPhoto, uploading, loadingPhotos, setMainPhoto, deletePhoto }
  } = useStore();
  const [uploadMode, setUploadMode] = useState(false);

  const handleUpload = (photo: Blob) => {
    uploadPhoto(photo)
      .then(() => setUploadMode(!uploadMode))
  }

  const [targetButtonName, setTargetButtonName] = useState("");

  const handleSetMain = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
    setTargetButtonName(e.currentTarget.name);
    setMainPhoto(photo.id);
  }

  const handleDelete = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
    setTargetButtonName(e.currentTarget.name);
    deletePhoto(photo);
  }

  // if isMain - all are disabled
  // if !loading - active
  // while Main is loading - Del is disabled
  // while Del is loading - Main is disabled
  const isDisabled = (isMainPhoto: boolean, isStateLoading: boolean, targetButtonName: string, siblingButtonName: string) => {
    if (isMainPhoto) return true;

    if (!loadingPhotos) return false;

    return targetButtonName === siblingButtonName;
  }

  const isLoading = (isStateLoading: boolean, targetButtonName: string, currentButtonName: string) => {
    return isStateLoading && targetButtonName === currentButtonName;
  }

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
            ? <PhotoUploadWidget uploadPhoto={handleUpload} uploading={uploading} />
            : <Card.Group>
              {profile.photos?.map(p => (
                <Card key={p.id}>
                  <Image src={p.url} />
                  {isCurrentUser &&
                    <Button.Group widths={2}>
                      <Button
                        basic
                        color="green"
                        content="Main"
                        disabled={isDisabled(p.isMain, loadingPhotos, targetButtonName, p.id + 'delete')}
                        name={p.id + 'main'}
                        loading={isLoading(loadingPhotos, targetButtonName, p.id + 'main')}
                        onClick={(e) => handleSetMain(p, e)}
                      />
                      <Button
                        basic
                        color="red"
                        icon="trash"
                        disabled={isDisabled(p.isMain, loadingPhotos, targetButtonName, p.id + 'main')}
                        name={p.id + 'delete'}
                        loading={isLoading(loadingPhotos, targetButtonName, p.id + 'delete')}
                        onClick={(e) => handleDelete(p, e)}
                      />
                    </Button.Group>
                  }
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