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
        if (index < 0 || index >= this.#size) return;

        let currentNode = this.#head;
        for (let i = 0; i < index; i++) {
            currentNode = currentNode?.nextNode;
        }
        if (!currentNode) return;
        return currentNode.value;
    }

    pop() {
        if (this.#head) {
            const prevHead = this.#head;
            this.#head = prevHead.nextNode;
            this.#size--;
            return prevHead.value;
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
        let pointer = 0;
        while (currentNode) {
            if (cb(currentNode.value)) return pointer;
            currentNode = currentNode.nextNode;
            pointer++;
        }
        return -1;
    }

    toString() {
        let currentNode = this.#head;
        let str = "";
        while (currentNode) {
            str += `(${currentNode.value}) -> `;

            if (!currentNode.nextNode) {
                str += "null";
                break;
            }
            currentNode = currentNode.nextNode;
        }
        return str;
    }

    forEach(cb) {
        let currentNode = this.#head;
        let index = 0;
        while (currentNode) {
            cb(currentNode.value, index);
            currentNode = currentNode.nextNode;
            index++;
        }
    }

    insertAt(index, ...values) {
        if (index < 0 || index > this.#size)
            throw new RangeError("Trying to access index out of bound");

        if (index === 0) {
            values.reverse().forEach(value => {
                this.prepend(value);
            });
            return;
        }

        if (index >= this.#size) {
            values.forEach(value => {
                this.append(value);
            });
            return;
        }

        let currentNode = this.#head;
        const nodeBeforeTargetIndex = index - 1;

        for (let i = 0; i < nodeBeforeTargetIndex; i++) {
            currentNode = currentNode.nextNode;
        }

        values.forEach(value => {
            currentNode.nextNode = new Node(value, currentNode.nextNode);
            currentNode = currentNode.nextNode;
        });

        this.#size += values.length;
    }

    removeAt(index) {
        if (index < 0 || index >= this.#size)
            throw new RangeError("Trying to access index out of bound");

        if (index === 0) {
            this.pop();
            if (this.#size === 0) this.#tail = null;
            return;
        }

        let currentNode = this.#head;
        const nodeBeforeTargetIndex = index - 1;

        for (let i = 0; i < nodeBeforeTargetIndex; i++) {
            currentNode = currentNode.nextNode;
        }
        const removed = currentNode.nextNode;
        currentNode.nextNode = removed.nextNode;
        removed.nextNode = null;

        const lastNodeIndex = this.#size - 1;

        if (index === lastNodeIndex) {
            this.#tail = currentNode;
        }
        this.#size--;
    }
}