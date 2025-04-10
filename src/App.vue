<template>
  <div class="busy-timer">
    <!-- Main timer display -->
    <div class="timer-display">
      <div class="timer-value">{{ formatTime }}</div>
      <div class="timer-mode" :class="currentMode.toLowerCase()">{{ currentMode }}</div>
    </div>

    <!-- Controls -->
    <div class="controls">
      <button class="control-button" @click="toggleTimer" :class="{ active: isActive }">
        {{ isActive ? 'Pause' : 'Start' }}
      </button>
      <button class="control-button" @click="resetTimer">Reset</button>
      <button class="control-button" @click="skipToNext">Skip</button>
    </div>

    <!-- Settings -->
    <div class="settings">
      <div class="setting">
        <label>Work</label>
        <div class="time-input">
          <button @click="decrementWork" :disabled="isActive">-</button>
          <span>{{ workMinutes }}m</span>
          <button @click="incrementWork" :disabled="isActive">+</button>
        </div>
      </div>

      <div class="setting">
        <label>Break</label>
        <div class="time-input">
          <button @click="decrementRest" :disabled="isActive">-</button>
          <span>{{ restMinutes }}m</span>
          <button @click="incrementRest" :disabled="isActive">+</button>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="progress-container">
      <!-- Work segment -->
      <div class="segment work-segment" :class="{ active: currentMode === 'WORK' }">
        <div class="progress-fill" :style="{ width: workProgressWidth + '%' }" v-if="currentMode === 'WORK'"></div>
      </div>

      <!-- Rest segment -->
      <div class="segment rest-segment" :class="{ active: currentMode === 'REST' }">
        <div class="progress-fill" :style="{ width: restProgressWidth + '%' }" v-if="currentMode === 'REST'"></div>
      </div>
    </div>

    <!-- Session counter -->
    <div class="sessions">
      <span>Session {{ completedSessions + 1 }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workMinutes: 25,
      restMinutes: 5,
      currentSeconds: 0,
      totalSeconds: 0,
      timer: null,
      isActive: false,
      isPaused: false,
      currentMode: 'WORK',
      completedSessions: 0
    };
  },

  computed: {
    formatTime() {
      const minutes = Math.floor(this.currentSeconds / 60).toString().padStart(2, '0');
      const seconds = (this.currentSeconds % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    },

    workProgressWidth() {
      if (this.currentMode !== 'WORK') return 0;
      const progress = (1 - (this.currentSeconds / this.totalSeconds)) * 100;
      return progress;
    },

    restProgressWidth() {
      if (this.currentMode !== 'REST') return 0;
      const progress = (1 - (this.currentSeconds / this.totalSeconds)) * 100;
      return progress;
    }
  },

  methods: {
    toggleTimer() {
      if (this.isActive) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    },

    startTimer() {
      if (this.isPaused) {
        this.isPaused = false;
      } else {
        this.setupTimer();
      }

      this.isActive = true;
      this.timer = setInterval(() => {
        if (this.currentSeconds > 0) {
          this.currentSeconds--;
        } else {
          this.switchMode();
        }
      }, 1000);
    },

    pauseTimer() {
      clearInterval(this.timer);
      this.isActive = false;
      this.isPaused = true;
    },

    resetTimer() {
      clearInterval(this.timer);
      this.isActive = false;
      this.isPaused = false;
      this.currentMode = 'WORK';
      this.completedSessions = 0;
      this.setupTimer();
    },

    skipToNext() {
      this.switchMode();
      if (this.isActive) {
        clearInterval(this.timer);
        this.startTimer();
      }
    },

    setupTimer() {
      if (this.currentMode === 'WORK') {
        this.totalSeconds = this.workMinutes * 60;
      } else {
        this.totalSeconds = this.restMinutes * 60;
      }
      this.currentSeconds = this.totalSeconds;
    },

    switchMode() {
      if (this.currentMode === 'WORK') {
        this.currentMode = 'REST';
      } else {
        this.currentMode = 'WORK';
        this.completedSessions++;
      }

      this.setupTimer();
    },

    incrementWork() {
      if (this.workMinutes < 60) {
        this.workMinutes++;
        if (!this.isActive && this.currentMode === 'WORK') {
          this.setupTimer();
        }
      }
    },

    decrementWork() {
      if (this.workMinutes > 1) {
        this.workMinutes--;
        if (!this.isActive && this.currentMode === 'WORK') {
          this.setupTimer();
        }
      }
    },

    incrementRest() {
      if (this.restMinutes < 30) {
        this.restMinutes++;
        if (!this.isActive && this.currentMode === 'REST') {
          this.setupTimer();
        }
      }
    },

    decrementRest() {
      if (this.restMinutes > 1) {
        this.restMinutes--;
        if (!this.isActive && this.currentMode === 'REST') {
          this.setupTimer();
        }
      }
    }
  },

  created() {
    this.setupTimer();
  }
};
</script>

<style scoped>
.busy-timer {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.timer-display {
  text-align: center;
  margin-bottom: 30px;
}

.timer-value {
  font-size: 72px;
  font-weight: 700;
  letter-spacing: -1px;
  margin-bottom: 10px;
}

.timer-mode {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 5px 15px;
  display: inline-block;
  border-radius: 20px;
}

.timer-mode.work {
  background-color: rgba(255, 77, 77, 0.15);
  color: #ff4d4d;
}

.timer-mode.rest {
  background-color: rgba(77, 255, 136, 0.15);
  color: #4dff88;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.control-button {
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  background-color: #f0f0f0;
  color: #333;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-button:hover {
  background-color: #e0e0e0;
}

.control-button.active {
  background-color: #333;
  color: white;
}

.settings {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
}

.setting {
  text-align: center;
}

.setting label {
  display: block;
  font-size: 14px;
  margin-bottom: 10px;
  color: #777;
}

.time-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.time-input button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: #f0f0f0;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.time-input button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.time-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.time-input span {
  font-size: 16px;
  font-weight: 600;
  min-width: 40px;
}

.progress-container {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
}

.segment {
  height: 100%;
  position: relative;
  transition: all 0.3s ease;
}

.work-segment {
  flex: 1;
  background-color: #f0f0f0;
}

.work-segment.active {
  background-color: rgba(255, 77, 77, 0.2);
}

.rest-segment {
  flex: 1;
  background-color: #f0f0f0;
}

.rest-segment.active {
  background-color: rgba(77, 255, 136, 0.2);
}

.progress-fill {
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  transition: width 1s linear;
}

.work-segment .progress-fill {
  background-color: #ff4d4d;
}

.rest-segment .progress-fill {
  background-color: #4dff88;
}

.sessions {
  text-align: center;
  font-size: 14px;
  color: #777;
}
</style>