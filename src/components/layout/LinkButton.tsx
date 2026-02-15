//import styles from "./LinkButton.module.css";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

type Props = {
  to: string;
  text: string;
  variant?: string;
}

function LinkButton(props: Props) {
  const navigate = useNavigate();
  return (
    <Button variant={props.variant ?? "primary"} onClick={() => navigate(`${props.to}`)} >
      {props.text}
    </Button>

  )
}

export default LinkButton;