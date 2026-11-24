/**
 * Predesigned OneLnk card faces, shared by the homepage "Digital Profile
 * Preview" (DesignerSection) and the create-card wizard's <PhysicalCard>.
 *
 * These are LIVE presets, not static images: each is a background + text colour
 * (+ an optional decorative CSS overlay) applied to the same PhysicalCard, so
 * the visitor's typed name / title / phone still render live in the chosen
 * design — exactly the way the plain colour swatches already reflect.
 */
export interface CardPreset {
  id: string;
  label: string;
  /** CSS background for the card face (solid or gradient). */
  bg: string;
  /** A short representative hex — stored in the ≤32-char `card_color` column
   *  (the gradient `bg` would overflow it); the look is driven by the preset id. */
  solid: string;
  /** Foreground / text colour. */
  fg: string;
  /** Optional title-line colour override (Onyx uses an ember title). */
  titleColor?: string;
  /** Decorative overlay class suffix (see .pcard__overlay--* in CSS). */
  overlay?: 'coral' | 'onyx' | 'violet' | 'cobalt' | null;
}

export const CARD_PRESETS: CardPreset[] = [
  { id: 'coral',  label: 'Coral',  bg: 'linear-gradient(135deg, #FF5B3A, #FF2E74)', solid: '#FF5B3A', fg: '#FFFFFF', overlay: 'coral' },
  { id: 'onyx',   label: 'Onyx',   bg: 'linear-gradient(135deg, #1E1E22, #26262B)', solid: '#1E1E22', fg: '#FFFFFF', titleColor: '#F3801E', overlay: 'onyx' },
  { id: 'violet', label: 'Violet', bg: 'linear-gradient(135deg, #6D28D9, #8B3DEE)', solid: '#6D28D9', fg: '#FFFFFF', overlay: 'violet' },
  { id: 'gold',   label: 'Gold',   bg: 'linear-gradient(135deg, #FFD24A, #FFA51F)', solid: '#FFA51F', fg: '#0A0F16', overlay: null },
  { id: 'teal',   label: 'Teal',   bg: 'linear-gradient(135deg, #12C9A5, #0C9E8E)', solid: '#0C9E8E', fg: '#FFFFFF', overlay: null },
  { id: 'cobalt', label: 'Cobalt', bg: '#2451F5',                                    solid: '#2451F5', fg: '#FFFFFF', overlay: 'cobalt' },
];

export const getCardPreset = (id?: string | null): CardPreset | undefined =>
  id ? CARD_PRESETS.find((p) => p.id === id) : undefined;
