require('dotenv').config();
let { HOST, USER, PASSWORD, DATABASE } = process.env;

const moment = require('moment/moment');

const APIRequestResponse = require("../utils/API/response")
const apiResponse = new APIRequestResponse();

const MySQLConnection = require('../modal/mysql/mysql_connection');
const dbConnect = new MySQLConnection({ host: HOST, user: USER, password: PASSWORD, database: DATABASE });


class taskController {
    constructor() {
    }

    async getAllTasks(req, res) {
        try {
            const { id } = req.query;

            const sqlGetAllTasksQuery = `SELECT * from tasks where user_id = ?`;
            const sqlGetAllTasksValues = [id];

            const data = await dbConnect.executeSqlQuery(sqlGetAllTasksQuery, sqlGetAllTasksValues);
            // console.log(data)
            if (data) {
                res.status(apiResponse.responseCodes.SUCCESS)
                    .send({
                        status: true,
                        outdata: { tasks: data },
                        client_message: "",
                        dev: {
                            message: "",
                            error: ""
                        }
                    })
            }
            else {
                res.status(apiResponse.responseCodes.BAD_REQUEST)
                    .send({
                        status: false,
                        client_message: "Incorrect User Id",
                        dev: {
                            message: "Please enter valid fields",
                            error: apiResponse.responseMessages.BAD_REQUEST
                        }
                    })
            }


        } catch (error) {
            res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                .send({
                    status: false,
                    client_message: "Error getting task data",
                    dev: {
                        message: "Error in catch block",
                        error: [apiResponse.responseMessages.INTERNAL_SERVER_ERROR, error]
                    }
                })
        }
    }
    async getTasksById(req, res) {
        try {
            const { user_id, task_id } = req.params;

            const sqlGetTasksByIdQuery = `SELECT * from tasks where user_id = ? and task_id = ?`;
            const sqlGetTasksByIdValues = [user_id, task_id];

            const data = await dbConnect.executeSqlQuery(sqlGetTasksByIdQuery, sqlGetTasksByIdValues);
            console.log(data)
            if (data) {
                res.status(apiResponse.responseCodes.SUCCESS)
                    .send({
                        status: true,
                        outdata: data[0],
                        client_message: "",
                        dev: {
                            message: "",
                            error: ""
                        }
                    })
            }
            else {
                res.status(apiResponse.responseCodes.BAD_REQUEST)
                    .send({
                        status: false,
                        client_message: "Incorrect User Id or Task Id",
                        dev: {
                            message: "Please enter valid fields",
                            error: apiResponse.responseMessages.BAD_REQUEST
                        }
                    })
            }


        } catch (error) {
            res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                .send({
                    status: false,
                    client_message: "Error getting task data",
                    dev: {
                        message: "Error in catch block",
                        error: [apiResponse.responseMessages.INTERNAL_SERVER_ERROR, error]
                    }
                })
        }
    }
    async addTask(req, res) {
        try {
            const { task_title, task_desc, task_status, user_id } = req.body;

            const currentTimeStamp = moment().format("YYYY-MM-DD HH:mm")

            const array = await dbConnect.executeSqlQuery('select task_index from tasks where user_id = ? and task_status = ?', [user_id, task_status])

            const maxTaskIndex = array.reduce((max, obj) => {
                console.log("max", max)
                if (obj.task_index !== null && obj.task_index > max) {
                    return obj.task_index;
                }
                return max;
            }, -1);


            const sqlInsertQuery = `INSERT INTO tasks(task_title, task_desc, task_status, user_id,task_date,task_index) VALUES (?,?,?,?,?,?)`;
            const sqlInsertValues = [task_title, task_desc, task_status, user_id, currentTimeStamp, maxTaskIndex + 1];

            const task = await dbConnect.executeSqlQuery(sqlInsertQuery, sqlInsertValues);

            if (task.affectedRows > 0) {

                res.status(apiResponse.responseCodes.CREATED)
                    .send({
                        status: true,
                        client_message: "Task added successfully",
                        dev: {
                            message: "Task added to the table.",
                            error: ""
                        }
                    })
            }
            else {
                res.status(apiResponse.responseCodes.CONFLICT)
                    .send({
                        status: false,
                        client_message: "Error Adding Task",
                        dev: {
                            message: "Please enter valid fields",
                            error: apiResponse.responseMessages.CONFLICT
                        }
                    })
            }


        } catch (error) {
            console.log(error)
            res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                .send({
                    status: false,
                    client_message: "Error Adding Task",
                    dev: {
                        message: "Error in catch block",
                        error: [apiResponse.responseMessages.INTERNAL_SERVER_ERROR, error]
                    }
                })
        }
    }
    async updateTask(req, res) {
        try {
            const { task_title, task_desc, task_status, user_id, task_id } = req.body;

            console.log(task_title, task_desc, task_status, user_id, task_id)
            const sqlUpdateQuery = `UPDATE tasks set task_title = ?, task_desc = ?, task_status = ? where user_id = ? and task_id = ?`
            const sqlUpdateValues = [task_title, task_desc, task_status, user_id, task_id];

            const updateTask = await dbConnect.executeSqlQuery(sqlUpdateQuery, sqlUpdateValues);

            if (updateTask.affectedRows > 0) {
                res.status(apiResponse.responseCodes.CREATED)
                    .send({
                        status: true,
                        client_message: "Task Updated successfully",
                        dev: {
                            message: "Task Updated successfully.",
                            error: ""
                        }
                    })
            }
            else {
                res.status(apiResponse.responseCodes.CONFLICT)
                    .send({
                        status: false,
                        client_message: "Error Adding Task",
                        dev: {
                            message: "Please enter valid fields",
                            error: apiResponse.responseMessages.CONFLICT
                        }
                    })
            }

        } catch (error) {
            console.log(error)
            res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                .send({
                    status: false,
                    client_message: "Error Updating Tasks",
                    dev: {
                        message: "Error in catch block",
                        error: [apiResponse.responseMessages.INTERNAL_SERVER_ERROR, error]
                    }
                })
        }
    }
    async deleteTask(req, res) {
        try {
            const { task_id, user_id, task_status } = req.query;

            const sqlDeleteQuery = `DELETE from tasks where task_id = ? and user_id = ? and task_status = ?`
            const sqlDeleteValues = [task_id, user_id, task_status]
            console.log(sqlDeleteQuery, sqlDeleteValues)
            const deleteTask = await dbConnect.executeSqlQuery(sqlDeleteQuery, sqlDeleteValues)

            console.log(deleteTask, "deleteTask")

            if (deleteTask.affectedRows > 0) {
                res.status(apiResponse.responseCodes.SUCCESS)
                    .send({
                        status: true,
                        client_message: "Task Deleted successfully",
                        dev: {
                            message: "Task Deleted successfully.",
                            error: ""
                        }
                    })
            }
            else {
                res.status(apiResponse.responseCodes.BAD_REQUEST)
                    .send({
                        status: false,
                        client_message: "Error Deleting task",
                        error: apiResponse.responseMessages.BAD_REQUEST
                    })
            }


        } catch (error) {
            res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                .send({
                    status: false,
                    client_message: "Error Deleting task",
                    dev: {
                        message: "Error in catch block",
                        error: [apiResponse.responseMessages.INTERNAL_SERVER_ERROR, error]
                    }
                })
        }
    }

