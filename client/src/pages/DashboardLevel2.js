
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';
import HighScore from '../components/HighScore';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useEffect } from 'react';
import GameLevel2 from './GameLevel2';
import { useLocation } from 'react-router-dom';

function Dashboard(props) {
  const currentLocation = useLocation();
  const logout = async e => {
    e.preventDefault();

    await axios.get('/api/logout');

    props.setState((oldState) => {
      return {
        ...oldState,
        user: null
      }
    })
  }
  
  
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
   const updateScore = (newScore) => {
    setUserScore(newScore);
  };

  useEffect(() => {
    // Define butInstall inside this useEffect to ensure DOM is ready
    const butInstall = document.getElementById('buttonInstall');

    // Logic for installing the PWA
    window.addEventListener('beforeinstallprompt', (event) => {
        console.log('beforeinstallprompt event triggered');
        // Store the event to be used later for prompting the installation
        window.deferredPrompt = event;
        // Show the "Install" button by removing the 'hidden' class
        butInstall.classList.toggle('hidden', false);
    });

    butInstall.addEventListener('click', async () => {
        console.log('Button clicked');

        // Retrieve the deferred prompt event from the window object
        const promptEvent = window.deferredPrompt;
        console.log(promptEvent);
        // If there's no prompt event, exit the function    
        if (!promptEvent) {
            return;
        }
        // Show the installation prompt
       
          promptEvent.prompt();

      
        const choiceResult = await promptEvent.userChoice;
        
        console.log('User choice:', choiceResult.outcome);

        // Set the deferred prompt to null since the installation prompt was shown   
        window.deferredPrompt = null;
        // Hide the "Install" button by adding the 'hidden' class
        butInstall.classList.toggle('hidden', true);
    });

    window.addEventListener('appinstalled', (event) => {
        // Clear the deferred prompt since the app is now installed
        window.deferredPrompt = null;
    });const installBtn = document.getElementById('installBtn');


  }, []); // Empty dependency array to ensure this effect runs only once


  return (
    <main className="dashboard">
      <div className="dashboard-content">
        <div className="game-container">
          <GameLevel2 user={props.user} updateScore={updateScore} />
        </div>

        <div className="form-container">
          <div className="button-container">
            <Link to="/dashboard">
              <button className='botton-leve2'>Level 1</button>
            </Link>
            <Link to="/">
              <button className='back-home'>Home</button>
            </Link>
            <Link onClick={logout} to="/logout">
              <button className="logout-button">Log Out</button>
            </Link>
            <button title='install' className="btn btn-sm btn-dark" id="buttonInstall">Install!</button>
          </div>

        <h1 className="text-center">Welcome, {props.state.user.username}!</h1>
        <h2 className="text-center">Share your tips to beat Sugarland Shuffle!</h2>
        <div className="notes pt">
        {!props.state.user.notes.length && <p>No notes have been added.</p>}

        {props.state.user.notes.map(note => (
          <div key={note._id} className="note column flex-container">
            <h3>{note.text}</h3>
            <div className="column flex-container">
              <p>Added By: {props.state.user.username}</p>
              <button className='delete-button' onClick={() => deleteTask(note._id)}>delete</button>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="column dashboard-form flex-container-row">
        <input value={formData.text} onChange={handleInputChange} type="text" placeholder="Message" />
        <button >
        <FontAwesomeIcon icon={faSquareCaretRight} />
          </button>
      </form>
        <HighScore score={userScore} />
      </div>
      </div>
    </main>
  )
}

export default Dashboard;

