import Database, { type Database as DB } from 'better-sqlite3';
import fetch from 'cross-fetch';

export let db: DB;
let modified: number | undefined;

const db_connect = async () => {
    const response = await fetch('https://keablob.blob.core.windows.net/products/products_final.db');
    const last_modified = new Date(response.headers.get('last-modified')).getTime();
    
    if (modified && modified >= last_modified) {
        return;
    }
    
    modified = last_modified;

    const db_db = await response.arrayBuffer();
    const db_buff = Buffer.from(db_db);
    db = new Database(db_buff, { verbose: console.log });
}

export default db_connect;