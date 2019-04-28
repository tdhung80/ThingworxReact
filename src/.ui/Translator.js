//
// TODO: load i18n resource, translator.service.js
//
const translator = scope => {
  let ctx = {};

  ctx.text = key => `?${key}?`; // scope
  ctx.format = (key, params) => {
    return new Function(`{${Object.keys(params).join(",")}}`, "return `" + ctx.text(key) + "`")(params);
  };

  // UI
  ctx.title = ctx.label = ctx.action = ctx.text;

  // Entity
  ctx.field = ctx.text;

  // Data
  ctx.data = ctx.text;

  return ctx;
};

// export default translator;
export default translator;
