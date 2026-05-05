import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateField } from '../redux/interactionSlice';
import { Calendar, Clock, User, MessageSquare, Info, CheckCircle, Package, Smile, Mic } from 'lucide-react';

const InteractionForm = () => {
  const { formData } = useSelector((state) => state.interaction);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ field: name, value }));
  };

  return (
    <div className="card animate-fade-in">
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>Interaction Details</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label><User size={16} style={{ marginRight: '8px' }} /> HCP Name</label>
          <input 
            type="text" 
            name="hcp_name" 
            placeholder="Search or select HCP..."
            value={formData.hcp_name || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Interaction Type</label>
          <select name="interaction_type" value={formData.interaction_type} onChange={handleChange}>
            <option>Meeting</option>
            <option>Call</option>
            <option>Email</option>
            <option>Virtual Lunch</option>
          </select>
        </div>

        <div className="form-group">
          <label><Calendar size={16} style={{ marginRight: '8px' }} /> Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label><Clock size={16} style={{ marginRight: '8px' }} /> Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label>Attendees</label>
        <input 
          type="text" 
          name="attendees" 
          placeholder="Enter names or search..."
          value={formData.attendees || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group" style={{ position: 'relative' }}>
        <label><MessageSquare size={16} style={{ marginRight: '8px' }} /> Topics Discussed</label>
        <textarea 
          name="topics_discussed" 
          rows="4" 
          placeholder="Enter key discussion points..."
          value={formData.topics_discussed || ''}
          onChange={handleChange}
        ></textarea>
        <button className="btn-secondary" style={{ 
          marginTop: '0.75rem', 
          fontSize: '0.75rem', 
          padding: '0.5rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          width: 'fit-content'
        }}>
          <Mic size={14} /> Summarize from Voice Note (Requires Consent)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label><Package size={16} style={{ marginRight: '8px' }} /> Materials Shared</label>
          <input 
            type="text" 
            name="materials_shared" 
            placeholder="Search/Add Materials..."
            value={formData.materials_shared || ''}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label><Package size={16} style={{ marginRight: '8px' }} /> Samples Distributed</label>
          <input 
            type="text" 
            name="samples_distributed" 
            placeholder="Add Sample..."
            value={formData.samples_distributed || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label><Smile size={16} style={{ marginRight: '8px' }} /> Observed/Inferred HCP Sentiment</label>
        <div style={{ display: 'flex', gap: '2rem', padding: '0.5rem 0' }}>
          {['Positive', 'Neutral', 'Negative'].map((s) => (
            <label key={s} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textTransform: 'none', letterSpacing: 'normal' }}>
              <input 
                type="radio" 
                name="sentiment" 
                value={s} 
                checked={formData.sentiment === s}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', marginRight: '10px', accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '0.9375rem', color: formData.sentiment === s ? 'var(--primary)' : 'var(--text-main)' }}>{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label><CheckCircle size={16} style={{ marginRight: '8px' }} /> Outcomes</label>
        <textarea 
          name="outcomes" 
          rows="3" 
          placeholder="Key outcomes or agreements..."
          value={formData.outcomes || ''}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-group">
        <label><Info size={16} style={{ marginRight: '8px' }} /> Follow-up Actions</label>
        <textarea 
          name="follow_up_actions" 
          rows="2" 
          placeholder="Next steps or tasks..."
          value={formData.follow_up_actions || ''}
          onChange={handleChange}
        ></textarea>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button className="btn-primary" style={{ flex: 1, height: '3.5rem', fontSize: '1rem' }}>
          Log Interaction
        </button>
      </div>
    </div>
  );
};

export default InteractionForm;
