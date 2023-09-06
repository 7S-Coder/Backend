/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
require("dotenv").config();

const connectedMDB = process.env.VITE_API_KEY;

const mongoose = require("mongoose");

const express = require("express");

const bookRoutes = require("./routes/book");

const userRoutes = require("./routes/user");

const path = require("path");

// se connecter à ma bdd sur MongoDb
mongoose
  .connect(connectedMDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// eslint-disable-next-line no-unused-vars
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

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
