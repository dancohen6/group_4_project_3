import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretRight } from '@fortawesome/free-solid-svg-icons'; 
import { Link } from 'react-router-dom';

import { useState } from 'react';
import axios from 'axios';

function Dashboard(props) {
  const [formData, setFormData] = useState({
    text: ''
  });

  const handleInputChange = e => {
    setFormData({
      ...formData,
      text: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const res = await axios.post('/api/note', formData);

    props.setState(oldState => ({
      ...oldState,
      user: res.data.user
    }));

    setFormData({
      text: ''
    });
  }

  const deleteTask = (noteId) => {
    
    const updatedNotes = props.state.user.notes.filter(note => note._id !== noteId);
    console.log(updatedNotes);

    axios.delete(`/api/note/${noteId}`)
      .then(() => {
        props.setState(oldState => ({
          ...oldState,
          user: {
            ...oldState.user,
            notes: updatedNotes
          }
        }));
      })
      .catch(error => {
        console.error("Error deleting note:", error);
      });
  };
  


  return (
    <main className="dashboard">
      <div className='link-container'>
        <Link to="/payment">
          <button className='button-leve2'>level 2</button>
        </Link>
      </div>
      <h1 className="text-center">Welcome, {props.state.user.username}!</h1>
      <h2 className="text-center">Share your tips to beat Candy Crush</h2>
      <div className="notes">
        {!props.state.user.notes.length && <p>No notes have been added.</p>}

        {props.state.user.notes.map(note => (
          <div key={note._id} className="note column">
            <h3>{note.text}</h3>
            <div className="column">
              <p>Added On: {note.createdAt}</p>
              <button onClick={() => deleteTask(note._id)}>delete</button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="column dashboard-form">
        <input value={formData.text} onChange={handleInputChange} type="text" placeholder="Message" />
        <button >
        <FontAwesomeIcon icon={faSquareCaretRight} />
          </button>
      </form>
    </main>
  )
}

export default Dashboard;

