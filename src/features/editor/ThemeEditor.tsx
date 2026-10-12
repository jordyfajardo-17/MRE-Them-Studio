import { useRef } from 'react';
import { layouts, navigations, parseTheme, players, serializeTheme, surfaces, themePresets, validateTheme } from '@mre/theme-core';
import { ThemePreview } from './ThemePreview';
import { useEditorStore } from './editor-store';

export function ThemeEditor() {
  const { draft, notice, setDraft, updateTheme, updateTokens, updateComponents, save, setNotice } = useEditorStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const exportTheme = () => {
    try {
      const content = serializeTheme(draft);
      const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${draft.id}.mmetheme.json`;
      anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice('Tema exportado. Puedes pegar su JSON en la pantalla Temas de Player.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Tema no válido.'); }
  };
  const importFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 262_144) { setNotice('El archivo supera el tamaño permitido.'); return; }
    try { setDraft(parseTheme(await file.text())); setNotice('Tema importado y validado.'); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'No se pudo importar el archivo.'); }
  };
  return <>
    <header className="topbar"><div><span className="eyebrow">MRE THEME STUDIO</span><h1>Construye tu identidad.</h1></div>
      <div className="actions"><button onClick={() => fileInput.current?.click()}>Importar</button><button onClick={save}>Guardar borrador</button><button className="primary" onClick={exportTheme}>Exportar tema ↗</button></div>
      <input ref={fileInput} type="file" hidden accept=".json,application/json" onChange={(event) => { void importFile(event.target.files?.[0]); event.target.value = ''; }} />
    </header>
    <div className="editor-layout">
      <aside className="presets"><span className="eyebrow">PUNTO DE PARTIDA</span><h2>Inspiraciones</h2><p>Empieza con un preset y hazlo tuyo.</p>
        {themePresets.map((preset) => <button key={preset.id} aria-pressed={draft.id === preset.id} className="preset-card" onClick={() => setDraft(preset)}><span className="preset-dot" style={{ backgroundColor: preset.tokens.accent }} /><strong>{preset.name}</strong><small>{preset.components.layout} / {preset.components.surface}</small></button>)}
        <div className="studio-footnote"><h3>Un formato compartido</h3><p>Player interpreta el mismo contrato que valida Studio. Glass es una referencia visual; su efecto nativo se probará en dispositivos.</p></div>
      </aside>
      <main className="preview-stage"><div className="preview-label"><span>VISTA PREVIA</span><span>Mobile · demostración</span></div><ThemePreview theme={draft} /><p className="stage-caption">Colores, radios y densidad reaccionan en tiempo real.</p></main>
      <aside className="inspector"><span className="eyebrow">PROPIEDADES</span><h2>Tu tema</h2>
        <label>Nombre<input value={draft.name} maxLength={80} onChange={(event) => updateTheme({ name: event.target.value })} /></label>
        <label>Identificador<input value={draft.id} maxLength={128} onChange={(event) => updateTheme({ id: event.target.value })} /><small>Minúsculas, números, puntos y guiones.</small></label>
        <label>Layout<select value={draft.components.layout} onChange={(event) => updateComponents({ layout: event.target.value as typeof draft.components.layout })}>{layouts.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Superficie<select value={draft.components.surface} onChange={(event) => updateComponents({ surface: event.target.value as typeof draft.components.surface })}>{surfaces.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Navegación<select value={draft.components.navigation} onChange={(event) => updateComponents({ navigation: event.target.value as typeof draft.components.navigation })}>{navigations.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Reproductor<select value={draft.components.player} onChange={(event) => updateComponents({ player: event.target.value as typeof draft.components.player })}>{players.map((value) => <option key={value}>{value}</option>)}</select><small>Se exporta; su renderizador llegará en la siguiente etapa.</small></label>
        <div className="color-grid">{(['accent','background','surface'] as const).map((key) => <label key={key}>{({ accent: 'Acento', background: 'Fondo', surface: 'Superficie' })[key]}<input type="color" value={draft.tokens[key]} onChange={(event) => updateTokens({ [key]: event.target.value })} /></label>)}</div>
        <label>Radio <span>{draft.tokens.radiusDp} dp</span><input type="range" min="0" max="40" value={draft.tokens.radiusDp} onChange={(event) => updateTokens({ radiusDp: Number(event.target.value) })} /></label>
        <label>Blur <span>{Math.round(draft.tokens.blurIntensity * 100)}%</span><input type="range" min="0" max="1" step="0.01" value={draft.tokens.blurIntensity} onChange={(event) => updateTokens({ blurIntensity: Number(event.target.value) })} /><small>Parámetro exportado; efecto nativo pendiente.</small></label>
        <label>Opacidad <span>{Math.round(draft.tokens.surfaceOpacity * 100)}%</span><input type="range" min="0.1" max="1" step="0.01" value={draft.tokens.surfaceOpacity} onChange={(event) => updateTokens({ surfaceOpacity: Number(event.target.value) })} /><small>Parámetro exportado; no representa una licencia ni cambia la reproducción.</small></label>
        <button onClick={() => { try { validateTheme(draft); setNotice('Tema válido para el contrato v1.'); } catch (error) { setNotice(error instanceof Error ? error.message : 'Tema no válido.'); } }}>Validar tema</button>
      </aside>
    </div>
    <footer className="statusbar"><span role="status" aria-live="polite">{notice || 'Borrador local · la publicación y los pagos aún no están conectados.'}</span><span>Formato 1 / Motor 1.0.0</span></footer>
  </>;
}
