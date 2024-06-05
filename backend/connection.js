const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
 
// Use Pooling
const client = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "root",
    database: "test",
    max: 50, // maximum number of connections in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait for a connection to be established
    multipleStatements: true
})

module.exports = client