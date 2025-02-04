const express = require('express');
const mongoose = require('mongoose');       
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config(); 
const { MONGO_URI } = process.env;  
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true               
}));    
app.use(express.json());

  const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Contact = mongoose.model("Contact", contactSchema);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// POST route to handle form submission
app.post("/contact", ClerkExpressRequireAuth(), async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
  
      // Validate input fields
      if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      // Save to MongoDB
      const newContact = new Contact({ name, email, phone, message });
      await newContact.save();
  
      res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      console.error("Error saving contact form:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


app.listen(port, () => {
    console.log(`AA app listening on port ${port}`);
         
})