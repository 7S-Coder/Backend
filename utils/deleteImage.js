/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */

const fs = require("fs").promises;
const path = require("path");

// Fonction pour supprimer une image du système de fichiers
const deleteImage = async (imageUrl) => {
  // Vérification si l'URL de l'image est définie
  if (!imageUrl) return;

  // Extraction du nom de fichier à partir de l'URL de l'image
  const filename = imageUrl.split("/images/")[1];

  // Construction du chemin complet de l'image
  const imagePath = path.join(__dirname, "..", "images", filename);

  try {
    // Suppression du fichier d'image
    await fs.unlink(imagePath);
    console.log(`Image supprimée avec succès : ${imageUrl}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image :", error);
    throw error; // Rejette l'erreur pour être gérée plus loin
  }
};

module.exports = deleteImage;

// exports.modifyBook = async (req, res) => {
//   try {
//     // Extraire l'ID du livre des paramètres de la requête
//     const { id } = req.params;
//     // Trouver le livre correspondant à l'ID
//     const book = await Book.findOne({ _id: id });
//     // Vérifier si le livre existe
//     if (!book) {
//       return res.status(404).json({ message: "Livre non trouvé !" });
//     }

//     // Vérifier si l'utilisateur a le droit de modifier le livre (vérification de l'ID utilisateur)
//     if (book.userId !== req.auth.userId) {
//       return res.status(401).json({ message: "Vous n'êtes pas autorisé !" });
//     }

//     // Préparer les données du livre à mettre à jour
//     const bookData = req.file
//       ? {
//           ...JSON.parse(req.body.book),
//           imageUrl: `${req.protocol}://${req.get("host")}/images/${
//             req.file.filename
//           }`,
//         }
//       : { ...req.body };
//     // Supprimer l'ancienne image du livre si une nouvelle image est envoyée
//     if (req.file && book.imageUrl) {
//       deleteImage(book.imageUrl);
//     }

//     // Supprimer les propriétés "_id" et "_userId" du nouvel objet de livre
//     delete bookData._id;
//     delete bookData._userId;
//     // Mettre à jour le livre dans la base de données
//     await Book.updateOne({ _id: id }, { ...bookData });
//     // Envoyer une réponse avec un message de succès
//     res.status(200).json({ message: "Livre modifié avec succès !" });
//   } catch (error) {
//     // Gérer les erreurs et renvoyer une réponse avec l'erreur
//     return res.status(500).json({ error });
//   }
// };
