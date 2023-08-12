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


  return (
    <main className="dashboard">
      <h1 className="text-center">Welcome, {props.state.user.username}!</h1>

      <form onSubmit={handleSubmit} className="column dashboard-form">
        <h2 className="text-center">Create a Note</h2>
        <input value={formData.text} onChange={handleInputChange} type="text" placeholder="Enter your note text" />
        <button>Submit</button>
      </form>

      <h3>Here are your saved notes:</h3>

      <div className="notes">
        {!props.state.user.notes.length && <p>No notes have been added.</p>}

        {props.state.user.notes.map(note => (
          <div key={note._id} className="note column">
            <h3>{note.text}</h3>
            <div className="column">
              <p>Added On: {note.createdAt}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Dashboard;