from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict
import uuid

import models, schemas, database, agent
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI-First CRM HCP Module")

# CORS setup
# CORSMisconfig fix: Restrict origins based on environment variable
origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
# Note: Ensure MySQL is running and the 'crm_hcp' database exists
try:
    models.Base.metadata.create_all(bind=database.engine)
except Exception as e:
    print(f"Database initialization error: {e}")

# In-memory session storage for chat history
# In production, use Redis or a database
chat_sessions: Dict[str, List] = {}

@app.post("/interactions/", response_model=schemas.Interaction)
def create_interaction(interaction: schemas.InteractionCreate, db: Session = Depends(database.get_db)):
    db_interaction = models.Interaction(**interaction.dict())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@app.get("/interactions/", response_model=List[schemas.Interaction])
def read_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    interactions = db.query(models.Interaction).offset(skip).limit(limit).all()
    return interactions

@app.post("/chat/")
async def chat_with_agent(request: schemas.ChatRequest):
    session_id = request.session_id or "default"
    
    if session_id not in chat_sessions:
        chat_sessions[session_id] = []
    
    # Add user message to history
    user_msg = HumanMessage(content=request.message)
    chat_sessions[session_id].append(user_msg)
    
    # Run the agent
    # We pass the full history and the current form data
    try:
        result = agent.agent.invoke({
            "messages": chat_sessions[session_id],
            "form_data": request.current_form_data or {}
        })
        
        # Update session history with the new messages (including tool calls/outputs)
        # We only want to keep a reasonable number of messages
        chat_sessions[session_id] = result["messages"][-10:] 
        
        # Extract the last AI response
        last_ai_message = next((m for m in reversed(result["messages"]) if isinstance(m, AIMessage)), None)
        response_text = last_ai_message.content if last_ai_message else "I'm sorry, I couldn't process that."
        
        return {
            "response": response_text,
            "updated_form_data": result.get("form_data", {}),
            "session_id": session_id
        }
    except Exception as e:
        # ErrorHandling fix: Log the error and return a structured response
        print(f"Agent error: {e}")
        raise HTTPException(
            status_code=500, 
            detail={
                "message": "An error occurred while processing your request with the AI agent.",
                "error_type": type(e).__name__
            }
        )

@app.get("/hcps/", response_model=List[schemas.HCP])
def get_hcps(db: Session = Depends(database.get_db)):
    return db.query(models.HCP).all()

@app.get("/")
def root():
    return {"message": "AI-First CRM HCP API is running with MySQL"}
