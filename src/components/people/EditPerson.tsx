import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import axios from "axios";

import styles from "./Person.module.css";

import {updatePerson, getPersonById} from "../../services/PeopleServices.ts";

type Person = {
  id: string;
  name: string;
  age: number;
};

function EditPerson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [idToValidate, setIdToValidate] = useState<string | "">("");

  // validação bootstrap
  const [validated, setValidated] = useState(false);

  const nameInvalid = validated && name.trim() === "";
  const ageInvalid = validated && age !== "" && Number(age) < 0;

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        const person: Person = await getPersonById(id);

        setName(person.name ?? "");
        setAge(person.age ?? "");
        setIdToValidate(person.id ?? "");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setNotFound(true);
          return;
        }

        setError("Não foi possível carregar os dados da pessoa.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);
    if (!id) return;

    //validações locais
    if (name.trim() === "" || (age !== "" && Number(age) < 0)) return;

    // aqui você chamaria o updatePerson(...)
    try {
      await updatePerson(id.trim(), {
        id: idToValidate.trim(),
        name: name.trim(),
        age: Number(age),
      });

      navigate("/people", {
        state: { successMessage: "Pessoa atualizada com sucesso!" },
      });
    } catch (err) {
      setError("Não foi possível atualizar a pessoa. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="py-4">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Carregando...</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <Alert variant="warning">
        Pessoa não encontrada.{" "}
        <Button variant="link" onClick={() => navigate("/people")}>
          Voltar
        </Button>
      </Alert>
    );
  }

  return (
    <div className={styles.people_container}>
      <h1>Editar Pessoa</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isInvalid={nameInvalid}
          />
          <Form.Control.Feedback type="invalid">
            O nome é obrigatório.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="age">
          <Form.Label>Idade</Form.Label>
          <Form.Control
            type="number"
            placeholder="Idade"
            value={age}
            onChange={(e) => {
              const v = e.target.value;
              setAge(v === "" ? "" : Number(v));
            }}
            isInvalid={ageInvalid}
          />
          <Form.Control.Feedback type="invalid">
            A idade não pode ser negativa.
          </Form.Control.Feedback>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            Salvar
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/people")}>
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default EditPerson;