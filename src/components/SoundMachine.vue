<template>
  <div 
    class="sound-machine"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="grill">
      <div class="hidden-display">
        <div class="time-readout">
          {{ hoursDisplay }}<span class="separator">:</span>{{ minutesDisplay }}
        </div>
      </div>
    </div>
    
    <div class="controls">
      <div class="display-panel">
        <canvas ref="canvasRef" class="visualizer" v-show="visualizerActive"></canvas>
        <div class="station-info" v-if="!visualizerActive">
          <div class="station-indicator" v-if="isPlaying">
            ON AIR: {{ currentSoundLabel }}
          </div>
          <div class="station-indicator off" v-else>OFF</div>
        </div>
        <button 
          class="viz-toggle" 
          @click="toggleVisualizer"
          :class="{ active: visualizerActive }"
          title="Toggle Visualizer"
        >
          <div class="bar-icon">
            <span></span><span></span><span></span>
          </div>
        </button>
      </div>
      
      <div class="knobs">
        <div class="tuning-knob">
          <!-- Sound Selection -->
          <button 
            v-for="sound in sounds" 
            :key="sound.id"
            class="channel-btn"
            :class="{ active: currentSoundId === sound.id && isPlaying }"
            @click="selectSound(sound)"
            @mousedown.stop
            @touchstart.stop
          >
            {{ t(sound.labelKey) }}
          </button>
        </div>
        
        <div class="volume-knob-container">
          <div class="fader-scale"></div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            v-model="volume" 
            @input="updateVolume"
            class="volume-slider"
            @mousedown.stop
          />
          <span class="label">VOL</span>
        </div>
        
        <button class="power-btn" :class="{ on: isPlaying }" @click="togglePower" @mousedown.stop>
          <div class="icon">⏻</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, computed } from 'vue';
import { useDraggable } from '../composables/useDraggable';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { position, onMouseDown, onTouchStart } = useDraggable('radio_pos', 50, 50);

const isPlaying = ref(false);
const currentSoundId = ref('white');
const volume = ref(0.5);

interface SoundProfile {
  id: string;
  name: string; // Keep for internal/debug if needed, or remove. keeping for now but unused in display
  labelKey: string;
  type: 'white' | 'pink' | 'brown' | 'stream';
  url?: string;
}

const sounds: SoundProfile[] = [
  { id: 'white', name: 'White Noise', labelKey: 'sounds.white_noise', type: 'white' },
  { id: 'pink', name: 'Rain', labelKey: 'sounds.rain', type: 'pink' },
  { id: 'brown', name: 'Ocean', labelKey: 'sounds.brown_noise', type: 'brown' },
  { id: 'radio-kniga', name: 'Radio Kniga', labelKey: 'sounds.radio_kniga', type: 'stream', url: 'http://bookradio.hostingradio.ru:8069/fm' },
  { id: 'flux-chillhop', name: 'FluxFM Chillhop', labelKey: 'sounds.lofi', type: 'stream', url: 'https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/ '},
];

const currentSoundLabel = computed(() => {
  const sound = sounds.find(s => s.id === currentSoundId.value);
  return sound ? t(sound.labelKey) : '';
});

const visualizerActive = ref(true);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const hoursDisplay = ref('00');
const minutesDisplay = ref('00');

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let sourceNode: AudioBufferSourceNode | null = null;
let streamAudio: HTMLAudioElement | null = null;
let streamSource: MediaElementAudioSourceNode | null = null;
let animationId: number | null = null;
let clockInterval: ReturnType<typeof setInterval> | null = null;

const updateTime = () => {
  const now = new Date();
  hoursDisplay.value = String(now.getHours()).padStart(2, '0');
  minutesDisplay.value = String(now.getMinutes()).padStart(2, '0');
};

onMounted(() => {
  updateTime();
  clockInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  stopAudio();
  if (audioCtx) {
    audioCtx.close();
  }
  if (clockInterval) {
    clearInterval(clockInterval);
  }
});

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    analyser = audioCtx.createAnalyser();
    
    // Configure analyser
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.5;
    
    // Routing: MasterGain -> Analyser -> Destination
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    masterGain.gain.value = volume.value;
  }
};

const createNoiseBuffer = (type: 'white' | 'pink' | 'brown') => {
  if (!audioCtx) return null;
  const bufferSize = 2 * audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = buffer.getChannelData(0);

  if (type === 'white') {
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  } else if (type === 'pink') {
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // (roughly) compensate for gain
      b6 = white * 0.115926;
    }
  } else if (type === 'brown') {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // (roughly) compensate for gain
    }
  }
  return buffer;
};

