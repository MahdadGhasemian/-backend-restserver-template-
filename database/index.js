const databaseManager = require("./lib/dataBaseManager").getInstance();

const userRepository = require("./lib/repositories/userRepository");
const settingRepository = require("./lib/repositories/settingRepository");
const carRepository = require("./lib/repositories/basicRepositories/carRepository");
const driverRepository = require("./lib/repositories/basicRepositories/driverRepository");
const customerRepository = require("./lib/repositories/basicRepositories/customerRepository");
const productRepository = require("./lib/repositories/basicRepositories/productRepository");
const deliveryRepository = require("./lib/repositories/projectRepositories/deliveryRepository");

const userModel = require("./lib/models/userModel");
const settingModel = require("./lib/models/settingModel");
const licensePlateModel = require("./lib/models/licensePlateModel");
const carModel = require("./lib/models/basicModels/carModel");
const driverModel = require("./lib/models/basicModels/driverModel");
const customerModel = require("./lib/models/basicModels/customerModel");
const productModel = require("./lib/models/basicModels/productModel");
const deliveryModel = require("./lib/models/projectModels/deliveryModel");

function connect() {
  return databaseManager.connect();
}

function disconnect() {
  return databaseManager.disconnect();
}

const users = new userRepository();
const settings = new settingRepository();
const cars = new carRepository();
const drivers = new driverRepository();
const customers = new customerRepository();
const products = new productRepository();
const deliverys = new deliveryRepository();

module.exports = {
  connect: connect,
  disconnect: disconnect,

  users: users,
  settings: settings,
  deliverys: deliverys,
  cars: cars,
  drivers: drivers,
  customers: customers,
  products: products,

  userModel: userModel,
  settingModel: settingModel,
  licensePlateModel: licensePlateModel,
  carModel: carModel,
  driverModel: driverModel,
  customerModel: customerModel,
  productModel: productModel,
  deliveryModel: deliveryModel,
};
