import mongoose from "mongoose";
import Food from "../models/Food.js";
import { createError } from "../error.js";


// ================= ADD PRODUCTS =================

export const addProducts = async (req, res, next) => {
  try {
    let foodData = req.body;

    // Allow single object or array
    if (!Array.isArray(foodData)) {
      foodData = [foodData];
    }

    let createdfoods = [];

    for (const foodInfo of foodData) {
      const { name, desc, img, price, ingredients, category } = foodInfo;

      const product = new Food({
        name,
        desc,
        img,
        price,
        ingredients,
        category,
      });

      const createdFood = await product.save();
      createdfoods.push(createdFood);
    }

    res.status(201).json(createdfoods);

  } catch (err) {
    next(err);
  }
};



// ================= GET FOOD LIST =================

export const getFoodItems = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, ingredients, search } = req.query;

    categories = categories?.split(",");
    ingredients = ingredients?.split(",");

    const filter = {};

    if (categories?.length) {
      filter.category = { $in: categories };
    }

    if (ingredients?.length) {
      filter.ingredients = { $in: ingredients };
    }

    if (minPrice || maxPrice) {
      filter["price.org"] = {};

      if (minPrice) {
        filter["price.org"]["$gte"] = Number(minPrice);
      }

      if (maxPrice) {
        filter["price.org"]["$lte"] = Number(maxPrice);
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { desc: { $regex: new RegExp(search, "i") } },
      ];
    }

    const foods = await Food.find(filter);

    res.status(200).json(foods);

  } catch (err) {
    next(err);
  }
};



// ================= GET FOOD BY ID =================

export const getFoodById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }

    const food = await Food.findById(id);

    if (!food) {
      return next(createError(404, "Food not found"));
    }

    res.status(200).json(food);

  } catch (err) {
    next(err);
  }
};
