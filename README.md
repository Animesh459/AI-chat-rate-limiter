# 🚀 AI Chat Rate Limiter

[![Node.js](https://img.shields.io/badge/Node.js-24.x-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-Framework-lightgrey?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red)](#)

A robust and scalable **rate-limiting solution** for AI chatbots.  
It enforces **different request limits based on user tiers**, ensuring fair access while controlling **usage costs**.

---

## ✨ Features
- ⏳ **Fixed Window Rate Limiting** (1-hour reset time per tier)
- 🧑‍🤝‍🧑 **Tier-Based Limits**  
  - Guest: 3 requests/hour  
  - Free: 10 requests/hour  
  - Premium: 50 requests/hour
- 💰 **Cost Management**: Limits enforced *before* costly AI calls
- 🔑 **Flexible User Identification**: Unique ID (logged-in) or IP (guests)
- 📡 **Clear API**: Login, Chat, Status endpoints
- 📦 **Scalable Architecture**: Middleware, routes, and modular design
- ⚠️ **Error Handling**: Clear error responses when limits exceeded

---

## 📘 API Endpoints

### 🔐 1. POST `/api/login`
Simulates login and returns a **token**.

**Request:**
```json
{ "username": "guestuser" }
```
```json
{ "username": "premiumuser" }
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJpZCI6ImZyZWV1c2VyIiwidHlwZSI6ImZyZWUifQ==",
  "userType": "premium"
}
```

---

### 💬 2. POST `/api/chat`
Send a message to the AI. Rate-limited.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Request:**
```json

from vercel AI SDK OR

{ "message": "What is the capital of France?" }
```

**Response (Success):**
```json
{ "success": true, "message": "AI response here...", "remaining_requests": 7, "reset_in_seconds": "MS" }
```

**Response (Limit Exceeded):**
```json
{ "success": false, "error": "Too many requests. Free users can make 10 requests per hour.", "remaining_requests": 0, "reset_in_seconds": "MS" }
```

---

### 📊 3. GET `/api/status`
Check user’s tier and remaining requests.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response:**
```json
{ "success": true, "userType": "free", "total_requests_per_hour": 10, "remaining_requests": 9 }
```

---

## 📂 Project Structure
```
/ai-chat-rate-limiter
|-- /middleware
|   |-- rateLimiter.js
|-- /routes
|   |-- auth.js
|   |-- chat.js
|-- server.js
|-- package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js **v16.x+**

### Installation
```bash
git clone https://github.com/Animesh459/AI-chat-rate-limiter
cd ai-chat-rate-limiter
npm install express

# For Gemini
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key

# OR for OpenAI
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-your_model

``` 

### Running
```bash
node server.js
```
Server: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing the API

Testing the API
You can use a tool like Postman or Insomnia to test the endpoints.

Testing a Free User:

Get a Token: Send a POST request to http://localhost:3000/api/login with {"username": "freeuser"} in the body.

Make a Chat Request: Use the token from the previous step in the Authorization header (Bearer <your_token>) of a POST request to http://localhost:3000/api/chat.

Check Status: Use the same token in the Authorization header of a GET request to http://localhost:3000/api/status. The remaining requests will decrease with each chat request you make.


