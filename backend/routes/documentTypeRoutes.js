const express = require("express");

const documentTypeController = require("../controllers/documentTypeController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(documentTypeController.getAllDocumentTypes)
    .post(documentTypeController.createDocumentType);

router
    .route("/:id")
    .get(documentTypeController.getDocumentType)
    .patch(documentTypeController.updateDocumentType)
    .delete(documentTypeController.deleteDocumentType);

module.exports = router;