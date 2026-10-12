import { create } from 'zustand';
import { defaultTheme, parseTheme, serializeTheme, validateTheme, type MusicTheme } from '@mre/theme-core';

const KEY = 'mre.studio.draft.v1';
function initialDraft(): MusicTheme {
  try { const value = localStorage.getItem(KEY); return value ? parseTheme(value) : defaultTheme(); }
  catch { return defaultTheme(); }
}
interface EditorState {
  draft: MusicTheme; notice: string;
  setDraft(theme: MusicTheme): void;
  updateTheme(patch: Pick<Partial<MusicTheme>, 'name' | 'id'>): void;
  updateTokens(patch: Partial<MusicTheme['tokens']>): void;
  updateComponents(patch: Partial<MusicTheme['components']>): void;
  save(): void;
  setNotice(message: string): void;
}
export const useEditorStore = create<EditorState>((set, get) => ({
  draft: initialDraft(), notice: '',
  setDraft: (draft) => set({ draft: validateTheme(draft), notice: '' }),
  updateTheme: (patch) => set((state) => ({ draft: { ...state.draft, ...patch }, notice: '' })),
  updateTokens: (patch) => set((state) => ({ draft: { ...state.draft, tokens: { ...state.draft.tokens, ...patch } }, notice: '' })),
  updateComponents: (patch) => set((state) => ({ draft: { ...state.draft, components: { ...state.draft.components, ...patch } }, notice: '' })),
  save: () => {
    try { localStorage.setItem(KEY, serializeTheme(get().draft)); set({ notice: 'Borrador guardado en este navegador.' }); }
    catch (error) { set({ notice: error instanceof Error ? error.message : 'No se pudo guardar el borrador.' }); }
  },
  setNotice: (notice) => set({ notice }),
}));
