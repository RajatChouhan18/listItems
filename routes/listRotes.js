var router = require('express').Router();
var ListController = require('../controllers/listController.js')

// define the home page route
router.post('/fetch', function (req, res, next) {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.fetchList();
});
// define the about route
router.post('/addItem', (req, res, next) => {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.addItem();
});
// File upload for incident and solution(if available)
router.post('/uploadImage', (req, res, next) => {
  let listControllerObj = new ListController(req, res, next);
  return listControllerObj.fileUpload();
});


module.exports = router