/**
 * Fine-crafted cinematic synthesizer engine using standard browser Web Audio API.
 * Synthesizes analog sweeps, deep booms, resonant sonars, and sparkling bells
 * strictly in real-time, matching each logo animation state.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    // Standard and vendor-prefixed AudioContext support
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  // Resume if suspended (browser behavior)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCinematicSound(preset: string) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Master Volume node to prevent clipping
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.15, now);
    masterGain.connect(ctx.destination);

    // Filter node for warmth and resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(4, now);
    filter.connect(masterGain);

    if (preset === 'neon-laser' || preset === 'glitch-tech') {
      // Laser Sweep: Resonance sweep down with slight white noise click
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.6);

      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);

      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(now);
      osc.stop(now + 0.61);

      // Add a quick glitch click
      if (preset === 'glitch-tech') {
        const noise = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        noise.type = 'square';
        noise.frequency.setValueAtTime(3000, now);
        noise.frequency.setValueAtTime(150, now + 0.08);

        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        noise.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.start(now);
        noise.stop(now + 0.16);
      }
    } 
    else if (preset === 'vortex-reveal') {
      // Vortex wind-up and chime
      // 1. Bass sweep
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, now);
      subOsc.frequency.exponentialRampToValueAtTime(110, now + 0.8);
      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(0.4, now + 0.4);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      subOsc.connect(subGain);
      subGain.connect(filter);
      subOsc.start(now);
      subOsc.stop(now + 0.81);

      // 2. High sparkle chime at the end of vortex
      const chimeDelay = now + 0.5;
      const chimeFreqs = [523.25, 659.25, 783.99, 1046.50]; // C Major Chord sparkly tones
      chimeFreqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chimeDelay + idx * 0.04);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.1, chimeDelay + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, chimeDelay + 0.8);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(chimeDelay + idx * 0.04);
        osc.stop(chimeDelay + 1);
      });
    } 
    else if (preset === 'pulse-glow') {
      // Warm synthesizer sweeping chord - standard atmospheric pad
      const notes = [110, 165, 220, 275]; // A2, E3, A3, C#4 (Warm major-esque chord)
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        // Slow sweep on filter frequency for deep warmth
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.linearRampToValueAtTime(800, now + 0.6);
        filter.frequency.exponentialRampToValueAtTime(150, now + 1.8);

        osc.connect(gain);
        gain.connect(filter);
        osc.start(now);
        osc.stop(now + 1.81);
      });
    } 
    else if (preset === 'ripple-sonar') {
      // High-end Submarine metallic chime (Sonar)
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1480, now); // high ping
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1485, now); // slight beat frequency detune

      gain.gain.setValueAtTime(0.35, now);
      // Fast drop, but with nice tail
      gain.gain.exponentialRampToValueAtTime(0.05, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      filter.frequency.setValueAtTime(2000, now);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 1.51);
      osc2.stop(now + 1.51);

      // Reverb/Echo simulation - lower delay ping
      const delayOsc = ctx.createOscillator();
      const delayGain = ctx.createGain();
      delayOsc.type = 'sine';
      delayOsc.frequency.setValueAtTime(1480, now + 0.4);
      delayGain.gain.setValueAtTime(0, now);
      delayGain.gain.setValueAtTime(0.08, now + 0.4);
      delayGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      delayOsc.connect(delayGain);
      delayGain.connect(filter);
      delayOsc.start(now + 0.4);
      delayOsc.stop(now + 1.61);
    } 
    else if (preset === 'starlight') {
      // Glisten sound effects - random sparkling chimes
      const sparkleCount = 6;
      for (let i = 0; i < sparkleCount; i++) {
        const timeOffset = now + i * 0.12;
        const noteFreq = 1200 + i * 150 + Math.random() * 80;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, timeOffset);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.08, timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + 0.4);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(timeOffset);
        osc.stop(timeOffset + 0.45);
      }
    }
  } catch (error) {
    console.warn('Web Audio synthesis blocked or unavailable on this system:', error);
  }
}
