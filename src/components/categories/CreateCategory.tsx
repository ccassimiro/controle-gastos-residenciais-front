import styles from "./Categories.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useState } from "react";
import { createCategory } from "../../services/CategoriesServices.ts";
import { useNavigate } from "react-router-dom";
import LinkButton from "../layout/LinkButton.tsx";

function CreateCategory() {
  const navigate = useNavigate();

  // validação bootstrap
  const [validated, setValidated] = useState(false);

  const [error, setError] = useState<string>();
  const [description, setDescription] = useState("");
  const [purposeType, setPurposeType] = useState<number>(1);

  const purposeOptions = [
    { value: 1, label: "Despesa" },
    { value: 2, label: "Receita" },
    { value: 3, label: "Ambos" },
  ];

  const categoryInvalid = validated && description.trim() === "";
  const categoryTooLong = validated && description.trim().length > 500;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);
    setError("");

    // validações locais
    if (description.trim() === "" || description.trim().length > 500) return;

    try {
      await createCategory({
        description: description.trim(),
        purposeType: purposeType,
      });

      navigate("/categories", {
        state: { successMessage: "Categoria cadastrada com sucesso!" },
      });
    } catch (err) {
      setError("Não foi possível cadastrar a categoria. Tente novamente.");
    }
  };

  return (
    <div className={styles.categories_container}>
      <h1>Adicionar Categoria</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nome"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isInvalid={categoryInvalid || categoryTooLong}
          />
          <Form.Control.Feedback type="invalid">
            {categoryInvalid && <div>A descrição é obrigatória.</div>}
            {categoryTooLong && <div>A descrição deve ter no máximo 500 caracteres.</div>}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="purposeType">
          <Form.Label>Tipo</Form.Label>

          <Form.Select
            value={purposeType}
            onChange={(e) => setPurposeType(parseInt(e.target.value, 10))}
          >
            {purposeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary" className="me-2">
          Adicionar
        </Button>

        <LinkButton variant="secondary" to={`/people`} text="Voltar" />
      </Form>
    </div>
  );
}

export default CreateCategory;