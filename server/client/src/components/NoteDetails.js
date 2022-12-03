import { useNotesContext } from "../hooks/useNotesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState } from "react";
// date fns
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const NoteDetails = ({ note }) => {
  const { dispatch } = useNotesContext();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch("/api/notes/" + note._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_NOTE", payload: json });
    }
  };

  const noteid = note._id;
  const [title, setTitle] = useState(note.title);
  const [due_date, setDue_date] = useState(note.due_date);
  const [content, setContent] = useState(note.content);
  const [emptyFields, setEmptyFields] = useState([]);
  const [share, setShare] = useState("");
  const [targetedit, setTargetedit] = useState("");
  const [targetshare, setTargetshare] = useState("");
  const [priority, setPriority] = useState(note.priority);
  const [userid, setUserid] = useState(note.user_id);
  const [color, setColor] = useState(note.color);
  const [text_color, setTextcolor] = useState(note.text_color);

  if (text_color === undefined) {
    setTextcolor("#cdced6");
  }
  if (color === undefined) {
    setColor("#3f4264");
  }
  const handleEdit = async () => {
    if (!user) {
      return;
    }

    const notebodyedit = {
      title,
      content,
      due_date,
      color,
      text_color,
      priority,
    };

    const response = await fetch("/api/notes/" + note._id, {
      method: "PATCH",
      body: JSON.stringify(notebodyedit),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setDue_date("");
      setContent("");
      setEmptyFields([]);
      dispatch({ type: "SET_NOTES", payload: json });
    }
  };

  const targeteditset = () => {
    setTargetedit(note._id);
    setTargetshare("");
  };

  const handleShare = async () => {
    if (!user) {
      return;
    }
    const notebodyshare = {
      noteid,
      title,
      due_date,
      content,
      user_id: userid + share,
      color: color,
    };
    const response = await fetch("/api/notes/" + note._id, {
      method: "PATCH",
      body: JSON.stringify(notebodyshare),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle("");
      setDue_date("");
      setContent("");
      setEmptyFields([]);
      setUserid("");
      dispatch({ type: "SET_NOTES", payload: json });
    }
  };

  const targetshareset = () => {
    setTargetshare(note._id);
    setTargetedit("");
  };

  if (note._id === targetedit) {
    return (
      <div className="note-details-wrap ani-edit">
        <div
          style={{
            backgroundColor: color,
            color: text_color,
          }}
          className="note-details"
        >
          <h4>{title}</h4>
          <p>
            <strong>Due date: </strong>
            {due_date}
          </p>
          <p>{content}</p>
          <p>
            created
            {" " +
              formatDistanceToNow(new Date(note.createdAt), {
                addSuffix: true,
              })}
          </p>
          <span
            className="material-symbols-outlined delete"
            onClick={handleDelete}
          >
            delete
          </span>

          <span
            className="material-symbols-outlined share"
            onClick={targetshareset}
          >
            share
          </span>

          <form className="f" onSubmit={handleEdit}>
            <label>Title:</label>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className={emptyFields.includes("title") ? "error" : ""}
            />
            <label>Due date:</label>
            <input
              type="date"
              onChange={(e) => setDue_date(e.target.value)}
              value={due_date}
              className={emptyFields.includes("due_date") ? "error" : ""}
            />
            <label>Content:</label>
            <textarea
              type="text"
              onChange={(e) => setContent(e.target.value)}
              value={content}
              id="edit-content"
              className={emptyFields.includes("content") ? "error" : ""}
            />
            <div className="color-form">
              <div className="card-color">
                <label>Card color</label>
                <input
                  className="input-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="text-color">
                <label>Text color</label>
                <input
                  className="input-text-color"
                  type="color"
                  value={text_color}
                  onChange={(e) => setTextcolor(e.target.value)}
                />
              </div>

              <div className="form-radio-box">
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
            </div>
            <button>Edit Note</button>
          </form>
        </div>
      </div>
    );
  }
  if (note._id === targetshare) {
    return (
      <div className="note-details-wrap ani-share">
        <div
          style={{
            backgroundColor: color,
            color: text_color,
          }}
          className="note-details"
        >
          <h4>{title}</h4>
          <p>
            <strong>Due date: </strong>
            {due_date}
          </p>
          <p>{content}</p>
          <p>
            created
            {" " +
              formatDistanceToNow(new Date(note.createdAt), {
                addSuffix: true,
              })}
          </p>
          <span
            className="material-symbols-outlined delete"
            onClick={handleDelete}
          >
            delete
          </span>

          <span
            className="material-symbols-outlined edit"
            onClick={targeteditset}
          >
            edit
          </span>

          <form className="f" onSubmit={handleShare}>
            <label>Share with :</label>
            <input
              type="text"
              onChange={(e) => setShare(e.target.value)}
              value={share}
              className={emptyFields.includes("share") ? "error" : ""}
            />

            <button>Share</button>
          </form>
        </div>
      </div>
    );
  }
  if (note._id !== targetedit && note._id !== targetshare) {
    return (
      <div className="note-details-wrap ani-appear">
        <div
          style={{
            backgroundColor: color,
            color: text_color,
          }}
          className="note-details"
        >
          <h4>{title}</h4>
          <p>
            <strong>Due date : </strong>
            {due_date}
          </p>
          <p>{content}</p>

          <p>
            created
            {" " +
              formatDistanceToNow(new Date(note.createdAt), {
                addSuffix: true,
              })}
          </p>
          <span
            className="material-symbols-outlined delete"
            onClick={handleDelete}
          >
            delete
          </span>

          <span
            className="material-symbols-outlined edit"
            onClick={targeteditset}
          >
            edit
          </span>

          <span
            className="material-symbols-outlined share"
            onClick={targetshareset}
          >
            share
          </span>
        </div>
      </div>
    );
  }
};
export default NoteDetails;
