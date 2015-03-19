var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Generator' });
});

/* Get ER diagram page. */
router.get('/er/', function (req, res, next) {
  res.render('er-diagram', {title: 'ER Diagram'});
});

module.exports = router;
