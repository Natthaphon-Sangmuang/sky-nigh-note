import { useEffect } from "react";
import { useNotesContext } from "../hooks/useNotesContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import NoteDetails from "../components/NoteDetails";
import NoteForm from "../components/NoteForm";
const Home = () => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  const { notes, dispatch } = useNotesContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch("/api/notes", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_NOTES", payload: json });
      }
    };

    if (user) {
      fetchNotes();
    }
  }, [dispatch, user]);

  if (notes) {
    const low_notes = notes.filter((e) => e.priority === "1");
    const medium_notes = notes.filter((e) => e.priority === "2");
    const hight_notes = notes.filter((e) => e.priority === "3");

    return (
      <div className="home">
        <div className="high_priority">
          <div className="high_priority_label">High Priority</div>
          <div className="notes">
            {notes &&
              hight_notes.map((note) => (
                <NoteDetails key={note._id} note={note} />
              ))}
          </div>
        </div>
        <div className="medium_priority">
          <div className="high_priority_label">Medium Priority</div>
          <div className="notes">
            {notes &&
              medium_notes.map((note) => (
                <NoteDetails key={note._id} note={note} />
              ))}
          </div>
        </div>
        <div className="low_priority">
          <div className="high_priority_label">Low Priority</div>
          <div className="notes">
            {notes &&
              low_notes.map((note) => (
                <NoteDetails key={note._id} note={note} />
              ))}
          </div>
        </div>
        <NoteForm className="form" />
        <div className="today">{today.toDateString()}</div>
      </div>
    );
  }
};

export default Home;
