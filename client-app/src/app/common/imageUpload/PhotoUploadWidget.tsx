import { Button, Grid, Header } from "semantic-ui-react"
import PhotoUploadWidgetDropzone from "./PhotoUploadWidgetDropzone";
import { useEffect, useState } from "react";
import PhotoUploadWidgetCropper from "./PhotoUploadWidgetCropper";
import { observer } from "mobx-react-lite";

interface UploadedFile {
  path: string;
  preview: string;
}

interface Props {
  uploadPhoto: (photo: Blob) => void;
  uploading: boolean;
}

const PhotoUploadWidget = ({ uploadPhoto, uploading }: Props) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [cropper, setCropper] = useState<Cropper>();

  const onCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
    }
  }

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  const isFileDropped = files && files.length > 0 && files[0].preview;

  return (
    <Grid columns={3} divided style={{ minWidth: 839, paddingBottom: 15 }}>
      <Grid.Column textAlign="center">
        <Header sub color='teal' content='Step 1 - Add Photo' style={{ marginBottom: '15px' }} />
        <PhotoUploadWidgetDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column textAlign="center">
        <Header sub color='teal' content='Step 2 - Resize Image' style={{ marginBottom: '15px' }} />
        {isFileDropped &&
          <PhotoUploadWidgetCropper setCropper={setCropper} imagePreview={files[0].preview} />
        }
      </Grid.Column>
      <Grid.Column textAlign="center">
        <Header sub color='teal' content='Step 3 - Preview & Upload' style={{ marginBottom: '15px' }} />
        {isFileDropped &&
          <>
            <div className='img-preview' style={{ height: 250, width: 250, overflow: 'hidden', margin: '0 auto' }} />
            <Button.Group widths={2} style={{ width: '200px', marginTop: '15px' }}>
              <Button loading={uploading} onClick={onCrop} positive icon='check' />
              <Button disabled={uploading} onClick={() => setFiles([])} icon='close' />
            </Button.Group>
          </>}
      </Grid.Column>
    </Grid>
  )
}

export default observer(PhotoUploadWidget);