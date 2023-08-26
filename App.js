/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://dylane33:3hGaew16O7MNlkPW@dbdylan.lwhd3x8.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then()
  .catch();

const express = require("express");

const app = express();

app.use(express.json());

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
