/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */

const fs = require("fs");

const Book = require("../models/Books");

const deleteImage = require("../utils/deleteImage");

exports.createBook = async (req, res) => {
  try {
    // Convertir la chaîne JSON en objet JavaScript
    const bookObject = JSON.parse(req.body.book);
    // Supprimer les propriétés "_id" et "_userId" de l'objet du livre
    delete bookObject._id;
    delete bookObject._userId;

    // Créer une instance du modèle Book avec les données du livre
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId, // Utiliser l'ID de l'utilisateur extrait de l'authentification
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    // Sauvegarder le livre dans la base de données
    await book.save();

    // Envoyer une réponse avec un message de succès
    res.status(201).json({ message: "Livre enregistré !" });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse avec l'erreur
    res.status(400).json({ error });
  }
};

exports.modifyBook = async (req, res) => {
  try {
    // Extraire l'ID du livre des paramètres de la requête
    const { id } = req.params;
    // Trouver le livre correspondant à l'ID
    const book = await Book.findOne({ _id: id });

    // Vérifier si le livre existe
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé !" });
    }

    // Vérifier si l'utilisateur a le droit de modifier le livre (vérification de l'ID utilisateur)
    if (book.userId !== req.auth.userId) {
      return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
    }

    // Préparer les données du livre à mettre à jour
    const bookData = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    // Supprimer l'ancienne image du livre si une nouvelle image est envoyée
    if (req.file && book.imageUrl) {
      deleteImage(book.imageUrl);
    }

    // Supprimer les propriétés "_id" et "_userId" du nouvel objet de livre
    delete bookData._id;
    delete bookData._userId;

    // Mettre à jour le livre dans la base de données
    await Book.updateOne({ _id: id }, { ...bookData });

    // Envoyer une réponse avec un message de succès
    res.status(200).json({ message: "Livre modifié avec succès !" });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse avec l'erreur
    return res.status(500).json({ error });
  }

  return res.status(500).json({ message: "Erreur inattendue" });
};

exports.deleteThing = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
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
