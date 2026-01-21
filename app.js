const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, "data/data.json");

app.use(cors());
app.use(express.json());

// helper functions
const readData = () => {
  const jsonData = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(jsonData);
};

const writeData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

app.get("/contacts", (req, res) => {
  const contacts = readData();
  res.json(contacts);
});

app.post("/contacts", (req, res) => {
  const contacts = readData();
  const newContact = {
    id: Date.now().toString(),
    ...req.body,
  };

  contacts.push(newContact);
  writeData(contacts);

  res.status(201).json(newContact);
});

app.put("/contacts/:id", (req, res) => {
  const { id } = req.params;
  const contacts = readData();

  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Contact not found" });
  }

  contacts[index] = { ...contacts[index], ...req.body };
  writeData(contacts);

  res.json(contacts[index]);
});

app.delete("/contacts/:id", (req, res) => {
  const { id } = req.params;
  let contacts = readData();

  contacts = contacts.filter((c) => c.id !== id);
  writeData(contacts);

  res.json({ message: "Contact deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
