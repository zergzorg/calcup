import { getAudioContext } from './useAudioContext';

type Envelope = {
  attack?: number;
  release: number;
  peak: number;
  startOffset?: number;
};

const playTone = (
  freq: number,
  type: OscillatorType,
  startAt: number,
  { attack = 0.05, release, peak, startOffset = 0 }: Envelope
) => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);

  gain.gain.setValueAtTime(0, startAt + startOffset);
  gain.gain.linearRampToValueAtTime(peak, startAt + startOffset + attack);
  gain.gain.exponentialRampToValueAtTime(0.01, startAt + startOffset + release);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startAt + startOffset);
  osc.stop(startAt + startOffset + release + 0.05);
};

// Soft chord — rest begins
export const playBreakStartSound = (): void => {
  try {
    const now = getAudioContext().currentTime;
    [523.25, 659.25].forEach((freq, i) => {
      playTone(freq, 'sine', now, {
        attack: 0.1,
        release: 1.5,
        peak: 0.15,
        startOffset: i * 0.15,
      });
    });
  } catch (e) {
    console.warn('Failed to play break-start sound', e);
  }
};

// Rising triad — rest ends
export const playBreakEndSound = (): void => {
  try {
    const now = getAudioContext().currentTime;
    [440, 554.37, 659.25].forEach((freq, i) => {
      playTone(freq, 'triangle', now, {
        attack: 0.05,
        release: 0.4,
        peak: 0.2,
        startOffset: i * 0.12,
      });
    });
  } catch (e) {
    console.warn('Failed to play break-end sound', e);
  }
};
