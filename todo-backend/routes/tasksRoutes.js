const express = require('express');
const taskRouter = express.Router();

const taskController = require('../controller/taskController');

const task = new taskController();

// task manipulation APIs
taskRouter.get('/get-all-tasks',task.getAllTasks);
taskRouter.get('/get-tasks-by-id/:user_id/:task_id',task.getTasksById);
taskRouter.post('/add-task',task.addTask);
taskRouter.patch('/update-task',task.updateTask);
taskRouter.delete('/delete-task',task.deleteTask);
taskRouter.patch('/status-update-task',task.statusUpdateTask);

module.exports = taskRouter;