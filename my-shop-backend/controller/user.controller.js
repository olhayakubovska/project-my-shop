import { generateToken } from "../geterate-token.js";
import { userMap } from "../map/userMap.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";

export const register = async (login, password) => {
  if (!password) {
    throw new Error("Empty password ");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ login, password: hashPassword });

  const token = generateToken({ id: user.id, roleId: user.roleId });

  return { user: userMap(user), token };
};

export const login = async (login, password) => {
  const user = await User.findOne({ login });
  if (!user) {
    throw new Error("User not found ");
  }

  const isPassword = await bcrypt.compare(password, user.password);

  if (!isPassword) {
    throw new Error("Wrong password ");
  }

  const token = generateToken({ id: user._id, roleId: user.roleId });

  return { user: userMap(user), token };
};

export const getUsers = async () => {
  const users = await User.find();
  return users;
};

export const getRoles = () => {
  const roles = [
    {
      id: "0",
      name: "Администратор",
    },

    {
      id: "2",
      name: "Читатель",
    },
    {
      id: "3",
      name: "Гость",
    },
  ];
  return roles;
};
export const changeUserRole = async (userId, newRole) => {
  const newUser = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { roleId: newRole } },
    { new: true, upsert: true }
  );
  return newUser;
};
export const deleteUser = async (userId) => {
  await User.deleteOne({ _id: userId });
  const users = await User.find();

  return users;
};
