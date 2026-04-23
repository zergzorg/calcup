let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

export async function resumeAudioContext(): Promise<void> {
  const c = getAudioContext();
  if (c.state === 'suspended') {
    await c.resume();
  }
}

export function closeAudioContext(): void {
  if (ctx) {
    ctx.close().catch(() => {});
    ctx = null;
  }
}
