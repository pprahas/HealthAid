const express = require("express");
require("dotenv").config();
const router = express.Router();
router.use(express.json());

const Patient = require("../../models/PatientModel");

router.post("/", async (req, res) => {
  const userData = req.body;
});

module.exports = router;
