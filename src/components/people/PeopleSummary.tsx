import styles from "./Person.module.css";
import { useEffect, useState } from "react";
import { getPeopleSummary } from "../../services/PeopleServices.ts";
import Table from "react-bootstrap/esm/Table";
import Spinner from "react-bootstrap/esm/Spinner";
import LinkButton from "../layout/LinkButton.tsx";

type PersonSummary = {
  id: string;
  name: string;
  expense: number;
  income: number;
  balance: number;
}

function PeopleSummary() {
  const [peopleSummary, setPeopleSummary] = useState<PersonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getPeopleSummary();
        setPeopleSummary(data);
      } catch {
        setError("Não foi possível carregar as pessoas.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


  return (
    <div className={styles.people_container}>
      <h1>Balanço por Pessoa</h1>

      <div className="mt-4">
        <Table striped bordered responsive className="text-center align-middle">
          <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Receita</th>
            <th>Despesa</th>
            <th>Balanço</th>
          </tr>
          </thead>

          <tbody>
          {loading && (
            <tr>
              <td colSpan={4} className="py-4">
                <Spinner animation="border" role="status" />
                <span className="ms-2">Carregando...</span>
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={4} className="py-4 text-danger">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && peopleSummary.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-muted">
                Nenhum dado de balanço para ser mostrado
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            peopleSummary.map((person, index) => (
              <tr key={person.id}>
                <td>{index + 1}</td>
                <td>{person.name}</td>
                <td>{person.income}</td>
                <td>{person.expense}</td>
                <td>{person.balance}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <LinkButton variant="secondary" to={`/people`} text="Voltar" />
    </div>
  )
}

export default PeopleSummary;