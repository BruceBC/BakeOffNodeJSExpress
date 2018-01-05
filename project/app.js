const express = require('express')
const math = require('mathjs')
const sqlite3 = require('sqlite3').verbose()
const app = express()

// Import Apis
const { createTables } = require('./sqlite-config')
const { fibApi } = require('./fib-api')
const { todoApi } = require('./todoApi')
const { userApi } = require('./user-api')
const { lookupTodoApi } = require('./lookup-todo-api')

math.config({
    precision: 20000
})

app.get('/', (req, res) => res.send('Hello World!'))

// Initialize todo api
fibApi({math, app})
todoApi({createTables, sqlite3, app})
userApi({createTables, sqlite3, app})
lookupTodoApi({createTables, sqlite3, app})

app.listen(3000, () => console.log('Example app listening on port 3000!'))