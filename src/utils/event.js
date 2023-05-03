class Event {
    #subscribes

    constructor() {
        this.#subscribes = new Map()
    }

    on(key, fn) {
        this.#subscribes.set(key, fn)
    }

    emit() {
        this.#subscribes.forEach((fn, key) => {
            fn()
            this.#subscribes.delete(key)
        })
    }

    off() {
        this.#subscribes.clear()
    }

    get length(){
        return this.#subscribes.size
    }
}

export default Event
