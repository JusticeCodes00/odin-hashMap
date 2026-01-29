import LinkedList from "./LinkedList.js";

export default class HashMap {
    #bucket;
    #capacity;
    #loadFactor;
    #entries = 0;
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

    set(key, value) {
        const bucketIndex = this.#hash(key);
        const list = this.#bucket[bucketIndex];

        if (list.contains(key)) {
            list.at(list.findIndex(key))[key] = value;
        }

        list.append({ [key]: value });
        this.#entries += 1;
    }
}

const hashMap = new HashMap();
console.log(hashMap.set("ben", "first value"));
console.log(hashMap.set("neb", "second value"));
console.log(hashMap.set("uuuuuu", "third value"));
