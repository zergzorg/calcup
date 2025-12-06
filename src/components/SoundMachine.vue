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
            :class="{ 
              active: currentSoundId === sound.id && isPlaying,
              loading: currentSoundId === sound.id && isLoading
            }"
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
const isLoading = ref(false);

interface SoundProfile {
  id: string;
  name: string; // Keep for internal/debug if needed, or remove. keeping for now but unused in display
  labelKey: string;
  loader?: boolean; // If true, show loader while buffering
  type: 'audio' | 'stream';
  url?: string;
  loop?: boolean;
}

const sounds: SoundProfile[] = [
  { id: 'white', name: 'Wind', labelKey: 'sounds.white_noise', type: 'audio', url: 'https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/master/audio/wind.mp3', loop: true },
  { id: 'pink', name: 'Rain', labelKey: 'sounds.rain', type: 'audio', url: 'https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/master/audio/rain.mp3', loop: true },
  { id: 'brown', name: 'Ocean', labelKey: 'sounds.brown_noise', type: 'audio', url: 'https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/master/audio/ocean.mp3', loop: true },
  { id: 'forest', name: 'Forest', labelKey: 'sounds.forest', type: 'audio', url: 'https://raw.githubusercontent.com/bradtraversy/ambient-sound-mixer/master/audio/birds.mp3', loop: true },
  { id: 'radio-kniga', name: 'Radio Kniga', labelKey: 'sounds.radio_kniga', type: 'stream', url: 'http://bookradio.hostingradio.ru:8069/fm' },
  { id: 'lofi-girl', name: 'Lofi Girl', labelKey: 'sounds.lofi', type: 'stream', url: 'https://stream.zeno.fm/0r0xa792kwzuv' },
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
let currentAudio: HTMLAudioElement | null = null;
let audioSource: MediaElementAudioSourceNode | null = null;
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

const playSound = async (sound: SoundProfile) => {
  // Останавливаем существующее воспроизведение
  stopAudio(false); 

  initAudio();
  if (!audioCtx || !masterGain || !analyser) return;

  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }

  // Для iOS используем HTMLAudioElement для всех типов звуков
  // Это решает проблему с потерей контекста пользовательского взаимодействия
  if (!sound.url) return;

  isLoading.value = true;

  // Создаём новый Audio элемент для каждого звука
  currentAudio = new Audio();
  currentAudio.crossOrigin = 'anonymous';
  currentAudio.src = sound.url;
  currentAudio.loop = !!sound.loop;
  currentAudio.volume = volume.value;

  // Подключаем к Web Audio API для визуализатора
  try {
    audioSource = audioCtx.createMediaElementSource(currentAudio);
    audioSource.connect(masterGain);
  } catch (e) {
    // Если CORS не позволяет — воспроизводим без визуализатора
    console.warn('CORS error, playing without visualizer:', e);
    currentAudio.volume = volume.value;
  }

  currentAudio.oncanplaythrough = () => {
    isLoading.value = false;
  };

  currentAudio.onerror = () => {
    isLoading.value = false;
    console.error('Error loading audio:', sound.url);
  };

  try {
    await currentAudio.play();
    startVisualizer();
  } catch (e) {
    console.error('Error playing audio:', e);
    isLoading.value = false;
  }
};

const stopAudio = (fullReset = true) => {
  if (currentAudio) {
    currentAudio.pause();
    if (fullReset) {
      currentAudio.src = '';
      currentAudio = null;
      audioSource = null;
    }
  }
  
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  // Очищаем canvas
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
  if (currentAudio) {
    currentAudio.volume = volume.value;
  }
  if (masterGain) {
    masterGain.gain.value = volume.value;
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

.channel-btn.loading {
  cursor: wait;
}

.channel-btn.loading::after {
  background-color: #f1c40f;
  animation: blink-fast 0.5s infinite alternate;
  box-shadow: 0 0 5px #f1c40f;
}

@keyframes blink-fast {
  from { opacity: 0.3; }
  to { opacity: 1; }
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
