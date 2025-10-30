import React, { useState } from 'react';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function Calendar({ selectedDates, onSelect }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const days = getDaysInMonth(viewYear, viewMonth);

  function toggleDate(date) {
    onSelect(date);
  }

  // Weekday headers (Monday to Sunday)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Find the weekday of the first day of the month (0=Sunday, 1=Monday...)
  const firstDay = new Date(viewYear, viewMonth, 1);
  // Adjust so Monday is 0, Sunday is 6
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  // Create array for calendar cells (empty for offset, then days)
  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= days; i++) {
    calendarCells.push(new Date(viewYear, viewMonth, i));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" onClick={() => setViewMonth(viewMonth - 1)}>&lt;</button>
        <span>{viewYear} - {viewMonth + 1}</span>
        <button type="button" onClick={() => setViewMonth(viewMonth + 1)}>&gt;</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginTop: '8px' }}>
        {weekDays.map((wd) => (
          <div key={wd} style={{ fontWeight: 'bold', textAlign: 'center', padding: '4px 0' }}>{wd}</div>
        ))}
        {calendarCells.map((date, i) =>
          date ? (
            <button
              type="button"
              key={i}
              style={{
                padding: '6px',
                background: selectedDates.some(d => d.toDateString() === date.toDateString()) ? '#1976d2' : '#eee',
                color: selectedDates.some(d => d.toDateString() === date.toDateString()) ? '#fff' : '#333',
                border: selectedDates.some(d => d.toDateString() === date.toDateString()) ? '2px solid #1565c0' : 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedDates.some(d => d.toDateString() === date.toDateString()) ? 'bold' : 'normal',
              }}
              onClick={() => toggleDate(date)}
            >
              {date.getDate()}
            </button>
          ) : (
            <div key={i}></div>
          )
        )}
      </div>
    </div>
  );
}

export default function Popup() {
  const [isPortalTab, setIsPortalTab] = useState(true);
  const [selectedDates, setSelectedDates] = useState([]);
  const [time, setTime] = useState('8h');
  const [taskId, setTaskId] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  // Load note for current taskId
  React.useEffect(() => {
    if (taskId) {
      try {
        const notes = JSON.parse(localStorage.getItem('ttf_notes_by_task') || '{}');
        setNote(notes[taskId] || '');
      } catch {
        setNote('');
      }
    }
  }, [taskId]);

  // Try to get the task ID from the current tab's URL
  React.useEffect(() => {
    const regex = /portal\.yopeso\.com\/(?:project\/[^\/]+\/)?task\/(\d+)/;
    const portalHost = /portal\.yopeso\.com/;
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0] && tabs[0].url) {
          setIsPortalTab(portalHost.test(tabs[0].url));
          const match = tabs[0].url.match(regex);
          if (match) {
            setTaskId(match[1]);
          }
        } else {
          setIsPortalTab(false);
        }
      });
    } else if (window.location && window.location.href) {
      setIsPortalTab(portalHost.test(window.location.href));
      // Fallback for testing outside extension
      const match = window.location.href.match(regex);
      if (match) {
        setTaskId(match[1]);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      // Save note for this taskId
      try {
        const notes = JSON.parse(localStorage.getItem('ttf_notes_by_task') || '{}');
        notes[taskId] = note;
        localStorage.setItem('ttf_notes_by_task', JSON.stringify(notes));
      } catch {}
      let successCount = 0;
      let failCount = 0;
      for (const date of selectedDates) {
        const dateStr = date.toLocaleDateString('en-GB').replace(/\//g, '.');
        const url = `https://portal.yopeso.com/api/task/${taskId}/newtimetracking`;
        const body = JSON.stringify({ note, time, time_start: dateStr });
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'accept': 'application/json, text/plain, */*',
            'content-type': 'application/json',
          },
          credentials: 'include',
          body,
        });
        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      }
      setStatus(`Submitted: ${successCount} success, ${failCount} failed.`);
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <div style={{ width: 300, padding: 16, fontFamily: 'sans-serif' }}>
      <h2>Time Tracking Filler</h2>
      {!isPortalTab ? (
        <div style={{ color: '#d32f2f', fontWeight: 'bold', marginTop: 24 }}>
          Please navigate to{' '}
          <a
            href="https://portal.yopeso.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'underline' }}
          >
            portal.yopeso.com
          </a>{' '}to use this extension.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Task ID:<br />
            <input
              value={taskId}
              onChange={e => {
                const newTaskId = e.target.value;
                setTaskId(newTaskId);
                try {
                  const notes = JSON.parse(localStorage.getItem('ttf_notes_by_task') || '{}');
                  setNote(notes[newTaskId] || '');
                } catch {
                  setNote('');
                }
              }}
              required
              style={{ width: '100%' }}
            />
          </label>
          <br /><br />
          <label>Note:<br />
            <input value={note} onChange={e => setNote(e.target.value)} required style={{ width: '100%' }} />
          </label>
          <br /><br />
          <label>Time:<br />
            <input value={time} onChange={e => setTime(e.target.value)} required style={{ width: '100%' }} />
          </label>
          <br /><br />
          <label>Date(s):</label>
          <Calendar
            selectedDates={selectedDates}
            onSelect={date => {
              setSelectedDates(prev => {
                const exists = prev.some(d => d.toDateString() === date.toDateString());
                if (exists) {
                  return prev.filter(d => d.toDateString() !== date.toDateString());
                } else {
                  return [...prev, date];
                }
              });
            }}
          />
          <br />
          <button type="submit" style={{ width: '100%', padding: '8px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Submit</button>
        </form>
      )}
      <div style={{ marginTop: 12, color: '#d32f2f' }}>{status}</div>
    </div>
  );
}
