<template>
  <div
    class="snake-widget"
    :style="{ transform: `translate(${position.x}px, ${position.y}px)`, zIndex }"
    @mousedown.capture="activateWidget"
    @touchstart.capture="activateWidget"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="snake-shell">
      <header class="snake-header">
        <div>
          <p class="eyebrow">{{ t('snake.title') }}</p>
          <h2>{{ statusText }}</h2>
        </div>

        <div class="score-stack">
          <span>{{ t('snake.score') }}</span>
          <strong>{{ score }}</strong>
        </div>
      </header>

      <div
        ref="boardRef"
        class="snake-board"
        tabindex="0"
        :aria-label="t('snake.board')"
        @keydown.prevent="handleKeydown"
        @mousedown.stop
        @touchstart.stop
      >
        <div class="scanline"></div>
        <div
          v-for="cell in cells"
          :key="cell.index"
          class="snake-cell"
          :class="cell.className"
        ></div>
      </div>

      <div class="snake-toolbar" @mousedown.stop @touchstart.stop>
        <button class="primary-btn" @click="toggleGame">
          {{ primaryActionLabel }}
        </button>
        <button class="ghost-btn" @click="resetGame">
          {{ t('snake.reset') }}
        </button>

        <label class="name-field">
          <span>{{ t('snake.player') }}</span>
          <input v-model="playerName" maxlength="12" :placeholder="t('snake.player_placeholder')" />
        </label>
      </div>

      <div class="mobile-controls" @mousedown.stop @touchstart.stop>
        <button :aria-label="t('snake.up')" @click="setDirection('up')">▲</button>
        <div>
          <button :aria-label="t('snake.left')" @click="setDirection('left')">◀</button>
          <button :aria-label="t('snake.down')" @click="setDirection('down')">▼</button>
          <button :aria-label="t('snake.right')" @click="setDirection('right')">▶</button>
        </div>
      </div>

      <section class="records-panel" @mousedown.stop @touchstart.stop>
        <div class="records-title">
          <span>{{ t('snake.records') }}</span>
          <button class="clear-records" @click="clearRecords">{{ t('snake.clear_records') }}</button>
        </div>

        <ol v-if="records.length" class="records-list">
          <li v-for="record in records" :key="record.id">
            <span class="record-name">{{ record.name }}</span>
            <strong>{{ record.score }}</strong>
            <time>{{ formatRecordDate(record.date) }}</time>
          </li>
        </ol>
        <p v-else class="empty-records">{{ t('snake.no_records') }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useDraggable } from '../composables/useDraggable';
import { useI18n } from 'vue-i18n';

type Direction = 'up' | 'down' | 'left' | 'right';
type GameStatus = 'idle' | 'running' | 'paused' | 'gameover';

interface Point {
  x: number;
  y: number;
}

interface SnakeRecord {
  id: string;
  name: string;
  score: number;
  date: string;
}

const BOARD_SIZE = 18;
const TICK_MS = 132;
const RECORDS_KEY = 'calcup_snake_records';
const PLAYER_KEY = 'calcup_snake_player';
const START_SNAKE: Point[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
];

const { t, locale } = useI18n();
const { position, zIndex, activateWidget, onMouseDown, onTouchStart } = useDraggable('snake_pos', 930, 72);

const boardRef = ref<HTMLElement | null>(null);
const snake = ref<Point[]>([...START_SNAKE]);
const food = ref<Point>({ x: 12, y: 9 });
const direction = ref<Direction>('right');
const queuedDirection = ref<Direction>('right');
const status = ref<GameStatus>('idle');
const score = ref(0);
const records = ref<SnakeRecord[]>([]);
const playerName = ref('PLAYER');

let tickId: number | null = null;

const oppositeDirections: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const statusText = computed(() => {
  if (status.value === 'running') return t('snake.running');
  if (status.value === 'paused') return t('snake.paused');
  if (status.value === 'gameover') return t('snake.gameover');
  return t('snake.ready');
});

const primaryActionLabel = computed(() => {
  if (status.value === 'running') return t('snake.pause');
  if (status.value === 'paused') return t('snake.resume');
  if (status.value === 'gameover') return t('snake.play_again');
  return t('snake.start');
});

const cells = computed(() => {
  const head = snake.value[0];
  const bodyKeys = new Set(snake.value.slice(1).map(pointKey));
  const foodKey = pointKey(food.value);
  const headKey = pointKey(head);

  return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);
    const key = `${x}:${y}`;
    let className = '';

    if (key === foodKey) className = 'food';
    if (bodyKeys.has(key)) className = 'snake';
    if (key === headKey) className = 'snake head';

    return { index, className };
  });
});

const pointKey = (point: Point) => `${point.x}:${point.y}`;

const cloneStartSnake = () => START_SNAKE.map((point) => ({ ...point }));

const normalizePlayerName = (name: string) => {
  const trimmed = name.trim();
  return trimmed || 'PLAYER';
};

