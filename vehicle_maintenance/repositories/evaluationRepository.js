const { BASE_URL } = require("../config");
const { authHeader } = require("../services/authService");
const { request } = require("../utils/httpClient");

async function protectedGet(path, token) {
  return request(`${BASE_URL}${path}`, {
    headers: {
      Authorization: authHeader(token)
    }
  });
}

async function getDepots(token) {
  const data = await protectedGet("/depots", token);
  return data.depots || [];
}

async function getVehicles(token) {
  const data = await protectedGet("/vehicles", token);
  return data.vehicles || [];
}

module.exports = { getDepots, getVehicles };
