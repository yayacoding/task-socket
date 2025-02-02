const db = require("./dbConfig");
const bcrypt = require("bcrypt");
const { status: httpStatus } = require("http-status");
const { generateToken } = require("./middleware");

const { user, task } = db.models;
const { getIo } = require("./socket");
const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hasPass = await bcrypt.hash(password, 10);
    const dataToSave = {
      username,
      password: hasPass,
    };

    const userData = await user.create(dataToSave);
    if (!userData) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "DATA_NOT_SAVED" });
    }
    const token = await generateToken(userData);
    return res
      .status(httpStatus.CREATED)
      .json({ message: "USER_CREATED_SUCCESSFULLY", data: userData, token });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "SOMETHING_WENT_WRONG" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userData = await user.findOne({ where: { username } });

    if (userData && (await bcrypt.compare(password, userData.password))) {
      const token = await generateToken(userData);
      return res
        .status(httpStatus.CREATED)
        .json({ message: "USER_LOGIN_SUCCESSFULLY", data: userData, token });
    }
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: "INVALID_CREDENTIAL" });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "SOMETHING_WENT_WRONG" });
  }
};

const createTask = async (req, res) => {
  try {
    const { userId } = req.userData;
    const { title, description, assignedTo } = req.body;
    const dataToSave = {
      title,
      description,
      assignedTo,
      createdBy: userId,
      status: "inprogress",
    };

    const taskData = await task.create(dataToSave);
    if (!taskData) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "DATA_NOT_SAVED" });
    }
    const io = getIo();
    io.emit("task-create", taskData);
    return res
      .status(httpStatus.CREATED)
      .json({ message: "TASK_CREATED_SUCCESSFULLY", data: taskData });
  } catch (error) {
    console.log("TCL: createTask -> error", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "SOMETHING_WENT_WRONG" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const dataToSave = { ...req.body };

    await task.update(dataToSave, { where: { id } });
    const io = getIo();
    io.emit("task-update", {
      message: `Task updated successfully task id: ${id}`,
    });
    return res
      .status(httpStatus.CREATED)
      .json({ message: "TASK_UPDATED_SUCCESSFULLY" });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "SOMETHING_WENT_WRONG" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await task.destroy({ where: { id } });
    const io = getIo();
    io.emit("task-deleted", { message: `Task deleted successfully :${id}` });
    return res
      .status(httpStatus.CREATED)
      .json({ message: "TASK_DELETED_SUCCESSFULLY" });
  } catch (error) {
    console.log("TCL: deleteTask -> error", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "SOMETHING_WENT_WRONG" });
  }
};

const listTask = async (req, res) => {
  try {
    const { page, size } = req.query;
    const limit = size;
    const offset = (page - 1) * size;
    const taskList = await task.findAndCountAll({ offset, limit });

    res
      .status(httpStatus.OK)
      .json({ message: "Task fetched successfully", data: taskList });
  } catch (error) {
    console.log("TCL: signup -> error", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};
module.exports = {
  signUp,
  login,
  createTask,
  updateTask,
  deleteTask,
  listTask,
};
