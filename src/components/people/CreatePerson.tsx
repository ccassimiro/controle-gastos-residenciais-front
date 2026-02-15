import styles from "./Person.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useState } from "react";
import { createPerson } from "../../services/PeopleServices.ts";
import { useNavigate } from "react-router-dom";
import LinkButton from "../layout/LinkButton.tsx";

function CreatePerson() {
  const navigate = useNavigate();

  // validação bootstrap
  const [validated, setValidated] = useState(false);

  const [error, setError] = useState<string>();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");

  const nameInvalid = validated && name.trim() === "";
  const nameTooLong = validated && name.trim().length > 200;
  const ageInvalid = validated && age !== "" && Number(age) < 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);
    setError("");

    // validações locais
    if (name.trim() === "" || name.trim().length > 200 || age === "" || Number(age) < 0) return;

    try {
      await createPerson({
        name: name.trim(),
        age: Number(age),
      });

      navigate("/people", {
        state: { successMessage: "Pessoa cadastrada com sucesso!" },
      });
    } catch (err) {
      setError("Não foi possível cadastrar a pessoa. Tente novamente.");
    }
  };

  return (
    <div className={styles.people_container}>
      <h1>Adicionar Pessoa</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nome">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isInvalid={nameInvalid || nameTooLong}
          />
          <Form.Control.Feedback type="invalid">
            {nameInvalid && <div>O nome é obrigatório.</div>}
            {nameTooLong && <div>O nome deve ter no máximo 200 caracteres.</div>}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="idade">
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

        <Button type="submit" variant="primary" className="me-2">
          Adicionar
        </Button>

        <LinkButton variant="secondary" to={`/people`} text="Voltar" />
      </Form>
    </div>
  );
}

export default CreatePerson;