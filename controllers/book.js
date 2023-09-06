/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */

const fs = require("fs");

const Book = require("../models/Books");

const deleteImage = require("../utils/deleteImage");

exports.deleteBook = async (req, res) => {
  try {
    // Extraire l'ID du livre des paramètres de la requête
    const { id } = req.params;
    // Trouver et supprimer le livre correspondant à l'ID et à l'ID utilisateur
    const book = await Book.findOneAndDelete({
      _id: id,
      userId: req.auth.userId,
    });

    // Vérifier si le livre a été trouvé
    if (!book) {
      return res.status(401).json({ message: "Livre non trouvé !" });
    }

    // Supprimer l'image du livre si elle existe
    if (book.imageUrl) {
      deleteImage(book.imageUrl);
    }

    // Envoyer une réponse avec un message de succès
    res.status(200).json({ message: "Objet supprimé !" });
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse avec l'erreur
    res.status(500).json({ error });
  }
};

exports.createBook = async (req, res) => {
  try {
    // Convertir la chaîne JSON en objet JavaScript
    const bookObject = JSON.parse(req.body.book);
    // Supprimer les propriétés "_id" et "_userId" de l'objet du livre
    delete bookObject._id;
    delete bookObject._userId;
    console.log(bookObject);
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
  // Met à jour le livre avec l'_id fourni. Si une image est
  // téléchargée, elle est capturée, et l’ImageUrl du livre
  // est mise à jour. Si aucun fichier n'est fourni, les
  // informations sur le livre se trouvent directement
  // dans le corps de la requête (req.body.title,
  // req.body.author, etc.). Si un fichier est fourni, le livre
  // transformé en chaîne de caractères se trouve dans
  // req.body.book. Notez que le corps de la demande
  // initiale est vide ; lorsque Multer est ajouté, il renvoie
  // une chaîne du corps de la demande
};

exports.getAllBooks = async (req, res) => {
  try {
    // Obtenir tous les livres à partir de la base de données
    const books = await Book.find();

    // Envoyer une réponse avec tous les livres
    res.status(200).json(books);
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse avec l'erreur
    res.status(400).json({ error });
  }
};

exports.getOneBook = async (req, res) => {
  try {
    // Trouver le livre correspondant à l'ID dans les paramètres de la requête
    const book = await Book.findOne({ _id: req.params.id });

    // Vérifier si le livre a été trouvé
    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé !" });
    }

    // Envoyer une réponse avec le livre
    res.status(200).json(book);
  } catch (error) {
    // Gérer les erreurs et renvoyer une réponse avec l'erreur
    res.status(500).json({ error });
  }
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