const loadRecords = () => {
  try {
    const storedRecords = localStorage.getItem(RECORDS_KEY);
    const storedPlayer = localStorage.getItem(PLAYER_KEY);

    if (storedRecords) {
      records.value = JSON.parse(storedRecords).slice(0, 10);
    }

    if (storedPlayer) {
      playerName.value = storedPlayer;
    }
  } catch (e) {
    console.warn('Failed to load snake records', e);
  }
};

const saveRecords = () => {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records.value.slice(0, 10)));
};

const randomFood = (snakeBody: Point[]) => {
  const occupied = new Set(snakeBody.map(pointKey));
  const freeCells: Point[] = [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const point = { x, y };
      if (!occupied.has(pointKey(point))) {
        freeCells.push(point);
      }
    }
  }

  return freeCells[Math.floor(Math.random() * freeCells.length)] ?? { x: 0, y: 0 };
};

const saveRecord = () => {
  if (score.value <= 0) return;

  records.value = [
    {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: normalizePlayerName(playerName.value),
      score: score.value,
      date: new Date().toISOString(),
    },
    ...records.value,
  ]
    .sort((a, b) => b.score - a.score || a.date.localeCompare(b.date))
    .slice(0, 10);

  saveRecords();
};

const stopTicker = () => {
  if (tickId !== null) {
    window.clearInterval(tickId);
    tickId = null;
  }
};

const startTicker = () => {
  stopTicker();
  tickId = window.setInterval(tick, TICK_MS);
};

const resetGame = () => {
  stopTicker();
  snake.value = cloneStartSnake();
  direction.value = 'right';
  queuedDirection.value = 'right';
  score.value = 0;
  food.value = randomFood(snake.value);
  status.value = 'idle';
  nextTick(() => boardRef.value?.focus());
};

const startGame = () => {
  if (status.value === 'gameover') {
    snake.value = cloneStartSnake();
    direction.value = 'right';
    queuedDirection.value = 'right';
    score.value = 0;
    food.value = randomFood(snake.value);
  }

  status.value = 'running';
  startTicker();
  nextTick(() => boardRef.value?.focus());
};

const pauseGame = () => {
  status.value = 'paused';
  stopTicker();
};

const toggleGame = () => {
  if (status.value === 'running') {
    pauseGame();
    return;
  }

  startGame();
};

const setDirection = (nextDirection: Direction) => {
  if (oppositeDirections[nextDirection] === direction.value) return;
  queuedDirection.value = nextDirection;
  nextTick(() => boardRef.value?.focus());
};

const handleKeydown = (event: KeyboardEvent) => {
  const keyMap: Record<string, Direction> = {
    ArrowUp: 'up',
    KeyW: 'up',
    ArrowDown: 'down',
    KeyS: 'down',
    ArrowLeft: 'left',
    KeyA: 'left',
    ArrowRight: 'right',
    KeyD: 'right',
  };

  if (event.code === 'Space') {
    toggleGame();
    return;
  }

  const nextDirection = keyMap[event.code];
  if (nextDirection) setDirection(nextDirection);
};

const tick = () => {
  direction.value = queuedDirection.value;

  const head = snake.value[0];
  const nextHead = { ...head };

  if (direction.value === 'up') nextHead.y -= 1;
  if (direction.value === 'down') nextHead.y += 1;
  if (direction.value === 'left') nextHead.x -= 1;
  if (direction.value === 'right') nextHead.x += 1;

  const ateFood = nextHead.x === food.value.x && nextHead.y === food.value.y;
  const bodyForCollision = ateFood ? snake.value : snake.value.slice(0, -1);
  const hitWall = nextHead.x < 0 || nextHead.x >= BOARD_SIZE || nextHead.y < 0 || nextHead.y >= BOARD_SIZE;
  const hitSelf = bodyForCollision.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

  if (hitWall || hitSelf) {
    status.value = 'gameover';
    stopTicker();
    saveRecord();
    return;
  }

  const nextSnake = [nextHead, ...snake.value];

  if (ateFood) {
    score.value += 10;
    food.value = randomFood(nextSnake);
  } else {
    nextSnake.pop();
  }

  snake.value = nextSnake;
};

const clearRecords = () => {
  records.value = [];
  saveRecords();
};

