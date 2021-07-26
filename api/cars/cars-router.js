// DO YOUR MAGIC
const express = require('express');
const Cars = require('./cars-model');
const { checkCarId, checkCarPayload, checkVinNumberValid, checkVinNumberUnique } = require('./cars-middleware');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await Cars.getAll();  
    res.json(data);
  } catch(err) { next(err)}
});

router.get('/:id', checkCarId, (req, res) => {
  res.status(200).json(req.car);
});

router.post('/', checkCarPayload, checkVinNumberValid, async (req, res, next) => {
  const carData = req.body;
  try {
    const newCar = await Cars.create(carData);
    res.json(newCar);
  } catch (err) { next(err)}
});

router.use((err, req, res, next) => {
  err.statusCode = err.status || 500;
  res.status(err.statusCode).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
