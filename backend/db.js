import pkg from "pg";
const { Pool } = pkg;


const pool = new Pool({
    user: "postgres",
    password: "yourpassword",
    host: "localhost",
    port: 5432,
    database: "horrormovies"
});

export default pool;