Perfect — that folder structure tells me you have a **full-stack FastAPI + React project**, with all backend logic under `/supabase/functions` and the frontend in `/src`.
Here’s a clean, professional **README.md** template that fits your exact setup and tools (Gemini API, OpenRouter, Auth0).

---

## 🧠 **LITMIND – AI-Powered Book Translation Platform**

LITMIND is an AI-driven web app that lets users translate books into any language while preserving tone, style, and cultural nuance.
It uses **Google Gemini**, **OpenRouter**, and **Auth0** to deliver intelligent, personalized, and secure translations.

---

### 🏗️ **Project Structure**

```
LITMIND/
│
├── src/                         # React frontend
│   ├── assets/                  # Images and icons
│   ├── components/              # Reusable UI components
│   │   └── ui/                  # UI subcomponents
│   ├── hooks/                   # Custom React hooks
│   ├── integrations/            # Third-party SDK or API setups
│   ├── lib/                     # Helper modules
│   ├── pages/                   # App pages (Home, Reader, etc.)
│   ├── App.tsx                  # Root React component
│   ├── main.tsx                 # React entry point
│   ├── vite-env.d.ts            # TypeScript environment types
│   └── index.css / App.css      # Global styles
│
├── supabase/                    # FastAPI backend functions
│   ├── chat/                    # Chat & translation API endpoints
│   ├── generate-image-project/  # AI image generation (Gemini/OpenRouter)
│   ├── generate-video-image/    # AI video-to-text/image pipelines
│   ├── translate/               # Book translation logic
│   └── verify-token/            # Auth0 token verification
│
├── .env                         # Environment variables (API keys, secrets)
├── config.toml                  # Supabase function configuration
├── .gitignore
└── README.md
```

---

### ⚙️ **Environment Variables**

Create a `.env` file in the project root:

```bash
# Google Gemini API
GOOGLE_API_KEY=your_gemini_api_key

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key

# Auth0
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret

# (Optional) FastAPI settings
BACKEND_PORT=8000
FRONTEND_PORT=5173
```

Make sure to load this `.env` in every backend function using:

```python
from dotenv import load_dotenv
load_dotenv(dotenv_path=".env")
```

---

### 🚀 **Running the Project**

#### **1. Install Dependencies**

**Frontend**

```bash
cd src
npm install
```

**Backend**

```bash
cd supabase
pip install -r requirements.txt
```

---

#### **2. Run Backend (FastAPI)**

```bash
uvicorn supabase.main:app --reload
```

Your backend runs on **[http://localhost:8000](http://localhost:8000)**

---

#### **3. Run Frontend (Vite + React)**

```bash
npm run dev
```

Frontend runs on **[http://localhost:5173](http://localhost:5173)**

---

### 🤖 **APIs Used**

| API                    | Purpose                                      | Integration               |
| ---------------------- | -------------------------------------------- | ------------------------- |
| **Google Gemini**      | Core text generation & translation           | via `google.generativeai` |
| **OpenRouter**         | Alternative large models (Claude, GPT, etc.) | REST API                  |
| **Auth0**              | User authentication & authorization          | React + FastAPI           |
| **Supabase Functions** | FastAPI microservices                        | `/supabase/functions`     |

---

### 🧩 **Backend Notes**

* Every FastAPI function (in `/supabase/functions/`) can be deployed as a **Supabase Edge Function** or run locally.
* `.env` must exist in the same directory level as the function calling Gemini.
* Example Gemini setup:

  ```python
  import google.generativeai as genai
  import os
  from dotenv import load_dotenv

  load_dotenv()
  genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
  model = genai.GenerativeModel("gemini-1.5-flash")
  print(model.generate_content("Hello world!").text)
  ```

---

### 💡 **Features**

* Translate entire books using AI with tone & context preservation
* Multimodal translation (text, image, audio)
* Auth0-based secure login & user management
* Realtime chat for live translation feedback
* AI-generated visuals to accompany translated text

---

### 🧠 **Tech Stack**

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| **Frontend** | React + TypeScript + Vite              |
| **Backend**  | FastAPI                                |
| **Database** | Supabase                               |
| **AI APIs**  | Gemini + OpenRouter                    |
| **Auth**     | Auth0                                  |
| **Hosting**  | Vercel (frontend) + Supabase (backend) |

---

### 🧾 **Troubleshooting**

If you see

```
No API_KEY or ADC found
```

check these:

1. `.env` file is in project root (same level as `config.toml`)
2. The key name is `GOOGLE_API_KEY` (not `GEMINI_API_KEY`)
3. Your backend code runs in the same working directory as `.env`
4. You call `load_dotenv()` **before** `genai.configure()`
5. Test with:

   ```python
   import os
   from dotenv import load_dotenv
   load_dotenv()
   print("Key:", os.getenv("GOOGLE_API_KEY"))
   ```
