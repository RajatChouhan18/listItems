var router = require('express').Router();
var ListController = require('../controllers/listController.js')

// define the home page route
router.post('/fetch', function (req, res, next) {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.fetchList();
})
// define the about route
router.post('/addItem', function (req, res, next) {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.addItem();
})

module.exports = router