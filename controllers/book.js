/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */

const Book = require("../models/Books");

exports.createBook = (req, res) => {
  delete req.body._id;
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res) => {
  Book.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};

exports.ratingBook = async (req, res) => {
  // L’utilisateur met sa note dans le tbleau [rating]
  // je regarde si j'ai dans le body, une note envoyé par un utilisateur
  try {
    const bookId = req.params.id;
    const { userId, grade } = req.body;
    // Si oui, je vérifie si ce livre est dans la bibliothèque
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
      // si le livre n'est pas dans la biblithèque envoyé un message d'erreur
    }

    // création d'un objet pour entrer dans le tableau rating
    const newRating = {
      userId,
      grade,
    };
    // puis on le push dans ratings[]
    book.ratings.push(newRating);
    await book.save(); // on dit à mongodb de sauvegarder les changements du livre

    res.status(201).json({ message: "Évaluation ajoutée avec succès" });
  } catch (error) {
    res.status(500).json({
      message:
        "Une erreur est survenue lors de l'ajout de l'évaluation au livre",
    });
  }

  return res.status(500).json({ message: "Erreur inattendue" });
};

exports.getBestBooks = async (req, res) => {
  try {
    const books = await Book.aggregate([
      {
        $project: {
          title: 1,
          imageUrl: 1,
          author: 1,
          year: 1,
          genre: 1,
          averageRating: { $avg: "$ratings.grade" },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: 3,
      },
    ]);

    // Envoyer une réponse avec les meilleurs livres
    res.status(200).json(books);
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse avec l'erreur
    res.status(400).json({ error });
  }
};
