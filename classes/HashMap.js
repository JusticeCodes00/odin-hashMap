import LinkedList from "./LinkedList.js";

export default class HashMap {
  static HOW_MUCH_TO_GROW = 2;
  static BASE_CAPACITY = 16;

  #bucket;
  #capacity;
  #entries = 0;
  #currentKey = null;
  #loadFactor = 0.75;

  constructor() {
    this.#capacity = HashMap.BASE_CAPACITY;
    this.#bucket = this.#create();
  }

  #create() {
    return new Array(this.#capacity).fill(null).map(() => new LinkedList());
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
    this.#capacity = this.#capacity * HashMap.HOW_MUCH_TO_GROW;

    const prevBucket = this.#bucket;

    this.#bucket = this.#create();

    this.#entries = 0;

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
  }

  #match = (container) => this.#currentKey in container;

  set(key, value) {
    this.#currentKey = key;
    const grow = this.#entries >= this.#loadFactor * this.#capacity;

    const bucketIndex = this.#hash(key);
    const list = this.#bucket[bucketIndex];

    if (list.contains(this.#match)) {
      list.at(list.findIndex(this.#match))[key] = value;
      return;
    }

    if (grow) {
      this.#growBucket();
      this.set(key, value);
      return;
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
    console.log(this.#capacity);
    return this.#entries;
  }

  clear() {
    this.#capacity = HashMap.BASE_CAPACITY;
    this.#bucket = this.#create();
    this.#entries = 0;
    this.#currentKey = null;
  }

  keys() {
    const keys = [];

    for (let i = 0; i < this.#capacity; i++) {
      const list = this.#bucket[i];

      if (!list.head()) continue;

      list.forEach((nodeValue) => {
        keys.push(...Object.keys(nodeValue));
      });
    }
    return keys;
  }

  values() {
    const values = [];

    for (let i = 0; i < this.#capacity; i++) {
      const list = this.#bucket[i];

      if (!list.head()) continue;

      list.forEach((nodeValue) => {
        values.push(...Object.values(nodeValue));
      });
    }
    return values;
  }

  entries() {
    const entries = [];

    for (let i = 0; i < this.#capacity; i++) {
      const list = this.#bucket[i];

      if (!list.head()) continue;

      list.forEach((nodeValue) => {
        entries.push(...Object.entries(nodeValue));
      });
    }
    return entries;
  }

  // Protected helper methods for subclasses
  _checkAndGrow() {
    const grow = this.#entries >= this.#loadFactor * this.#capacity;
    if (grow) {
      this.#growBucket();
      return true;
    }
    return false;
  }

  _findBucketList(key) {
    this.#currentKey = key;
    const index = this.#hash(key);
    return this.#bucket[index];
  }

  _keyExists(list) {
    return list.contains(this.#match);
  }

  _getExistingNode(list) {
    return list.at(list.findIndex(this.#match));
  }

  _incrementEntries() {
    this.#entries++;
  }
}
