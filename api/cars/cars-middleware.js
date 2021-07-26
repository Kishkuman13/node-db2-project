const Cars = require('./cars-model');
var vinValidator = require('vin-validator');
const db = require('../../data/db-config');

const checkCarId = async (req, res, next) => {
  // DO YOUR MAGIC
  const { id } = req.params;
  try {
    const car = await Cars.getById(id);
    if(car) {
      req.car = car;
      next();
    } else {
      next({ ...Error(), status: 404, message: `car with id ${id} is not found` });
    }
  } catch (err) {
    next({ ...err, status: 500, message: err.message });
  }
}

const checkCarPayload = (req, res, next) => {
  // DO YOUR MAGIC
  const newCar = req.body;
  if(!newCar.vin  || newCar.vin == null) {
    next({ ...Error(), status:400, message: 'vin is missing' });
  } else if (!newCar.make || newCar.make == null) {
    next({ ...Error(), status:400, message: 'make is missing' });
  } else if (!newCar.model || newCar.model == null) {
    next({ ...Error(), status:400, message: 'model is missing' });
  } else if (!newCar.mileage || newCar.mileage == null) {
    next({ ...Error(), status:400, message: 'mileage is missing' });
  } else {
    next();
  }
}

const checkVinNumberValid = async (req, res, next) => {
  // DO YOUR MAGIC
  const vin = req.body.vin;
  var validVin = await vinValidator.validate(vin);
  if (validVin === false) {
    next({ ...Error(), status:400, message: `vin ${vin} is invalid` });
  } else {
    next();
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  // DO YOUR MAGIC
  const vin = req.body.vin;
  const unique = Cars.getAll().filter( car => car['vin'] === vin);
  if (unique === true) {
    next({ ...Error(), status:400, message: `vin ${vin} already exists` });
  } else {
    next();
  }
    
}

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
}