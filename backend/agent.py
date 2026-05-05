import os
import datetime
from typing import Annotated, List, Union, Optional
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langchain_groq import ChatGroq
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

# Define the system prompt for extraction
SYSTEM_PROMPT = """You are an AI Assistant for a Life Science CRM. 
Your goal is to help field representatives log interactions with Healthcare Professionals (HCPs).

When a user describes an interaction:
1. Extract key fields: hcp_name, interaction_type, date, time, attendees, topics_discussed, sentiment, outcomes, and follow_up_actions.
2. Use the `log_interaction` tool to save this structured data. Always try to fill as many fields as possible from the user's description.
3. If information is missing, you can ask the user for it, or leave it blank if it's not crucial.
4. Inform the user that the form has been updated.

If the user wants to change something, use the `edit_interaction` tool.

Available Tools:
- search_hcp: Find HCPs by name or specialty.
- get_materials: List available samples/materials.
- suggest_followups: Get AI suggestions for next steps.
- log_interaction: Save/Update the interaction record.
- edit_interaction: Modify a specific field.
"""

# Define the state of the agent
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], lambda x, y: x + y]
    form_data: dict

# Define Tools
@tool
def log_interaction(hcp_name: Optional[str] = None, 
                    interaction_type: str = "Meeting", 
                    date: Optional[str] = None, 
                    time: Optional[str] = None, 
                    attendees: Optional[str] = None, 
                    topics_discussed: Optional[str] = None, 
                    sentiment: str = "Neutral", 
                    outcomes: Optional[str] = None, 
                    follow_up_actions: Optional[str] = None):
    """
    Captures and logs an interaction with an HCP. Use this to update the form fields.
    Fields: hcp_name, interaction_type (Meeting, Call, Email, Virtual Lunch), date (YYYY-MM-DD), 
    time (HH:MM), attendees, topics_discussed, sentiment (Positive, Neutral, Negative), 
    outcomes, follow_up_actions.
    """
    data = {
        "hcp_name": hcp_name,
        "interaction_type": interaction_type,
        "date": date or datetime.date.today().isoformat(),
        "time": time or datetime.datetime.now().strftime("%H:%M"),
        "attendees": attendees,
        "topics_discussed": topics_discussed,
        "sentiment": sentiment,
        "outcomes": outcomes,
        "follow_up_actions": follow_up_actions
    }
    return data

@tool
def edit_interaction(field_name: str, new_value: str):
    """
    Updates a specific field in the interaction log. 
    Field names: hcp_name, interaction_type, date, time, attendees, topics_discussed, sentiment, outcomes, follow_up_actions.
    """
    return {field_name: new_value}

@tool
def search_hcp(query: str):
    """
    Searches for Healthcare Professionals by name or specialty.
    """
    # Mock data for demonstration
    hcps = [
        {"id": 1, "name": "Dr. Smith", "specialty": "Oncology", "hospital": "City Hospital"},
        {"id": 2, "name": "Dr. Jane Doe", "specialty": "Cardiology", "hospital": "Heart Center"},
        {"id": 3, "name": "Dr. Sharma", "specialty": "Neurology", "hospital": "Neurolab"}
    ]
    results = [h for h in hcps if query.lower() in h["name"].lower() or query.lower() in h["specialty"].lower()]
    return results if results else "No HCPs found matching your query."

@tool
def get_materials():
    """
    Retrieves a list of available samples and promotional materials for field reps.
    """
    return {
        "Materials": ["OncoBoost Brochure", "Product X Visual Aid", "Safety Data Sheet"],
        "Samples": ["HeartCare Sample Pack", "OncoBoost 5mg Vials"]
    }

@tool
def suggest_followups(topics: str):
    """
    Generates AI-driven follow-up suggestions based on the topics discussed.
    """
    return [
        f"Schedule follow-up meeting in 2 weeks to discuss further details on {topics}",
        "Email the clinical trial summary for Product X",
        "Invite to the upcoming webinar on Life Science Innovations",
        "Add to the monthly newsletter mailing list"
    ]

tools = [log_interaction, edit_interaction, search_hcp, get_materials, suggest_followups]
tool_node = ToolNode(tools)

# Initialize the LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0
)

# Bind tools to the LLM
llm_with_tools = llm.bind_tools(tools)

# Define the node that calls the model
def call_model(state: AgentState):
    messages = state["messages"]
    # Check if system message is present, if not add it
    if not any(isinstance(m, HumanMessage) and m.content == SYSTEM_PROMPT for m in messages):
        # We use a system message if the LLM supports it, or just prepend to history
        # For ChatGroq, SystemMessage is preferred
        from langchain_core.messages import SystemMessage
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
    
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

# Define a node to update the form data state from tool outputs
def process_tool_output(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    
    # We only care about ToolMessages that come from log_interaction or edit_interaction
    if isinstance(last_message, ToolMessage):
        # Find the tool call that generated this message
        # We need to find the AIMessage before this ToolMessage
        for i in range(len(messages) - 2, -1, -1):
            if isinstance(messages[i], AIMessage) and messages[i].tool_calls:
                for tc in messages[i].tool_calls:
                    if tc["id"] == last_message.tool_call_id:
                        if tc["name"] in ["log_interaction", "edit_interaction"]:
                            try:
                                import json
                                # ToolMessage content is a string. If it's a dict, update form_data.
                                content = last_message.content.replace("'", "\"")
                                data = json.loads(content)
                                if isinstance(data, dict):
                                    new_form_data = {**state.get("form_data", {}), **data}
                                    return {"form_data": new_form_data}
                            except Exception as e:
                                print(f"Error parsing tool output: {e}")
                        break
    return {}

# Define the logic to determine whether to continue or stop
def should_continue(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return END

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)
workflow.add_node("update_state", process_tool_output)

workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue, {
    "tools": "tools",
    END: END
})
workflow.add_edge("tools", "update_state")
workflow.add_edge("update_state", "agent")

# Compile the graph
agent = workflow.compile()
