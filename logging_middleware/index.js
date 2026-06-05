const DEFAULT_BASE_URL = "http://4.224.186.213/evaluation-service";

function authHeader(token) {
  return token && token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;
}

async function toJson(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function Log(stack, level, packageName, message, options = {}) {
  const baseUrl = options.baseUrl || process.env.EVAL_BASE_URL || DEFAULT_BASE_URL;
  const token = options.token || (options.getAccessToken && await options.getAccessToken());
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = authHeader(token);
  }

  const response = await fetch(`${baseUrl}/logs`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      stack,
      level,
      package: packageName,
      message: String(message)
    })
  });

  const data = await toJson(response);

  if (!response.ok) {
    throw new Error(data.message || `log failed with status ${response.status}`);
  }

  return data;
}

module.exports = { Log };
