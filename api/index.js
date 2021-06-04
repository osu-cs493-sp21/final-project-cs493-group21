const router = require('express').Router();

router.use('/users', require('./users'));
router.use('/songs', require('./songs'));
module.exports = router;