const {MemoryUsers} = require('../models/users'); //import models
const getUsers = async (req, res) => {
  try {
    const user = await MemoryUsers.find();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
};