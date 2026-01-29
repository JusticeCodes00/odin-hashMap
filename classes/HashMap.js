import LinkedList from "./LinkedList.js";

export default class HashMap {
    static HOW_MUCH_TO_GROW = 2;

    #bucket;
    #capacity;
    #loadFactor;
    #entries = 0;
    #currentKey = null;

    constructor() {
        this.#capacity = 16;
        this.#bucket = new Array(this.#capacity)
            .fill(null)
            .map(() => new LinkedList());
        this.#loadFactor = 0.75;
    }

    #hash(key) {
        if (typeof key !== "string") {
            throw new Error("key must be of type String");
        }

        let hashCode = 0;
        const primeNum = 31;

        for (let i = 0; i < key.length; i++) {
            hashCode =
                (primeNum * hashCode + key.charCodeAt(i)) % this.#capacity;
        }
        return hashCode;
    }

    #growBucket() {
        this.#capacity = this.#capacity * HashMap.HOW_MUCH_TO_GROW;

        const prevBucket = this.#bucket;

        this.#bucket = new Array(this.#capacity)
            .fill(null)
            .map(() => new LinkedList());

        for (let i = 0; i < prevBucket.length; i++) {
            const current = prevBucket[i];
            if (!current.size()) {
                continue;
            }

            while (current.head()) {
                const [[key, value]] = Object.entries(current.pop());
                this.set(key, value);
            }
        }
        for (let j = 0; j < this.#bucket.length; j++) {
            console.log(this.#bucket[j].toString());
        }
        console.log("New Capacity: " + this.#capacity);
    }

    #match = container => this.#currentKey in container;

    set(key, value) {
        this.#currentKey = key;
        const timeToGrow = this.#entries >= this.#loadFactor * this.#capacity;

        if (timeToGrow) {
            console.log(
                `Max entries exceeded(${this.#entries})\nGrowing bucket...`
            );
            this.#growBucket();
        }

        const bucketIndex = this.#hash(key);
        const list = this.#bucket[bucketIndex];

        if (list.contains(this.#match)) {
            list.at(list.findIndex(this.#match))[key] = value;
        }

        list.append({ [key]: value });

        this.#entries++;
    }

    get(key) {
        this.#currentKey = key;
        const index = this.#hash(key);
        let value = null;

        const list = this.#bucket[index];

        const exist = list.contains(this.#match);

        if (exist) {
            value = list.at(list.findIndex(this.#match))[this.#currentKey];
        }

        return value;
    }

    has(key) {
        this.#currentKey = key;

        const index = this.#hash(key);

        const list = this.#bucket[index];

        return list.contains(this.#match);
    }

    remove(key) {
        this.#currentKey = key;
        const index = this.#hash(key);
        const list = this.#bucket[index];
        let result = false;

        if (list.contains(this.#match)) {
            list.removeAt(list.findIndex(this.#match));
            result = true;
            this.#entries--;
        }

        return result;
    }

    length() {
        return this.#entries;
    }
}

// Test bucket growth

const map = new HashMap();

console.log(map.set("ben", "Hello"));
// for (let i = 0; i < 32; i++) {
//     map.set(`ab${i}`, `${i}${i}${i}${i}`);
// }

console.log(map.remove("ben"));
console.log(map.get("ben"));
console.log(map.length());
