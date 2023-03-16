Array.prototype.myforeach = function (cb, thisArg) {
  const that = thisArg || this;
  for (let i = 0; i < this.length; ++i) {
    cb.call(that, this[i], i, this);
  }
};

class Counter {
  constructor() {
    this.sum = 0;
    this.count = 0;
  }
  reset() {
    this.sum = 0;
    this.count = 0;
  }
  add(array) {
    // Only function expressions will have its own this binding
    array.forEach(function countEntry(entry) {
      this.sum += entry;
      ++this.count;
    }, this);
  }
  add2(array) {
    // Only function expressions will have its own this binding
    array.myforeach(function countEntry(entry) {
      this.sum += entry;
      ++this.count;
    }, this);
  }
}

const obj = new Counter();
obj.add([2, 5, 9]);
console.log(obj.count); // 3
console.log(obj.sum); // 16
obj.reset()
obj.add2([2, 5, 9]);
console.log(obj.count); // 3
console.log(obj.sum); // 16
