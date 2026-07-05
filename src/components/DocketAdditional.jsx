export default function DocketAdditional({ docket }) {
  return (
    <div>
      <div className="grp-title">Additional Information<span style={{fontSize:'11px',fontWeight:600,color:'#9CA3AF'}}>{docket.plant} · {new Date(docket.date).toLocaleDateString()}</span></div>

      {/* Shot */}
      <div id="sec-shot" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-bmp"></i>Shot Information</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld"><div className="fld-lbl">Project No.</div><input placeholder="Enter project no." defaultValue="PRJ-3500-900"/></div>
          <div className="fld selwrap"><div className="fld-lbl">Shot Type</div><select defaultValue="Production Bench"><option>Production Bench</option><option>Pre-split</option><option>Trim</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld selwrap"><div className="fld-lbl">No. of Operators</div><select defaultValue="2"><option>2</option><option>3</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">Bench Height</div><input placeholder="0.0" defaultValue="12.0"/></div><div className="unitbox">m</div></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">Avg Charging Ht</div><input placeholder="0.0" defaultValue="9.6"/></div><div className="unitbox">m</div></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">Hole Diameter</div><input placeholder="0" defaultValue="115"/></div><div className="unitbox">mm</div></div>
          <div className="fld"><div className="fld-lbl">No. of Holes</div><input placeholder="0" defaultValue="96"/></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">Temperature</div><input placeholder="0" defaultValue="31"/></div><div className="unitbox">°C</div></div>
          <div></div>
          <div className="fld" style={{gridColumn:'span 3'}}><div className="fld-lbl">Internal Notes</div><input placeholder="Enter notes"/></div>
        </div>
      </div>

      {/* Time */}
      <div id="sec-time" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-clock-hour-4"></i>Time Information</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld selwrap"><div className="fld-lbl">Time Required</div><div className="fld-val" style={{color:'#9CA3AF',fontWeight:500}}>Select time</div><i className="ti ti-clock chev" style={{bottom:'11px'}}></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Labour Time</div><div className="fld-val" style={{color:'#9CA3AF',fontWeight:500}}>Select time</div><i className="ti ti-clock chev" style={{bottom:'11px'}}></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Delay Time</div><div className="fld-val" style={{color:'#9CA3AF',fontWeight:500}}>Select time</div><i className="ti ti-clock chev" style={{bottom:'11px'}}></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Time In Plant</div><div className="fld-val">05:40</div><i className="ti ti-clock chev" style={{bottom:'11px'}}></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Time Out Plant</div><div className="fld-val">06:05</div><i className="ti ti-clock chev" style={{bottom:'11px'}}></i></div>
          <div className="fld selwrap"><div className="fld-lbl">MMU Load Time</div><div className="fld-val" style={{color:'#9CA3AF',fontWeight:500}}>Select time</div><i className="ti ti-clock chev" style={{bottom:'11px'}}></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Time On Site</div><div className="fld-val">06:32</div><i className="ti ti-clock chev" style={{bottom:'11px'}}></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Time Off Site</div><div className="fld-val" style={{color:'#9CA3AF',fontWeight:500}}>Select time</div><i className="ti ti-clock chev" style={{bottom:'11px'}}></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Travel Time</div><div className="fld-val" style={{color:'#9CA3AF',fontWeight:500}}>Select time</div><i className="ti ti-clock chev" style={{bottom:'11px'}}></i></div>
        </div>
      </div>

      {/* Cup Weights */}
      <div id="sec-cup" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h" style={{justifyContent:'space-between'}}><span style={{display:'flex',alignItems:'center',gap:'8px'}}><i className="ti ti-scale"></i>Cup Weights</span><button className="txtbtn"><i className="ti ti-plus" style={{fontSize:'15px'}}></i>Add Cup Weight</button></div>
        <div className="fld" style={{maxWidth:'220px',marginBottom:'12px'}}><div className="fld-lbl">No. of Cup Weights per MMU</div><input defaultValue="3"/></div>
        <div style={{border:'1px solid #E8EDF3',borderRadius:'11px',overflow:'hidden',background:'#fff'}}>
          <table className="tbl">
            <thead><tr><th>Cup Weight</th><th>Density</th><th>UoM</th><th>Temperature</th><th>UoM</th><th></th></tr></thead>
            <tbody>
              <tr>
                <td style={{fontWeight:700,color:'#1E3A5C'}}>Cup Weight 1</td>
                <td><input className="qty-in" style={{textAlign:'left',width:'78px'}} defaultValue="1.18"/></td>
                <td style={{color:'#6B7280',fontWeight:600}}>kg/l</td>
                <td><input className="qty-in" style={{textAlign:'left',width:'78px'}} defaultValue="31"/></td>
                <td style={{color:'#6B7280',fontWeight:600}}>°C</td>
                <td><button className="delx"><i className="ti ti-trash" style={{fontSize:'14px'}}></i></button></td>
              </tr>
              <tr>
                <td style={{fontWeight:700,color:'#1E3A5C'}}>Cup Weight 2</td>
                <td><input className="qty-in" style={{textAlign:'left',width:'78px'}} defaultValue="1.16"/></td>
                <td style={{color:'#6B7280',fontWeight:600}}>kg/l</td>
                <td><input className="qty-in" style={{textAlign:'left',width:'78px'}} defaultValue="32"/></td>
                <td style={{color:'#6B7280',fontWeight:600}}>°C</td>
                <td><button className="delx"><i className="ti ti-trash" style={{fontSize:'14px'}}></i></button></td>
              </tr>
              <tr>
                <td style={{fontWeight:700,color:'#1E3A5C'}}>Cup Weight 3</td>
                <td><input className="qty-in" style={{textAlign:'left',width:'78px'}} defaultValue="1.19"/></td>
                <td style={{color:'#6B7280',fontWeight:600}}>kg/l</td>
                <td><input className="qty-in" style={{textAlign:'left',width:'78px'}} defaultValue="31"/></td>
                <td style={{color:'#6B7280',fontWeight:600}}>°C</td>
                <td><button className="delx"><i className="ti ti-trash" style={{fontSize:'14px'}}></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Distance */}
      <div id="sec-distance" style={{scrollMarginTop:'8px',marginTop:'24px'}}>
        <div className="sec-h"><i className="ti ti-route"></i>Distance Information</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'11px',marginBottom:'24px',maxWidth:'420px'}}>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">Total Distance</div><input placeholder="0" defaultValue="48"/></div><div className="unitbox">km</div></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">On-site Distance</div><input placeholder="0" defaultValue="3.2"/></div><div className="unitbox">km</div></div>
        </div>
      </div>

      {/* Bulk Mass */}
      <div id="sec-bulk" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-barrel"></i>Bulk Mass Information</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">ANE Used</div><input placeholder="0" defaultValue="32000"/></div><div className="unitbox">kg</div></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">AN Used</div><input placeholder="0" defaultValue="18000"/></div><div className="unitbox">kg</div></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">Road Fuel</div><input placeholder="0" defaultValue="86"/></div><div className="unitbox">l</div></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">Process Fuel</div><input placeholder="0" defaultValue="24"/></div><div className="unitbox">l</div></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">Weight In</div><input placeholder="0" defaultValue="41200"/></div><div className="unitbox">kg</div></div>
          <div style={{display:'flex',gap:'7px'}}><div className="fld" style={{flex:1}}><div className="fld-lbl">Weight Out</div><input placeholder="0" defaultValue="9100"/></div><div className="unitbox">kg</div></div>
        </div>
      </div>

      {/* Notes */}
      <div id="sec-notes" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-note"></i>Notes</div>
        <textarea placeholder="Enter notes (optional)" style={{width:'100%',minHeight:'70px',border:'1.5px solid #E3E8EF',borderRadius:'10px',padding:'11px 13px',fontSize:'13px',color:'#1F2937',outline:'none',resize:'vertical',fontFamily:'inherit'}}></textarea>
      </div>
      <div style={{height:'6px'}}></div>
    </div>
  );
}