const playSound = (sound: SoundProfile) => {
  // Stop existing sounds first
  stopAudio(false); 

  initAudio();
  if (!audioCtx || !masterGain || !analyser) return;

  if (sound.type === 'stream' && sound.url) {
    if (!streamAudio) {
      streamAudio = new Audio();
      streamAudio.crossOrigin = "anonymous";
      streamAudio.src = sound.url;
    } else {
      streamAudio.src = sound.url;
    }
    
    // Create MediaElementSource only once per element
    if (!streamSource && streamAudio) {
      try {
        streamSource = audioCtx.createMediaElementSource(streamAudio);
        streamSource.connect(masterGain);
      } catch (e) {
        console.warn('CORS or routing error with stream:', e);
      }
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    streamAudio.play().catch(e => console.error('Error playing stream:', e));
    startVisualizer();
    return;
  }

  // Handle noise generation
  const buffer = createNoiseBuffer(sound.type as 'white' | 'pink' | 'brown');
  if (buffer) {
    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = buffer;
    sourceNode.loop = true;
    sourceNode.connect(masterGain);
    sourceNode.start();
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    startVisualizer();
  }
};

const stopAudio = (fullReset = true) => {
  if (sourceNode) {
    sourceNode.stop();
    sourceNode.disconnect();
    sourceNode = null;
  }
  
  if (streamAudio) {
    streamAudio.pause();
    // Don't clear src immediately to avoid re-buffering lag if just toggling text, 
    // but here we are stopping.
    if (fullReset) {
      // streamAudio.src = ''; 
    }
  }
  
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  // Clear canvas
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
};

const startVisualizer = () => {
  if (!visualizerActive.value || !analyser || !canvasRef.value) return;
  
  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;
  
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  const draw = () => {
    animationId = requestAnimationFrame(draw);
    
    if (!visualizerActive.value) return;

    analyser!.getByteFrequencyData(dataArray);
    
    const width = canvasRef.value!.width;
    const height = canvasRef.value!.height;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = (width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      
      const r = barHeight + 25 * (i/bufferLength);
      const g = 250 * (i/bufferLength);
      const b = 50;
      
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
  };
  
  draw();
};

const toggleVisualizer = () => {
  visualizerActive.value = !visualizerActive.value;
  if (visualizerActive.value && isPlaying.value) {
    startVisualizer();
  }
};


const togglePower = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    const sound = sounds.find(s => s.id === currentSoundId.value) || sounds[0];
    playSound(sound);
    // Start clock if not running (though we play it always now for effect?)
    // Let's just have the clock start when mounted, independent of power?
    // User asked for it 'in the grill', implying it might be there always or only when on.
    // Usually these retro things are "on" if plugged in. Let's start it on mount.
  } else {
    stopAudio();
  }
};

const selectSound = (sound: SoundProfile) => {
  // Toggle off if clicking the same active sound
  if (currentSoundId.value === sound.id && isPlaying.value) {
    togglePower();
    return;
  }

  currentSoundId.value = sound.id;
  isPlaying.value = true;
  playSound(sound);
};

const updateVolume = () => {
  if (streamAudio) {
    streamAudio.volume = volume.value;
  }
};


</script>

<style scoped>
.sound-machine {
  width: 280px;
  background-color: #2c3e50;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 
    10px 10px 20px rgba(0,0,0,0.4),
    inset 0 0 20px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 15px;
  /* Position it on the desk */
  align-self: flex-start; /* Removed as now we use absolute */
  position: absolute;
  cursor: grab;
  z-index: 10;
  transition: transform 0.05s ease-out;
  user-select: none;
}

.sound-machine:active {
  cursor: grabbing;
  z-index: 150;
  box-shadow: 15px 15px 25px rgba(0,0,0,0.5);
}

.grill {
  height: 60px;
  background-color: #000; /* Deep black interior */
  border-radius: 4px;
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.8);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* The mesh texture overlay */
.grill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle, transparent 60%, #34495e 61%) 0 0,
    radial-gradient(circle, transparent 60%, #34495e 61%) 4px 4px;
  background-size: 8px 8px;
  z-index: 2;
  pointer-events: none;
  opacity: 0.9;
}

.hidden-display {
  position: relative;
  z-index: 1; /* Behind the mesh (z-index 2) */
  font-family: 'Courier New', monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transform: translateY(2px);
  width: 100%;
  height: 100%;
}

.time-readout {
  color: #ffaa00; /* Brighter amber */
  font-size: 52px;
  font-weight: bold;
  text-shadow: 
    0 0 15px rgba(255, 170, 0, 1),
    0 0 30px rgba(255, 170, 0, 0.7);
  letter-spacing: 4px;
  line-height: 1;
}

