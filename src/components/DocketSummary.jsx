import { useState, useRef, useEffect } from 'react';
import { formatDisplayDate } from '../utils/dateUtils';
import CustomSelect from './CustomSelect';

const FALLBACK_MATERIALS = [
  { id: 'MAT-EMULSION', name: 'Bulk Emulsion', cls: 'BULK', uom: 't' },
  { id: 'MAT-ANFO', name: 'ANFO', cls: 'BULK', uom: 't' },
  { id: 'MAT-ANE', name: 'Ammonium Nitrate Emulsion (ANE)', cls: 'BULK', uom: 't' },
  { id: 'MAT-EDET', name: 'Electronic Detonator', cls: 'IS&PE', uom: 'ea' },
  { id: 'MAT-BOOST', name: 'Boosters', cls: 'IS&PE', uom: 'ea' },
  { id: 'MAT-DCORD', name: 'Detonating Cord 5 g/m', cls: 'IS&PE', uom: 'm' }
];

const SERVICES = [
  { id: 'SVC-SETUP', name: 'Site Service & Setup', uom: 'ea' },
  { id: 'SVC-BMDOP', name: 'BMD Operation Charge', uom: 'hr' },
  { id: 'SVC-FIXED', name: 'Fixed Plant Charge', uom: 'day' },
  { id: 'SVC-BORE', name: 'Bore Tracking / Hole Survey', uom: 'm' },
  { id: 'SVC-MARK', name: 'Blast Mark-Out', uom: 'm' },
  { id: 'SVC-CLEAR', name: 'Blast Clearance & Guarding', uom: 'hr' },
  { id: 'SVC-DTH', name: 'Down-the-hole Loading', uom: 'hr' },
  { id: 'SVC-STEM', name: 'Stemming Service', uom: 'hr' },
  { id: 'SVC-DESIGN', name: 'Blast Design & Consultancy', uom: 'ea' },
  { id: 'SVC-FUME', name: 'Post-Blast Fume Clearance', uom: 'hr' },
  { id: 'SVC-MMU', name: 'MMU Operation', uom: 'hr' }
];

const SERVICE_CATALOG = SERVICES.map(s => ({ ...s, cls: 'SERVICE' }));

let rowCounter = 0;
const nextRowId = (prefix) => `${prefix}-${Date.now()}-${++rowCounter}`;

function toEditableItems(items, defaultCls) {
  return (items || []).map((item, idx) => ({
    _rowId: `${item.matNo || defaultCls}-${idx}`,
    matNo: item.matNo || '',
    name: item.name || '',
    cls: item.cls || defaultCls,
    scheduledQty: item.scheduledQty ?? 0,
    actualQty: item.actualQty !== undefined && item.actualQty !== null ? item.actualQty : (item.scheduledQty ?? 0),
    uom: item.uom || (defaultCls === 'SERVICE' ? 'ea' : 't')
  }));
}

function serializeItems(items) {
  return items.map(({ _rowId, ...rest }) => ({
    ...rest,
    scheduledQty: Number(rest.scheduledQty ?? 0),
    actualQty: Number(rest.actualQty === '' ? 0 : rest.actualQty ?? 0)
  }));
}

