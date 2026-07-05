export default function BottomNav() {
  return (
    <nav style={{background:'#fff',borderTop:'1px solid #E8EDF3',display:'flex',alignItems:'stretch',flexShrink:0,paddingBottom:'4px'}}>
      <button className="bnav on"><i className="ti ti-calendar-week"></i>Schedule</button>
      <button className="bnav"><i className="ti ti-files"></i>My Dockets<span className="badge">2</span></button>
      <button className="bnav"><i className="ti ti-bell"></i>Alerts</button>
      <button className="bnav"><i className="ti ti-user"></i>Profile</button>
    </nav>
  );
}
