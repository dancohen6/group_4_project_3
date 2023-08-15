import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';
import HighScore from '../components/HighScore';
import { useEffect } from 'react';
import Game from './Game'

const Dashboard = (props) => {
  const [formData, setFormData] = useState({
    text: ''
  });

  const handleInputChange = e => {
    setFormData({
      ...formData,
      text: e.target.value
    });
  };

  const [userScore, setUserScore] = useState(0); // State to store user's score

  useEffect(() => {
    // Fetch the user's score from the backend
    axios.get(`/api/user/${props.state.user._id}`)
      .then(res => {
        setUserScore(res.data.score);
      })
      .catch(error => {
        console.error('Error fetching user score:', error);
      });
  }, [props.state.user._id]);

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

  const updateScore = (newScore) => {
    setUserScore(newScore);
  };

  return (
    <main className="dashboard">
      <div className="dashboard-content">
        <div className="game-container">
          <Game user={props.user} updateScore={updateScore} />
        </div>

        <div className="form-container">
          <h1 className="text-center">Welcome, {props.state.user.username}!</h1>
          <h2 className="text-center">Share your tips to beat Sugar Land Shuffle</h2>
          <div className="notes">
            {!props.state.user.notes.length && <p className="text-center">No notes have been added.</p>}

            {props.state.user.notes.map(note => (
              <div key={note._id} className="note column text-center">
                <h3>{note.text}</h3>
                <div className="column">
                  <p>Added By: {note.author}</p>
                  <button
                    onClick={() => deleteTask(note._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          </div>
          <form onSubmit={handleSubmit} className="column dashboard-form">
            <input value={formData.text} onChange={handleInputChange} type="text" placeholder="Message" />
            <button>
              <FontAwesomeIcon icon={faSquareCaretRight} />
            </button>
          </form>

          {/* Display the ScoreBoard component with the score */}
          <HighScore score={userScore} />
        </div>
      </div>
    </main>
  );
};


export default Dashboard;
