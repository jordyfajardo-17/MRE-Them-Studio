import type { CSSProperties } from 'react';
import type { MusicTheme } from '@mre/theme-core';
export function ThemePreview({ theme }: { theme: MusicTheme }) {
  const style = { '--theme-bg': theme.tokens.background, '--theme-surface': theme.tokens.surface,
    '--theme-accent': theme.tokens.accent, '--theme-text': theme.tokens.text,
    '--theme-muted': theme.tokens.muted, '--theme-radius': `${theme.tokens.radiusDp}px`,
    '--theme-gap': theme.components.layout === 'dense' ? '8px' : '16px' } as CSSProperties;
  return <div className="phone" style={style} aria-label={`Vista previa de ${theme.name}`}>
    <div className="phone-top"><span>9:41</span><span>MRE</span></div>
    <div className="phone-body"><p className="phone-kicker">TU MÚSICA</p><h2>A tu manera.</h2>
      <div className={`preview-hero surface-${theme.components.surface}`}><span className="disc">◉</span><div><p>MRE Sessions</p><h3>Aurora</h3></div></div>
      <h3>Hecho para ti</h3><div className="preview-tracks">{['Aurora','Orbit','Slow morning'].map((name, index) => <div className="preview-track" key={name}><span>{index + 1}</span><div><strong>{name}</strong><small>MRE Sessions</small></div><span>›</span></div>)}</div>
      <p className="preview-note">Metadata de demostración · sin audio</p>
    </div>
    <div className={`phone-nav ${theme.components.navigation}`}><span className="active">Inicio</span><span>Buscar</span><span>Biblioteca</span><span>Temas</span></div>
  </div>;
}
