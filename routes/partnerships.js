const express = require('express');
const auth = require('../middleware/auth');
const partnershipController = require("../controllers/partnershipsController");

const router = express.Router();

router.get("/admin", auth, partnershipController.getAllAdmin);
router.get("/public", partnershipController.getAllPublic);
router.get("/admin/:id", auth, partnershipController.getOneAdmin);
router.get("/public/:id", partnershipController.getOnePublic);
router.post("/", auth, partnershipController.create);
router.patch("/:id", partnershipController.update);
router.delete("/:id", auth, partnershipController.remove);
router.get("/stats/admin", auth, partnershipController.getStats);

module.exports = router; 