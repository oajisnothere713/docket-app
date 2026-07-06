import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import ScheduleScreen from './components/ScheduleScreen';
import DocketSummary from './components/DocketSummary';
import DocketAdditional from './components/DocketAdditional';
import './index.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('schedule');
  const [docketPage, setDocketPage] = useState('summary');
  const [dockets, setDockets] = useState([]);
  const [selectedDocket, setSelectedDocket] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDockets = () => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/dockets`)
      .then(res => res.json())
      .then(data => {
        setDockets(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch dockets:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDockets();
    
    // Poll for live updates every 5 seconds
    const interval = setInterval(() => {
      fetchDockets();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const openDocket = (docket) => {
    setSelectedDocket(docket);
    setCurrentScreen('docket');
    setDocketPage('summary');
  };

  const handleDocketSubmit = () => {
    fetchDockets(); // Refresh the list
    setCurrentScreen('schedule'); // Go back to schedule
  };

  return (
    <div style={{minHeight:'100vh',width:'100%',display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'34px 20px',background:'radial-gradient(1200px 700px at 50% -10%,#D5DCE7,#C0C9D7)'}}>
      <div style={{width:'800px',background:'#0B0F17',borderRadius:'44px',padding:'15px',boxShadow:'0 40px 90px -20px rgba(15,23,42,.55),inset 0 0 0 2px #23293A'}}>
        <div style={{position:'relative',width:'770px',height:'1040px',background:'#EEF2F7',borderRadius:'30px',overflow:'hidden',display:'flex',flexDirection:'column'}}>
          {/* front camera */}
          <div style={{position:'absolute',top:'14px',left:'50%',transform:'translateX(-50%)',width:'8px',height:'8px',borderRadius:'50%',background:'#1B2130',boxShadow:'inset 0 0 0 2px #2C3348',zIndex:40}}></div>

          {currentScreen === 'schedule' && (
            <div data-screen-label="Schedule" style={{display:'flex',flexDirection:'column',height:'100%',minHeight:0}}>
              <Header />
              <ScheduleScreen dockets={dockets} loading={loading} onOpenDocket={openDocket} />
              <BottomNav />
            </div>
          )}

          {currentScreen === 'docket' && selectedDocket && (
            <div data-screen-label="Docket" style={{display:'flex',height:'100%',minHeight:0}}>
              <Sidebar 
                docket={selectedDocket}
                onBack={() => setCurrentScreen('schedule')}
                currentPage={docketPage}
                onChangePage={setDocketPage}
              />
              <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0,height:'100%',background:'#F4F7FB'}}>
                <div id="docketScroll" style={{flex:1,overflowY:'auto',minHeight:0,padding:'20px 22px 30px'}}>
                  {docketPage === 'summary' && <DocketSummary docket={selectedDocket} onSubmit={handleDocketSubmit} />}
                  {docketPage === 'additional' && <DocketAdditional docket={selectedDocket} />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
