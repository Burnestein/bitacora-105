/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors({ origin: true }));

// Proxy API requests to AWS
app.use("/api/*", async (req, res) => {
  const awsUrl = `http://18.119.213.232:3001${req.originalUrl.replace('/api', '')}`;
  try {
    const response = await fetch(awsUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(awsUrl).host,
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
    });
    const data = await response.json();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Error connecting to AWS API:", error);
    res.status(500).send({ error: "Error connecting to AWS API" });
  }
});

exports.proxyToAwsApi = functions.https.onRequest(app);
