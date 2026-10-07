const express = require('express');
const router = express.Router();
const { getReservations, getReservation, createReservation, updateReservation, deleteReservation } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getReservations).post(createReservation);
router.route('/:id').get(getReservation).put(updateReservation).delete(deleteReservation);

module.exports = router;
