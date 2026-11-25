import { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ label, value, options, onChange, searchable = false, placeholder = 'Select option' }) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const toggleOpen = () => {
    if (!open && wrapRef.current) {
      const rect = wrapRef.current.getBoundingClientRect();
      const scrollContainer = document.getElementById('docketScroll');
      const bottomBound = scrollContainer ? scrollContainer.getBoundingClientRect().bottom : window.innerHeight;
      const spaceBelow = bottomBound - rect.bottom;
      setOpenUpward(spaceBelow < 230 && rect.top > 230);
      setQuery('');
    }
    setOpen(v => !v);
  };

  const filteredOptions = searchable && query.trim()
    ? options.filter(opt => opt.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  return (
    <div ref={wrapRef} className={`cselect ${open ? 'open' : ''}`}>
      <button type="button" className="fld cselect-trigger" onClick={toggleOpen} aria-expanded={open}>
        <div className="fld-lbl">{label}</div>
        <div className="cselect-val">
          <span className="cselect-text">{selectedOption ? selectedOption.label : placeholder}</span>
          {selectedOption?.badge && <span className="cselect-uom">{selectedOption.badge}</span>}
        </div>
        <i className={`ti ti-chevron-down chev cselect-chev ${open ? 'rot' : ''}`}></i>
      </button>

      {open && (
        <div className={`cselect-menu ${openUpward ? 'upward' : ''}`} role="listbox">
          {searchable && options.length > 7 && (
            <div className="cselect-search-wrap">
              <i className="ti ti-search" style={{fontSize:'13px',color:'#9CA3AF'}}></i>
              <input
                className="cselect-search"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          )}
          <div className="cselect-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`cselect-opt ${isSelected ? 'selected' : ''} ${opt.isAction ? 'action' : ''}`}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <span className="cselect-opt-label">{opt.label}</span>
                    <span className="cselect-opt-right">
                      {opt.badge && <span className="cselect-uom">{opt.badge}</span>}
                      {isSelected && <i className="ti ti-check" style={{fontSize:'14px',color:'#1E3A5C'}}></i>}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="cselect-empty">No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
