var router = require('express').Router();
var ListController = require('../controllers/listController.js')
var CommonValidators = require('../validators/commonValidators');

// fetch list
router.post('/fetch', CommonValidators.listing(), CommonValidators.validate(), function (req, res, next) {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.fetchList();
});

// add item to list
router.post('/addItem', CommonValidators.addItem(), CommonValidators.validate(), (req, res, next) => {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.addItem();
});

// delete item from list
router.post('/deleteItem', CommonValidators.deleteItem(), CommonValidators.validate(), (req, res, next) => {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.deleteItem();
});

// file upload
router.post('/uploadImage', (req, res, next) => {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.fileUpload();
});


module.exports = router