const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+~`{}[]:;|\\?/\"'<>,.*";
const n = charset.length;

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomString(length, excludeChars = "") {
  let result = "";
  for (let i = 0; i < length; i++) {
    let c = charset.charAt(Math.floor(Math.random() * n));
    if (!excludeChars || excludeChars.indexOf(c) === -1) {
      result += c;
    } else {
      i--;
    }
  }
  return result;
}
// console.log(makeid(5));
