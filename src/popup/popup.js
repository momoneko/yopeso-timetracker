import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function Calendar({ selectedDate, onSelect }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const days = getDaysInMonth(viewYear, viewMonth);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={() => setViewMonth(viewMonth - 1)}>&lt;</button>
        <span>
          {viewYear} - {viewMonth + 1}
        </span>
        <button onClick={() => setViewMonth(viewMonth + 1)}>&gt;</button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "2px",
        }}
      >
        {[...Array(days)].map((_, i) => {
          const date = new Date(viewYear, viewMonth, i + 1);
          return (
            <button
              key={i}
              style={{
                padding: "6px",
                background:
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString()
                    ? "#1976d2"
                    : "#eee",
                color:
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString()
                    ? "#fff"
                    : "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => onSelect(date)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Popup() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState("8h");
  const [note, setNote] = useState("");
  const [taskId, setTaskId] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      const dateStr = selectedDate
        .toLocaleDateString("en-GB")
        .replace(/\//g, ".");
      const url = `https://portal.yopeso.com/api/task/${taskId}/newtimetracking`;
      const body = JSON.stringify({ note, time, time_start: dateStr });
      // Use chrome.cookies API in background script for JWT/cookie
      const response = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
        credentials: "include",
        body,
      });
      if (response.ok) {
        setStatus("Success!");
      } else {
        setStatus("Failed: " + response.status);
      }
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div style={{ width: 300, padding: 16, fontFamily: "sans-serif" }}>
      <h2>Time Tracking Filler</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Task ID:
          <br />
          <input
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </label>
        <br />
        <br />
        <label>
          Note:
          <br />
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </label>
        <br />
        <br />
        <label>
          Time:
          <br />
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </label>
        <br />
        <br />
        <label>Date:</label>
        <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />
        <br />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
      <div style={{ marginTop: 12, color: "#d32f2f" }}>{status}</div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Popup />);
