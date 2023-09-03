/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
const express = require("express");

const router = express.Router();

const bookCtrl = require("../controllers/book");

const auth = require("../middleware/auth");

const { upload, resizeImage } = require("../middleware/multer-config");

router.get("/", auth, bookCtrl.getAllBooks);
router.get("/:id", auth, bookCtrl.getOneBook);
router.get("/bestrating", auth, bookCtrl.getBestBooks);
router.post("/", auth, upload, resizeImage, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.ratingBook);
router.put("/:id", auth, upload, resizeImage, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
