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

const FLEET = [
  { id: 'MH-12-BMD-01', group: 'BMD Trucks', type: 'Bulk Mix Truck', ops: 'Ramesh Patil, Anil More', status: 'Available' },
  { id: 'MH-12-BMD-02', group: 'BMD Trucks', type: 'Bulk Mix Truck', ops: 'Ashok Kumar, Dinesh Rao', status: 'Available' },
  { id: 'MH-12-BMD-03', group: 'BMD Trucks', type: 'Bulk Mix Truck', ops: 'Vikram Soni, Sanjay Mishra', status: 'Off Shift' },
  { id: 'MH-12-BCV-01', group: 'Blast Crew Vehicles', type: 'Blast Crew Cab', ops: 'Mahesh Verma', status: 'Available' },
  { id: 'MH-12-BCV-02', group: 'Blast Crew Vehicles', type: 'Blast Crew Cab', ops: 'Prakash Jadhav', status: 'Maintenance' },
  { id: 'MH-12-SVY-01', group: 'Support Trucks', type: 'Survey Vehicle', ops: '', status: 'Available' },
  { id: 'MH-12-SPT-01', group: 'Support Trucks', type: 'Ancillary Support', ops: '', status: 'Available' }
];

export default function ScheduleScreen({ dockets, fleetStatuses = [], loading, onOpenDocket }) {
  const [viewMode, setViewMode] = useState('grid');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Ownership modal state
  const [selectedDocketToOpen, setSelectedDocketToOpen] = useState(null);

  const weekInfo = getWeekRange(currentDate);
  const YOUR_VEHICLE = 'MH-12-BMD-01';

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

  // Generate the 5 days of the week (Mon-Fri)
  const gridDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(weekInfo.start);
    d.setDate(d.getDate() + i);
    return d;
  });

  const getVehicleStatusForDate = (vehicleId, dateObj) => {
    // Format dateObj to YYYY-MM-DD local time to match db format
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    for (const doc of fleetStatuses) {
      if (doc.status && doc.status[vehicleId] && doc.status[vehicleId][dateStr]) {
        return doc.status[vehicleId][dateStr].status;
      }
    }
    return 'Available';
  };

  const handleDocketClick = (docket) => {
    if (docket.vehicleId && docket.vehicleId !== YOUR_VEHICLE) {
      setSelectedDocketToOpen(docket);
    } else {
      onOpenDocket(docket);
    }
  };

  const confirmOpenDocket = () => {
    if (selectedDocketToOpen) {
      onOpenDocket(selectedDocketToOpen);
      setSelectedDocketToOpen(null);
    }
  };

  const isTodayDate = (dateObj) => new Date().toDateString() === dateObj.toDateString();
  const isTodaySelected = isTodayDate(currentDate);

  const renderBookingCard = (docket, compact = false) => {
    const statusColor = docket.status === 'inprogress' ? 'amber' : docket.status === 'planned' ? 'navy' : docket.status === 'delivered' || docket.status === 'signed' ? 'green' : 'grey';
    const statusDotColor = docket.status === 'inprogress' ? '#D97706' : docket.status === 'planned' ? '#2E5390' : docket.status === 'delivered' || docket.status === 'signed' ? '#16A34A' : '#9CA3AF';
    
    return (
      <div key={docket._id} onClick={() => handleDocketClick(docket)} style={{
        background:'#fff', borderLeft:`3px solid ${statusDotColor}`, borderTop:'1px solid #E4E9F0', borderRight:'1px solid #E4E9F0', borderBottom:'1px solid #E4E9F0', borderRadius:'6px', padding: compact ? '8px' : '12px', cursor:'pointer', height:'100%', position:'relative', transition:'box-shadow 0.2s', boxShadow:'0 1px 2px rgba(0,0,0,0.03)'
      }}>
        <div style={{position:'absolute', top:'8px', right:'8px', width:'6px', height:'6px', borderRadius:'50%', background: statusDotColor}}></div>
        {compact ? (
          <>
            <div style={{fontSize:'9px', fontWeight:800, color:'#4B5563', display:'flex', alignItems:'center', gap:'4px'}}><i className="ti ti-clock" style={{fontSize:'11px'}}></i>{docket.scheduledStart}</div>
            <div style={{fontSize:'11.5px', fontWeight:800, color:'#111827', marginTop:'3px', lineHeight:1.2}}>{docket.customerName || 'Customer'}</div>
            <div style={{fontSize:'9px', color:'#6B7280', marginTop:'2px', display:'flex', alignItems:'center', gap:'3px'}}><i className="ti ti-map-pin" style={{fontSize:'10px'}}></i>{docket.site}</div>
            <div style={{fontSize:'9px', fontWeight:700, color:'#E8590C', marginTop:'4px'}}>{docket.docketNo}</div>
          </>
        ) : (
          <div style={{display:'flex', gap:'9px'}}>
            <div style={{flex:1}}>
              <div style={{display:'flex', alignItems:'center', gap:'8px', justifyContent:'space-between'}}>
                <span style={{fontSize:'14px', fontWeight:800, color:'#1E3A5C'}}>{docket.blastNo}</span>
                <span className={`chip chip-${statusColor}`}>
                  {docket.status === 'inprogress' ? 'In Progress' : docket.status.charAt(0).toUpperCase() + docket.status.slice(1)}
                </span>
              </div>
              <div style={{fontSize:'12px', fontWeight:700, color:'#374151', marginTop:'5px'}}><i className="ti ti-map-pin" style={{fontSize:'13px', color:'#B0B8C4'}}></i> {docket.site}</div>
              <div style={{fontSize:'11px', color:'#6B7280', marginTop:'3px'}}>{docket.shotfirer} (Shotfirer)</div>
            </div>
            <div style={{textAlign:'right', flexShrink:0}}>
              <div style={{fontSize:'14px', fontWeight:800, color:'#111827'}}><i className="ti ti-clock" style={{fontSize:'13px', color:'#B0B8C4'}}></i> {docket.scheduledStart} hrs</div>
              <div style={{fontSize:'9.5px', color:'#AAB4C2', marginTop:'3px', fontWeight:600}}>{docket.docketNo}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{flex:1, display:'flex', flexDirection:'column', minHeight:0, position:'relative'}}>
      {/* week nav */}
      <div style={{background:'#fff', borderBottom:'1px solid #E8EDF3', padding:'11px 18px', display:'flex', alignItems:'center', gap:'10px', flexShrink:0}}>
        <button onClick={prevWeek} style={{width:'34px', height:'34px', borderRadius:'8px', border:'1.5px solid #E3E8EF', display:'flex', alignItems:'center', justifyContent:'center', color:'#4B5563', cursor:'pointer'}}><i className="ti ti-chevron-left" style={{fontSize:'17px'}}></i></button>
        <div style={{flex:1, textAlign:'center'}}>
          <div style={{fontSize:'14px', fontWeight:800, color:'#111827'}}>{weekInfo.label}</div>
          <div style={{fontSize:'10.5px', color:'#9CA3AF', fontWeight:600, marginTop:'1px'}}>Week {weekInfo.weekNum} · Panna Plant</div>
        </div>
        <button onClick={nextWeek} style={{width:'34px', height:'34px', borderRadius:'8px', border:'1.5px solid #E3E8EF', display:'flex', alignItems:'center', justifyContent:'center', color:'#4B5563', cursor:'pointer'}}><i className="ti ti-chevron-right" style={{fontSize:'17px'}}></i></button>
        <button onClick={goToToday} className="btn-ghost" style={{padding:'7px 13px', fontSize:'12px', cursor:'pointer', background:isTodaySelected ? '#E8EDF3' : 'transparent'}}>Today</button>
        
        {/* layout toggle */}
        <div style={{display:'flex', background:'#F1F5FA', borderRadius:'9px', padding:'3px', gap:'2px'}}>
          <button onClick={() => setViewMode('grid')} style={{cursor:'pointer', border:'none', width:'32px', height:'28px', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', color:viewMode === 'grid' ? '#1E3A5C' : '#8A97A8', background:viewMode === 'grid' ? '#fff' : 'transparent', boxShadow:viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}><i className="ti ti-layout-grid" style={{fontSize:'16px'}}></i></button>
          <button onClick={() => setViewMode('agenda')} style={{cursor:'pointer', border:'none', width:'32px', height:'28px', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', color:viewMode === 'agenda' ? '#1E3A5C' : '#8A97A8', background:viewMode === 'agenda' ? '#fff' : 'transparent', boxShadow:viewMode === 'agenda' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}><i className="ti ti-list-details" style={{fontSize:'16px'}}></i></button>
        </div>
      </div>

      <div style={{flex:1, overflow:'auto', minHeight:0, background:'#F4F7FB', padding:'14px 16px'}}>
        
        {viewMode === 'grid' ? (
          <div className="grid-container">
            {/* Header Row */}
            <div className="grid-row grid-header-row">
              <div className="grid-cell grid-cell-veh" style={{alignItems:'center', flexDirection:'row', gap:'6px', color:'#7A8598'}}>
                <i className="ti ti-truck-delivery" style={{fontSize:'15px'}}></i> VEHICLE
              </div>
              {gridDays.map((d, i) => {
                const isActive = isTodayDate(d);
                return (
                  <div key={i} className={`grid-cell ${isActive ? 'active-day' : ''}`} style={{alignItems:'center', justifyContent:'center', padding:'6px 0'}}>
                    <div className="grid-day-name">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                    <div className="grid-day-num">{d.getDate().toString().padStart(2, '0')}</div>
                  </div>
                );
              })}
            </div>

            {/* Matrix Body grouped by category */}
            {['BMD Trucks', 'Blast Crew Vehicles', 'Support Trucks'].map(group => {
              const groupVehicles = FLEET.filter(v => v.group === group);
              if (groupVehicles.length === 0) return null;
              
              const groupIcon = group === 'BMD Trucks' ? 'ti-truck' : group === 'Blast Crew Vehicles' ? 'ti-users' : 'ti-tool';
              
              return (
                <div key={group}>
                  <div className="grid-row grid-group-header">
                    <i className={`ti ${groupIcon}`} style={{fontSize:'14px', color:'#9CA3AF'}}></i>
                    {group} <span className="grid-group-badge">{groupVehicles.length}</span>
                  </div>
                  {groupVehicles.map(veh => (
                    <div className="grid-row" key={veh.id}>
                      <div className="grid-cell grid-cell-veh" style={{background:'#fff'}}>
                        <div className="veh-name">
                          {veh.id}
                          {veh.id === YOUR_VEHICLE && <span className="you-badge">YOU</span>}
                        </div>
                        <div className="veh-type">{veh.type}</div>
                        {veh.ops && <div className="veh-ops">{veh.ops}</div>}
                      </div>
                      
                      {gridDays.map((d, i) => {
                        // Find docket for this vehicle on this day
                        const dayStart = new Date(d); dayStart.setHours(0,0,0,0);
                        const dayEnd = new Date(d); dayEnd.setHours(23,59,59,999);
                        const dayDockets = dockets.filter(doc => {
                          if (!doc.date) return false;
                          const docDate = new Date(doc.date);
                          return (doc.vehicleId === veh.id || doc.vehicleId === 'Unknown') && docDate >= dayStart && docDate <= dayEnd;
                        }).filter(doc => doc.vehicleId === veh.id); // Strict match for Grid
                        
                        const currentStatus = getVehicleStatusForDate(veh.id, d);

                        return (
                          <div key={i} className="grid-cell" style={{background:'#fff'}}>
                            {dayDockets.length > 0 ? (
                              <div style={{display:'flex', flexDirection:'column', gap:'6px', height:'100%'}}>
                                {dayDockets.map(doc => renderBookingCard(doc, true))}
                              </div>
                            ) : (
                              <div className={`grid-empty-state ${currentStatus === 'Maintenance' ? 'maintenance' : ''}`}>
                                {currentStatus}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          /* Agenda View */
          <>
            <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
              <span style={{fontSize:'15px', fontWeight:800, color:'#111827'}}>{formatDate(currentDate)}</span>
              {isTodaySelected && <span className="chip chip-navy">Today</span>}
            </div>

            {loading ? (
              <div style={{textAlign:'center', padding:'20px'}}>Loading...</div>
            ) : (
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {FLEET.map(veh => {
                  const dayStart = new Date(currentDate); dayStart.setHours(0,0,0,0);
                  const dayEnd = new Date(currentDate); dayEnd.setHours(23,59,59,999);
                  const vehDockets = dockets.filter(doc => {
                    if (!doc.date) return false;
                    const docDate = new Date(doc.date);
                    return doc.vehicleId === veh.id && docDate >= dayStart && docDate <= dayEnd;
                  });

                  if (vehDockets.length === 0) return null;

                  const isOwn = veh.id === YOUR_VEHICLE;
                  
                  return (
                    <div key={veh.id} className={!isOwn ? 'dimmed-vehicle' : ''}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px', padding:'0 2px'}}>
                        <span style={{fontSize:'12.5px', fontWeight:800, color:'#1F2937'}}>{veh.id}</span>
                        {isOwn && <span className="you-badge">YOUR VEHICLE</span>}
                        <span style={{fontSize:'10.5px', color:'#9CA3AF', fontWeight:600}}>{veh.type}</span>
                      </div>
                      <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                        {vehDockets.map(doc => renderBookingCard(doc, false))}
                      </div>
                    </div>
                  );
                })}
                
                {dockets.filter(doc => {
                   const dayStart = new Date(currentDate); dayStart.setHours(0,0,0,0);
                   const dayEnd = new Date(currentDate); dayEnd.setHours(23,59,59,999);
                   const docDate = new Date(doc.date);
                   return docDate >= dayStart && docDate <= dayEnd;
                }).length === 0 && (
                  <div style={{textAlign:'center', padding:'40px 20px', color:'#8A97A8', fontSize:'13px', background:'#fff', borderRadius:'12px', border:'1px dashed #C3CCD9'}}>
                    <i className="ti ti-calendar-off" style={{fontSize:'24px', marginBottom:'8px', display:'block', color:'#AAB4C2'}}></i>
                    No dockets scheduled for this day.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* legend */}
      <div style={{background:'#fff', borderTop:'1px solid #E8EDF3', padding:'8px 16px', display:'flex', alignItems:'center', gap:'13px', flexShrink:0, flexWrap:'wrap', zIndex:10}}>
        <div style={{display:'flex', alignItems:'center', gap:'5px'}}><span className="sdot sdot-planned"></span><span style={{fontSize:'10px', color:'#6B7280', fontWeight:600}}>Planned</span></div>
        <div style={{display:'flex', alignItems:'center', gap:'5px'}}><span className="sdot sdot-inprogress"></span><span style={{fontSize:'10px', color:'#6B7280', fontWeight:600}}>In Progress</span></div>
        <div style={{display:'flex', alignItems:'center', gap:'5px'}}><span className="sdot sdot-delivered"></span><span style={{fontSize:'10px', color:'#6B7280', fontWeight:600}}>Delivered</span></div>
        <div style={{display:'flex', alignItems:'center', gap:'5px'}}><span className="sdot sdot-submitted"></span><span style={{fontSize:'10px', color:'#6B7280', fontWeight:600}}>Submitted</span></div>
        <div style={{display:'flex', alignItems:'center', gap:'5px', marginLeft:'auto'}}><span style={{width:'11px', height:'11px', borderRadius:'3px', background:'#FDECDF', borderLeft:'3px solid #E8590C'}}></span><span style={{fontSize:'10px', color:'#6B7280', fontWeight:600}}>Your vehicle</span></div>
      </div>

      {/* Ownership Modal */}
      {selectedDocketToOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#FEF2F2', color:'#DC2626', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'12px'}}>
              <i className="ti ti-alert-triangle" style={{fontSize:'20px'}}></i>
            </div>
            <div style={{fontSize:'16px', fontWeight:800, color:'#111827', marginBottom:'6px'}}>Vehicle Mismatch</div>
            <div style={{fontSize:'13px', color:'#4B5563', lineHeight:1.5, marginBottom:'20px'}}>
              You are assigned to <strong>{YOUR_VEHICLE}</strong>. Do you want to open this docket for <strong>{selectedDocketToOpen.vehicleId}</strong>?
            </div>
            <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
              <button className="btn-ghost" onClick={() => setSelectedDocketToOpen(null)}>Dismiss</button>
              <button className="btn-navy" onClick={confirmOpenDocket}>Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
