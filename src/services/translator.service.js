const texts = {
  LOGIN_FAILED: "Your username or password is incorrect"
};

export default texts;

export function text(key) {
  return `?${key}?`;
}
