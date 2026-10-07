const express = require('express');
const router = express.Router();
const { getParking, createParking, updateParking, deleteParking } = require('../controllers/parkingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getParking).post(createParking);
router.route('/:id').put(updateParking).delete(deleteParking);

module.exports = router;
