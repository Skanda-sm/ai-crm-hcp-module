from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time

class HCPBase(BaseModel):
    name: str
    specialty: Optional[str] = None
    organization: Optional[str] = None

class HCPCreate(HCPBase):
    pass

class HCP(HCPBase):
    id: int
    class Config:
        from_attributes = True

class InteractionBase(BaseModel):
    hcp_id: Optional[int] = None
    hcp_name: Optional[str] = None
    interaction_type: str
    date: date
    time: Optional[time] = None
    attendees: Optional[str] = None
    topics_discussed: Optional[str] = None
    sentiment: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: Optional[str] = None

class InteractionCreate(InteractionBase):
    pass

class Interaction(InteractionBase):
    id: int
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    current_form_data: Optional[dict] = None
