/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */

const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // identifiant MongoDB unique de l'utilisateur qui a noté le livre
      grade: { type: Number, min: 0, max: 5 }, // note donnée à un livre
    },
  ], // notes données à un livre
  averageRating: { type: Number, default: 0 }, // note moyenne du livre
});

module.exports = mongoose.model("Book", bookSchema);
