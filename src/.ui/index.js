export * from "react-bootstrap";
export * from "./ErrorBoundary";
//export * from "./FormView";
//export * from "./ListView";
export * from "./Buttons";
export * from "./Routes";
//export * from "./Translator";

export const debounce = (fn, delay) => {
  let timer = null;
  return function(...args) {
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};