function AddLineItemPanel({ itemLabel, catalog, defaultCls, defaultUom, onAdd, onCancel }) {
  const [selectedId, setSelectedId] = useState(catalog[0]?.id || '__custom__');
  const [customName, setCustomName] = useState('');
  const [uom, setUom] = useState(catalog[0]?.uom || defaultUom);
  const [qty, setQty] = useState('1');
  const [error, setError] = useState('');

  const isCustom = selectedId === '__custom__';
  const selectedItem = catalog.find(c => c.id === selectedId);

  useEffect(() => {
    if (selectedId !== '__custom__' && !catalog.some(c => c.id === selectedId)) {
      setSelectedId(catalog[0]?.id || '__custom__');
      setUom(catalog[0]?.uom || defaultUom);
    }
  }, [catalog, selectedId, defaultUom]);

  const handleSelectChange = (val) => {
    setSelectedId(val);
    setError('');
    if (val === '__custom__') {
      setUom(defaultUom);
    } else {
      const found = catalog.find(c => c.id === val);
      if (found) setUom(found.uom);
    }
  };

  const handleConfirm = () => {
    const name = isCustom ? customName.trim() : (selectedItem?.name || '');
    const parsedQty = Number(qty);
    if (!name) {
      setError(`Please enter a ${itemLabel.toLowerCase()} name.`);
      return;
    }
    if (qty === '' || Number.isNaN(parsedQty) || parsedQty < 0) {
      setError('Please enter a valid quantity (0 or greater).');
      return;
    }

    onAdd({
      _rowId: nextRowId(itemLabel),
      matNo: isCustom ? `${defaultCls === 'SERVICE' ? 'SVC' : 'MAT'}-${Date.now()}` : selectedItem.id,
      name,
      cls: isCustom ? defaultCls : (selectedItem?.cls || defaultCls),
      scheduledQty: 0,
      actualQty: parsedQty,
      uom: uom.trim() || defaultUom
    });
  };

  const selectOptions = [
    ...catalog.map(item => ({ value: item.id, label: item.name, badge: item.uom })),
    { value: '__custom__', label: `+ Custom ${itemLabel}…`, isAction: true }
  ];

  return (
    <div style={{marginTop:'10px',background:'#F8FAFC',border:'1.5px solid #D8E3F0',borderRadius:'11px',padding:'12px 14px',animation:'pop .15s ease'}}>
      <div style={{fontSize:'11px',fontWeight:800,color:'#1E3A5C',textTransform:'uppercase',letterSpacing:'.4px',marginBottom:'10px'}}>
        Add {itemLabel}
      </div>
      <div style={{display:'grid',gridTemplateColumns: isCustom ? '1.4fr 1.2fr .75fr .65fr' : '2.2fr .8fr .65fr',gap:'9px',alignItems:'end'}}>
        <CustomSelect
          label={itemLabel}
          value={selectedId}
          options={selectOptions}
          onChange={handleSelectChange}
          searchable
        />
        {isCustom && (
          <div className="fld">
            <div className="fld-lbl">Name</div>
            <input placeholder={`Enter ${itemLabel.toLowerCase()} name`} value={customName} onChange={(e) => { setCustomName(e.target.value); setError(''); }} />
          </div>
        )}
        <div className="fld">
          <div className="fld-lbl">Actual Qty</div>
          <input type="number" min="0" step="any" value={qty} onChange={(e) => { setQty(e.target.value); setError(''); }} />
        </div>
        <div className="fld">
          <div className="fld-lbl">UoM</div>
          <input value={uom} onChange={(e) => setUom(e.target.value)} />
        </div>
      </div>
      {error && <div style={{color:'#DC2626',fontSize:'11px',fontWeight:600,marginTop:'7px'}}>{error}</div>}
      <div style={{display:'flex',justifyContent:'flex-end',gap:'8px',marginTop:'10px'}}>
        <button type="button" className="btn-ghost" style={{padding:'6px 12px',fontSize:'12px'}} onClick={onCancel}>Cancel</button>
        <button type="button" className="btn-navy" style={{padding:'6px 14px',fontSize:'12px'}} onClick={handleConfirm}>Add</button>
      </div>
    </div>
  );
}

