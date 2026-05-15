// Loaded via <script type="text/babel"> — React is already available globally.

function useTweaks(defaults) {
  const [tweaks, setTweaks] = React.useState(defaults);
  const setTweak = (key, val) => setTweaks(prev => ({ ...prev, [key]: val }));
  return [tweaks, setTweak];
}

function TweaksPanel({ children }) {
  const [open, setOpen] = React.useState(false);

  const panelStyle = {
    position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
    fontFamily: "'DM Mono', monospace",
  };

  const drawerStyle = {
    background: '#F5F0E8',
    border: '1px solid rgba(61,74,46,.18)',
    borderRadius: '4px',
    width: '240px',
    marginBottom: '10px',
    boxShadow: '0 4px 24px rgba(28,28,26,.14)',
    overflow: 'hidden',
  };

  const headerStyle = {
    background: '#3D4A2E',
    color: 'rgba(255,255,255,.65)',
    fontSize: '9px',
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    padding: '8px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const closeBtnStyle = {
    background: 'none', border: 'none',
    color: 'rgba(255,255,255,.45)',
    cursor: 'pointer', fontSize: '13px',
    lineHeight: 1, padding: 0,
  };

  const bodyStyle = {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  };

  const toggleBtnStyle = {
    background: '#3D4A2E',
    color: 'rgba(255,255,255,.72)',
    border: 'none',
    borderRadius: '4px',
    padding: '7px 14px',
    fontSize: '9px',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: "'DM Mono', monospace",
    display: 'block',
    marginLeft: 'auto',
  };

  return (
    <div style={panelStyle}>
      {open && (
        <div style={drawerStyle}>
          <div style={headerStyle}>
            <span>Tweaks</span>
            <button style={closeBtnStyle} onClick={() => setOpen(false)}>✕</button>
          </div>
          <div style={bodyStyle}>{children}</div>
        </div>
      )}
      <button style={toggleBtnStyle} onClick={() => setOpen(o => !o)}>
        {open ? 'Close' : 'Tweaks'}
      </button>
    </div>
  );
}

function TweakSection({ title, children }) {
  return (
    <div>
      <div style={{
        fontSize: '8px', letterSpacing: '.16em',
        textTransform: 'uppercase', color: '#7A7068',
        marginBottom: '8px', fontFamily: "'DM Mono', monospace",
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
}

function TweakColor({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ fontSize: '10px', color: '#1C1C1A' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '9px', color: '#7A7068', fontFamily: "'DM Mono', monospace" }}>{value}</span>
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '26px', height: '22px',
            border: '1px solid rgba(61,74,46,.2)',
            borderRadius: '2px', padding: '1px',
            cursor: 'pointer', background: 'none',
          }}
        />
      </div>
    </div>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <span style={{ fontSize: '10px', color: '#1C1C1A' }}>{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          fontFamily: "'DM Mono', monospace", fontSize: '10px',
          padding: '4px 6px',
          border: '1px solid rgba(61,74,46,.25)',
          borderRadius: '2px',
          background: '#fff', color: '#1C1C1A',
          cursor: 'pointer',
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function TweakSlider({ label, value, min, max, step, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '10px', color: '#1C1C1A' }}>{label}</span>
        <span style={{ fontSize: '9px', color: '#7A7068', fontFamily: "'DM Mono', monospace" }}>{value}px</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#3D4A2E' }}
      />
    </div>
  );
}

function TweakToggle({ label, value, onChange }) {
  const trackStyle = {
    width: '34px', height: '18px',
    borderRadius: '9px', border: 'none',
    background: value ? '#3D4A2E' : 'rgba(61,74,46,.22)',
    cursor: 'pointer', position: 'relative',
    transition: 'background .2s', flexShrink: 0,
    padding: 0,
  };

  const thumbStyle = {
    position: 'absolute',
    top: '2px',
    left: value ? '16px' : '2px',
    width: '14px', height: '14px',
    borderRadius: '50%',
    background: '#fff',
    transition: 'left .2s',
    display: 'block',
    boxShadow: '0 1px 3px rgba(0,0,0,.2)',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ fontSize: '10px', color: '#1C1C1A' }}>{label}</span>
      <button style={trackStyle} onClick={() => onChange(!value)}>
        <span style={thumbStyle} />
      </button>
    </div>
  );
}
