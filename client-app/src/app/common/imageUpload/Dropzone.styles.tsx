import styled, { css } from "styled-components";

interface DropzoneProps {
  isActive: boolean;
}

export const Dropzone = styled.div<DropzoneProps>`
  border: 'dashed 3px #eee';
  border-radius: '5px';
  padding-top: '30px';
  text-align: 'center' as 'center'; // required for style prop to not complain
  height: '250px';
  ${(props) => {
    return props.isActive
      ? css`
        borderColor: '#eee';
      `
      : css`
        borderColor: 'green'
      `
  }}
`