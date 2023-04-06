function throttle(fn, interval = 500) {
  let start;
  return (...args) => {
    if (!start) {
      start = Date.now();
    }

    if (Date.now() - start < interval) {
      return;
    }

    start = Date.now();
    fn(...args);
  };
}

const onInput = throttle((e) => {
  console.log(e.target.value);
});

document.getElementsByTagName("input")[0].oninput = onInput;