    /*
    there are 3 status for task 
        1. Pending
        2. In Progress
        3. Completed
    */

    async statusUpdateTask(req, res) {

        try {

            // const { task_status, task_id, user_id } = req.body;
            const { task_id, user_id, sourceTask_status, sourceIndex, destinationTask_status, destinationIndex } = req.body;

            console.log("Input DATA ----------------- over -----------------", {
                "task_id": task_id,
                "user_id": user_id,
                "sourceTask_status": sourceTask_status,
                "sourceIndex": sourceIndex,
                "destinationTask_status": destinationTask_status,
                "destinationIndex": destinationIndex
            }, "Input DATA ----------------- over -----------------")



            if (sourceTask_status === destinationTask_status) {
                if (destinationIndex > sourceIndex) {
                    console.log('destinationIndex > sourceIndex');
                    // 👉 updating other task's Index 
                    console.log('\n\n')
                    const sqlUpdateSourceIndexQuery = 'UPDATE tasks SET task_index = task_index - 1 WHERE task_id > 0 AND task_status = ?  AND task_index >= ? AND task_index <= ?  AND task_id != ? AND user_id = ?'
                    const sqlUpdateSourceIndexValue = [sourceTask_status, sourceIndex, destinationIndex, task_id, user_id]
                    const updateSourceIndex = await dbConnect.executeSqlQuery(sqlUpdateSourceIndexQuery, sqlUpdateSourceIndexValue)
                    console.log("updateSourceIndex", updateSourceIndex)


                    // 👉 updating other task's Index 
                    console.log('\n\n')
                    const sqlUpdateDestinationIndexQuery = 'UPDATE tasks SET task_index = ? where task_id = ? AND user_id = ?'
                    const sqlUpdateDestinationIndexValue = [destinationIndex, task_id, user_id]
                    const updateDestinationIndex = await dbConnect.executeSqlQuery(sqlUpdateDestinationIndexQuery, sqlUpdateDestinationIndexValue)
                    console.log("updateDestinationIndex", updateDestinationIndex)

                    if (updateSourceIndex.affectedRows > 0 || updateDestinationIndex.affectedRows > 0) {
                        res.status(apiResponse.responseCodes.CREATED)
                            .send({
                                status: true,
                                client_message: "Task status Updated successfully",
                                dev: {
                                    message: "Task status Updated successfully.",
                                    error: ""
                                }
                            })
                    } else {
                        res.status(apiResponse.responseCodes.BAD_REQUEST)
                            .send({
                                status: false,
                                client_message: "Error while Updating",
                                dev: {
                                    message: "Error while Updating.",
                                    error: apiResponse.responseMessages.BAD_REQUEST
                                }
                            })

                    }

                } else if (destinationIndex < sourceIndex) {
                    console.log('destinationIndex < sourceIndex');
                    // 👉 updating other task's Index 
                    console.log('\n\n')
                    const sqlUpdateSourceIndexQuery = 'UPDATE tasks SET task_index = task_index + 1 WHERE task_id > 0 AND task_status = ?  AND task_index >= ? AND task_index <= ?  AND task_id != ? AND user_id = ?'
                    const sqlUpdateSourceIndexValue = [sourceTask_status, destinationIndex, sourceIndex, task_id, user_id]
                    const updateSourceIndex = await dbConnect.executeSqlQuery(sqlUpdateSourceIndexQuery, sqlUpdateSourceIndexValue)
                    console.log("updateSourceIndex", updateSourceIndex)


                    // 👉 updating other task's Index 
                    console.log('\n\n')
                    const sqlUpdateDestinationIndexQuery = 'UPDATE tasks SET task_index = ? where task_id = ? AND user_id = ?'
                    const sqlUpdateDestinationIndexValue = [destinationIndex, task_id, user_id]
                    const updateDestinationIndex = await dbConnect.executeSqlQuery(sqlUpdateDestinationIndexQuery, sqlUpdateDestinationIndexValue)
                    console.log("updateDestinationIndex", updateDestinationIndex)

                    if (updateSourceIndex.affectedRows > 0 && updateDestinationIndex.affectedRows > 0) {
                        res.status(apiResponse.responseCodes.CREATED)
                            .send({
                                status: true,
                                client_message: "Task status Updated successfully",
                                dev: {
                                    message: "Task status Updated successfully.",
                                    error: ""
                                }
                            })
                    } else {
                        res.status(apiResponse.responseCodes.BAD_REQUEST)
                            .send({
                                status: false,
                                client_message: "Error while Updating",
                                dev: {
                                    message: "Error while Updating.",
                                    error: apiResponse.responseMessages.BAD_REQUEST
                                }
                            })
                    }
                }
            } else if (sourceTask_status !== destinationTask_status) {
                console.log("sourceTask_status !== destinationTask_status")
                // 👉 updating other task's Index 
                console.log('\n\n')
                const sqlUpdateDestinationIndexQuery = 'UPDATE tasks SET task_index = task_index + 1 WHERE task_id > 0 AND task_status = ? AND task_index >= ? AND task_id != ? AND user_id = ?'
                const sqlUpdateDestinationIndexValue = [destinationTask_status, destinationIndex, task_id, user_id]
                const updateDestinationIndex = await dbConnect.executeSqlQuery(sqlUpdateDestinationIndexQuery, sqlUpdateDestinationIndexValue)
                console.log("updateDestinationIndex", updateDestinationIndex)

                // 👉 updating other task's Index 
                const sqlUpdateSourceIndexQuery = 'UPDATE tasks SET task_index = task_index - 1 WHERE task_id > 0 AND task_status = ? AND task_index >= ? AND task_id != ? AND user_id = ?'
                const sqlUpdateSourceIndexValue = [sourceTask_status, sourceIndex, task_id, user_id]
                const updateSourceIndex = await dbConnect.executeSqlQuery(sqlUpdateSourceIndexQuery, sqlUpdateSourceIndexValue)
                console.log("updateDestinationIndex", updateSourceIndex)

                // 👉 updating other task's Index 
                // console.log('\n\n')
                const sqlUpdateCurrentTaskStatusIndexQuery = 'UPDATE tasks SET task_index = ?,task_status = ? where task_id = ? AND user_id = ?'
                const sqlUpdateCurrentTaskStatusIndexValue = [destinationIndex, destinationTask_status, task_id, user_id]
                const updateCurrentTaskStatusIndex = await dbConnect.executeSqlQuery(sqlUpdateCurrentTaskStatusIndexQuery, sqlUpdateCurrentTaskStatusIndexValue)
                console.log("updateCurrentTaskStatusIndex", updateCurrentTaskStatusIndex)



                if (updateDestinationIndex.affectedRows > 0 || updateCurrentTaskStatusIndex.affectedRows > 0 || updateSourceIndex.affectedRows > 0) {
                    res.status(apiResponse.responseCodes.CREATED)
                        .send({
                            status: true,
                            client_message: "Task status Updated successfully",
                            dev: {
                                message: "Task status Updated successfully.",
                                error: ""
                            }
                        })
                } else {
                    res.status(apiResponse.responseCodes.BAD_REQUEST)
                        .send({
                            status: false,
                            client_message: "Error while Updating",
                            dev: {
                                message: "Error while Updating.",
                                error: apiResponse.responseMessages.BAD_REQUEST
                            }
                        })

                }
            }
        } catch (error) {
            res.status(apiResponse.responseCodes.INTERNAL_SERVER_ERROR)
                .send({
                    status: false,
                    client_message: "Error Status Update of task",
                    dev: {
                        message: "Error in catch block",
                        error: [apiResponse.responseMessages.INTERNAL_SERVER_ERROR, error]
                    }
                })
        }
    }

}

module.exports = taskController;