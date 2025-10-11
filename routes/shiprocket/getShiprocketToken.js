// const fetch = require("node-fetch");

let tokenCache = null;
let tokenExpiry = null;

async function getShiprocketToken() {
  const now = Date.now();

  if (tokenCache && tokenExpiry && now < tokenExpiry) {
    return tokenCache;
  }

  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    }
  );

  const data = await res.json();

  if (!data.token) {
    throw new Error("Failed to fetch Shiprocket token");
  }

  tokenCache = data.token;
  tokenExpiry = now + 23 * 60 * 60 * 1000; // 23 hours

  return tokenCache;
}

module.exports = { getShiprocketToken };
