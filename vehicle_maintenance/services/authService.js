const { BASE_URL, credentials } = require("../config");
const { request } = require("../utils/httpClient");

function authHeader(token) {
  return token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
}

function requiredCredentials() {
  return Object.entries(credentials).filter(([, value]) => !value).map(([key]) => key);
}

async function getAccessToken() {
  const missing = requiredCredentials();

  if (missing.length) {
    throw new Error(`missing environment values: ${missing.join(", ")}`);
  }

  const data = await request(`${BASE_URL}/auth`, {
    method: "POST",
    body: credentials
  });

  const token = data.access_token;

  if (!token) {
    throw new Error("auth response did not include access_token");
  }

  return token;
}

module.exports = { getAccessToken, authHeader };
