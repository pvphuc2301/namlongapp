const express = require("express");

const projectController = require("./../controllers/projectController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(projectController.getAllProjects)
    .post(projectController.uploadProjectImages, projectController.resizeProjectImages, projectController.createProject);

router
    .route("/:id")
    .get(projectController.getProject)
    .patch(projectController.uploadProjectImages, projectController.resizeProjectImages, projectController.updateProject)
    .delete(projectController.deleteProject);

module.exports = router;