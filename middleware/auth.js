const express = require("express");
const jwt = require("jsonwebtoken");
const language = require("../public/language/languages.json");

const auth = async (req, res, next) => {
  console.log("Auth middleware hit");
  try {
    const token = req.cookies.jwt;
    console.log("JWT token from cookie:", token);

    if (!token) {
      console.log("No JWT token found");
      req.flash("errors", "You Are Not Authorized, Please Login First ...");
      return res.redirect("/");
    }

    const decode = await jwt.verify(token, process.env.TOKEN_KEY);
    console.log("Decoded JWT token:", decode);
    req.user = decode;

    const lang = req.cookies.lang;
    console.log("Language cookie:", lang);

    const decode_lang = await jwt.verify(lang, process.env.TOKEN);
    console.log("Decoded language token:", decode_lang);
    req.lang = decode_lang;

    let languageData;
    switch (decode_lang.lang) {
      case "en":
        languageData = language.en;
        break;
      case "de":
        languageData = language.de;
        break;
      case "es":
        languageData = language.es;
        break;
      case "fr":
        languageData = language.fr;
        break;
      case "pt":
        languageData = language.pt;
        break;
      case "cn":
        languageData = language.cn;
        break;
      case "ae":
        languageData = language.ae;
        break;
      case "in":
        languageData = language.in;
        break;
      default:
        console.log("Unknown language:", decode_lang.lang);
        languageData = language.en; // Default to English
    }

    req.language_data = languageData;
    console.log("Language set to:", decode_lang.lang);

    console.log("Auth successful, proceeding to next middleware/route");
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    req.flash("errors", "You Are Not Authorized, Please Login First ...");
    return res.redirect("/");
  }
};

module.exports = auth;
