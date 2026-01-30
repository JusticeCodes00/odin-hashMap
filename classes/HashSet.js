import HashMap from "./HashMap.js";

export default class HashSet extends HashMap {
  set(key) {
    const list = this._findBucketList(key);

    if (this._keyExists(list)) {
      this._getExistingNode(list)[key] = key;
      return;
    }

    if (this._checkAndGrow()) {
      this.set(key);
      return;
    }

    list.append({ [key]: key });
    this._incrementEntries();
  }

  get(key) {
    const list = this._findBucketList(key);
    let value = null;

    if (this._keyExists(list)) {
      value = this._getExistingNode(list)[key];
    }

    return value;
  }
}
