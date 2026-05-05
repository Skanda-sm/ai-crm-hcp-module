# AI-First CRM HCP Module

An intelligent, premium Customer Relationship Management (CRM) tool specifically designed for Healthcare Professionals (HCP). This module features a dual-interface approach: a structured form for precision and an AI-powered conversational assistant for speed and flexibility.

## ✨ Key Features

- **AI-First Extraction**: Naturally describe an interaction (e.g., "Met Dr. Smith for lunch today") and watch the AI automatically populate the structured form.
- **LangGraph Integration**: Uses a state-of-the-art agentic workflow to manage complex multi-turn interactions and tool calls.
- **Premium Design System**: A high-end UI built with glassmorphism, the **Outfit** font family, and smooth animations.
- **Session-Based Context**: The AI assistant remembers previous conversation context for a truly conversational experience.
- **SQLite Persistence**: Ships with SQLite out-of-the-box (zero config). Easily switchable to MySQL/PostgreSQL via `.env`.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, Framer Motion, Lucide React
- **Backend**: FastAPI, SQLAlchemy, SQLite (default) / MySQL (optional)
- **AI Agent**: LangGraph, Groq (**Llama 3.3 70B Versatile**)
- **Styling**: Vanilla CSS (Premium Modern Design)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- A Groq API Key — get one free at [console.groq.com](https://console.groq.com/)
- *(Optional)* MySQL Server — only needed if you want to use MySQL instead of SQLite

---

### 1. Backend Setup (FastAPI)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure the `.env` file (already present — just update your API key):
   ```env
   # Default: SQLite — no extra setup required
   DATABASE_URL=sqlite:///./crm_hcp.db

   # Your Groq API key
   GROQ_API_KEY=your_groq_api_key_here

   # Allowed frontend origins
   CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

   # LLM model to use via Groq
   LLM_MODEL=llama-3.3-70b-versatile
   ```

   > **Want MySQL instead?**  
   > Create a database named `crm_hcp`, then change `DATABASE_URL` to:  
   > `DATABASE_URL=mysql+pymysql://root:<password>@localhost:3306/crm_hcp`

4. Start the FastAPI server:
   ```bash
   python -m uvicorn main:app --reload
   ```
   The API will be live at **http://localhost:8000**

---

### 2. Frontend Setup (React)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will open at **http://localhost:5173**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/interactions/` | List all logged interactions |
| `POST` | `/interactions/` | Save a new interaction record |
| `GET` | `/hcps/` | List all Healthcare Professionals |
| `POST` | `/chat/` | Send a message to the AI agent |

Interactive API docs available at **http://localhost:8000/docs**

---

## 🤖 AI Agent & Tools

The agent is powered by **LangGraph** and uses the following specialized tools:

| Tool | Description |
|------|-------------|
| `log_interaction` | Extracts fields from natural language (HCP Name, Date, Time, Topics, Sentiment, etc.) |
| `edit_interaction` | Modifies a specific field via natural language command |
| `search_hcp` | Look up Healthcare Professionals by name or specialty |
| `get_materials` | Retrieve available samples and promotional materials |
| `suggest_followups` | Generate AI-driven next steps based on discussion topics |

---

## 📁 Project Structure

```text
Assisment/
├── backend/
│   ├── main.py          # FastAPI entry point & API endpoints
│   ├── agent.py         # LangGraph logic, Agent definition & Tools
│   ├── models.py        # SQLAlchemy ORM models
│   ├── schemas.py       # Pydantic validation schemas
│   ├── database.py      # DB engine & session (SQLite/MySQL auto-detect)
│   ├── crm_hcp.db       # SQLite database (auto-created on first run)
│   ├── requirements.txt # Python dependencies
│   └── .env             # Environment variables (API key, DB URL, etc.)
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (InteractionForm, AIAssistant)
│   │   ├── redux/       # Redux store & interaction slice
│   │   ├── App.jsx      # Root application component
│   │   └── index.css    # Premium Design System & Global Styles
│   └── package.json     # Frontend dependencies
└── README.md            # You are here
```

---

## 🎨 Design Philosophy

- **Human-Centric**: Designed for field representatives who need to log data quickly between meetings.
- **Reliability**: Dual-mode input ensures that even if AI extraction isn't perfect, the user has full control over the structured form.
- **Aesthetics**: Using modern web design trends like glassmorphism and subtle micro-animations to provide a premium enterprise experience.
