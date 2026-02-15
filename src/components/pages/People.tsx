import styles from "./People.module.css";
import LinkButton from "../layout/LinkButton";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getPeople, deletePerson } from "../../services/PeopleServices.ts";

type Person = {
  id: string;
  name: string;
  age: number;
};

function People() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as any)?.successMessage ?? null
  );

  // Aviso que uma pessoa foi Criada/Atualizada.
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

        const data = await getPeople();
        setPeople(data);
      } catch {
        setError("Não foi possível carregar as pessoas.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openDeleteModal = (person: Person) => {
    setPersonToDelete(person);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (deletingId) return; // evita fechar enquanto está deletando
    setShowDeleteModal(false);
    setPersonToDelete(null);
  };

  const confirmDelete = async () => {
    if (!personToDelete) return;

    try {
      setDeletingId(personToDelete.id);
      await deletePerson(personToDelete.id);

      setPeople((prev) => prev.filter((p) => p.id !== personToDelete.id));

      closeDeleteModal();
    } catch {
      alert("Erro ao deletar a pessoa.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.people_container}>
      <h1>Pessoas</h1>

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

      <LinkButton to="/people/create" text="Cadastrar pessoa" />

      <div className="mt-4">
        <Table striped bordered responsive className="text-center align-middle">
          <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Idade</th>
            <th></th>
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

          {!loading && !error && people.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-muted">
                Nenhuma pessoa cadastrada.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            people.map((person, index) => (
              <tr key={person.id}>
                <td>{index + 1}</td>
                <td>{person.name}</td>
                <td>{person.age}</td>
                <td className="text-start">
                  <>
                    <LinkButton to={`/people/edit/${person.id}`} text="Editar" />

                    <Button
                      className="ms-2"
                      variant="danger"
                      onClick={() => openDeleteModal(person)}
                    >
                      Deletar
                    </Button>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton={!deletingId}>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {personToDelete ? (
            <>
              Tem certeza que deseja deletar <strong>{personToDelete.name}</strong>?
            </>
          ) : (
            "Tem certeza que deseja deletar esta pessoa?"
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal} disabled={!!deletingId}>
            Cancelar
          </Button>

          <Button variant="danger" onClick={confirmDelete} disabled={!!deletingId}>
            {deletingId ? "Deletando..." : "Confirmar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default People;