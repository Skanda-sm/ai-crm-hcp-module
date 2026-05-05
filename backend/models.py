from sqlalchemy import Column, Integer, String, Date, Time, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class HCP(Base):
    __tablename__ = "hcps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    specialty = Column(String(255))
    organization = Column(String(255))

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_id = Column(Integer, ForeignKey("hcps.id"), nullable=True)
    hcp_name = Column(String(255)) # For logging directly by name
    interaction_type = Column(String(50)) # Meeting, Call, Email, Virtual Lunch
    date = Column(Date, default=datetime.date.today)
    time = Column(Time)
    attendees = Column(Text)
    topics_discussed = Column(Text)
    sentiment = Column(String(20)) # Positive, Neutral, Negative
    materials_shared = Column(Text) # JSON or list
    samples_distributed = Column(Text) # JSON or list
    outcomes = Column(Text)
    follow_up_actions = Column(Text)
    
    hcp = relationship("HCP")

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    type = Column(String(50)) # Sample, Brochure, etc.
    stock_count = Column(Integer, default=0)
