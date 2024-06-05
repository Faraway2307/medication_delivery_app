const client = require('./connection.js')

async function main() {
await client.connect();
// Create users table
const userTable = "userid SERIAL PRIMARY KEY, role VARCHAR(30), password VARCHAR(255)," +
    "nric VARCHAR(255) UNIQUE";
await client.query(`CREATE TABLE IF NOT EXISTS users (${userTable})`);

// Create admin table
const adminTable = "did SERIAL PRIMARY KEY, salutation VARCHAR(30), full_name VARCHAR(255)," +
    "nric VARCHAR(255) UNIQUE, contact VARCHAR(255), user_id INTEGER REFERENCES users(userid) ON DELETE RESTRICT";
await client.query(`CREATE TABLE IF NOT EXISTS admin (${adminTable})`);

// Create patient table
const patientTable = "pid SERIAL PRIMARY KEY, birthdate TIMESTAMP WITHOUT TIME ZONE, nric VARCHAR(255), gender VARCHAR(255), " +
    "full_name VARCHAR(255), contact VARCHAR(255), race VARCHAR(255), address VARCHAR(255), user_id INTEGER UNIQUE REFERENCES users(userid) ON DELETE RESTRICT";
await client.query(`CREATE TABLE IF NOT EXISTS patient (${patientTable})`);

const encounterTable = "encounterID VARCHAR(255) PRIMARY KEY, encounterDate TIMESTAMP WITHOUT TIME ZONE, pid INTEGER REFERENCES patient(pid), " +
    "encounterDesc VARCHAR(255), doctorid INT REFERENCES admin(did)";
await client.query(`CREATE TABLE IF NOT EXISTS encounter (${encounterTable})`);

// Create medication table
const medicationTable = "medCode SERIAL PRIMARY KEY, medName VARCHAR(255), medDesc TEXT, stock INT CHECK(stock >= 0), price NUMERIC(10,2) CHECK(price > 0)";
await client.query(`CREATE TABLE IF NOT EXISTS medication (${medicationTable})`);

// Create medicationOrder table
const medicationOrderTable = "orderID SERIAL PRIMARY KEY, pid INTEGER REFERENCES patient(pid), startDate TIMESTAMP WITHOUT TIME ZONE, " +
    "encounterID VARCHAR(255) REFERENCES encounter(encounterID), medCode INT, " +
    "medDesc TEXT, status VARCHAR(30), reason TEXT, doctorid INT REFERENCES admin(did)";
await client.query(`CREATE TABLE IF NOT EXISTS medicationOrder (${medicationOrderTable})`);

await client.end();

}
main().catch(console.error);
