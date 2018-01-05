export default class Todo {
    _text = null
    _completed = false
    _users = []

    constructor(text, users = [], completed = false) {
        this.text = text
        this.users = users
        this.completed = completed
    }

    get text() {
        return this._text
    }

    set text(text) {
        this._text = text
    }

    get completed() {
        return this._completed
    }

    set completed(completed) {
        this._completed = completed
    }

    get users() {
        return this._users
    }

    set users(users) {
        this._users = users
    }

    toJSON() {
        return {
            text: this.text,
            completed: this.completed,
            users: this.users
        }
    }

    toJSONString() {
        return JSON.stringify(this.toJSON())
    }
}