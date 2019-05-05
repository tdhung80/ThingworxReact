export * from "react-bootstrap";
//export * from "./FormView";
//export * from "./ListView";
export * from "./Buttons";
export * from "./Routes";
export * from "./Stepper";
//export * from "./Translator";

export const useDebounce = (fn, delay) => {
  let timer = null;
  return function(...args) {
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      console.debug("debounce-callback");
      fn.apply(context, args);
    }, delay);
  };
};
