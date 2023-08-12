import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

// components
import Loading from './components/Loading';
import Header from './components/Header';
import Redirect from './components/Redirect';
import ScoreBoard from './components/ScoreBoard';

// pages
import AuthForm from './pages/AuthForm';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Game from './pages/Game';


function App() {
  const [state, setState] = useState({
    user: null,
    notes: [],
    loading: true
  });

  useEffect(() => {
    axios.get('/api/authenticated')
      .then(res => {
        setState({
          ...state,
          user: res.data.user,
          loading: false
        });
      });
  }, []);

  return (
    <>
      <Header state={state} setState={setState} />

      {state.loading && <Loading />}

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={(
          <Redirect user={state.user}>
            <AuthForm setState={setState} />
          </Redirect>
        )} />

        <Route path="/game" element={(
          <Redirect user={state.user}>
            <Game setState={setState} />
          </Redirect>
        )} />

        <Route path="/dashboard" element={(
          <Redirect user={state.user}>
            <Dashboard state={state} setState={setState} />
          </Redirect>
        )} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;


