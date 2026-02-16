import styles from "./Transaction.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import LinkButton from "../layout/LinkButton.tsx";
import { getCategories } from "../../services/CategoriesServices.ts";
import { getPeople } from "../../services/PeopleServices.ts";
import { createTransaction } from "../../services/TransactionsServices.ts";
import { moneyToNumber } from "../../utils/utils.ts";
import { NumericFormat } from "react-number-format";

type Category = {
  id: string;
  description: string;
  purposeType: number;
};

type Person = {
  id: string;
  name: string;
  age: number;
};

function CreateTransaction() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  // validação bootstrap
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purposeOptions = [
    { value: 1, label: "Despesa" },
    { value: 2, label: "Receita" },
  ];

  const [description, setDescription] = useState("");
  const [value, setValue] = useState<string>("");
  const [purposeType, setPurposeType] = useState<number>(purposeOptions[0].value);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: "",
    description: "",
    purposeType: purposeType,
  });
  const [selectedPerson, setSelectedPerson] = useState<Person>({
    id: "",
    name: "",
    age: 0,
  });

  // pegando todas as categorias cadastradas para poder filtrar de acordo com o Tipo selecionado
  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Não foi possível carregar as categorias.");
      }
    };

    load();
  }, []);

  const filteredCategories = categories.filter(
    (c) => c.purposeType === purposeType || c.purposeType === 3
  );

  // pegando todas as pessoas cadastradas para colocar na lista de pessoas
  useEffect(() => {
    const load = async () => {
      try {
        setError(null);

        const data = await getPeople();
        setPeople(data);
      } catch {
        setError("Não foi possível carregar as pessoas.");
      }
    };

    load();
  }, []);

  const transactionInvalid = validated && description.trim() === "";
  const transactionTooLong = validated && description.trim().length > 400;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);
    setError("");

    // validações locais
    if (description.trim() === "" || description.trim().length > 400) return;

    try {
      // checa se o Tipo é receita e a idade da pessoa é menor que 18 anos
      if(purposeType == 2 && selectedPerson.age < 18) {
        setError("Não é possível cadastrar transações do tipo Receita para menores de 18 anos.");
        return;
      }

      console.log(`O valor é ${moneyToNumber(value)}`);

      await createTransaction({
        description: description,
        value: moneyToNumber(value),
        purposeType: purposeType,
        categoryId: selectedCategory.id,
        personId: selectedPerson.id,
      })

      navigate("/transactions", {
        state: { successMessage: "Transação cadastrada com sucesso!" },
      });
    } catch (err) {
      setError("Não foi possível cadastrar a categoria. Tente novamente.");
    }
  };

  return (
    <div className={styles.transactions_container}>
      <h1>Adicionar Transação</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isInvalid={transactionInvalid || transactionTooLong}
          />
          <Form.Control.Feedback type="invalid">
            {transactionInvalid && <div>A descrição é obrigatória.</div>}
            {transactionTooLong && <div>A descrição deve ter no máximo 400 caracteres.</div>}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="value">
          <Form.Label>Valor</Form.Label>

          <NumericFormat
            value={value}
            onValueChange={(values) => setValue(values.formattedValue)} // "R$ 1.234,56"
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            allowNegative={false}
            prefix="R$ "
            className="form-control"
            placeholder="Valor"
          />

          {/*<Form.Control*/}
          {/*  type="text"*/}
          {/*  inputMode="decimal"*/}
          {/*  placeholder="10.99"*/}
          {/*  value={value}*/}
          {/*  onChange={(e) => setValue(sanitizeMoneyInput(e.target.value))}*/}
          {/*/>*/}

          <Form.Control.Feedback type="invalid">
            {/* validações aqui */}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="purposeType">
          <Form.Label>Tipo</Form.Label>
          <div>
            {purposeOptions.map((opt) => (
              <Form.Check
                key={opt.value}
                inline
                type="radio"
                id={`purpose-${opt.value}`}
                name="purposeType"
                label={opt.label}
                checked={purposeType === opt.value}
                onChange={() => setPurposeType(opt.value)}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="categoryId">
          <Form.Label>Categoria</Form.Label>

          <Form.Select
            value={selectedCategory.id}
            onChange={(e) => {
              const selectedId = e.target.value;
              const category = filteredCategories.find((c) => c.id === selectedId);

              setSelectedCategory(
                category ?? { id: "", description: "", purposeType }
              );
            }}
          >
            <option value="" disabled>
              Selecione...
            </option>

            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.description}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="personId">
          <Form.Label>Pessoas</Form.Label>

          <Form.Select
            value={selectedPerson.id}
            onChange={(e) => {
              const selectedId = e.target.value;
              const person = people.find((p) => p.id === selectedId);

              setSelectedPerson(person ?? { id: "", name: "", age: 0 });
            }}
          >
            <option value="" disabled>
              Selecione...
            </option>

            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary" className="me-2">
          Adicionar
        </Button>

        <LinkButton variant="secondary" to={`/transactions`} text="Voltar" />
      </Form>
    </div>
  );
}

export default CreateTransaction;