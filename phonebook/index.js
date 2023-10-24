require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
morgan.token("body", function (req, res) {
  if (req.method === "POST") return JSON.stringify(req.body);
});
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body",
    "default"
  )
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } 

  next(error);
};

const Person = require("./models/person");

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/dist/index.html");
});

app.get("/api", (request, response) => {
  response.send('<p>Hi! Please go to <a href="/api/persons">here.<a/></p>');
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.post("/api/persons", (request, response, next) => {
  console.log("Adding person", request.body);

  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  person
    .save()
    .then((result) => {
      console.log(`Added ${person.name} number ${person.phone} to phonebook`);
      response.status(201).json(person);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const d = new Date();
  Person.count({}).then((count) => {
    response.send(
      `<h1>Hi!</h1><p>Phonebook has ${count} entries</p><p>${d.toUTCString()}</p>`
    );
  });
});

app.use(unknownEndpoint);
// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
