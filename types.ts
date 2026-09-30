export type AnimationPreset = 
  | 'neon-laser'      // Outlines draw with neon glowing laser paths
  | 'vortex-reveal'   // Swirling zoom with elastic bounce
  | 'pulse-glow'      // Breathing aura with continuous floating
  | 'ripple-sonar'    // Echoing signal waves spreading outward
  | 'starlight'       // Particle aggregation and flashing backlighting
  | 'glitch-tech';    // Cyberpunk cybernetic glitch sweep

export interface AnimationConfig {
  preset: AnimationPreset;
  speed: number;          // 0.5 to 2.0 (duration multiplier)
  glowIntensity: number;  // 0 to 4 (glowing shadows)
  primaryColor: string;   // Green pin color
  pColor: string;         // Black letter P color
  whiteAccentColor: string; // Inner white arc color
  particlesActive: boolean; // Bursting stars/particles
  soundEnabled: boolean;  // Audio synthesis triggers
  bgGradient: boolean;    // Full page dark ambient gradient vs static solid
  wireframeMode: boolean; // Render pin as outline only
}

export interface SoundPreset {
  frequency: number;
  type: OscillatorType;
  filterFreq: number;
  sweepDelay: number;
  duration: number;
}
