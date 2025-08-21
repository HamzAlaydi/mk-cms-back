const express = require('express');
const auth = require('../middleware/auth');
const certificationController = require("../controllers/certificationsController");
const { allowAllButRestrictDelete } = require('../middleware/roles');

const router = express.Router();

router.get("/admin", auth, certificationController.getAllAdmin);
router.get("/public", certificationController.getAllPublic);
router.get("/admin/:id", auth, certificationController.getOneAdmin);
router.get("/public/:id", certificationController.getOnePublic);
router.post("/", auth, certificationController.create);
router.patch("/:id", certificationController.update);
router.delete("/:id", auth, allowAllButRestrictDelete, certificationController.remove);
router.get("/stats/admin", auth, certificationController.getStats);

module.exports = router; 