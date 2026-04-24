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

const overlapsHorizontally = (a: WidgetRect, b: WidgetRect) => {
  return !(
    a.x + a.width + WIDGET_GAP <= b.x ||
    b.x + b.width + WIDGET_GAP <= a.x
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
  const maxX = Math.max(DESK_PADDING, Math.floor(deskWidth - widget.width - DESK_PADDING));
  const maxY = Math.max(DESK_PADDING, Math.floor(deskHeight - widget.height - DESK_PADDING));
  const randomCandidates = Array.from({ length: 180 }, () => {
    return DESK_PADDING + Math.random() * Math.max(1, maxX - DESK_PADDING);
  });
  const edgeCandidates = placed.flatMap((rect) => [
    rect.x,
    rect.x + rect.width + WIDGET_GAP,
    rect.x - widget.width - WIDGET_GAP,
  ]);
  const xCandidates = shuffleArray([...randomCandidates, ...edgeCandidates, DESK_PADDING, maxX])
    .map((x) => Math.round(Math.min(maxX, Math.max(DESK_PADDING, x))));
  const seenX = new Set<number>();
  const validCandidates: WidgetRect[] = [];

  for (const x of xCandidates) {
    if (seenX.has(x)) continue;
    seenX.add(x);

    let y = DESK_PADDING;
    let guard = 0;

    while (guard < placed.length + 1) {
      const candidate = { ...widget, x, y };
      const blocker = placed.find((rect) => intersects(candidate, rect));

      if (!blocker) break;
      y = blocker.y + blocker.height + WIDGET_GAP;
      guard += 1;
    }

    const candidate = { ...widget, x, y };
    if (candidate.y <= maxY && !placed.some((rect) => intersects(candidate, rect))) {
      validCandidates.push(candidate);
    }
  }

  if (validCandidates.length > 0) {
    const sorted = validCandidates.sort((a, b) => a.y - b.y);
    const relaxedTopBand = sorted.filter((candidate) => {
      return candidate.y <= sorted[0].y + Math.max(140, deskHeight * 0.18);
    });

    return shuffleArray(relaxedTopBand)[0];
  }

  const columnCandidates = xCandidates.map((x) => {
    const columnBottom = placed
      .filter((rect) => overlapsHorizontally({ ...widget, x, y: DESK_PADDING }, rect))
      .reduce((bottom, rect) => Math.max(bottom, rect.y + rect.height + WIDGET_GAP), DESK_PADDING);

    return { ...widget, x, y: columnBottom };
  }).filter((candidate) => !placed.some((rect) => intersects(candidate, rect)));

  if (columnCandidates.length > 0) {
    const sorted = columnCandidates.sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return Math.random() - 0.5;
    });

    return sorted[0];
  }

  let fallbackY = DESK_PADDING;
  while (placed.some((rect) => intersects({ ...widget, x: DESK_PADDING, y: fallbackY }, rect))) {
    fallbackY += WIDGET_GAP;
    for (const rect of placed) {
      const candidate = { ...widget, x: DESK_PADDING, y: fallbackY };
      if (intersects(candidate, rect)) {
        fallbackY = rect.y + rect.height + WIDGET_GAP;
      }
    }
  }

  return { ...widget, x: DESK_PADDING, y: fallbackY };
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
