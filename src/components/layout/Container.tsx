import styles from './Container.module.css'

type Props = {
  children: React.ReactNode;
  customClass?: keyof typeof styles;
}
function Container (props: Props) {
  return (
    <div className={`${styles.container} ${props.customClass ? styles[props.customClass] : ""}`}>{props.children}</div>
  )
}

export default Container;