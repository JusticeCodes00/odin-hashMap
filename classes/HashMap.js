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
      hashCode = (primeNum * hashCode + key.charCodeAt(i)) % this.#capacity;
    }
    return hashCode;
  }

  #growBucket() {
    this.#capacity = this.#capacity * 2;

    const prevBucket = this.#bucket;

    this.#bucket = new Array(this.#capacity)
      .fill(null)
      .map(() => new LinkedList());
  }

  set(key, value) {
    if (this.#entries >= this.#loadFactor * this.#capacity) {
      console.log("Time to resize bucket");
      this.#growBucket();
      return;
    }
    const bucketIndex = this.#hash(key);
    const list = this.#bucket[bucketIndex];

    const match = (container) => key in container;

    if (list.contains(match)) {
      list.at(list.findIndex(match))[key] = value;
    }

    list.append({ [key]: value });
    this.#entries++;
    console.log(this.#entries);
  }
}

const hashMap = new HashMap();
for (let i = 0; i < 13; i++) {
  hashMap.set(`${i}ab`, "no empty");
}
