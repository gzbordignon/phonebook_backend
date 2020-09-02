const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(cors());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "040-654321",
    id: 2,
  },
  {
    name: "Guilherme Bordignon",
    number: "995823059",
    id: 3,
  },
  {
    name: "Larissa Alvarez",
    number: "981090842",
    id: 4,
  },
];

const getId = req => {
  return Number(req.params.id);
};

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0;
  return maxId + 1;
};

// root

app.get("/", (req, res) => {
  res.send("lol");
});

// info

app.get("/info", (req, res) => {
  const sentence = `<p>Phonebook has info for ${persons.length} people. <br> ${new Date()}</p>`;
  res.send(sentence);
});

// all persons

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

// show person

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.send(person);
  } else {
    res.status(404).end();
  }
});

// create person
app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name && !body.number) {
    return res.status(400).json({ error: "name and number missing" });
  } else if (!body.name) {
    return res.status(400).json({ error: "name missing" });
  } else if (!body.number) {
    return res.status(400).json({ error: "number missing" });
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({ error: "name already exists" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  res.json(persons);
});

// delete persons

app.delete("/api/persons/:id", (req, res) => {
  const id = getId(req);
  persons = persons.filter(person => person.id !== id);
  res.send(persons);
});

const PORT = process.env || 3001;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
