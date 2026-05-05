# AI-First CRM HCP Module

An intelligent, premium Customer Relationship Management (CRM) tool specifically designed for Healthcare Professionals (HCP). This module features a dual-interface approach: a structured form for precision and an AI-powered conversational assistant for speed and flexibility.

## ✨ Key Features

- **AI-First Extraction**: Naturally describe an interaction (e.g., "Met Dr. Smith for lunch today") and watch the AI automatically populate the structured form.
- **LangGraph Integration**: Uses a state-of-the-art agentic workflow to manage complex multi-turn interactions and tool calls.
- **Premium Design System**: A high-end UI built with glassmorphism, the **Outfit** font family, and smooth animations.
- **Session-Based Context**: The AI assistant remembers previous conversation context for a truly conversational experience.
- **MySQL Persistence**: Full integration with MySQL for robust data management.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, Framer Motion, Lucide React.
- **Backend**: FastAPI, SQLAlchemy, MySQL.
- **AI Agent**: LangGraph, Groq (**Llama 3.3 70B Versatile**).
- **Styling**: Vanilla CSS (Premium Modern Design).

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- MySQL Server running locally
- A Groq API Key (get one at [console.groq.com](https://console.groq.com/))

### 1. Backend Setup (FastAPI)

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure your `.env` file:
    ```env
    DATABASE_URL=mysql+pymysql://root:@localhost:3306/crm_hcp
    GROQ_API_KEY=your_api_key_here
    ```
    *Note: Ensure you have created a database named `crm_hcp` in your MySQL instance.*
4.  Start the FastAPI server:
    ```bash
    python -m uvicorn main:app --reload
    ```

### 2. Frontend Setup (React)

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🤖 AI Agent & Tools

The agent is powered by **LangGraph** and utilizes the following specialized tools:

1.  **`log_interaction`**: Extracts fields from unstructured text (HCP Name, Topics, Sentiment, etc.).
2.  **`edit_interaction`**: Allows users to modify specific fields using natural language.
3.  **`search_hcp`**: Look up Healthcare Professionals in the system database.
4.  **`get_materials`**: Retrieve a list of available samples and promotional materials.
5.  **`suggest_followups`**: Generates AI-driven next steps based on the discussion context.

---

## 📁 Project Structure

```text
Assisment/
├── backend/
│   ├── main.py          # FastAPI entry point & API endpoints
│   ├── agent.py         # LangGraph logic, Agent definition & Tools
│   ├── models.py        # SQLAlchemy Database models (MySQL)
│   ├── schemas.py       # Pydantic data validation schemas
│   ├── database.py      # Database engine & Session configuration
│   └── .env             # Environment variables (API Keys, DB URL)
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (InteractionForm, AIAssistant)
│   │   ├── redux/       # Redux store & Interaction slices
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
