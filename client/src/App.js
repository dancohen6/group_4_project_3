import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';


// components
import Loading from './components/Loading';
import Redirect from './components/Redirect';

// pages
import AuthForm from './pages/AuthForm';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Payment from './pages/Payment';
import DashboardLevel2 from './pages/DashboardLevel2';
import GameLevel2 from './pages/GameLevel2';


function App() {
  const [state, setState] = useState({
    user: null,
    notes: [],
    loading: true,
    score: 0
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
      {/* <Header state={state} setState={setState} />  header was applying to all pages*/}

      {state.loading && <Loading />}

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/auth" element={(
          <Redirect user={state.user}>
            <AuthForm setState={setState} />
          </Redirect>
        )} />

        <Route path="/dashboard" element={(
          <Redirect user={state.user}>
            <div className="dashboardGame">
              <Dashboard state={state} setState={setState} user={state.user}/>
            </div>
          </Redirect>
        )} />

        <Route path="/payment" element={(
          <Redirect user={state.user}>
            <div className="paymentBord">
            <h1 className="payh1" >Sugarland Shuffle! level 2</h1>

            <Payment setState={setState} />
            </div>
          </Redirect>
        )} />
         <Route path="/dashboard2" element={(
          <Redirect user={state.user}>
            <div className= 'dashboardGame' >
              <DashboardLevel2 state={state} setState={setState} />
              
            </div>
          </Redirect>
         )} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
    
  );
}

export default App;
