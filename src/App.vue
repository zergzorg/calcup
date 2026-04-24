<template>
  <DesktopLayout @clearAll="handleClearAll" @shuffleWidgets="shuffleWidgets" @contextmenu.prevent>
    <TimerWidget v-if="isWidgetVisible('timer')" />
    <DateTimerWidget v-if="isWidgetVisible('dateTimer')" />
    <TaskPlanner v-if="isWidgetVisible('tasks')" />
    <SoundMachine v-if="isWidgetVisible('sound')" />
    <SnakeGame v-if="isWidgetVisible('snake')" />
  </DesktopLayout>
</template>

<script setup lang="ts">
import DesktopLayout from './components/DesktopLayout.vue';
import TimerWidget from './components/TimerWidget.vue';
import DateTimerWidget from './components/DateTimerWidget.vue';
import TaskPlanner from './components/TaskPlanner.vue';
import SoundMachine from './components/SoundMachine.vue';
import SnakeGame from './components/SnakeGame.vue';
import { useSeo } from './composables/useSeo';
import { useScale } from './composables/useScale';
import { useI18n } from 'vue-i18n';
import { useWidgets } from './composables/useWidgets';

interface WidgetRect {
  storageKey: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

interface WidgetPosition {
  x: number;
  y: number;
}

const WIDGET_GAP = 18;
const DESK_PADDING = 28;

useSeo();
const { t } = useI18n();
const { widgets } = useWidgets();
const { scale } = useScale();

const isWidgetVisible = (id: string) => {
  return widgets.value.find((w) => w.id === id)?.visible ?? true;
};

const clearAllCookies = () => {
  document.cookie.split(';').forEach((c) => {
    const name = c.replace(/^ +/, '').replace(/=.*/, '');
    document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
  });
};

const handleClearAll = () => {
  if (!confirm(t('confirm_reset'))) return;
  try {
    localStorage.clear();
  } catch (e) {
    console.warn('Failed to clear localStorage', e);
  }
  clearAllCookies();
  location.reload();
};

const intersects = (a: WidgetRect, b: WidgetRect) => {
  return !(
    a.x + a.width + WIDGET_GAP <= b.x ||
    b.x + b.width + WIDGET_GAP <= a.x ||
    a.y + a.height + WIDGET_GAP <= b.y ||
    b.y + b.height + WIDGET_GAP <= a.y
  );
};

const shuffleArray = <T,>(items: T[]) => {
  return [...items].sort(() => Math.random() - 0.5);
};

const getDeskSize = () => {
  return {
    width: window.innerWidth / scale.value,
    height: window.innerHeight / scale.value,
  };
};

const findRandomPosition = (widget: WidgetRect, placed: WidgetRect[], deskWidth: number, deskHeight: number) => {
  const maxX = Math.max(DESK_PADDING, deskWidth - widget.width - DESK_PADDING);
  const maxY = Math.max(DESK_PADDING, deskHeight - widget.height - DESK_PADDING);

  for (let attempt = 0; attempt < 700; attempt += 1) {
    const candidate = {
      ...widget,
      x: DESK_PADDING + Math.random() * Math.max(1, maxX - DESK_PADDING),
      y: DESK_PADDING + Math.random() * Math.max(1, maxY - DESK_PADDING),
    };

    if (!placed.some((rect) => intersects(candidate, rect))) {
      return candidate;
    }
  }

  const gridStep = 24;
  const xSlots = Math.max(1, Math.floor((maxX - DESK_PADDING) / gridStep));
  const ySlots = Math.max(1, Math.floor((maxY - DESK_PADDING) / gridStep));
  const gridCandidates: WidgetRect[] = [];

  for (let ySlot = 0; ySlot <= ySlots; ySlot += 1) {
    for (let xSlot = 0; xSlot <= xSlots; xSlot += 1) {
      gridCandidates.push({
        ...widget,
        x: DESK_PADDING + xSlot * gridStep,
        y: DESK_PADDING + ySlot * gridStep,
      });
    }
  }

  return shuffleArray(gridCandidates).find((candidate) => {
    return !placed.some((rect) => intersects(candidate, rect));
  }) ?? { ...widget, x: DESK_PADDING, y: DESK_PADDING };
};

const setWidgetPosition = (storageKey: string, position: WidgetPosition) => {
  window.dispatchEvent(new CustomEvent('calcup:set-widget-position', {
    detail: { storageKey, position },
  }));
};

const shuffleWidgets = () => {
  const widgetRects = Array.from(document.querySelectorAll<HTMLElement>('[data-widget-key]'))
    .map((element) => ({
      storageKey: element.dataset.widgetKey ?? '',
      width: element.offsetWidth,
      height: element.offsetHeight,
      x: 0,
      y: 0,
    }))
    .filter((widget) => widget.storageKey && widget.width > 0 && widget.height > 0);

  const { width: deskWidth, height: deskHeight } = getDeskSize();
  const placed: WidgetRect[] = [];

  for (const widget of shuffleArray(widgetRects)) {
    const nextPosition = findRandomPosition(widget, placed, deskWidth, deskHeight);
    placed.push(nextPosition);
  }

  for (const widget of placed) {
    setWidgetPosition(widget.storageKey, {
      x: Math.round(widget.x),
      y: Math.round(widget.y),
    });
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #1e1e1e;
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
}
</style>
