import { FaLinkedin } from "react-icons/fa";
import styles from './Footer.module.css'

function Footer () {
  return (
    <footer className={styles.footer}>
      <ul className={styles.list}>
        <li>
          <a
            href="https://www.linkedin.com/in/lucas-cassimiro-tranzillo-nogueira-b06265147/"
            target="_blank"
            rel="noreferrer"
            className={styles.iconLink}
          >
            <FaLinkedin />
          </a>
        </li>
      </ul>

      <p className={styles.copyright}><span>Controle de Gastos Residenciais </span>&copy;</p>
    </footer>
  )
}

export default Footer;