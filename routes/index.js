import { login, registration } from "../controllers/auth.controller";
import {
  createCategory,
  getAllCategory
} from "../controllers/category.controller";
import { getUserInfo } from "../controllers/personalInfo.controller";
import { addItem, getItem } from "../controllers/addItems.controller";

module.exports = function(app) {
  app.post("/registration", registration);
  app.post("/login", login);

  app.post("/category", createCategory);
  app.get("/categories", getAllCategory);

  app.get("/user-info", getUserInfo);

  app.post("/post-item", addItem);
  app.get("/get-item", getItem);
};