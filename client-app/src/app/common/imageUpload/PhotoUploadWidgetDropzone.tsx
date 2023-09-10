import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react';
import { Dropzone } from './Dropzone.styles';

interface Props {
  setFiles: (files: any) => void;
}

const PhotoUploadWidgetDropzone = ({ setFiles }: Props) => {

  const onDrop = useCallback((acceptedFiles: object[]) => {
    setFiles(acceptedFiles.map((file: any) => (
      { ...file, preview: URL.createObjectURL(file) }
    )))
  }, [setFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Dropzone $isActive={isDragActive} {...getRootProps()}>
      <input {...getInputProps()} />
      <Icon name='upload' size='huge' />
      <Header content='Drop image here' />
    </Dropzone>
  )
}

export default PhotoUploadWidgetDropzone;