export default function DocketSummary({ docket, onSubmit }) {
  const [products, setProducts] = useState(() => toEditableItems(docket.products, 'BULK'));
  const [services, setServices] = useState(() => toEditableItems(docket.services, 'SERVICE'));
  const [materialCatalog, setMaterialCatalog] = useState(FALLBACK_MATERIALS);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddService, setShowAddService] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [receiverName, setReceiverName] = useState(docket.signature?.signedBy && docket.signature.signedBy !== 'Customer' ? docket.signature.signedBy : '');
  const [notes, setNotes] = useState(docket.notes || '');

  // Signature Pad state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const isReadOnly = ['delivered', 'signed', 'submitted'].includes((docket.status || '').toLowerCase());

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

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    fetch(`${API_URL}/api/materials`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMaterialCatalog(data.map(m => ({
            id: m._id,
            name: m.name,
            cls: (m.type || '').toLowerCase() === 'bulk' ? 'BULK' : 'IS&PE',
            uom: m.uom || 't'
          })));
        }
      })
      .catch(() => {
        // Keep fallback material catalog if endpoint is unreachable
      });
  }, []);

  const hasVariance =
    products.some(p => Number(p.actualQty) !== Number(p.scheduledQty)) ||
    services.some(s => Number(s.actualQty) !== Number(s.scheduledQty)) ||
    products.length !== (docket.products || []).length ||
    services.length !== (docket.services || []).length;

  const updateRowQty = (setter, rowId, val) => {
    setter(prev => prev.map(item => (item._rowId === rowId ? { ...item, actualQty: val } : item)));
  };

  const handleAddProduct = (item) => {
    setProducts(prev => [...prev, item]);
    setShowAddProduct(false);
  };

  const handleRemoveProduct = (rowId) => {
    setProducts(prev => prev.filter(item => item._rowId !== rowId));
  };

  const handleAddService = (item) => {
    setServices(prev => [...prev, item]);
    setShowAddService(false);
  };

  const handleRemoveService = (rowId) => {
    setServices(prev => prev.filter(item => item._rowId !== rowId));
  };

  const startDrawing = (e) => {
    if (isReadOnly) return;
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const cleanProducts = serializeItems(products);
      const cleanServices = serializeItems(services);
      const actualQuantities = Object.fromEntries(
        [...cleanProducts, ...cleanServices]
          .filter(item => item.matNo)
          .map(item => [item.matNo, item.actualQty])
      );

      const response = await fetch(`${API_URL}/api/dockets/${docket._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actualQuantities,
          products: cleanProducts,
          services: cleanServices,
          notes,
          signature: {
            isSigned: hasSignature || receiverName.trim().length > 0,
            signedBy: receiverName.trim() || '',
            signatureData: hasSignature && canvasRef.current ? canvasRef.current.toDataURL() : null
          }
        })
      });
      if (response.ok) {
        onSubmit();
      } else {
        const data = await response.json().catch(() => ({}));
        setSubmitError(data.message || `Failed to submit docket (HTTP ${response.status})`);
      }
    } catch (err) {
      console.error('Submit failed', err);
      setSubmitError(err.message || 'Failed to submit docket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = formatDisplayDate(docket.date);

  return (
    <div>
      <div className="grp-title">Delivery Summary<span style={{fontSize:'11px',fontWeight:600,color:'#9CA3AF'}}>{docket.plant} · {formattedDate}</span></div>

      {/* Delivery / summary fields */}
      <div id="sec-summary" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-clipboard-list"></i>Delivery Details</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Docket No.</div><div className="fld-val">{docket.docketNo}</div></div>
          <div className="fld"><div className="fld-lbl">Purchase Order No.</div><input defaultValue="PO-2026-991" /></div>
          <div className="fld"><div className="fld-lbl">Date</div><input defaultValue={formattedDate} /></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Blast No.</div><div className="fld-val">{docket.blastNo}</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Plant</div><div className="fld-val">{docket.plant}</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Scheduled Start</div><div className="fld-val">{docket.scheduledStart} hrs</div></div>
          <div className="fld"><div className="fld-lbl" style={{color:'#E8590C'}}><i className="ti ti-pencil" style={{fontSize:'10px'}}></i>Actual Arrival Time</div><input placeholder="Enter arrival time" defaultValue={docket.actualArrival || ''} disabled={isReadOnly} /></div>
        </div>
      </div>

      {/* Customer */}
      <div id="sec-customer" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-user-circle"></i>Customer Information</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld fld-ro" style={{gridColumn:'span 2'}}><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Sold-to Customer</div><div className="fld-val">{docket.customerName}</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Ship-to Site</div><div className="fld-val">{docket.site}</div></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Contract No.</div><div className="fld-val">{docket.contractNo}</div></div>
          <div className="fld"><div className="fld-lbl">Site Contact Person</div><input defaultValue={docket.siteContact || 'Ramesh Patil'} disabled={isReadOnly} /></div>
          <div className="fld"><div className="fld-lbl">Designation</div><input defaultValue="Mine Manager" disabled={isReadOnly} /></div>
        </div>
      </div>

      {/* Vehicle */}
      <div id="sec-vehicle" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h"><i className="ti ti-truck"></i>Vehicle &amp; Operator Info</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'11px',marginBottom:'24px'}}>
          <div className="fld selwrap"><div className="fld-lbl">Vehicle</div><select defaultValue={docket.vehicleId} disabled={isReadOnly}><option>{docket.vehicleId}</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld fld-ro"><div className="fld-lbl"><i className="ti ti-lock" style={{fontSize:'10px'}}></i>Vehicle Type</div><div className="fld-val">{docket.vehicleType}</div></div>
          <div className="fld selwrap" style={{gridColumn:'span 2'}}><div className="fld-lbl">Operators</div><select disabled={isReadOnly}><option>{(docket.operators || []).join(', ') || 'Not assigned'}</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Blaster / Shotfirer</div><select defaultValue={docket.shotfirer} disabled={isReadOnly}><option>{docket.shotfirer}</option></select><i className="ti ti-chevron-down chev"></i></div>
          <div className="fld selwrap"><div className="fld-lbl">Surveyor (optional)</div><select disabled={isReadOnly}><option>Not assigned</option></select><i className="ti ti-chevron-down chev"></i></div>
        </div>
      </div>

      {/* Products */}
      <div id="sec-products" style={{scrollMarginTop:'8px'}}>
        <div className="sec-h" style={{justifyContent:'space-between'}}>
          <span style={{display:'flex',alignItems:'center',gap:'8px'}}><i className="ti ti-package"></i>Products</span>
          {!isReadOnly && (
            <button type="button" className="txtbtn" onClick={() => setShowAddProduct(v => !v)}>
              <i className="ti ti-plus" style={{fontSize:'15px'}}></i>Add Product
            </button>
          )}
        </div>
        <div style={{border:'1px solid #E8EDF3',borderRadius:'11px',overflow:'hidden',background:'#fff'}}>
          <table className="tbl">
            <thead><tr><th>Material Name</th><th style={{textAlign:'right'}}>Sched.</th><th style={{textAlign:'right'}}>Actual</th><th>UoM</th><th></th></tr></thead>
            <tbody>
              {products.length > 0 ? (
                products.map(p => (
                  <tr key={p._rowId}>
                    <td style={{fontWeight:600}}>{p.name}</td>
                    <td className="qty-sched">{p.scheduledQty}</td>
                    <td style={{textAlign:'right'}}>
                      <input
                        className={`qty-in ${Number(p.actualQty) !== Number(p.scheduledQty) ? 'amber' : ''}`}
                        value={p.actualQty ?? ''}
                        onChange={(e) => updateRowQty(setProducts, p._rowId, e.target.value)}
                        disabled={isReadOnly}
                      />
                    </td>
                    <td style={{color:'#6B7280',fontWeight:600}}>{p.uom}</td>
                    <td>
                      {!isReadOnly && (
                        <button type="button" className="delx" onClick={() => handleRemoveProduct(p._rowId)}>
                          <i className="ti ti-trash" style={{fontSize:'14px'}}></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{textAlign:'center',color:'#9CA3AF',padding:'20px'}}>No products added.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showAddProduct && !isReadOnly && (
          <AddLineItemPanel
            itemLabel="Product"
            catalog={materialCatalog}
            defaultCls="BULK"
            defaultUom="t"
            onAdd={handleAddProduct}
            onCancel={() => setShowAddProduct(false)}
          />
        )}
        {hasVariance && (
          <div style={{marginTop:'11px',background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:'10px',padding:'11px 13px',display:'flex',gap:'10px',animation:'pop .18s ease'}}>
            <i className="ti ti-alert-triangle" style={{fontSize:'18px',color:'#D97706',flexShrink:0}}></i>
            <div><div style={{fontSize:'12px',fontWeight:800,color:'#92400E'}}>Quantity variance detected</div><div style={{fontSize:'11.5px',color:'#B45309',marginTop:'3px',lineHeight:1.5}}>Actual quantity differs from scheduled. Please record the reason in the Notes section below.</div></div>
          </div>
        )}
      </div>

      {/* Services */}
      <div id="sec-services" style={{scrollMarginTop:'8px',marginTop:'24px'}}>
        <div className="sec-h" style={{justifyContent:'space-between'}}>
          <span style={{display:'flex',alignItems:'center',gap:'8px'}}><i className="ti ti-tools"></i>Services</span>
          {!isReadOnly && (
            <button type="button" className="txtbtn" onClick={() => setShowAddService(v => !v)}>
              <i className="ti ti-plus" style={{fontSize:'15px'}}></i>Add Service
            </button>
          )}
        </div>
        <div style={{border:'1px solid #E8EDF3',borderRadius:'11px',overflow:'hidden',background:'#fff'}}>
          <table className="tbl">
            <thead><tr><th>Service Name</th><th style={{textAlign:'right'}}>Sched.</th><th style={{textAlign:'right'}}>Actual</th><th>UoM</th><th></th></tr></thead>
            <tbody>
              {services.length > 0 ? (
                services.map(s => (
                  <tr key={s._rowId}>
                    <td style={{fontWeight:600}}>{s.name}</td>
                    <td className="qty-sched">{s.scheduledQty}</td>
                    <td style={{textAlign:'right'}}>
                      <input
                        className={`qty-in ${Number(s.actualQty) !== Number(s.scheduledQty) ? 'amber' : ''}`}
                        value={s.actualQty ?? ''}
                        onChange={(e) => updateRowQty(setServices, s._rowId, e.target.value)}
                        disabled={isReadOnly}
                      />
                    </td>
                    <td style={{color:'#6B7280',fontWeight:600}}>{s.uom}</td>
                    <td>
                      {!isReadOnly && (
                        <button type="button" className="delx" onClick={() => handleRemoveService(s._rowId)}>
                          <i className="ti ti-trash" style={{fontSize:'14px'}}></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{textAlign:'center',color:'#9CA3AF',padding:'20px'}}>No services scheduled.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showAddService && !isReadOnly && (
          <AddLineItemPanel
            itemLabel="Service"
            catalog={SERVICE_CATALOG}
            defaultCls="SERVICE"
            defaultUom="ea"
            onAdd={handleAddService}
            onCancel={() => setShowAddService(false)}
          />
        )}
      </div>

      {/* Notes */}
      <div style={{marginTop:'24px'}}>
        <div className="sec-h"><i className="ti ti-note"></i>Notes</div>
        <textarea placeholder="Site observations, reasons for quantity variances, special equipment, safety notes…" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={isReadOnly} style={{width:'100%',minHeight:'74px',border:'1.5px solid #E3E8EF',borderRadius:'10px',padding:'11px 13px',fontSize:'13px',color:'#1F2937',outline:'none',resize:'vertical',fontFamily:'inherit', opacity: isReadOnly ? 0.7 : 1}}></textarea>
      </div>

      {/* Signature */}
      <div id="sec-signature" style={{scrollMarginTop:'8px',marginTop:'24px'}}>
        <div className="sec-h"><i className="ti ti-signature"></i>Signature</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          {/* delivered by */}
          <div style={{border:'1.5px solid #E8EDF3',borderRadius:'12px',padding:'14px',background:'#fff'}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'#98A2B2',textTransform:'uppercase',letterSpacing:'.5px'}}>Delivered By</div>
            <div style={{fontSize:'14px',fontWeight:800,color:'#1F2937',marginTop:'4px'}}>{(docket.operators && docket.operators[0]) || 'Operator'}</div>
            <div style={{height:'78px',borderRadius:'9px',background:'#F7F9FC',border:'1px solid #EEF2F7',marginTop:'9px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="150" height="46" viewBox="0 0 150 46"><path d="M6 30 C 18 8, 26 8, 32 26 S 46 40, 54 20 S 70 6, 80 28 C 88 40, 98 30, 108 18 C 118 8, 130 14, 144 30" fill="none" stroke="#1E3A5C" strokeWidth="2.2" strokeLinecap="round"/></svg>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'9px',fontSize:'10.5px',color:'#16A34A',fontWeight:700}}><i className="ti ti-circle-check" style={{fontSize:'14px'}}></i>Captured at shift start</div>
          </div>
          {/* received by */}
          <div style={{border:'1.5px solid #E8EDF3',borderRadius:'12px',padding:'14px',background:'#fff'}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'#98A2B2',textTransform:'uppercase',letterSpacing:'.5px'}}>Received By (Customer)</div>
            <input placeholder="Enter receiver's name" disabled={isReadOnly || !!docket.signature?.signatureData} value={receiverName} onChange={e => setReceiverName(e.target.value)} style={{width:'100%',border:'1.5px solid #E3E8EF',borderRadius:'8px',padding:'7px 10px',fontSize:'13px',fontWeight:600,color: docket.signature?.signatureData ? '#9CA3AF' : '#1F2937',outline:'none',marginTop:'6px',background: docket.signature?.signatureData || isReadOnly ? '#F9FAFB' : '#fff'}}/>
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
            {!docket.signature?.signatureData && !isReadOnly && (
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'8px'}}>
                <span style={{fontSize:'10.5px',color:'#9CA3AF',fontWeight:600}}></span>
                <button type="button" onClick={clearSignature} className="txtbtn" style={{fontSize:'11px',padding:'2px',cursor:'pointer'}}><i className="ti ti-eraser" style={{fontSize:'13px'}}></i>Clear</button>
              </div>
            )}
          </div>
        </div>
        {submitError && (
          <div style={{marginTop:'14px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'9px',padding:'10px 12px',color:'#DC2626',fontSize:'12px',fontWeight:600}}>
            {submitError}
          </div>
        )}
        {/* submit button */}
        <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end'}}>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting || isReadOnly} style={{padding: '12px 24px', background: isReadOnly ? '#AAB4C2' : '#1E3A5C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isReadOnly ? 'not-allowed' : 'pointer'}}>
            {isSubmitting ? 'Submitting...' : isReadOnly ? 'Already Submitted' : 'Submit Docket'}
          </button>
        </div>
      </div>
      <div style={{height:'6px'}}></div>
    </div>
  );
}
