
import './App.css';
import Dashboard from './component/dashboard/dashboard';
import Header from './component/header/header';
import ModalConnect from './component/modals/modalConnect';
import React, { useState, useEffect } from 'react'
import OlderResult from './component/olderResult/olderResult';
import { useCookies } from 'react-cookie';
import ReadData from './services/readData'
import { useTranslation } from 'react-i18next';

// import Test from './component/test/test';
let retryNumbers = 0
function App() {
  const { t, } = useTranslation();
  const [admin, setAdmin] = useState(false)
  const [cookies] = useCookies(['user']);
  const [isOlderResult, setIsOlderResult] = useState(false)
  const readData = new ReadData()
  const [selectDriver, setSelectDriver] = useState([])
  const [loading, setLoading] = useState(true)
  const [showInvalidServ, setShowInvalidServ] = useState(false)
  const MAX_RETRY = 2;

  const fetchDriver = async (retryNumbers) => {
    retryNumbers ++;
    let allInfo = await readData.getLocalApi("fetch_drivers")
    if(allInfo){
      allInfo.sort((a, b) => (a.Surname > b.Surname) ? 1 : -1)
      setSelectDriver(allInfo)
      setLoading(false)
      setShowInvalidServ(false)
    } else if(retryNumbers < MAX_RETRY) {
      setTimeout(() => {
        fetchDriver(retryNumbers)
      }, 1000)
    } else {
      setShowInvalidServ(true)
    }
  }
  useEffect(() => {
    if(retryNumbers < MAX_RETRY)fetchDriver(retryNumbers)
    let adminLocal = localStorage.getItem('admin')
    if(adminLocal !== "false")setAdmin(adminLocal)
  }, [])
    
  return (
    <div className="App">
        <Header admin={admin} setAdmin={setAdmin} olderResult={isOlderResult} setIsOlderResult={setIsOlderResult}/>
        {('user' in cookies) ? 
            (isOlderResult) ?  
              <OlderResult/> : 
              <Dashboard admin={admin} setAdmin={setAdmin}/>
              :
          <div id="shadow-background"></div>
        }
        
        {!('user' in cookies) && !loading && <ModalConnect setAdmin={setAdmin} selectDriver={selectDriver}></ModalConnect>}
        {showInvalidServ && 
          <div className="error">{t("error.serverNotFound")}</div>
        }
    </div>
  );
}

export default App;
