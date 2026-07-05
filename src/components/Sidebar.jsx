export default function Sidebar({ docket, onBack, currentPage, onChangePage }) {
  return (
    <aside style={{width:'214px',minWidth:'214px',background:'#0F2440',display:'flex',flexDirection:'column',height:'100%'}}>
      {/* docket meta */}
      <div style={{padding:'15px 15px 14px',borderBottom:'1px solid rgba(255,255,255,.08)'}}>
        <button onClick={onBack} className="back-btn"><i className="ti ti-arrow-left" style={{fontSize:'15px'}}></i>Schedule</button>
        <div style={{fontSize:'9px',fontWeight:700,color:'#7E8CA3',textTransform:'uppercase',letterSpacing:'.6px'}}>Delivery Docket No.</div>
        <div style={{fontSize:'20px',fontWeight:800,color:'#fff',letterSpacing:'-.4px',marginTop:'3px'}}>{docket.docketNo}</div>
        <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'9px'}}>
          <span className={`chip chip-${docket.status === 'inprogress' ? 'amber' : docket.status === 'planned' ? 'grey' : 'green'}`}>
            {docket.status === 'inprogress' ? 'In Progress' : docket.status.charAt(0).toUpperCase() + docket.status.slice(1)}
          </span>
        </div>
        <div style={{marginTop:'12px',display:'flex',flexDirection:'column',gap:'6px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'7px'}}><i className="ti ti-flask" style={{fontSize:'13px',color:'#5B6B85'}}></i><span style={{fontSize:'11px',color:'#C7D0DD',fontWeight:600}}>{docket.blastNo}</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'7px'}}><i className="ti ti-map-pin" style={{fontSize:'13px',color:'#5B6B85'}}></i><span style={{fontSize:'11px',color:'#C7D0DD',fontWeight:600}}>{docket.site}</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'7px'}}><i className="ti ti-calendar" style={{fontSize:'13px',color:'#5B6B85'}}></i><span style={{fontSize:'11px',color:'#C7D0DD',fontWeight:600}}>{new Date(docket.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
        </div>
      </div>

      {/* section nav */}
      <div style={{flex:1,overflowY:'auto',padding:'6px 0'}}>
        {/* group 1 */}
        <div className={`grp-head ${currentPage === 'summary' ? 'on' : ''}`} onClick={() => onChangePage('summary')}><i className="ti ti-clipboard-list" style={{fontSize:'16px'}}></i>Delivery Summary<i className="ti ti-chevron-down" style={{fontSize:'15px',marginLeft:'auto',color:'#8493AB'}}></i></div>
        {currentPage === 'summary' && (
          <div>
            <div className="snav"><i className="ti ti-user-circle" style={{fontSize:'15px'}}></i>Customer Info<i className="ti ti-circle-check tick"></i></div>
            <div className="snav"><i className="ti ti-truck" style={{fontSize:'15px'}}></i>Vehicle &amp; Operator<i className="ti ti-circle-check tick"></i></div>
            <div className="snav"><i className="ti ti-package" style={{fontSize:'15px'}}></i>Products<i className="ti ti-circle-check tick"></i></div>
            <div className="snav"><i className="ti ti-tools" style={{fontSize:'15px'}}></i>Services<i className="ti ti-circle-check tick"></i></div>
            <div className="snav"><i className="ti ti-signature" style={{fontSize:'15px'}}></i>Notes &amp; Signature</div>
          </div>
        )}
        {/* group 2 */}
        <div className={`grp-head ${currentPage === 'additional' ? 'on' : ''}`} onClick={() => onChangePage('additional')} style={{marginTop:'2px'}}><i className="ti ti-adjustments-alt" style={{fontSize:'16px'}}></i>Additional Information<i className="ti ti-chevron-right" style={{fontSize:'15px',marginLeft:'auto',color:'#8493AB'}}></i></div>
        {currentPage === 'additional' && (
          <div>
            <div className="snav"><i className="ti ti-bmp" style={{fontSize:'15px'}}></i>Shot Information</div>
            <div className="snav"><i className="ti ti-clock-hour-4" style={{fontSize:'15px'}}></i>Time Information</div>
            <div className="snav"><i className="ti ti-scale" style={{fontSize:'15px'}}></i>Cup Weights</div>
            <div className="snav"><i className="ti ti-route" style={{fontSize:'15px'}}></i>Distance</div>
            <div className="snav"><i className="ti ti-barrel" style={{fontSize:'15px'}}></i>Bulk Mass</div>
            <div className="snav"><i className="ti ti-note" style={{fontSize:'15px'}}></i>Notes</div>
          </div>
        )}
      </div>

      {/* logged in */}
      <div style={{padding:'12px 15px',borderTop:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',gap:'9px'}}>
        <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'#1E3A5C',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:800,color:'#fff'}}>RP</div>
        <div style={{minWidth:0}}><div style={{fontSize:'9px',color:'#7E8CA3',fontWeight:600}}>Logged in as</div><div style={{fontSize:'12px',fontWeight:700,color:'#fff'}}>Ramesh Patil</div></div>
      </div>
    </aside>
  );
}
