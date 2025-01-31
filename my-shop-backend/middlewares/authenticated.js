import jwt from "jsonwebtoken";
import User from "../model/User.js";

const secretKey = "secret";

export const authenticated = async (req, res, next) => {
  const token = req.cookies.token;

  const tokenData = jwt.verify(token, secretKey);

  const user = await User.findOne({ _id: tokenData.id });
  if (!user) {
    res.send({ error: "user not authenticated" });
    return;
  }

  req.user = user;

  next();
};
