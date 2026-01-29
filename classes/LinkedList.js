import Node from "./Node.js";
export default class LinkedList {
  #head;
  #tail;
  #size;
  constructor() {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;
  }

  append(value) {
    const newNode = new Node(value);

    if (!this.#head) {
      this.#head = newNode;
      this.#tail = newNode;
      this.#size++;
    } else {
      this.#tail.nextNode = newNode;
      this.#tail = newNode;
      this.#size++;
    }
  }

  prepend(value) {
    const newNode = new Node(value, this.#head);
    this.#head = newNode;
    if (!this.#tail) this.#tail = newNode;
    this.#size++;
  }

  size() {
    return this.#size;
  }

  head() {
    return this.#head?.value;
  }

  tail() {
    return this.#tail?.value;
  }

  at(index) {
    if (index <= -1) return;
    let currentNode = this.#head;
    for (let i = 0; i < index; i++) {
      currentNode = currentNode?.nextNode;
    }
    if (!currentNode) return;
    return currentNode.value;
  }

  pop() {
    if (this.#head) {
      const oldHead = this.#head;
      this.#head = oldHead.nextNode;
      this.#size--;
      return oldHead.value;
    }
  }

  contains(cb) {
    let currentNode = this.#head;
    let result = false;
    while (currentNode) {
      if (cb(currentNode.value)) {
        result = true;
        break;
      }
      currentNode = currentNode.nextNode;
    }
    return result;
  }

  findIndex(cb) {
    let currentNode = this.#head;
    let count = 0;
    while (currentNode) {
      if (cb(currentNode.value)) return count;
      currentNode = currentNode.nextNode;
      count++;
    }
    return -1;
  }

  toString() {
    let currentNode = this.#head;
    let str = "";
    while (currentNode) {
      str += `(${currentNode.value}) –> `;

      if (!currentNode.nextNode) {
        str += "null";
        break;
      }
      currentNode = currentNode.nextNode;
    }
    return str;
  }

  insertAt(index, ...values) {
    if (index < 0 || index > this.#size)
      throw RangeError("index is out of range");

    if (index === 0) {
      values.reverse().forEach((value) => {
        this.prepend(value);
      });
      return;
    }

    if (index === this.#size - 1) {
      values.forEach((value) => {
        this.append(value);
      });
      return;
    }

    let currentNode = this.#head;
    for (let i = 0; i < index - 1; i++) {
      currentNode = currentNode.nextNode;
    }

    values.forEach((value) => {
      currentNode.nextNode = new Node(value, currentNode.nextNode);
      currentNode = currentNode.nextNode;
    });
    this.#size += values.length;
  }

  removeAt(index) {
    if (index < 0 || index >= this.#size)
      throw new RangeError("index is out of range");
    if (index === 0) {
      this.pop();
      if (this.#size === 0) {
        this.#tail = null;
      }
      return;
    }

    let currentNode = this.#head;
    for (let i = 0; i < index - 1; i++) {
      currentNode = currentNode.nextNode;
    }

    // If there is a node after the node i want to remove
    if (currentNode.nextNode.nextNode) {
      currentNode.nextNode = currentNode.nextNode.nextNode; // Make that node the nextNode for the node before the one i want to remove
    } else {
      currentNode.nextNode = null;
    }

    if (index === this.#size - 1) {
      this.#tail = currentNode;
    }
    this.#size--;
  }
}
