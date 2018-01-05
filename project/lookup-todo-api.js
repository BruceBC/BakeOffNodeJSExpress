exports.lookupTodoApi = ({ createTables, sqlite3, app }) => {
    app.get('/assignUsersToTodo', (req, res) => {
        const db = new sqlite3.Database('db.sqlite')
    
        db.serialize(function() {
    
            // Create tables if does not exists
            createTables(db)

            // Select todos
            stmt = db.prepare(`
                SELECT id, value, completed 
                FROM todos
            `)
            stmt.all([], (err, todos) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({err})
                } else {
                    todos = todos.map(row => {
                        const { value, ...res } = row
                        return {
                            ...res,
                            text: value
                        }
                    })
                    getUsers({db, todos, res})
                }
            })
    
            stmt.finalize()
        })
    })
}

const getUsers = ({db, todos, res}) => {
    // Get users
    db.all('SELECT id, name FROM users', [], (err, users) => {
        if (err) {
            console.log(err)
            res.status(500).json({err})
        } else {
            assignRandomUsersToTodos({db, todos, users, res})
        }
    })
    
    db.close()
}

const assignRandomUsersToTodos = ({db, todos, users, res}) => {
    // Set todo count
    const todoCount = todos.length

    // Assign random numbers of users to each todo
    let stmt = db.prepare('INSERT INTO todoLookup(userId, todoId) VALUES (?, ?)')

    for (let i = 0; i < todoCount; i++) {
        const numToAssign = randomIndex(1, 100)
        for (let j = 0; j < numToAssign; j++) {
            const userIndex = randomIndex(0, users.length - 1)
            const { id: userId } = users[userIndex]
            const { id: todoId } = todos[i]

            stmt.run([userId, todoId], (err) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({err})
                }
            })
        }
    }
    reportTodoLookupTable({db, stmt, res})
}

const reportTodoLookupTable = ({db, stmt, res}) => {
    stmt.finalize()

    db.all('SELECT * FROM todoLookup', [], (err, rows) => {

        if (err) {
            console.log(err)
            res.status(500).json({err})
        } else {
            res.status(200).json(rows)
        }

    })

    db.close()
}

// Helpers

const randomIndex = (min, max) => {
    return (Math.floor(Math.random() * (max + 1))) + min
}
