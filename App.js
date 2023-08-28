/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */

const mongoose = require("mongoose");

// se connecter à ma bdd sur MongoDb
mongoose
  .connect(
    "mongodb+srv://dylane33:3hGaew16O7MNlkPW@dbdylan.lwhd3x8.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const express = require("express");

const Book = require("./models/Books");

const app = express();

app.use(express.json()); // Ajoute le middleware pour analyser les données JSON

// On ajotue des headers à la réponse pour le CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// initialisation du CRUD (Create, Read, Update, Delete)
// POST A BOOK

app.post("/api/books", (req, res) => {
  delete req.body._id;
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});
// DELETE A BOOK

app.delete("/api/books/:id", (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
});

// PUT A BOOK
app.put("/api/books/:id", (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

// GET ONE BOOK
app.get("/api/books/:id", (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
});
// GET ALL BOOKS
app.get("/api/books", (req, res) => {
  Book.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
