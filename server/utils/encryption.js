const CryptoJS = require("crypto-js");

const SECRET_KEY = process.env.SECRET_KEY || "mindwell_secret";

exports.encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

exports.decrypt = (cipher) => {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};