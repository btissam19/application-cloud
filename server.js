const express = require('express');
const {GoogleGenerativeAI,HarmCategory,HarmBlockThreshold } = require("@google/generative-ai");
const app = express();
const dotenv = require('dotenv').config()
const port = process.env.PORT || 3000;;
app.use(express.json());
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.API_KEY;
async function runChat(userInput) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "Welcome to our healthcare chatbot! I'm here to assist you with any questions or concerns you may have regarding health and wellness. Whether you're seeking information about symptoms, medications, general health advice, or scheduling appointments with healthcare providers, I'm here to help. To personalize your experience, please feel free to provide some basic information such as your name, age, gender, and location. Rest assured that your privacy is important to us, and any information you share will be kept confidential. Please note that while I can offer guidance and support, I am not a substitute for professional medical care. In case of a medical emergency, please contact emergency services immediately. Let's get started on your journey to better health!"}],
        },
        {
          role: "model",
          parts: [{ text: "Thank you for the warm welcome and introduction! I'm happy to be interacting with this healthcare chatbot and exploring its capabilities. \n\nWhile I appreciate the offer to personalize my experience, as a large language model, I don't have personal information like name, age, gender, or location. However, I can still access and process information to answer your questions and provide helpful guidance on health and wellness topics. \n\nI understand the limitations of chatbots and will always recommend seeking professional medical care when necessary. \n\nI'm excited to see what questions and topics we can explore together!"}],
        },
        {
          role: "user",
          parts: [{ text: "What are the common symptoms of the flu?"}],
        },
        {
          role: "model",
          parts: [{ text: "The common symptoms of the flu typically include:\n\n**High fever:** This is often one of the first symptoms to appear and can reach temperatures of 100°F (37.8°C) or higher. \n\n**Chills and sweats:** You may experience alternating chills and sweats as your body temperature fluctuates.\n\n**Headache:** Headaches are a frequent symptom of the flu and can range from mild to severe.\n\n**Muscle aches and pains:** You may feel soreness and aching throughout your body, particularly in your back, arms, and legs.\n\n**Fatigue and weakness:** The flu can leave you feeling exhausted and weak, making even simple tasks difficult.\n\n**Cough:** A dry, hacking cough is a common symptom and can be persistent.\n\n**Sore throat:** Your throat may feel scratchy and painful, making it uncomfortable to swallow.\n\n**Runny or stuffy nose:** Nasal congestion and discharge are frequent symptoms.\n\n**Nausea, vomiting, and diarrhea:** While these symptoms are more common in children, adults can also experience them.\n\nIt's important to note that not everyone will experience all of these symptoms, and the severity can vary from person to person. Additionally, some individuals may experience complications such as pneumonia or bronchitis. If your symptoms are severe or you are concerned about your health, it's crucial to seek medical attention."}],
        },
        {
          role: "user",
          parts: [{ text: "What are the common symptoms of the flu?"}],
        },
        {
          role: "model",
          parts: [{ text: "The common symptoms of the flu typically include:\n\n* **Fever:** This is often one of the first symptoms to appear and can reach temperatures of 100°F (37.8°C) or higher. \n\n* **Chills and sweats:** You may experience alternating chills and sweats as your body temperature fluctuates.\n\n* **Headache:** Headaches are a frequent symptom of the flu and can range from mild to severe.\n\n* **Muscle aches and pains:** You may feel soreness and aching throughout your body, particularly in your back, arms, and legs.\n\n* **Fatigue and weakness:** The flu can leave you feeling exhausted and weak, making even simple tasks difficult.\n\n* **Cough:** A dry, hacking cough is a common symptom and can be persistent.\n\n* **Sore throat:** Your throat may feel scratchy and painful, making it uncomfortable to swallow.\n\n* **Runny or stuffy nose:** Nasal congestion and discharge are frequent symptoms.\n\n* **Nausea, vomiting, and diarrhea:** While these symptoms are more common in children, adults can also experience them.\n\nIt's important to note that not everyone will experience all of these symptoms, and the severity can vary from person to person. Additionally, some individuals may experience complications such as pneumonia or bronchitis. If your symptoms are severe or you are concerned about your health, it's crucial to seek medical attention."}],
        },
      ],
    });
  
const result = await chat.sendMessage(userInput);
const response = result.response;
return response.text();
  }
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
 app.get('/loader.gif', (req, res) => {
    res.sendFile(__dirname + '/loader.gif');
  });
app.post('/chat', async (req, res) => {
    try {
      const userInput = req.body?.userInput;
      console.log('incoming /chat req', userInput)
      if (!userInput) {
        return res.status(400).json({ error: 'Invalid request body' });
      }
  
      const response = await runChat(userInput);
      res.json({ response });
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  
