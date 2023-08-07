import React, { FC } from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
  inverted?: boolean;
  content?: string;
}

const LoadingComponent: FC<Props> = ({inverted = true, content = 'Loading...'}) => (
  <Dimmer active={true} inverted={inverted}>
    <Loader content={content} />
  </Dimmer>
)

export default LoadingComponent;