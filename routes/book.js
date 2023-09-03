/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
const express = require("express");

const router = express.Router();

const bookCtrl = require("../controllers/book");

const auth = require("../middleware/auth");

const multer = require("../middleware/multer-config");

// eslint-disable-next-line no-unused-vars
const Book = require("../models/Books");

router.get("/", auth, bookCtrl.getAllBooks);
router.post("/", auth, multer, bookCtrl.createBook);
router.get("/:id", auth, bookCtrl.getOneBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.ratingBook);
router.get("/bestrating", auth, bookCtrl.getBestBooks);

module.exports = router;
