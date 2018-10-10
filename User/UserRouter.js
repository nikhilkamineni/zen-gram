const express = require('express');
const { User, Page} = require('./UserModel');

const userRouter = express.Router();

userRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    const message = 'Error getting User with that ID';
    console.error(`${message}\n${error}`);
    res.status(500).json({ message, error });
  }
});

userRouter.post('/saveUser', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    const message = 'Error saving new user';
    console.error(`${message}\n${error}`);
    res.status(500).json({ message, error });
  }
});

module.exports = userRouter;
