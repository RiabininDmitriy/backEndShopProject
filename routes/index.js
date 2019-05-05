import { login, registration } from "../controllers/auth.controller";
import {
  createCategory,
  getAllCategory
} from "../controllers/category.controller";

module.exports = function(app) {
  app.post("/registration", registration);
  app.post("/login", login);

  app.post("/category", createCategory);
  app.get("/categories", getAllCategory);
};