.separator {
  animation: blink 1s step-end infinite;
  display: inline-block;
  margin: 0 -2px;
  position: relative;
  top: -2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.display-panel {
  background: #000;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #555;
  position: relative;
}

.visualizer {
  width: 100%;
  height: 100%;
}

.station-info {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.viz-toggle {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.viz-toggle:hover {
  opacity: 1;
}

.viz-toggle.active {
  opacity: 1;
}

.bar-icon {
  display: flex;
  gap: 1px;
  align-items: flex-end;
  height: 10px;
}

.bar-icon span {
  width: 2px;
  background: #bdc3c7;
  display: block;
}

.bar-icon span:nth-child(1) { height: 40%; }
.bar-icon span:nth-child(2) { height: 100%; }
.bar-icon span:nth-child(3) { height: 60%; }

.station-indicator {
  color: #e74c3c;
  font-family: monospace;
  font-weight: bold;
  text-shadow: 0 0 5px #e74c3c;
  font-size: 14px;
}

.station-indicator.off {
  color: #555;
  text-shadow: none;
}

.knobs {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tuning-knob {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.channel-btn {
  background: #2c3e50;
  border: 1px solid #1a252f;
  color: #7f8c8d;
  font-size: 10px;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
  transition: all 0.15s cubic-bezier(0.4, 0.0, 0.2, 1);
  text-transform: uppercase;
  font-weight: 600;
  box-shadow: 
    0 4px 6px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}

.channel-btn:hover {
  background: #34495e;
  color: #bdc3c7;
  transform: translateY(-1px);
}

.channel-btn:active {
  transform: translateY(1px);
  box-shadow: 
    0 1px 2px rgba(0,0,0,0.3),
    inset 0 1px 4px rgba(0,0,0,0.4);
}

.channel-btn.active {
  background: #e67e22;
  color: #fff;
  border-color: #d35400;
  box-shadow: 
    inset 0 2px 4px rgba(0,0,0,0.3),
    0 0 10px rgba(230, 126, 34, 0.6),
    0 0 20px rgba(230, 126, 34, 0.4);
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  transform: translateY(1px);
}

/* Add a small LED indicator */
.channel-btn::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #555;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);
  transition: all 0.2s;
}

.channel-btn.active::after {
  background-color: #fff;
  box-shadow: 0 0 5px #fff, 0 0 10px #fff;
}



.volume-knob-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 160px;
  position: relative;
  justify-content: flex-end;
  padding-bottom: 20px;
}

.volume-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100px; /* Height of the fader path on screen */
  height: 50px; /* Width of the fader touch area */
  background: transparent;
  transform: rotate(-90deg);
  transform-origin: center;
  position: absolute;
  top: 55px; /* Adjust to center vertically in container */
  cursor: pointer;
  z-index: 10;
}

/* Track (The Slot) - WebKit */
.volume-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 12px;
  background: #000;
  border-radius: 6px;
  box-shadow: 
    inset 0 2px 5px rgba(0,0,0,0.9),
    0 1px 0 rgba(255,255,255,0.1);
  border: 1px solid #111;
}

/* Track (The Slot) - Firefox */
.volume-slider::-moz-range-track {
  width: 100%;
  height: 12px;
  background: #000;
  border-radius: 6px;
  box-shadow: 
    inset 0 2px 5px rgba(0,0,0,0.9),
    0 1px 0 rgba(255,255,255,0.1);
  border: 1px solid #111;
}

/* Track (The Slot) - Firefox */
.volume-slider::-moz-range-track {
  width: 100%;
  height: 12px;
  background: #000;
  border-radius: 6px;
  box-shadow: 
    inset 0 2px 5px rgba(0,0,0,0.9),
    0 1px 0 rgba(255,255,255,0.1);
  border: 1px solid #111;
}

/* Thumb (The Photorealistic Fader Cap) - WebKit */
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  border: none;
  height: 40px; 
  width: 50px;
  border-radius: 1px; /* Slight roundness for realism, but small */
  box-sizing: border-box;
  
  background: 
    repeating-linear-gradient(
      to right,
      transparent 0%,
      transparent 45%,
      rgba(0,0,0,0.4) 48%,
      rgba(0,0,0,0.4) 52%,
      rgba(255,255,255,0.3) 53%,
      transparent 55%,
      transparent 100%
    ),
    linear-gradient(
      to right,
      #555 0%,
      #ecf0f1 10%,
      #bdc3c7 20%,
      #95a5a6 40%,
      #7f8c8d 60%,
      #bdc3c7 80%,
      #ecf0f1 90%,
      #555 100%
    ),
    linear-gradient(
      to bottom,
      #7f8c8d 0%,
      #f1f2f6 50%,
      #7f8c8d 100%
    );
    
  background-blend-mode: multiply, normal, normal;
  
  box-shadow: 
    -5px 0 10px rgba(0,0,0,0.6),
    inset 1px 0 1px rgba(255,255,255,0.4),
    inset -1px 0 1px rgba(0,0,0,0.2);
    
  margin-top: -16px; /* Center it */
  position: relative;
  z-index: 100;
}

