import styles from './Home.module.css';
import home_image from '../../img/savings.svg';
import LinkButton from "../layout/LinkButton.tsx";


function Categories () {
  return (
    <section className={styles.home_container}>
      <h1>Bem-vindo ao <span>CGR - Controle de Gastos Residenciais</span></h1>
      <p>Tenha total controle dos gastos da sua casa!</p>

      <LinkButton to="/transactions" text="Insira uma nova Trasação"/>

      <img src={home_image} alt="CGR - Controle de Gastos Residenciais" />
    </section>
  )
}

export default Categories;