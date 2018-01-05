export default class User {
    _name = null

    constructor(name) {
        this.name = name
    }

    get name() {
        return this._name
    }

    set name(name) {
        this._name = name
    }

    toJSON() {
        return {
            name: this.name
        }
    }

    toJSONString() {
        return JSON.stringify(this.toJSON())
    }
}