import Database from "better-sqlite3";

const db = new Database('products.db');

const stmt = db.prepare(`SELECT * FROM products WHERE id=?`);
stmt.get(1, (err, row) => {
    console.log(row);
});