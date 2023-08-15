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
      <h1 className="text-center">Candy Crush!</h1>

    </main>
  )
}

export default Landing;
