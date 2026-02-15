import styles from "./LinkButton.module.css";
import { Link } from "react-router-dom"

type Props = {
  to: string;
  text: string;
}

function LinkButton(props: Props) {
  return (
    <Link to={props.to} className={styles.btn}>
      {props.text}
    </Link>
  )
}

export default LinkButton;