exports.todoApi = ({ createTables, sqlite3, app }) => {
    app.get('/insertTodo', (req, res) => {
        const db = new sqlite3.Database('db.sqlite')
        let todos = []
    
        db.serialize(function() {
    
            // Create tables if does not exists
            createTables(db)
    
            // Insert todos
            let stmt = db.prepare('INSERT INTO todos(value) VALUES (?)')
    
            const todo = getRandomTodo()
                stmt.run([todo], (err) => {
                    if (err) {
                        console.error(err)
                        res.status(500).json({err})
                    }
                })
    
            stmt.finalize()
    
            stmt = db.prepare(`
                SELECT id, value, completed 
                FROM todos 
                ORDER BY id DESC 
                LIMIT 1
            `)
            stmt.all([], (err, rows) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({err})
                } else {
                    todos = rows.map(row => {
                        const { value, ...res } = row
                        return {
                            ...res,
                            text: value
                        }
                    })
                    res.status(200).json(todos)
                }
            })
    
            stmt.finalize()
        })
    
        db.close()
    
    })

    app.get('/todos', (req, res) => {
        const db = new sqlite3.Database('db.sqlite')
        let todos = []

        db.serialize(function() {
    
            // Create tables if does not exists
            createTables(db)
    
            // Select all todos
            stmt = db.prepare(`
                SELECT id, value, completed 
                FROM todos
            `)
            stmt.all([], (err, rows) => {
                if (err) {
                    console.error(err)
                    res.status(500).json({err})
                } else {
                    todos = rows.map(row => {
                        const { value, ...res } = row
                        return {
                            ...res,
                            text: value
                        }
                    })
                    res.status(200).json(todos)
                }
            })
    
            stmt.finalize()
        })
    
        db.close()
    })
}

// Helpers

const getRandomTodo = () => {

    const actions = 'call,read,dress,buy,ring,hop,skip,jump,look,rob,find,fly,go,ask,raise,search'
    const bridges = 'the,a,an,my,as,by,to,in,on,with'
    const targets = 'dog,doctor,store,dance,jig,friend,enemy,business,bull,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,Mom,Dad'
    
    const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1)
    const randomWord = list => {
      list = list.split(',');
      return list[Math.floor(Math.random() * list.length)];
    }
    
    return capitalizeFirstLetter(randomWord(actions)) + ' ' + randomWord(bridges) + ' ' + randomWord(targets)
}