require("dotenv").config();
const express = require("express");
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { default: mongoose } = require("mongoose");
const Routes=require("./Routes/router")
const app = express();
const PORT = 8000;

app.use(cors());

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

app.use(express.json());
app.use(Routes)
app.post("/getResponse", async (req, res) => {
  const { destination, date, length, group, budget, activity, promptG } = req.body;
//   console.log(promptG);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = promptG;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response; 
    const text = await response.text(); // Get the text response
    // const json = JSON.parse(text); // Parse the text into JSON object
    console.log(text);
    // res.json({ itinerary: json }); // Send the JSON object in the response
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  app.listen(PORT, () => console.log(`Server started on port ${PORT} and connected to database`));

}).catch((e)=>console.log(e))
