import { useState, useRef, useEffect } from 'react';

export default function DocketSummary({ docket, onSubmit }) {
  const primaryProduct = docket.products.find(p => p.cls === 'BULK') || docket.products[0];
  const [actualQty, setActualQty] = useState(primaryProduct?.actualQty || primaryProduct?.scheduledQty || '');
  const [hasVariance, setHasVariance] = useState(primaryProduct?.actualQty && primaryProduct.actualQty !== primaryProduct.scheduledQty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiverName, setReceiverName] = useState(docket.signature?.signedBy && docket.signature.signedBy !== 'Customer' ? docket.signature.signedBy : '');

  // Signature Pad state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#1E3A5C';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * (canvas.width / rect.width);
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * (canvas.height / rect.height);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * (canvas.width / rect.width);
    const y = ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * (canvas.height / rect.height);
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    ctx.beginPath();
  };

  const handleActualChange = (e) => {
    setActualQty(e.target.value);
    setHasVariance(e.target.value != primaryProduct?.scheduledQty);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/dockets/${docket._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actualQuantities: { [primaryProduct.matNo]: Number(actualQty) },
          signature: { 
            isSigned: true, 
            signedBy: receiverName || 'Customer',
            signatureData: canvasRef.current ? canvasRef.current.toDataURL() : null
          }
        })
      });
      if (response.ok) {
        onSubmit();
      }
    } catch (err) {
      console.error('Submit failed', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="grp-title">Delivery Summary<span style={{fontSize:'11px',fontWeight:600,color:'#9CA3AF'}}>{docket.plant} · {new Date(docket.date).toLocaleDateString()}</span></div>

      {/* Delivery / summary fields */}
      <div id="sec-summary" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-clipboard-list"></i>Delivery Details</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Docket No.</div><div className="fld-val">{docket.docketNo}</div></div>
          <div className="fld"><div className="fld-lbl">Purchase Order No.</div><input defaultValue="PO-2026-991" /></div>
          <div className="fld"><div className="fld-lbl">Date</div><input defaultValue={new Date(docket.date).toLocaleDateString()} /></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Blast No.</div><div className="fld-val">{docket.blastNo}</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Plant</div><div className="fld-val">{docket.plant}</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Scheduled Start</div><div className="fld-val">{docket.scheduledStart} hrs</div></div>
          <div className="fld"><div className="fld-lbl" style={{color:'#E8590C'}}><i className="ti ti-pencil" style={{fontSize:'10px'}}></i>Actual Arrival Time</div><input placeholder="Enter arrival time" defaultValue={docket.actualArrival || ''} /></div>
        </div>
      </div>

      {/* Customer */}
      <div id="sec-customer" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-user-circle"></i>Customer Information</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld fld-ro" style={{gridColumn:'span 2'}}><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Sold-to Customer</div><div className="fld-val">{docket.customerName}</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Ship-to Site</div><div className="fld-val">{docket.site}</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Contract No.</div><div className="fld-val">{docket.contractNo}</div></div>
          <div className="fld"><div className="fld-lbl">Site Contact Person</div><input defaultValue={docket.siteContact} /></div>
          <div className="fld"><div className="fld-lbl">Designation</div><input defaultValue="Mine Manager" /></div>
        </div>
      </div>

      {/* Vehicle */}
      <div id="sec-vehicle" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-truck"></i>Vehicle &amp; Operator Info</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld selwrap"><div className="fld-lbl">Vehicle</div><select defaultValue={docket.vehicleId}><option>{docket.vehicleId}</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Vehicle Type</div><div className="fld-val">{docket.vehicleType}</div></div>
          <div className="fld selwrap" style={{gridColumn:'span 2'}}><div className="fld-lbl">Operators</div><select><option>{docket.operators.join(', ')}</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Blaster / Shotfirer</div><select defaultValue={docket.shotfirer}><option>{docket.shotfirer}</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Surveyor (optional)</div><select><option>Not assigned</option></select><i className="ti ti-chevron-down chev"></i></div>
        </div>
      </div>

      {/* Products */}
      <div id="sec-products" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h" style={{justifyContent:'space-between'}}><span style={{display:'flex',alignItems:'center',gap:'8px'}}><i className="ti ti-package"></i>Products</span><button className="txtbtn"><i className="ti ti-plus" style={{fontSize:'15px'}}></i>Add Product</button></div>
        <div style={{border:'1px solid #E8EDF3',borderRadius:'11px',overflow:'hidden',background:'#fff'}}>
          <table className="tbl">
            <thead><tr><th>Material No.</th><th>Class</th><th>Material Name</th><th style={{textAlign:'right'}}>Sched.</th><th style={{textAlign:'right'}}>Actual</th><th>UoM</th><th></th></tr></thead>
            <tbody>
              {docket.products.map(p => (
                <tr key={p.matNo}>
                  <td style={{fontWeight:700,color:'#1E3A5C',whiteSpace:'nowrap'}}>{p.matNo}</td>
                  <td><span className={`cat-pill ${p.cls === 'BULK' ? 'cat-bulk' : 'cat-ispe'}`}>{p.cls}</span></td>
                  <td style={{fontWeight:600}}>{p.name}</td>
                  <td className="qty-sched">{p.scheduledQty}</td>
                  <td style={{textAlign:'right'}}>
                    {p.cls === 'BULK' ? (
                      <input className={`qty-in ${hasVariance ? 'amber' : ''}`} value={actualQty} onChange={handleActualChange}/>
                    ) : (
                      <input className="qty-in" defaultValue={p.actualQty || p.scheduledQty}/>
                    )}
                  </td>
                  <td style={{color:'#6B7280',fontWeight:600}}>{p.uom}</td>
                  <td><button className="delx"><i className="ti ti-trash" style={{fontSize:'14px'}}></i></button></td>
                </tr>
              ))}
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
            <div style={{fontSize:'14px',fontWeight:800,color:'#1F2937',marginTop:'4px'}}>{docket.operators[0]}</div>
            <div style={{height:'78px',borderRadius:'9px',background:'#F7F9FC',border:'1px solid #EEF2F7',marginTop:'9px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="150" height="46" viewBox="0 0 150 46"><path d="M6 30 C 18 8, 26 8, 32 26 S 46 40, 54 20 S 70 6, 80 28 C 88 40, 98 30, 108 18 C 118 8, 130 14, 144 30" fill="none" stroke="#1E3A5C" strokeWidth="2.2" strokeLinecap="round"/></svg>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'9px',fontSize:'10.5px',color:'#16A34A',fontWeight:700}}><i className="ti ti-circle-check" style={{fontSize:'14px'}}></i>Captured at shift start</div>
          </div>
          {/* received by */}
          <div style={{border:'1.5px solid #E8EDF3',borderRadius:'12px',padding:'14px',background:'#fff'}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'#98A2B2',textTransform:'uppercase',letterSpacing:'.5px'}}>Received By (Customer)</div>
            <input placeholder="Enter receiver's name" disabled={!!docket.signature?.signatureData} value={receiverName} onChange={e => setReceiverName(e.target.value)} style={{width:'100%',border:'1.5px solid #E3E8EF',borderRadius:'8px',padding:'7px 10px',fontSize:'13px',fontWeight:600,color: docket.signature?.signatureData ? '#9CA3AF' : '#1F2937',outline:'none',marginTop:'6px',background: docket.signature?.signatureData ? '#F9FAFB' : '#fff'}}/>
            <div style={{position:'relative',height:'78px',borderRadius:'9px',background:'#fff',border:'1.5px dashed #C3CCD9',marginTop:'9px',overflow:'hidden',touchAction:'none'}}>
              {docket.signature?.signatureData ? (
                <img src={docket.signature.signatureData} style={{width:'100%',height:'100%',objectFit:'contain',padding:'4px'}} alt="Customer Signature" />
              ) : (
                <>
                  {!hasSignature && (
                    <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}><span style={{fontSize:'11.5px',color:'#B0B8C4',fontStyle:'italic'}}>Customer signs here</span></div>
                  )}
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={78}
                    style={{ width: '100%', height: '100%', cursor: 'crosshair', position: 'relative', zIndex: 10 }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </>
              )}
            </div>
            {!docket.signature?.signatureData && (
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'8px'}}>
                <span style={{fontSize:'10.5px',color:'#9CA3AF',fontWeight:600}}></span>
                <button onClick={clearSignature} className="txtbtn" style={{fontSize:'11px',padding:'2px',cursor:'pointer'}}><i className="ti ti-eraser" style={{fontSize:'13px'}}></i>Clear</button>
              </div>
            )}
          </div>
        </div>
        {/* submit button */}
        <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
          <button onClick={handleSubmit} disabled={isSubmitting || docket.status === 'submitted'} style={{padding: '12px 24px', background: docket.status === 'submitted' ? '#AAB4C2' : '#1E3A5C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: docket.status === 'submitted' ? 'not-allowed' : 'pointer'}}>
            {isSubmitting ? 'Submitting...' : docket.status === 'submitted' ? 'Already Submitted' : 'Submit Docket'}
          </button>
        </div>
      </div>
      <div style={{height:'6px'}}></div>
    </div>
  );
}
