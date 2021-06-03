const router = require('express').Router();

const { generateAuthToken, requireAuthentication, requireAuthentication_createUser } = require('../lib/auth');
const { UserSchema, 
  insertNewUser, 
  getUserById,
  getUserID,
  validateUser } = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');


router.get('/:id', requireAuthentication, async (req, res, next) => {
        console.log("requested song id:", req.params.id);
});


module.exports = router;