/* Thumb (The Photorealistic Fader Cap) - Firefox */
.volume-slider::-moz-range-thumb {
  border: none;
  height: 40px; 
  width: 50px;
  border-radius: 1px;
  box-sizing: border-box;
  
  background: 
    repeating-linear-gradient(
      to right,
      transparent 0%,
      transparent 45%,
      rgba(0,0,0,0.4) 48%,
      rgba(0,0,0,0.4) 52%,
      rgba(255,255,255,0.3) 53%,
      transparent 55%,
      transparent 100%
    ),
    linear-gradient(
      to right,
      #555 0%,
      #ecf0f1 10%,
      #bdc3c7 20%,
      #95a5a6 40%,
      #7f8c8d 60%,
      #bdc3c7 80%,
      #ecf0f1 90%,
      #555 100%
    ),
    linear-gradient(
      to bottom,
      #7f8c8d 0%,
      #f1f2f6 50%,
      #7f8c8d 100%
    );
    
  background-blend-mode: multiply, normal, normal;
  
  box-shadow: 
    -5px 0 10px rgba(0,0,0,0.6),
    inset 1px 0 1px rgba(255,255,255,0.4),
    inset -1px 0 1px rgba(0,0,0,0.2);
    
  position: relative;
  z-index: 100;
}

/* Thumb (The Photorealistic Fader Cap) - Firefox */
.volume-slider::-moz-range-thumb {
  border: none;
  height: 40px; 
  width: 50px;
  border-radius: 1px;
  box-sizing: border-box;
  
  background: 
    repeating-linear-gradient(
      to right,
      transparent 0%,
      transparent 45%,
      rgba(0,0,0,0.4) 48%,
      rgba(0,0,0,0.4) 52%,
      rgba(255,255,255,0.3) 53%,
      transparent 55%,
      transparent 100%
    ),
    linear-gradient(
      to right,
      #555 0%,
      #ecf0f1 10%,
      #bdc3c7 20%,
      #95a5a6 40%,
      #7f8c8d 60%,
      #bdc3c7 80%,
      #ecf0f1 90%,
      #555 100%
    ),
    linear-gradient(
      to bottom,
      #7f8c8d 0%,
      #f1f2f6 50%,
      #7f8c8d 100%
    );
    
  background-blend-mode: multiply, normal, normal;
  
  box-shadow: 
    -5px 0 10px rgba(0,0,0,0.6),
    inset 1px 0 1px rgba(255,255,255,0.4),
    inset -1px 0 1px rgba(0,0,0,0.2);
    
  position: relative;
  z-index: 100;
}

/* Fader Scale Marks */
.fader-scale {
  position: absolute;
  top: 30px; /* Aligned with visual top of rotated slider (55 + 25 - 50 = 30) */
  height: 100px;
  width: 40px;
  background: 
    repeating-linear-gradient(
      to bottom,
      #555,
      #555 1px,
      transparent 1px,
      transparent 10px
    );
  background-size: 8px 100%; /* Only on one side */
  background-repeat: no-repeat;
  background-position: left center;
  opacity: 0.6;
  pointer-events: none;
}

.fader-scale::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 8px;
  background: 
    repeating-linear-gradient(
      to bottom,
      #555,
      #555 1px,
      transparent 1px,
      transparent 10px
    );
}

.label {
  font-size: 10px;
  color: #bdc3c7;
  margin-top: 10px;
  text-transform: uppercase;
  font-weight: bold;
}

.power-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #c0392b;
  box-shadow: 
    0 4px 8px rgba(0,0,0,0.4),
    inset 0 2px 5px rgba(255,255,255,0.2),
    inset 0 -2px 5px rgba(0,0,0,0.2);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  position: relative;
}

.power-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(192, 57, 43, 0.4);
  opacity: 0;
  transition: opacity 0.2s;
}

.power-btn:active {
  transform: scale(0.95);
  box-shadow: 
    0 2px 4px rgba(0,0,0,0.4),
    inset 0 3px 6px rgba(0,0,0,0.4);
}

.power-btn.on {
  background: #27ae60;
  box-shadow: 
    inset 0 2px 5px rgba(255,255,255,0.4),
    0 0 15px rgba(39, 174, 96, 0.8),
    0 0 30px rgba(39, 174, 96, 0.4);
  border: 1px solid #2ecc71;
}

.power-btn.on::after {
  opacity: 1;
  box-shadow: 0 0 20px rgba(39, 174, 96, 0.6);
}

.power-btn .icon {
  color: rgba(255,255,255,0.8);
  font-size: 18px;
}
</style>
