var router = require('express').Router();
var ListController = require('../controllers/listController.js')
var CommonValidators = require('../validators/commonValidators');

// define the home page route
router.post('/fetch', CommonValidators.listing(), CommonValidators.validate(), function (req, res, next) {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.fetchList();
});

// define the about route
router.post('/addItem', CommonValidators.addItem(), CommonValidators.validate(), (req, res, next) => {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.addItem();
});

// define the about route
router.post('/deleteItem', CommonValidators.deleteItem(), CommonValidators.validate(), (req, res, next) => {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.deleteItem();
});

// File upload for incident and solution(if available)
router.post('/uploadImage', (req, res, next) => {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.fileUpload();
});


module.exports = router