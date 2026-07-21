import { useState } from 'react';

// Helper to format dates
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
};

const getWeekRange = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const start = new Date(d.setDate(diff));
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Monday to Sunday
  
  const startStr = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const endStr = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  
  // Calculate week number
  const firstDayOfYear = new Date(start.getFullYear(), 0, 1);
  const pastDaysOfYear = (start - firstDayOfYear) / 86400000;
  const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  
  return { label: `${startStr} – ${endStr}`, weekNum, start, end };
};

export default function ScheduleScreen({ dockets, loading, onOpenDocket }) {
  const [isGrid, setIsGrid] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekInfo = getWeekRange(currentDate);

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filter dockets for the currently selected week (Monday to Sunday)
  const filteredDockets = dockets.filter(d => {
    if (!d.date) return false;
    const docketDate = new Date(d.date);
    const startOfWeek = new Date(weekInfo.start);
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(weekInfo.start);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // Up to Sunday
    endOfWeek.setHours(23,59,59,999);
    
    return docketDate >= startOfWeek && docketDate <= endOfWeek;
  });

  const isToday = new Date().toDateString() === currentDate.toDateString();

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      {/* week nav */}
      <div style={{background:'#fff',borderBottom:'1px solid #E8EDF3',padding:'11px 18px',display:'flex',alignItems:'center',gap:'10px',flexShrink:0}}>
        <button onClick={prevWeek} style={{width:'34px',height:'34px',borderRadius:'8px',border:'1.5px solid #E3E8EF',display:'flex',alignItems:'center',justifyContent:'center',color:'#4B5563',cursor:'pointer'}}><i className="ti ti-chevron-left" style={{fontSize:'17px'}}></i></button>
        <div style={{flex:1,textAlign:'center'}}>
          <div style={{fontSize:'14px',fontWeight:800,color:'#111827'}}>{weekInfo.label}</div>
          <div style={{fontSize:'10.5px',color:'#9CA3AF',fontWeight:600,marginTop:'1px'}}>Week {weekInfo.weekNum} · Panna Plant</div>
        </div>
        <button onClick={nextWeek} style={{width:'34px',height:'34px',borderRadius:'8px',border:'1.5px solid #E3E8EF',display:'flex',alignItems:'center',justifyContent:'center',color:'#4B5563',cursor:'pointer'}}><i className="ti ti-chevron-right" style={{fontSize:'17px'}}></i></button>
        <button onClick={goToToday} className="btn-ghost" style={{padding:'7px 13px',fontSize:'12px',cursor:'pointer',background:isToday ? '#E8EDF3' : 'transparent'}}>Today</button>
        {/* layout toggle */}
        <div style={{display:'flex',background:'#F1F5FA',borderRadius:'9px',padding:'3px',gap:'2px'}}>
          <button onClick={() => setIsGrid(true)} style={{cursor:'pointer',border:'none',width:'32px',height:'28px',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',color:isGrid?'#1E3A5C':'#8A97A8',background:isGrid?'#fff':'transparent',boxShadow:isGrid?'0 1px 3px rgba(0,0,0,0.1)':'none'}}><i className="ti ti-layout-grid" style={{fontSize:'16px'}}></i></button>
          <button onClick={() => setIsGrid(false)} style={{cursor:'pointer',border:'none',width:'32px',height:'28px',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',color:!isGrid?'#1E3A5C':'#8A97A8',background:!isGrid?'#fff':'transparent',boxShadow:!isGrid?'0 1px 3px rgba(0,0,0,0.1)':'none'}}><i className="ti ti-list-details" style={{fontSize:'16px'}}></i></button>
        </div>
      </div>

      <div style={{flex:1,overflow:'auto',minHeight:0,background:'#F4F7FB',padding:'14px 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
          <span style={{fontSize:'15px',fontWeight:800,color:'#111827'}}>{formatDate(currentDate)}</span>
          {isToday && <span className="chip chip-navy">Today</span>}
          <span style={{marginLeft:'auto',fontSize:'11px',color:'#9CA3AF',fontWeight:600}}>{loading ? '-' : filteredDockets.length} dockets scheduled</span>
        </div>

        <div style={{marginBottom:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px',padding:'0 2px'}}>
            <span style={{fontSize:'12.5px',fontWeight:800,color:'#1F2937'}}>MH-12-BMD-01</span>
            <span style={{fontSize:'8px',fontWeight:800,color:'#E8590C',background:'#FFF1E8',padding:'1px 6px',borderRadius:'4px'}}>YOUR VEHICLE</span>
            <span style={{fontSize:'10.5px',color:'#9CA3AF',fontWeight:600}}>Bulk Mix Truck</span>
          </div>
          
          <div style={isGrid ? {display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'} : {display:'flex',flexDirection:'column',gap:'8px'}}>
            {loading ? (
              // Skeleton Loaders
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{padding:'12px 14px',background:'#fff',borderRadius:'12px',border:'1px solid #E8EDF3',display:'flex',alignItems:'center',gap:'9px',animation:'pulse 1.5s infinite ease-in-out',opacity: 1 - (i * 0.15)}}>
                  <div style={{flex:1}}>
                    <div style={{width:'80px',height:'16px',background:'#E3E8EF',borderRadius:'4px',marginBottom:'8px'}}></div>
                    <div style={{width:'120px',height:'12px',background:'#F1F5FA',borderRadius:'4px',marginBottom:'6px'}}></div>
                    <div style={{width:'90px',height:'10px',background:'#F1F5FA',borderRadius:'4px'}}></div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{width:'50px',height:'14px',background:'#E3E8EF',borderRadius:'4px',marginBottom:'6px',marginLeft:'auto'}}></div>
                    <div style={{width:'70px',height:'10px',background:'#F1F5FA',borderRadius:'4px',marginLeft:'auto'}}></div>
                  </div>
                </div>
              ))
            ) : filteredDockets.length === 0 ? (
              <div style={{textAlign:'center',padding:'40px 20px',color:'#8A97A8',fontSize:'13px',background:'#fff',borderRadius:'12px',border:'1px dashed #C3CCD9'}}>
                <i className="ti ti-calendar-off" style={{fontSize:'24px',marginBottom:'8px',display:'block',color:'#AAB4C2'}}></i>
                No dockets scheduled for this week.
              </div>
            ) : (
              filteredDockets.map(docket => (
                <div key={docket._id} className={`bcard bcard-${docket.status}`} onClick={() => onOpenDocket(docket)} style={{padding:'12px 14px',borderLeftWidth:'4px',cursor:'pointer'}}>
                  <div style={{display:'flex',flexDirection: isGrid ? 'column' : 'row',alignItems: isGrid ? 'flex-start' : 'center',gap:'9px'}}>
                    <div style={{flex:1,minWidth:0,width:'100%'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px',justifyContent:'space-between'}}>
                        <span style={{fontSize:'14px',fontWeight:800,color:'#1E3A5C'}}>{docket.blastNo}</span>
                        {isGrid && (
                          <div style={{fontSize:'12px',fontWeight:800,color:'#111827'}}>{docket.scheduledStart} hrs</div>
                        )}
                        {!isGrid && (
                          <span className={`chip chip-${docket.status === 'inprogress' ? 'amber' : docket.status === 'planned' ? 'grey' : 'green'}`}>
                            {docket.status === 'inprogress' ? 'In Progress' : docket.status.charAt(0).toUpperCase() + docket.status.slice(1)}
                          </span>
                        )}
                      </div>
                      <div style={{fontSize:'12px',fontWeight:700,color:'#374151',marginTop:'5px'}}><i className="ti ti-map-pin" style={{fontSize:'13px',color:'#B0B8C4'}}></i> {docket.site}</div>
                      <div style={{fontSize:'11px',color:'#6B7280',marginTop:'3px'}}>{docket.shotfirer} (Shotfirer)</div>
                      
                      {isGrid && (
                        <div style={{marginTop:'8px'}}>
                           <span className={`chip chip-${docket.status === 'inprogress' ? 'amber' : docket.status === 'planned' ? 'grey' : 'green'}`}>
                            {docket.status === 'inprogress' ? 'In Progress' : docket.status.charAt(0).toUpperCase() + docket.status.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    {!isGrid && (
                      <div style={{textAlign:'right',flexShrink:0}}>
                        <div style={{fontSize:'14px',fontWeight:800,color:'#111827'}}><i className="ti ti-clock" style={{fontSize:'13px',color:'#B0B8C4'}}></i> {docket.scheduledStart} hrs</div>
                        <div style={{fontSize:'9.5px',color:'#AAB4C2',marginTop:'3px',fontWeight:600}}>{docket.docketNo}</div>
                        <i className="ti ti-chevron-right" style={{fontSize:'17px',color:'#C8D0DA',marginTop:'2px'}}></i>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{height:'8px'}}></div>
      </div>
      
      {/* legend */}
      <div style={{background:'#fff',borderTop:'1px solid #E8EDF3',padding:'8px 16px',display:'flex',alignItems:'center',gap:'13px',flexShrink:0,flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:'5px'}}><span className="sdot sdot-planned"></span><span style={{fontSize:'10px',color:'#6B7280',fontWeight:600}}>Planned</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'5px'}}><span className="sdot sdot-inprogress"></span><span style={{fontSize:'10px',color:'#6B7280',fontWeight:600}}>In Progress</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'5px'}}><span className="sdot sdot-delivered"></span><span style={{fontSize:'10px',color:'#6B7280',fontWeight:600}}>Delivered</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'5px'}}><span className="sdot sdot-signed"></span><span style={{fontSize:'10px',color:'#6B7280',fontWeight:600}}>Signed</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'5px',marginLeft:'auto'}}><span style={{width:'11px',height:'11px',borderRadius:'3px',background:'#FDECDF',borderLeft:'3px solid #E8590C'}}></span><span style={{fontSize:'10px',color:'#6B7280',fontWeight:600}}>Your vehicle</span></div>
      </div>
    </div>
  );
}
