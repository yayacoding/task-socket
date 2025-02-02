const route = require("express").Router();
const controller = require("./controller");
const { verifyToken } = require("./middleware");

route.post("/signup", controller.signUp);
route.post("/login", controller.login);
route.post("/task-create", verifyToken, controller.createTask);
route.put("/task-update/:id", verifyToken, controller.updateTask);
route.delete("/task-delete/:id", verifyToken, controller.deleteTask);
route.get("/task-list", verifyToken, controller.listTask);

module.exports = route;
