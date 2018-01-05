exports.createTables = (db) => {

    // Create User table if not exists
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`)

    // Create Todos table if not exists
    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT,
        completed BOOLEAN DEFAULT 0
    )`)

    // Create Lookup Table if not exists
    db.run(`CREATE TABLE IF NOT EXISTS todoLookup (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        todoId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
            ON DELETE CASCADE ON UPDATE CASCADE
        FOREIGN KEY (todoId) REFERENCES todos (id)
            ON DELETE CASCADE ON UPDATE CASCADE
    )`)

}