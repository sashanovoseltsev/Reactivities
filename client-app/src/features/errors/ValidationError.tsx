import { Message } from "semantic-ui-react";

interface Props {
  errors: string[];
}

const ValidationError = ({errors}: Props) => {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((err, i) => (
            <Message.Item key={i} content={err}/>
          ))}
        </Message.List>
      )}
    </Message>
  )
}

export default ValidationError;
