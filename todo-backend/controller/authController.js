let { HOST, USER, PASSWORD, DATABASE } = process.env;

const moment = require('moment/moment');
const APIRequestResponse = require('../utils/API/response');
require('dotenv').config();
const jwt = require("jsonwebtoken");

const apiResponse = new APIRequestResponse();

const MySQLConnection = require('../modal/mysql/mysql_connection');
const dbConnect = new MySQLConnection({ host: HOST, user: USER, password: PASSWORD, database: DATABASE });

class authController {
    constructor() {
    }

    async signup(req, res) {
        try {
            const { name, email, phone, password } = req.body;

            const sqlQuery = `SELECT email FROM user WHERE email = ?`;

            const existingUser = await dbConnect.executeSqlQuery(sqlQuery, [email]);

            if (existingUser.length > 0) {
                console.log("--->", await dbConnect.executeSqlQuery('select * from user',), "<---");


                res.status(apiResponse.responseCodes.CONFLICT)
                    .send({
                        status: false,
                        client_message: "User already exists",
                        dev: {
                            message: "User already exists",
                            error: apiResponse.responseMessages.CONFLICT
                        }
                    })

            }
            else {
                // const insertQuery = `insert into user (name, email, mobile, password) values (?)`;
                const insertQuery = `INSERT INTO user (name, email, mobile, password) VALUES (?,?,?,?)`;
                const insertValues = [name, email, phone, password];


                // console.log("--->",await dbConnect.executeSqlQuery('select * from user', insertValues),"<---");
                let user = await dbConnect.executeSqlQuery(insertQuery, insertValues);

                if (user.affectedRows > 0) {
                    res.status(apiResponse.responseCodes.CREATED)
                        .send({
                            status: true,
                            client_message: "Registerd successfully",
                            dev: {
                                message: apiResponse.responseMessages.CREATED,
                                error: ""
                            }
                        })
                }
                else {
                    res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                        .send({
                            status: false,
                            client_message: "Registration failed",
                            dev: {
                                message: "User data not inserted in to the table",
                                error: apiResponse.responseMessages.INTERNAL_SERVER_ERROR
                            }
                        })
                }
            }
        } catch (error) {
            res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                .send({
                    status: false,
                    client_message: "Error Registring user",
                    dev: {
                        message: "Error in catch block",
                        error: [apiResponse.responseMessages.INTERNAL_SERVER_ERROR, error]
                    }
                })
        }

    }

    async signin(req, res) {

        try {

            const { email, password } = req.body;
            // const sqlQuery = `SELECT * FROM user WHERE email = ?`;
            // const user = await dbConnect.executeSqlQuery(sqlQuery, [email]);


            const sqlQuery = `SELECT * FROM user WHERE email = ? AND password = ?`;

            const user = await dbConnect.executeSqlQuery(sqlQuery, [email, password]);


            if (user.length <= 0) {
                return res.status(apiResponse.responseCodes.UNAUTHORIZED)
                    .send({ status: false, client_message: "Invalid username or password", dev: { message: "User doesn't exists in table", error: apiResponse.responseMessages.UNAUTHORIZED } })
            }
            else {
                console.log(user[0].email, user, "printing User");
                const token = jwt.sign({ id: user[0].email }, "SECRET_KEY");
                // , { expiresIn: "1h" }
                console.log(token)
                const currentTimeStamp = moment().format("YYYY-MM-DD HH:mm:ss")

                const loginSqlQuery = `INSERT INTO user_acitvity_logs (user_id, last_login) VALUES(?,?)`;
                const loginSqlValues = [user[0].user_id, currentTimeStamp];
                console.log(loginSqlValues)

                const userActivityLogEntry = await dbConnect.executeSqlQuery(loginSqlQuery, loginSqlValues);

                if (userActivityLogEntry.affectedRows >= 0) {

                    res.status(apiResponse.responseCodes.SUCCESS)
                        .send({
                            status: true,
                            client_message: "Login successful",
                            user_id: user[0].user_id,
                            dev: {
                                message: "user's activity inserted successfully",
                                error: ""
                            },
                            token: token
                        })
                } else {
                    res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                        .send({
                            status: false,
                            client_message: "",
                            dev: {
                                message: "Error while entering user's activity ",
                                error: apiResponse.responseMessages.INTERNAL_SERVER_ERROR
                            }
                        })
                }

            }

        } catch (error) {
            res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                .send({
                    status: false,
                    client_message: "Error Login user",
                    dev: {
                        message: "Error in catch block",
                        error: [apiResponse.responseMessages.INTERNAL_SERVER_ERROR, error]
                    }
                })
        }
    }

}

module.exports = authController;
