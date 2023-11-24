const express = require('express');
const authRouter = express.Router();

// insert into user (name, email, mobile, password) values ("Manthan", 'mkp28082003@gmail.com', '9428609360','123456');
// insert into tasks (task_title, task_desc, task_status, user_id) values ("node", 'create a mern todo', 1 , 1);

const authController = require('../controller/authController');

const user = new authController();

authRouter.post('/signup',user.signup);
authRouter.post('/signin',user.signin);

module.exports = authRouter