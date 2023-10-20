const express = require("express");
const app = express();
app.use(express.json());
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
  if(person)
  {
    response.json(person);

  }else
  {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id !== id);
  if(person)
  {
    response.status(204).end();

  }else
  {
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
  const person = request.body;
  person.id = Math.floor(Math.random() * 5000000);
  persons.concat(person);
  console.log(person);
  response.status(201).json(person).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
