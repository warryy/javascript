function debounce(fn, delay = 500) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

const onInput = debounce((e) => {
  console.log(e);
});

document.getElementsByTagName("input")[0].oninput = onInput;
