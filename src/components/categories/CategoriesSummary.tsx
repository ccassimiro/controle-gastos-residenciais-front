import styles from "./Categories.module.css";
import { useEffect, useState } from "react";
import { getCategoriesSummary } from "../../services/CategoriesServices.ts";
import Table from "react-bootstrap/esm/Table";
import Spinner from "react-bootstrap/esm/Spinner";
import LinkButton from "../layout/LinkButton.tsx";

type CategorySummary = {
  id: string;
  name: string;
  purposeType: number;
  total: number;
}

function CategoriesSummary() {
  const [categoriesSummary, setCategoriesSummary] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCategoriesSummary();
        setCategoriesSummary(data);
      } catch {
        setError("Não foi possível carregar as pessoas.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);


  return (
    <div className={styles.categories_container}>
      <h1>Balanço por Categorias</h1>

      <div className="mt-4">
        <Table striped bordered responsive className="text-center align-middle">
          <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Tipo</th>
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

          {!loading && !error && categoriesSummary.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-muted">
                Nenhum dado de balanço para ser mostrado
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            categoriesSummary.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td>{category.name}</td>
                <td>{category.purposeType}</td>
                <td>{category.total}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <LinkButton variant="secondary" to={`/categories`} text="Voltar" />
    </div>
  )
}

export default CategoriesSummary;