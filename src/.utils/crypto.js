import { enc } from "crypto-js";
import AES from "crypto-js/aes";
import { getRandomInt, getRandomString } from "./random";

export function encrypt(source, delim = "Llp1") {
  const salt = getRandomString(getRandomInt(5, 20), delim);
  return salt + delim + AES.encrypt(source, salt).toString();
}

export function descrypt(encrypted, delim = "Llp1") {
  const idx = encrypted.indexOf(delim);
  const salt = encrypted.substr(0, idx);
  return AES.decrypt(encrypted.substr(idx + delim.length), salt).toString(enc.Utf8);
}
