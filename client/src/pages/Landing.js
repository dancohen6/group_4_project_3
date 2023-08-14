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
      <h1 className="text-center">Candy Crush!</h1>

      <Link to="/payment">
      <button className='botton-leve2'>level 2</button>
      </Link>

        
    </main>
  )
}

export default Landing;