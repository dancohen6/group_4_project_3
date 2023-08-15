import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
      <h1 className="text-center">Sugarland Shuffle!</h1>
      <Link to="/auth" className="landing-link">Login or Register</Link>

    </main>
  )
}

export default Landing;
