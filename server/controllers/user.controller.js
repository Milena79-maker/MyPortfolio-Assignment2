
import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import jwt from "jsonwebtoken";

// CREATE USER / SIGN UP
const create = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    await user.save();

    return res.status(200).json({
      message: "Successfully signed up!"
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// GET ALL USERS
const list = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role updated created");

    return res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// FIND USER BY ID
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user"
    });
  }
};

// READ USER
const read = (req, res) => {
  const user = req.profile.toObject();

  delete user.hashed_password;
  delete user.salt;

  return res.json(user);
};

// UPDATE USER
const update = async (req, res) => {
  try {
    const user = req.profile;

    const allowedUpdates = {};

    if (typeof req.body.name === "string") {
      allowedUpdates.name = req.body.name;
    }

    if (typeof req.body.email === "string") {
      allowedUpdates.email = req.body.email;
    }

    if (typeof req.body.password === "string" &&
        req.body.password.length >= 6) {
      allowedUpdates.password = req.body.password;
    }

    extend(user, allowedUpdates);
    user.updated = Date.now();

    await user.save();

    const result = user.toObject();
    delete result.hashed_password;
    delete result.salt;

    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// DELETE USER
const remove = async (req, res) => {
  try {
    const user = req.profile;

    await user.deleteOne();

    return res.json({
      message: "User deleted successfully"
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

// SIGN IN WITH JWT
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.authenticate(password)) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        _id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Sign-in failed"
    });
  }
};

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update,
  signin
};