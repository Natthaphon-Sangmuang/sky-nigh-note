import { useState } from "react";
import { useNotesContext } from "../hooks/useNotesContext";
import { useAuthContext } from "../hooks/useAuthContext";

const NoteForm = () => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [due_date, setDue_date] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const note = {
      title,
      due_date,
      content,
      priority,
    };

    const response = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify(note),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setDue_date("");
      setContent("");
      setError(null);
      setEmptyFields([]);
      dispatch({ type: "CREATE_NOTE", payload: json });
    }
  };

  return (
    <div className="form-warp ani-form">
      <div className="material-symbols-outlined add">Add</div>
      <form className="create" onSubmit={handleSubmit}>
        <h3 className="form-head-text">Add a New Note</h3>
        <label>Title :</label>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className={emptyFields.includes("title") ? "error" : ""}
        />
        <label>Due date :</label>
        <input
          type="date"
          onChange={(e) => setDue_date(e.target.value)}
          value={due_date}
          className={emptyFields.includes("due_date") ? "error" : ""}
        />
        <label>Content :</label>
        <textarea
          id="form-content-box"
          type="text"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          className={emptyFields.includes("content") ? "error" : ""}
        />
        <div className="radio-box">
          <label className="material-symbols-outlined high">star</label>
          <label className="material-symbols-outlined medium">star</label>
          <label className="material-symbols-outlined low">star</label>
          <input
            id="high"
            className="radio"
            name="pri"
            type="radio"
            onChange={(e) => setPriority(3)}
            value="high"
          />

          <input
            id="medium"
            className="radio"
            name="pri"
            type="radio"
            onChange={(e) => setPriority(2)}
            value="medium"
          />

          <input
            id="low"
            className="radio"
            name="pri"
            type="radio"
            onChange={(e) => setPriority(1)}
            value="low"
          />
        </div>
        <button className="form-add-button">Add Note</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default NoteForm;
