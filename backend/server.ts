import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import OpenAI from "openai";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running!"
  });
});


app.post("/api/ai-assessment", async (req, res) => {
  try {
    const {
      senderPublicName,
      receiverPublicName,
      amountUsd
    } = req.body;

    if (!senderPublicName || !receiverPublicName || !amountUsd) {
      return res.status(400).json({
        success: false,
        error: "Missing transaction information."
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5",
      instructions:
        "You are an AI assistant inside a university financial technology demonstration app. " +
        "Analyse the transaction information and provide a short, simple explanation. " +
        "Do not claim that a transaction is definitely fraudulent. " +
        "This is an educational demonstration, not financial advice.",

      input:
        `Analyse this proposed payment:\n` +
        `Sender: ${senderPublicName}\n` +
        `Receiver: ${receiverPublicName}\n` +
        `Amount: USD ${amountUsd}\n\n` +
        `Give:\n` +
        `1. A short transaction summary.\n` +
        `2. Any simple risk considerations.\n` +
        `3. One security recommendation.`
    });

    res.json({
      success: true,
      assessment: response.output_text
    });

  } catch (error) {
    console.error("OpenAI error:", error);

    res.status(500).json({
      success: false,
      error: "AI assessment failed."
    });
  }
});


app.post("/api/payment", async (req, res) => {
  try {
    const {
      amount,
      recipient
    } = req.body;

    console.log("Payment request received:");
    console.log("Amount:", amount);
    console.log("Recipient:", recipient);

    res.json({
      success: true,
      message: "Payment request received",
      amount: amount,
      recipient: recipient
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Payment failed"
    });
  }
});


app.listen(PORT, () => {
  console.log("");
  console.log("=====================================");
  console.log(" Seamless Commerce P2P Backend");
  console.log(` http://localhost:${PORT}`);
  console.log("=====================================");
});