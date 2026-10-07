const express = require('express');
const router = express.Router();
const { getHousekeeping, updateHousekeeping, createHousekeeping } = require('../controllers/housekeepingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').get(getHousekeeping).post(createHousekeeping);
router.route('/:id').put(updateHousekeeping);

module.exports = router;
