export default function Header() {
  return (
    <header style={{background:'#0F2440',padding:'14px 18px 13px',flexShrink:0}}>
      <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
        <div style={{width:'34px',height:'34px',borderRadius:'9px',background:'#E8590C',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:800,color:'#fff',flexShrink:0}}>FOI</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:'14px',fontWeight:800,color:'#fff',letterSpacing:'-.2px'}}>Field Ops Intelligence</div>
          <div style={{fontSize:'10.5px',color:'#8493AB',fontWeight:600,marginTop:'1px'}}>Operator Delivery Docket</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.09)',borderRadius:'9px',padding:'6px 11px'}}>
          <i className="ti ti-building-factory-2" style={{fontSize:'15px',color:'#E8590C'}}></i>
          <span style={{fontSize:'12px',fontWeight:700,color:'#fff'}}>Panna Plant — 2026</span>
          <i className="ti ti-chevron-down" style={{fontSize:'13px',color:'#7E8CA3'}}></i>
        </div>
      </div>
      {/* context strip */}
      <div style={{display:'flex',alignItems:'stretch',gap:'10px',marginTop:'12px'}}>
        <div style={{flex:1,background:'rgba(255,255,255,.06)',borderRadius:'10px',padding:'9px 12px',display:'flex',alignItems:'center',gap:'10px',border:'1px solid rgba(255,255,255,.07)'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#1E3A5C',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:800,color:'#fff',flexShrink:0}}>RP</div>
          <div style={{minWidth:0}}><div style={{fontSize:'12.5px',fontWeight:700,color:'#fff',lineHeight:1.1}}>Ramesh Patil</div><div style={{fontSize:'10px',color:'#8493AB',marginTop:'2px'}}>BMD Operator</div></div>
        </div>
        <div style={{flex:1,background:'rgba(232,89,12,.13)',border:'1px solid rgba(232,89,12,.3)',borderRadius:'10px',padding:'9px 12px',display:'flex',alignItems:'center',gap:'10px'}}>
          <i className="ti ti-truck" style={{fontSize:'20px',color:'#E8590C',flexShrink:0}}></i>
          <div style={{minWidth:0}}><div style={{fontSize:'9px',fontWeight:700,color:'#E9A876',textTransform:'uppercase',letterSpacing:'.5px'}}>Your vehicle today</div><div style={{fontSize:'12.5px',fontWeight:800,color:'#fff',marginTop:'1px'}}>MH-12-BMD-01</div></div>
        </div>
      </div>
    </header>
  );
}
