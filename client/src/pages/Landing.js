import { useEffect, useState } from 'react';
import axios from 'axios';

function Landing(props) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get('/api/notes')
      .then(res => {
        setNotes([...res.data.notes]);
      });
  }, []);

  return (
    <main className="landing">
      <h1 className="text-center">Welcome to the future in note taking!</h1>

      <h3>See what notes others are taking:</h3>

      <div className="notes">
        {!notes.length && <p>No notes have been added.</p>}

        {notes.map(note => (
          <div key={note._id} className="note column">
            <h3>{note.text}</h3>
            <div className="column">
              <p>Added On: {note.createdAt}</p>
              <p>Added By: {note.author.username}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Landing;