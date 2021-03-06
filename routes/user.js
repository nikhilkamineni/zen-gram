const bcrypt = require("bcrypt");
const express = require("express");

const User = require("../models/user.js");

const userRouter = express.Router();

userRouter.get("/get-user", async (req, res) => {
  try {
    const username = req.user.username; // passed on from authenticate middleware
    const user = await User.findOne({ username }).lean();
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    const message = "Internal Server Error!";
    res.status(500).json({ message, error });
  }
});

userRouter.post("/save-page", async (req, res) => {
  try {
    const username = req.user.username; // passed on from authenticate middleware
    let handle =
      req.body.handle[0] === "@" ? req.body.handle.slice(1) : req.body.handle;
    handle = handle.toLowerCase();

    const conditions = {
      username,
      "pages.handle": { $ne: handle }
    };

    const newPage = {
      $push: { pages: { handle } }
    };

    const options = { new: true };

    const savedPage = await User.findOneAndUpdate(
      conditions,
      newPage,
      options
    ).lean();
    delete savedPage.password;
    if (!savedPage)
      return res.status(400).json({ message: "Page already exists!" });
    else return res.status(201).json(savedPage);
  } catch (error) {
    const message = "Error saving a new page";
    return res.status(500).json({ message, error });
  }
});

userRouter.put("/delete-page", async (req, res) => {
  try {
    const pageId = req.body.pageId;
    const username = req.user.username;
    const pageToRemove = {
      $pull: {
        pages: {
          _id: pageId
        }
      }
    };

    const options = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      { username },
      pageToRemove,
      options
    ).lean();

    delete updatedUser.password;

    res
      .status(200)
      .json({ message: "Page was successfully deleted!", updatedUser });
  } catch (error) {
    const message = "Error deleting a new page";
    res.status(500).json({ message, error });
  }
});

userRouter.put("/change-password", async (req, res) => {
  try {
    const username = req.user.username; // passed on from authenticate middleware
    const password = req.body.newPassword;

    await bcrypt.hash(password, 11, async (err, hash) => {
      if (err)
        return res.status(500).json({ message: "Internal Server Error", err });
      else {
        await User.findOneAndUpdate(
          { username },
          { password: hash },
          { new: true }
        );
        return res
          .status(200)
          .json({ message: "Password was changed succesfully!" });
      }
    });
  } catch (error) {
    const message = "Error changing password!";
    return res.status(500).json({ message, error });
  }
});

module.exports = userRouter;
