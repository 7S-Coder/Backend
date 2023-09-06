/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
const express = require("express");

const router = express.Router();

const bookCtrl = require("../controllers/book");

const auth = require("../middleware/auth");

const { upload, resizeImage } = require("../middleware/multer-config");

router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
router.get("/bestrating", bookCtrl.getBestBooks);
router.post("/", auth, upload, resizeImage, bookCtrl.createBook);
router.post("/:id/rating", bookCtrl.ratingBook);
router.put("/:id", auth, upload, resizeImage, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
