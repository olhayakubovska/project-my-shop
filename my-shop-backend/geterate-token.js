import jwt from "jsonwebtoken";

const secretKey = "secret";

export const generateToken = (userData) => {
  const token = jwt.sign(userData, secretKey, { expiresIn: "30d" });
  return token;
};
