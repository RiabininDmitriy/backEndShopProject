import { login, registration } from "../controllers/auth.controller";
import {
  createCategory,
  getAllCategory
} from "../controllers/category.controller";
import {
  getUserInfo,
  updateUser
} from "../controllers/personalInfo.controller";
import {
  addItem,
  getMyItems,
  getItems,
  getItemById,
  deleteItem
} from "../controllers/item.controller";

module.exports = function(app) {
  app.post("/registration", registration);
  app.post("/login", login);

  app.post("/category", createCategory);
  app.get("/categories", getAllCategory);

  app.get("/user-info", getUserInfo);
  app.put("/update-user", updateUser);

  app.post("/post-item", addItem);
  app.get("/get-item", getItems);
  app.get("/get-item/:id", getItemById);
  app.delete("/item/:id", deleteItem);

  app.get("/get-my-items", getMyItems);
};
