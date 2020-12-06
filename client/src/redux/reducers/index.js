import { combineReducers } from "redux";

import auth from "./auth-reducer";
import items from "./items-reducer";
import orders from "./orders-reducer";
import profile from "./profile-reducer";
import cart from "./cart-reducer";

export default combineReducers({
  auth,
  items,
  orders,
  profile,
  cart,
});
