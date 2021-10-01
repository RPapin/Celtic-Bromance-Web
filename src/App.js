
import './App.css';
import Dashboard from './component/dashboard/dashboard';
import Header from './component/header/header';
import ModalConnect from './component/modals/modalConnect';
import React, { useState, useEffect } from 'react'
import ReadData from './services/readData'
import OlderResult from './component/olderResult/olderResult';
import { useCookies } from 'react-cookie';
// import Test from './component/test/test';

function App() {
  const [admin, setAdmin] = useState(false)
  const [cookies, setCookie] = useCookies(['user']);
  const [isOlderResult, setIsOlderResult] = useState(false)

  useEffect(() => {
    let adminLocal = localStorage.getItem('admin')
    if(adminLocal !== "false")setAdmin(adminLocal)
    }, [admin])
  return (
    <div className="App">
        <Header admin={admin} setAdmin={setAdmin} olderResult={isOlderResult} setIsOlderResult={setIsOlderResult}/>
        {(isOlderResult && ('user' in cookies)) ?  
          <OlderResult/> : 
          <Dashboard admin={admin} setAdmin={setAdmin}/>
        }
        
        {!('user' in cookies) && <ModalConnect setAdmin={setAdmin}></ModalConnect>}
        
    </div>
  );
}

export default App;
