const express = require("express");
const axios = require("axios");
const cors = require("cors");
const env = require("dotenv");
const app = express();
env.config();
app.use(
  cors({
    origin: "*",
  })
);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const TOKEN_URL = process.env.TOKEN_URL;
const SEARCH_URL = process.env.SEARCH_URL;

let tokenCache = {
  accessToken: "",
  expiresAt: 0,
};

async function getAccessToken() {
  const now = Date.now();
  if (tokenCache.accessToken && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }

  const res = await axios.post(
    TOKEN_URL,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  tokenCache.accessToken = res.data.access_token;
  tokenCache.expiresAt = now + res.data.expires_in * 1000;
  return tokenCache.accessToken;
}
app.get("/api/search", async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(SEARCH_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        query: req.query.q || "x-ray",
        pagenumber: req.query.page || 1,
        countperpage: req.query.limit || 18,
        format: "json",
        fields: "SystemIdentifier,Title,Path_TR7",
      },
    });

    const items = response.data.APIResponse.Items.map((item) => ({
      id: item.SystemIdentifier,
      name: item.Title,
      thumbnailUrl: item.Path_TR7?.URI || "",
    }));

    res.json({
      results: items,
      total: response.data.APIResponse.GlobalInfo.TotalCount,
    });
  } catch (err) {
    console.error("API error", err?.response?.data || err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

app.get("/api/image-details", async (req, res) => {
  const systemId = req.query.id;

  if (!systemId) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const token = await getAccessToken();

    const response = await axios.get(SEARCH_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        query: systemId,
        format: "json",
        fields:
          "SystemIdentifier,Title,Path_TR7,UsageNotes,Keywords,CreationDate,Dimensions",
        countperpage: 1,
      },
    });

    const item = response.data.APIResponse?.Items?.[0];
    if (!item) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imageDetails = {
      id: item.SystemIdentifier,
      name: item.Title,
      thumbnailUrl: item.Path_TR7?.URI || "",
      width: item.Path_TR7?.Width || null,
      height: item.Path_TR7?.Height || null,
    };

    res.json(imageDetails);
  } catch (err) {
    console.error("Image details error", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch image details" });
  }
});

app.listen(3000, () => {
  console.log(" API proxy running on http://localhost:3000");
});
