import { createError } from "../error.js";
import User from "../models/User.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return next(createError(403, "Admin access only"));
    }

    next();
  } catch (err) {
    next(err);
  }
};
