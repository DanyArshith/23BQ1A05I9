const { Log } = require("../../logging_middleware");
const { BASE_URL } = require("../config");
const { getAccessToken } = require("../services/authService");

async function log(level, packageName, message, token) {
  try {
    await Log("backend", level, packageName, message, { baseUrl: BASE_URL, token, getAccessToken });
  } catch {}
}

module.exports = { log };
