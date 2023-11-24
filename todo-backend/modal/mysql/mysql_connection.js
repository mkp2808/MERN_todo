const mysql = require('mysql2');

class MySQLConnection {
    constructor(config) {
        try {
            this.config = config;
            this.connection = null;
        } catch (error) {
            throw error;
        }
    }

    connect() {
        try {
            return new Promise((resolve, reject) => {
                this.connection = mysql.createConnection(this.config);

                this.connection.connect((err) => {
                    if (err) {
                        console.log("oops!...Error while connecting : ", err);
                        reject(err);
                    }
                    else {
                        console.log("Connected to MySQL database!");
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    close() {
        try {
            return new Promise((resolve, reject) => {
                if (this.connection) {
                    this.connection.end((err) => {
                        if (err) {
                            console.log("Error while closing the connection", err);
                            reject(err);
                        }
                        else {
                            console.log("MySQL connection closed");
                            resolve();
                        }
                    })
                }
                else {
                    resolve();
                }
            })
        } catch (error) {
            console.log("error", error);
        }
    }

    executeSqlQuery(query, values) {
        try {
            this.connection = mysql.createConnection(this.config);
            return new Promise((resolve, reject) => {
                this.connection.query(query, values, (error, results) => {
                    if (error) {
                        console.log("error", error);
                        reject(error);
                    }
                    else {
                        resolve(results);
                    }
                });
            });
        } catch (error) {
            console.log("error", error);
        }
    }
}


module.exports = MySQLConnection