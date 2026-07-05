import { useState } from 'react';

export default function ScheduleScreen({ dockets, loading, onOpenDocket }) {
  const [isGrid, setIsGrid] = useState(false);

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      {/* week nav */}
      <div style={{background:'#fff',borderBottom:'1px solid #E8EDF3',padding:'11px 18px',display:'flex',alignItems:'center',gap:'10px',flexShrink:0}}>
        <button style={{width:'34px',height:'34px',borderRadius:'8px',border:'1.5px solid #E3E8EF',display:'flex',alignItems:'center',justifyContent:'center',color:'#4B5563'}}><i className="ti ti-chevron-left" style={{fontSize:'17px'}}></i></button>
        <div style={{flex:1,textAlign:'center'}}><div style={{fontSize:'14px',fontWeight:800,color:'#111827'}}>29 Jun – 3 Jul 2026</div><div style={{fontSize:'10.5px',color:'#9CA3AF',fontWeight:600,marginTop:'1px'}}>Week 27 · Panna Plant</div></div>
        <button style={{width:'34px',height:'34px',borderRadius:'8px',border:'1.5px solid #E3E8EF',display:'flex',alignItems:'center',justifyContent:'center',color:'#4B5563'}}><i className="ti ti-chevron-right" style={{fontSize:'17px'}}></i></button>
        <button className="btn-ghost" style={{padding:'7px 13px',fontSize:'12px'}}>Today</button>
        {/* layout toggle */}
        <div style={{display:'flex',background:'#F1F5FA',borderRadius:'9px',padding:'3px',gap:'2px'}}>
          <button onClick={() => setIsGrid(true)} style={{width:'32px',height:'28px',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',color:isGrid?'#1E3A5C':'#8A97A8',background:isGrid?'#fff':'transparent'}}><i className="ti ti-layout-grid" style={{fontSize:'16px'}}></i></button>
          <button onClick={() => setIsGrid(false)} style={{width:'32px',height:'28px',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',color:!isGrid?'#1E3A5C':'#8A97A8',background:!isGrid?'#fff':'transparent'}}><i className="ti ti-list-details" style={{fontSize:'16px'}}></i></button>
        </div>
      </div>

      <div style={{flex:1,overflow:'auto',minHeight:0,background:'#F4F7FB',padding:'14px 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
          <span style={{fontSize:'15px',fontWeight:800,color:'#111827'}}>Tuesday, 30 Jun</span>
          <span className="chip chip-navy">Today</span>
          <span style={{marginLeft:'auto',fontSize:'11px',color:'#9CA3AF',fontWeight:600}}>5 dockets scheduled</span>
        </div>

        <div style={{marginBottom:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px',padding:'0 2px'}}>
            <span style={{fontSize:'12.5px',fontWeight:800,color:'#1F2937'}}>MH-12-BMD-01</span>
            <span style={{fontSize:'8px',fontWeight:800,color:'#E8590C',background:'#FFF1E8',padding:'1px 6px',borderRadius:'4px'}}>YOUR VEHICLE</span>
            <span style={{fontSize:'10.5px',color:'#9CA3AF',fontWeight:600}}>Bulk Mix Truck · Ramesh P, Anil M</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {loading ? (
              <div style={{textAlign:'center',padding:'20px',color:'#8A97A8',fontSize:'13px'}}>Loading schedule...</div>
            ) : dockets.length === 0 ? (
              <div style={{textAlign:'center',padding:'20px',color:'#8A97A8',fontSize:'13px'}}>No dockets scheduled for today.</div>
            ) : (
              dockets.map(docket => (
                <div key={docket._id} className={`bcard bcard-${docket.status}`} onClick={() => onOpenDocket(docket)} style={{padding:'12px 14px',borderLeftWidth:'4px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontSize:'14px',fontWeight:800,color:'#1E3A5C'}}>{docket.blastNo}</span>
                        <span className={`chip chip-${docket.status === 'inprogress' ? 'amber' : docket.status === 'planned' ? 'grey' : 'green'}`}>
                          {docket.status === 'inprogress' ? 'In Progress' : docket.status.charAt(0).toUpperCase() + docket.status.slice(1)}
                        </span>
                      </div>
                      <div style={{fontSize:'12px',fontWeight:700,color:'#374151',marginTop:'5px'}}><i className="ti ti-map-pin" style={{fontSize:'13px',color:'#B0B8C4'}}></i> {docket.site}</div>
                      <div style={{fontSize:'11px',color:'#6B7280',marginTop:'3px'}}>{docket.shotfirer} (Shotfirer)</div>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <div style={{fontSize:'14px',fontWeight:800,color:'#111827'}}><i className="ti ti-clock" style={{fontSize:'13px',color:'#B0B8C4'}}></i> {docket.scheduledStart} hrs</div>
                      <div style={{fontSize:'9.5px',color:'#AAB4C2',marginTop:'3px',fontWeight:600}}>{docket.docketNo}</div>
                      <i className="ti ti-chevron-right" style={{fontSize:'17px',color:'#C8D0DA',marginTop:'2px'}}></i>
                    </div>
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
        <div style={{display:'flex',alignItems:'center',gap:'5px'}}><span className="sdot sdot-submitted"></span><span style={{fontSize:'10px',color:'#6B7280',fontWeight:600}}>Submitted</span></div>
        <div style={{display:'flex',alignItems:'center',gap:'5px',marginLeft:'auto'}}><span style={{width:'11px',height:'11px',borderRadius:'3px',background:'#FDECDF',borderLeft:'3px solid #E8590C'}}></span><span style={{fontSize:'10px',color:'#6B7280',fontWeight:600}}>Your vehicle</span></div>
      </div>
    </div>
  );
}
