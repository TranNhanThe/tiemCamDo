const express = require('express');
const router = express.Router();
const bikeController = require('../controllers/bikeController');

router.get('/', bikeController.getAllBikes);
router.post('/', bikeController.createBike);
router.post('/id', bikeController.updateBike);
router.delete('/delete', bikeController.deleteBikes);

module.exports = router;