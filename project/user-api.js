const { results: json } = require('./users.json')

exports.userApi = ({ createTables, sqlite3, app }) => {
    app.get('/createUser', (req, res) => {
        const db = new sqlite3.Database('db.sqlite')
    
        db.serialize(function() {
    
            // Create tables if does not exists
            createTables(db)
    
            // Insert todos
            let stmt = db.prepare('INSERT INTO users(name) VALUES (?)')
    
            const { first, last } = json[randomIndex(0, 4999)].name
            const user = `${capitalize(first)} ${capitalize(last)}`
            stmt.run([user], (err) => {
                if (err && !didError) {
                    didError = true
                    console.error(err)
                    res.status(500).json({err})
                }
            })
    
            stmt.finalize()
    
            stmt = db.prepare(`
                SELECT id, name
                FROM users 
                ORDER BY id DESC 
                LIMIT 1
            `)
            stmt.all([], (err, rows) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({err})
                } else {
                    users = rows
                    res.status(200).json(users)
                }
            })
    
            stmt.finalize()
        })
    
        db.close()
    
    })

    app.get('/usersForRandomTodo', (req, res) => {
        const db = new sqlite3.Database('db.sqlite')
    
        db.serialize(function() {
    
            // Create tables if does not exists
            createTables(db)

            // Get todos
            db.all('SELECT * FROM todos', [], (err, todos) => {

                let todosCount = todos.length
                let todoIndex = randomIndex(0, todosCount - 1)
                const { id: todoId } = todos[todoIndex]

                // Get users from random todo
                stmt = db.prepare(`
                    SELECT u.*
                    FROM todoLookup as l
                    INNER JOIN users as u on u.id = l.userId
                    WHERE l.todoId = ?
                `)
                stmt.all([todoId], (err, users) => {
                    if (err) {
                        console.error(err)
                        res.status(500).json({err})
                    } else {
                        res.status(200).json({
                            todo: todos[todoIndex],
                            users
                        })
                    }

                    stmt.finalize()
                    db.close()
                })

            })
        })
    })
}

// Helpers

const randomIndex = (min, max) => {
    return (Math.floor(Math.random() * (max + 1))) + min
}

const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
}