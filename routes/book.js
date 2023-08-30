/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */

const express = require("express");

const router = express.Router();

const bookCtrl = require("../controllers/book");

// eslint-disable-next-line no-unused-vars
const Book = require("../models/Books");

router.get("/", bookCtrl.getAllBooks);
router.post("/", bookCtrl.createBook);
router.get("/:id", bookCtrl.getOneBook);
router.put("/:id", bookCtrl.modifyBook);
router.delete("/:id", bookCtrl.deleteBook);

module.exports = router;
