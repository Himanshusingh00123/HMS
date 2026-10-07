const express = require('express');
const router = express.Router();
const { getFoods, createFood, updateFood, deleteFood, getOrders, createOrder, updateOrder } = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/foods').get(getFoods).post(createFood);
router.route('/foods/:id').put(updateFood).delete(deleteFood);
router.route('/orders').get(getOrders).post(createOrder);
router.route('/orders/:id').put(updateOrder);

module.exports = router;
