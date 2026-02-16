import {useEffect, useState} from "react";
import { getTransactions } from '../../services/TransactionsServices.ts';
import styles from './Transactions.module.css';
import Table from "react-bootstrap/esm/Table";
import Spinner from "react-bootstrap/esm/Spinner";
import {useLocation, useNavigate} from "react-router-dom";
import Alert from "react-bootstrap/esm/Alert";
import LinkButton from "../layout/LinkButton.tsx";
import { numberToMoneyBRL, handlePurposeType } from "../../utils/utils.ts";


type Transaction = {
  id: string;
  description: string;
  value: number;
  purposeType: number;
  categoryId: string;
  category: {
    id: string;
    description: string;
    purposeType: number;
  };
  personId: string;
  person: {
    id: string;
    name: string;
    age: number;
  }
};

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as any)?.successMessage ?? null
  );

  // Aviso que uma transação foi Criada.
  useEffect(() => {
    if (!successMessage) return;

    const t = setTimeout(() => setSuccessMessage(null), 3000);

    navigate(location.pathname, { replace: true, state: null });

    return () => clearTimeout(t);
  }, [successMessage, navigate, location.pathname]);


  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getTransactions();
        setTransactions(data);
      } catch {
        setError("Não foi possível carregar as transações.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return(
    <div className={styles.transaction_container}>
      <h1>Transações</h1>

      {successMessage && (
        <Alert
          className="mt-3"
          variant="success"
          dismissible
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      <LinkButton to="/transactions/create" text="Cadastrar transação" />

      <div className="mt-4">
        <Table striped bordered responsive className="text-center align-middle">
          <thead>
          <tr>
            <th>#</th>
            <th>Descrição</th>
            <th>Valor (R$)</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Pessoa</th>
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

          {!loading && !error && transactions.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-muted">
                Nenhuma transação cadastrada.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            transactions.map((transaction, index) => (
              <tr key={transaction.id}>
                <td>{index + 1}</td>
                <td>{transaction.description}</td>
                <td>{numberToMoneyBRL(transaction.value)}</td>
                <td>{transaction.category.description}</td>
                <td>{handlePurposeType(transaction.purposeType)}</td>
                <td>{transaction.person.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default Transactions;