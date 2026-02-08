import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";

dotenv.config();


// ================= AUTH =================

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return next(createError(409, "Email already exists"));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      img,
      cart: [],
      favourites: [],
    });

    const createdUser = await user.save();

    const token = jwt.sign(
      { id: createdUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: createdUser });

  } catch (err) {
    next(err);
  }
};


export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) return next(createError(404, "User not found"));

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return next(createError(403, "Wrong password"));

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });

  } catch (err) {
    next(err);
  }
};



// ================= CART =================

export const addToCart = async (req, res, next) => {
  try {
    console.log(req.user);

    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.id);

    const index = user.cart.findIndex(item =>
      item.product.equals(productId)
    );

    if (index !== -1) {
      user.cart[index].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.status(200).json(user.cart);
    


  } catch (err) {
    next(err);
  }
};


export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.id);

    const index = user.cart.findIndex(item =>
      item.product.equals(productId)
    );

    if (index === -1) return next(createError(404, "Item not found"));

    if (quantity && quantity > 0) {
      user.cart[index].quantity -= quantity;
      if (user.cart[index].quantity <= 0) {
        user.cart.splice(index, 1);
      }
    } else {
      user.cart.splice(index, 1);
    }

    await user.save();
    res.status(200).json(user.cart);

  } catch (err) {
    next(err);
  }
};


export const getAllCartItems = async (req, res, next) => {
  try {
    console.log("REQ USER:", req.user);

    const user = await User.findById(req.user.id).populate("cart.product");

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(404).json("User not found");
    }

    res.status(200).json(user.cart);

  } catch (err) {
    console.log("CART ERROR:", err);
    res.status(500).json(err.message);
  }
};





// ================= FAVORITES =================

export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    res.status(200).json(user.favourites);

  } catch (err) {
    next(err);
  }
};


export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);

    user.favourites = user.favourites.filter(
      fav => !fav.equals(productId)
    );

    await user.save();

    res.status(200).json(user.favourites);

  } catch (err) {
    next(err);
  }
};


export const getUserFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("favourites");

    res.status(200).json(user.favourites);

  } catch (err) {
    next(err);
  }
};



// ================= ORDERS =================

export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;

    const order = new Orders({
      products,
      user: req.user.id,
      total_amount: totalAmount,
      address,
    });

    await order.save();

    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();

    res.status(200).json(order);

  } catch (err) {
    next(err);
  }
};


export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find({ user: req.user.id });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};
