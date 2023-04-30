const express = require("express");
const AdminController = require("../controller/AdminController");
const router = express.Router();

router.get("/dashboard", AdminController.getDashboard);

router.get("/barang", AdminController.getBarang);

router.post("/barang", AdminController.postBarang);

router.post("/barang/:idbarang", AdminController.postEditBarang);

router.post("/deletebarang", AdminController.postDeleteBarang);

router.get("/order", AdminController.getOrder);

module.exports = router;