const formatRecordDate = (date: string) => {
  return new Intl.DateTimeFormat(locale.value, {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(date));
};

watch(playerName, (name) => {
  localStorage.setItem(PLAYER_KEY, name);
});

onMounted(() => {
  loadRecords();
  food.value = randomFood(snake.value);
});

onUnmounted(() => {
  stopTicker();
});
</script>

<style scoped>
.snake-widget {
  position: absolute;
  z-index: 110;
  width: 404px;
  cursor: grab;
  user-select: none;
  transition: transform 0.05s ease-out;
}

.snake-widget:active {
  cursor: grabbing;
  z-index: 160;
}

.snake-shell {
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background:
    linear-gradient(145deg, rgba(25, 31, 29, 0.98), rgba(10, 14, 13, 0.97)),
    repeating-linear-gradient(90deg, transparent 0 16px, rgba(255, 255, 255, 0.026) 17px);
  box-shadow:
    0 26px 60px rgba(0, 0, 0, 0.36),
    0 8px 18px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.snake-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}

.eyebrow {
  margin: 0 0 4px;
  color: rgba(197, 255, 179, 0.55);
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: #f1f7e8;
  font-family: 'SF Pro Display', 'Inter', system-ui, sans-serif;
  font-size: 25px;
  font-weight: 760;
  line-height: 1.05;
}

.score-stack {
  min-width: 82px;
  padding: 8px 10px;
  border: 1px solid rgba(197, 255, 179, 0.18);
  border-radius: 8px;
  background: rgba(197, 255, 179, 0.08);
  text-align: right;
}

.score-stack span {
  display: block;
  color: rgba(255, 255, 255, 0.48);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.score-stack strong {
  display: block;
  color: #d6ff75;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 24px;
  line-height: 1;
}

.snake-board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  grid-template-rows: repeat(18, 1fr);
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid rgba(197, 255, 179, 0.22);
  border-radius: 8px;
  background:
    radial-gradient(circle at 28% 18%, rgba(214, 255, 117, 0.12), transparent 22%),
    linear-gradient(180deg, rgba(12, 38, 21, 0.98), rgba(3, 17, 9, 0.98));
  box-shadow:
    inset 0 0 28px rgba(0, 0, 0, 0.42),
    inset 0 0 0 1px rgba(255, 255, 255, 0.035);
  outline: none;
}

.snake-board:focus-visible {
  box-shadow:
    0 0 0 3px rgba(214, 255, 117, 0.24),
    inset 0 0 28px rgba(0, 0, 0, 0.42);
}

.scanline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 8px);
  mix-blend-mode: screen;
  opacity: 0.45;
}

.snake-cell {
  position: relative;
  min-width: 0;
  min-height: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.018);
  border-bottom: 1px solid rgba(255, 255, 255, 0.018);
}

.snake-cell.snake::before,
.snake-cell.food::before {
  content: '';
  position: absolute;
  inset: 18%;
  border-radius: 4px;
}

.snake-cell.snake::before {
  background: linear-gradient(145deg, #d9ff76, #58d66a);
  box-shadow: 0 0 12px rgba(138, 255, 97, 0.44);
}

.snake-cell.head::before {
  inset: 12%;
  background: linear-gradient(145deg, #f4ffd0, #95ff68);
  box-shadow: 0 0 18px rgba(196, 255, 82, 0.72);
}

.snake-cell.food::before {
  inset: 22%;
  border-radius: 50%;
  background: #ff716d;
  box-shadow: 0 0 16px rgba(255, 113, 109, 0.78);
}

.snake-toolbar {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  gap: 8px;
  align-items: stretch;
  margin-top: 12px;
}

.primary-btn,
.ghost-btn,
.clear-records,
.mobile-controls button {
  min-height: 40px;
  border-radius: 8px;
  font-family: 'SF Pro Text', 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 800;
}

.primary-btn {
  border: 1px solid rgba(214, 255, 117, 0.36);
  background: rgba(214, 255, 117, 0.15);
  color: #e8ffad;
}

.ghost-btn,
.clear-records,
.mobile-controls button {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.82);
}

.primary-btn:hover,
.ghost-btn:hover,
.clear-records:hover,
.mobile-controls button:hover {
  border-color: rgba(214, 255, 117, 0.38);
}

.name-field {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 40px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.045);
}

.name-field span {
  color: rgba(255, 255, 255, 0.44);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.name-field input {
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.92);
  font: 800 12px 'SF Mono', 'Roboto Mono', monospace;
  text-transform: uppercase;
}

.mobile-controls {
  display: none;
  place-items: center;
  gap: 6px;
  margin-top: 10px;
}

.mobile-controls div {
  display: flex;
  gap: 6px;
}

.mobile-controls button {
  width: 44px;
  padding: 0;
}

.records-panel {
  margin-top: 12px;
}

.records-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.records-title span {
  color: rgba(255, 255, 255, 0.52);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.clear-records {
  min-height: 28px;
  padding: 0 9px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 10px;
}

.records-list {
  display: grid;
  gap: 4px;
  max-height: 160px;
  margin: 0;
  padding: 0;
  overflow: auto;
  list-style: none;
}

.records-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 10px;
  align-items: center;
  min-height: 28px;
  padding: 0 9px;
  border-radius: 7px;
  background: rgba(255, 255, 255, 0.045);
  color: rgba(255, 255, 255, 0.76);
  font-size: 12px;
}

.record-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 760;
}

.records-list strong {
  color: #d6ff75;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 12px;
}

.records-list time {
  color: rgba(255, 255, 255, 0.42);
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 11px;
}

.empty-records {
  margin: 0;
  padding: 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.48);
  font-size: 12px;
}

@media (max-width: 720px) {
  .snake-widget {
    width: min(404px, calc(100vw - 28px));
  }

  .snake-toolbar {
    grid-template-columns: 1fr 1fr;
  }

  .name-field {
    grid-column: 1 / -1;
  }

  .mobile-controls {
    display: grid;
  }
}
</style>
