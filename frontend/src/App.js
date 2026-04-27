import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableSection } from './components/Editor/SortableSection';
import { savePortfolio } from './api';
import { downloadPortfolio } from './utils/downloadHandler';
import './styles/App.css';

function App() {
  const [portfolio, setPortfolio] = useState({
    username: '',
    title: 'My Professional Portfolio',
    theme: 'modern-dark',
    sections: [
      { id: '1', type: 'About', content: 'Describe yourself...', order: 1 },
      { id: '2', type: 'Skills', content: 'React, Node, MongoDB', order: 2 },
      { id: '3', type: 'Contact', content: 'email@domain.com', order: 3 }
    ]
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setPortfolio((prev) => {
        const oldIndex = prev.sections.findIndex(s => s.id === active.id);
        const newIndex = prev.sections.findIndex(s => s.id === over.id);
        return {
          ...prev,
          sections: arrayMove(prev.sections, oldIndex, newIndex)
        };
      });
    }
  };

  const updateSection = (id, newContent) => {
    setPortfolio({
      ...portfolio,
      sections: portfolio.sections.map(s => s.id === id ? { ...s, content: newContent } : s)
    });
  };

  const handleSave = async () => {
    if(!portfolio.username) return alert("Please enter a username first");
    try {
      await savePortfolio(portfolio);
      window.open(`http://localhost:8000/api/portfolios/${portfolio.username}`, '_blank');
    } catch (err) {
      alert('Error connecting to the server');
    }
  };

  return (
    <div className="app-container">
      <header>
        <span style={{fontWeight: 'bold', fontSize: '1.1rem', color: '#2563eb'}}>PortfolioBuilder Pro</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="save-btn" 
            style={{background: '#10b981', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'}} 
            onClick={() => downloadPortfolio(portfolio)}
          >
            Download HTML
          </button>
          <button className="save-btn" onClick={handleSave}>Publish Live</button>
        </div>
      </header>

      <div className="editor-grid">
        <aside className="sidebar">
          <h3>Site Identity</h3>
          <label>Public Username</label>
          <input 
            type="text" 
            placeholder="Type your name here" 
            onChange={(e) => setPortfolio({...portfolio, username: e.target.value})} 
          />
          
          <label>Website Title</label>
          <input 
            type="text" 
            value={portfolio.title} 
            onChange={(e) => setPortfolio({...portfolio, title: e.target.value})} 
          />

          <label>Visual Theme</label>
          <select value={portfolio.theme} onChange={(e) => setPortfolio({...portfolio, theme: e.target.value})}>
            <option value="modern-dark">Midnight Onyx</option>
            <option value="minimal-light">Minimalist White</option>
            <option value="royal-blue">Royal Aesthetic</option>
          </select>

          <hr />
          <h3>Content Sections (Drag ⠿ to Reorder)</h3>
          
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={portfolio.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {portfolio.sections.map((section) => (
                <SortableSection 
                  key={section.id} 
                  id={section.id} 
                  section={section} 
                  onUpdate={updateSection} 
                />
              ))}
            </SortableContext>
          </DndContext>
        </aside>

        <section className="preview-pane">
          <div className={`preview-window theme-${portfolio.theme}`}>
             <div style={{padding: '60px 40px'}}>
               <header style={{ textAlign: 'center', marginBottom: '60px', background: 'transparent', boxShadow: 'none' }}>
                 <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: '700' }}>{portfolio.title}</h1>
                 <p style={{ opacity: 0.6, marginTop: '10px' }}>Live Preview Mode</p>
               </header>
               
               {portfolio.sections.map(s => (
                 <div key={s.id} style={{marginBottom: '50px'}}>
                   <h2 style={{ 
                     fontSize: '1.1rem', 
                     borderLeft: '4px solid var(--primary)', 
                     paddingLeft: '15px', 
                     textTransform: 'uppercase', 
                     letterSpacing: '2px',
                     fontWeight: '700'
                   }}>
                     {s.type}
                   </h2>
                   <p style={{ lineHeight: '1.8', opacity: 0.9, marginTop: '15px', fontSize: '1.1rem' }}>{s.content}</p>
                 </div>
               ))}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;