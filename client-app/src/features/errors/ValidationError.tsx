import { Message } from "semantic-ui-react";

interface Props {
  errors: any;
}

const ValidationError = ({errors}: Props) => {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((err: any, i: any) => (
            <Message.Item key={i} content={err}/>
          ))}
        </Message.List>
      )}
    </Message>
  )
}

export default ValidationError;
