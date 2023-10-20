const express = require("express");
const morgan = require("morgan");
morgan.token('body', function (req, res) { if(req.method === "POST")return JSON.stringify(req.body) })
const app = express();
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body", "default"));
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send('<h1>Hi!, please go to <a href="/api/persons">here</a></h1>');
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id !== id);
  if (person) {
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const d = new Date();
  response.send(
    `<h1>Hi!</h1><p>Phonebook has ${
      persons.length
    } entries</p><p>${d.toUTCString()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  if (!request.body || !request.body.name | !request.body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (
    persons.find((person) => {
      if (person.name === request.body.name) return person;
    })
  ) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }
  const person = request.body;
  person.id = Math.floor(Math.random() * 5000000);
  persons.concat(person);
  console.log(person);
  response.status(201).json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
