import pgpConstructor from "pg-promise";

const initOptions = {};

const pgp = pgpConstructor(initOptions);
const db = pgp({
  host: "localhost",
  port: 5432,
  database: "library",
  user: "testuser", // Replace with the postgres user your created
  password: "password" // Replace with the password you set on that user
})

export default db;