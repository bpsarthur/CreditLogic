export default function ToggleSwitch({ id, label, checked, onChange, required }) {
  return (
    <div className={`toggle-item ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)}>
      <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider" />
      </label>
      <span className="toggle-label">
        {id.toUpperCase()}: {label}
        {required && <span className="tag">Obrigatória</span>}
      </span>
    </div>
  );
}
