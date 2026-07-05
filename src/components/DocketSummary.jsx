import { useState } from 'react';

export default function DocketSummary() {
  const [hasVariance, setHasVariance] = useState(false);
  const [actualQty, setActualQty] = useState('14000');

  const handleActualChange = (e) => {
    setActualQty(e.target.value);
    setHasVariance(e.target.value !== '14000');
  };

  return (
    <div>
      <div className="grp-title">Delivery Summary<span style={{fontSize:'11px',fontWeight:600,color:'#9CA3AF'}}>Panna Plant · 30 Jun 2026</span></div>

      {/* Delivery / summary fields */}
      <div id="sec-summary" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-clipboard-list"></i>Delivery Details</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Docket No.</div><div className="fld-val">DD-94021</div></div>
          <div className="fld"><div className="fld-lbl">Purchase Order No.</div><input defaultValue="PO-2026-991" /></div>
          <div className="fld"><div className="fld-lbl">Date</div><input defaultValue="30/06/2026" /></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Blast No.</div><div className="fld-val">BL-2026-041</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Plant</div><div className="fld-val">1054 — Panna</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Scheduled Start</div><div className="fld-val">06:30 hrs</div></div>
          <div className="fld"><div className="fld-lbl" style={{color:'#E8590C'}}><i className="ti ti-pencil" style={{fontSize:'10px'}}></i>Actual Arrival Time</div><input placeholder="Enter arrival time" defaultValue="06:32" /></div>
        </div>
      </div>

      {/* Customer */}
      <div id="sec-customer" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-user-circle"></i>Customer Information</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld fld-ro" style={{gridColumn:'span 2'}}><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Sold-to Customer</div><div className="fld-val">JK Cement Works — Central &nbsp;·&nbsp; ID 6201</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Ship-to Site</div><div className="fld-val">Panna Pit A</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Contract No.</div><div className="fld-val">C-JKC-24-0117</div></div>
          <div className="fld"><div className="fld-lbl">Site Contact Person</div><input defaultValue="Arjun Singh" /></div>
          <div className="fld"><div className="fld-lbl">Designation</div><input defaultValue="Mine Manager" /></div>
        </div>
      </div>

      {/* Vehicle */}
      <div id="sec-vehicle" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-truck"></i>Vehicle &amp; Operator Info</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld selwrap"><div className="fld-lbl">Vehicle</div><select defaultValue="MH-12-BMD-01"><option>MH-12-BMD-01</option><option>MH-12-BMD-02</option><option>MH-12-BMD-03</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Vehicle Type</div><div className="fld-val">Bulk Mix Truck (BMD)</div></div>
          <div className="fld selwrap" style={{gridColumn:'span 2'}}><div className="fld-lbl">Operators</div><select><option>Ramesh Patil, Anil More</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Blaster / Shotfirer</div><select defaultValue="Mahesh Verma"><option>Mahesh Verma</option><option>Sanjay Mishra</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Surveyor (optional)</div><select><option>Not assigned</option><option>D. Kulkarni</option></select><i className="ti ti-chevron-down chev"></i></div>
        </div>
      </div>

      {/* Products */}
      <div id="sec-products" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h" style={{justifyContent:'space-between'}}><span style={{display:'flex',alignItems:'center',gap:'8px'}}><i className="ti ti-package"></i>Products</span><button className="txtbtn"><i className="ti ti-plus" style={{fontSize:'15px'}}></i>Add Product</button></div>
        <div style={{border:'1px solid #E8EDF3',borderRadius:'11px',overflow:'hidden',background:'#fff'}}>
          <table className="tbl">
            <thead><tr><th>Material No.</th><th>Class</th><th>Material Name</th><th style={{textAlign:'right'}}>Sched.</th><th style={{textAlign:'right'}}>Actual</th><th>UoM</th><th></th></tr></thead>
            <tbody>
              <tr>
                <td style={{fontWeight:700,color:'#1E3A5C',whiteSpace:'nowrap'}}>MAT-8001</td>
                <td><span className="cat-pill cat-bulk">BULK</span></td>
                <td style={{fontWeight:600}}>Ammonium Nitrate Porous Prill</td>
                <td className="qty-sched">14000</td>
                <td style={{textAlign:'right'}}><input className={`qty-in ${hasVariance ? 'amber' : ''}`} value={actualQty} onChange={handleActualChange}/></td>
                <td style={{color:'#6B7280',fontWeight:600}}>KG</td>
                <td><button className="delx"><i className="ti ti-trash" style={{fontSize:'14px'}}></i></button></td>
              </tr>
              <tr>
                <td style={{fontWeight:700,color:'#1E3A5C',whiteSpace:'nowrap'}}>MAT-2104</td>
                <td><span className="cat-pill cat-ispe">ISPE</span></td>
                <td style={{fontWeight:600}}>Non-Electric Detonator 500ms</td>
                <td className="qty-sched">120</td>
                <td style={{textAlign:'right'}}><input className="qty-in" defaultValue="120"/></td>
                <td style={{color:'#6B7280',fontWeight:600}}>EA</td>
                <td><button className="delx"><i className="ti ti-trash" style={{fontSize:'14px'}}></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
        {hasVariance && (
          <div style={{marginTop:'11px',background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:'10px',padding:'11px 13px',display:'flex',gap:'10px',animation:'pop .18s ease'}}>
            <i className="ti ti-alert-triangle" style={{fontSize:'18px',color:'#D97706',flexShrink:0}}></i>
            <div><div style={{fontSize:'12px',fontWeight:800,color:'#92400E'}}>Quantity variance detected</div><div style={{fontSize:'11.5px',color:'#B45309',marginTop:'3px',lineHeight:1.5}}>Actual quantity differs from scheduled. Please record the reason in the Notes section below.</div></div>
          </div>
        )}
      </div>

      {/* Services */}
      <div id="sec-services" style={{scrollMarginTop:'8px',marginTop:'24px'}}>
        <div className="sec-h" style={{justifyContent:'space-between'}}><span style={{display:'flex',alignItems:'center',gap:'8px'}}><i className="ti ti-tools"></i>Services</span><button className="txtbtn"><i className="ti ti-plus" style={{fontSize:'15px'}}></i>Add Service</button></div>
        <div style={{border:'1px solid #E8EDF3',borderRadius:'11px',overflow:'hidden',background:'#fff'}}>
          <table className="tbl">
            <thead><tr><th>Material No.</th><th>Service Name</th><th style={{textAlign:'right'}}>Sched.</th><th style={{textAlign:'right'}}>Actual</th><th>UoM</th><th></th></tr></thead>
            <tbody>
              <tr>
                <td style={{fontWeight:700,color:'#1E3A5C',whiteSpace:'nowrap'}}>SRV-901</td>
                <td style={{fontWeight:600}}>Pump Charge Service</td>
                <td className="qty-sched">1</td>
                <td style={{textAlign:'right'}}><input className="qty-in" defaultValue="1"/></td>
                <td style={{color:'#6B7280',fontWeight:600}}>HR</td>
                <td><button className="delx"><i className="ti ti-trash" style={{fontSize:'14px'}}></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div style={{marginTop:'24px'}}>
        <div className="sec-h"><i className="ti ti-note"></i>Notes</div>
        <textarea placeholder="Site observations, reasons for quantity variances, special equipment, safety notes…" style={{width:'100%',minHeight:'74px',border:'1.5px solid #E3E8EF',borderRadius:'10px',padding:'11px 13px',fontSize:'13px',color:'#1F2937',outline:'none',resize:'vertical',fontFamily:'inherit'}}></textarea>
      </div>

      {/* Signature */}
      <div id="sec-signature" style={{scrollMarginTop:'8px',marginTop:'24px'}}>
        <div className="sec-h"><i className="ti ti-signature"></i>Signature</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          {/* delivered by */}
          <div style={{border:'1.5px solid #E8EDF3',borderRadius:'12px',padding:'14px',background:'#fff'}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'#98A2B2',textTransform:'uppercase',letterSpacing:'.5px'}}>Delivered By</div>
            <div style={{fontSize:'14px',fontWeight:800,color:'#1F2937',marginTop:'4px'}}>Ramesh Patil</div>
            <div style={{height:'78px',borderRadius:'9px',background:'#F7F9FC',border:'1px solid #EEF2F7',marginTop:'9px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="150" height="46" viewBox="0 0 150 46"><path d="M6 30 C 18 8, 26 8, 32 26 S 46 40, 54 20 S 70 6, 80 28 C 88 40, 98 30, 108 18 C 118 8, 130 14, 144 30" fill="none" stroke="#1E3A5C" strokeWidth="2.2" strokeLinecap="round"/></svg>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'9px',fontSize:'10.5px',color:'#16A34A',fontWeight:700}}><i className="ti ti-circle-check" style={{fontSize:'14px'}}></i>Captured at shift start · 30 Jun 05:40</div>
          </div>
          {/* received by */}
          <div style={{border:'1.5px solid #E8EDF3',borderRadius:'12px',padding:'14px',background:'#fff'}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'#98A2B2',textTransform:'uppercase',letterSpacing:'.5px'}}>Received By (Customer)</div>
            <input placeholder="Enter receiver's name" style={{width:'100%',border:'1.5px solid #E3E8EF',borderRadius:'8px',padding:'7px 10px',fontSize:'13px',fontWeight:600,color:'#1F2937',outline:'none',marginTop:'6px'}}/>
            <div style={{position:'relative',height:'78px',borderRadius:'9px',background:'#fff',border:'1.5px dashed #C3CCD9',marginTop:'9px',overflow:'hidden',touchAction:'none'}}>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}><span style={{fontSize:'11.5px',color:'#B0B8C4',fontStyle:'italic'}}>Customer signs here</span></div>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'8px'}}>
              <span style={{fontSize:'10.5px',color:'#9CA3AF',fontWeight:600}}></span>
              <button className="txtbtn" style={{fontSize:'11px',padding:'2px'}}><i className="ti ti-eraser" style={{fontSize:'13px'}}></i>Clear</button>
            </div>
          </div>
        </div>
        {/* customer not present */}
        <label style={{display:'flex',gap:'10px',alignItems:'flex-start',marginTop:'13px',cursor:'pointer',background:'#F7F9FC',border:'1.5px solid #E8EDF3',borderRadius:'11px',padding:'12px 14px'}}>
          <span style={{width:'19px',height:'19px',borderRadius:'5px',border:'2px solid #D8E0EA',background:'#fff',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',marginTop:'1px'}}></span>
          <span><span style={{fontSize:'12.5px',fontWeight:700,color:'#1F2937'}}>Customer not present on site?</span><span style={{fontSize:'11.5px',color:'#6B7280',display:'block',marginTop:'2px',lineHeight:1.5}}>Submit without on-site signature and email the customer a portal link to sign digitally.</span></span>
        </label>
      </div>
      <div style={{height:'6px'}}></div>
    </div>
  );
}
