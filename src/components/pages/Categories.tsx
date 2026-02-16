import {useEffect, useState} from "react";
import { getCategories } from "../../services/CategoriesServices.ts";
import styles from './Categories.module.css';
import Alert from "react-bootstrap/esm/Alert";
import LinkButton from "../layout/LinkButton.tsx";
import Table from "react-bootstrap/esm/Table";
import Spinner from "react-bootstrap/esm/Spinner";
import { useLocation, useNavigate } from "react-router-dom";
import { handlePurposeType } from "../../utils/utils.ts";

type Category = {
  id: string;
  description: string;
  purposeType: number;
};


function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as any)?.successMessage ?? null
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Não foi possível carregar as categorias.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Aviso que uma categoria foi Criada.
  useEffect(() => {
    if (!successMessage) return;

    const t = setTimeout(() => setSuccessMessage(null), 3000);

    navigate(location.pathname, { replace: true, state: null });

    return () => clearTimeout(t);
  }, [successMessage, navigate, location.pathname]);



  return(
    <div className={styles.people_container}>
      <h1>Categorias</h1>

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

      <LinkButton className="me-2" to="/categories/create" text="Cadastrar categoria" />
      <LinkButton variant="warning" to="/categories/summary" text="Total por Categoria" />

      <div className="mt-4">
        <Table striped bordered responsive className="text-center align-middle">
          <thead>
          <tr>
            <th>#</th>
            <th>Descrição</th>
            <th>Tipo</th>
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

          {!loading && !error && categories.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-muted">
                Nenhuma categoria cadastrada.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            categories.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td>{category.description}</td>
                <td>{handlePurposeType(category.purposeType)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default Categories;