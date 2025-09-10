const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config(); // for .env variables

const app = express();
app.use(express.json());

// Serve static frontend files (index.html, css, js)
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", contactSchema);

// Nodemailer Transporter with Resend
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  auth: {
    user: "resend", // fixed username for Resend
    pass: process.env.RESEND_API_KEY // stored in .env
  }
});

// Route: Save + Send Email
app.post("/contact", async (req, res) => {
  try {
    // Save data in MongoDB
    const newContact = new Contact(req.body);
    await newContact.save();

    // Send mail via Resend
    const mailOptions = {
      from: "onboarding@resend.dev",   // Must be verified in Resend
      to: "ravirajskadam2004@gmail.com", // Your email
      subject: `📩 New Message: ${req.body.subject}`,
      text: `
        Name: ${req.body.name}
        Email: ${req.body.email}
        Subject: ${req.body.subject}
        Message: ${req.body.message}
      `
    };

    await transporter.sendMail(mailOptions);

    res.send("Message sent successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).send("Failed to send message.");
  }
});

// ✅ Fallback: works in Express 5
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

