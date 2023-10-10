const express = require('express');
const router = express.Router();

const {
  getUsers,
} = require('../controllers/controls');

router.get('/user', getUsers);

module.exports = router;
