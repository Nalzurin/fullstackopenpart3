const mongoose = require("mongoose");
//wc7FxhaxEvv2fvo6
if (process.argv.length < 3) {
  console.log("give password as an argument");
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://alexnormandi:${password}@nalzurin.qd9cicy.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model("Person", personSchema);
if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({})
    .then((result) => {
      result.forEach((person) => {
        console.log(`${person.name} ${person.phone}`);
      });
      mongoose.connection.close();
      process.exit(1);
    })
    .catch(() => {
      mongoose.connection.close();
      process.exit(1);
    });
}

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    phone: process.argv[4],
  });

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.phone} to phonebook`);
    mongoose.connection.close();
    process.exit(1);
  });
}
