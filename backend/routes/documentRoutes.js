const express = require("express");

const documentController = require("../controllers/documentController.js");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(documentController.getAllDocuments)
    .post(documentController.uploadAttachments, documentController.resizeAttachments, documentController.createDocument);

router
    .route("/:id")
    .get(documentController.getDocument)
    .patch(documentController.uploadAttachments, documentController.resizeAttachments, documentController.updateDocument)
    .delete(documentController.deleteDocument);

module.exports = router;