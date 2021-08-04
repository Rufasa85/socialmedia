const express = require('express');
const router = express.Router();
const apiRoutes = require("./api")
const frontEndRoutes = require("./frontEndController")

router.use("/api",apiRoutes)
router.use(frontEndRoutes)

module.exports = router;