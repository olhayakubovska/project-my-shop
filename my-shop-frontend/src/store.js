import { applyMiddleware, combineReducers, createStore } from "redux";

import { thunk } from "redux-thunk";
import {
  AppReducer,
  BasketReducer,
  productsReducer,
  UserReducer,
  UsersReducer,

} from "./reducers";


const reducer = combineReducers({
  app: AppReducer,
  user: UserReducer,
  users: UsersReducer,
  products: productsReducer,
  basket: BasketReducer,
});

export const store = createStore(reducer, applyMiddleware(thunk));
