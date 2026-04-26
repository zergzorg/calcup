import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import {
  calculateMetronome,
  isBeatsPerBarValid,
  isBpmValid,
  isDurationValid,
} from '../lib/calculations'
import type {
  MetronomeCadenceMode,
  MetronomeInput,
  MetronomeInputField,
  MetronomeValidationIssue,
} from '../types/metronome'

type BrowserAudioContext = typeof AudioContext

export function useMetronomeCalculator() {
  const input = reactive<MetronomeInput>({
    bpm: 120,
    beatsPerBar: 4,
    durationMinutes: 5,
    cadenceMode: 'everyStep',
  })

  const isPlaying = ref(false)
  const currentBeat = ref(0)
  let timerId: number | null = null
  let audioContext: AudioContext | null = null

  const cadenceModes: MetronomeCadenceMode[] = ['everyStep', 'everyOtherStep']

  const issues = computed<MetronomeValidationIssue[]>(() => {
    const next: MetronomeValidationIssue[] = []

    if (!isBpmValid(input.bpm)) next.push({ field: 'bpm', messageKey: 'metronome.validation.bpm.range' })
    if (!isBeatsPerBarValid(input.beatsPerBar)) next.push({ field: 'beatsPerBar', messageKey: 'metronome.validation.beatsPerBar.range' })
    if (!isDurationValid(input.durationMinutes)) next.push({ field: 'durationMinutes', messageKey: 'metronome.validation.durationMinutes.range' })

    return next
  })

  const result = computed(() =>
    issues.value.length ? null : calculateMetronome(input),
  )

  function getIssue(field: MetronomeInputField) {
    return issues.value.find(issue => issue.field === field) ?? null
  }

  function getAudioContext() {
    if (typeof window === 'undefined') return null
    const AudioContextCtor = (window.AudioContext || (window as Window & { webkitAudioContext?: BrowserAudioContext }).webkitAudioContext)
    if (!AudioContextCtor) return null
    audioContext ??= new AudioContextCtor()
    return audioContext
  }

  function click() {
    const context = getAudioContext()
    if (!context) return

    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const beatInBar = currentBeat.value % input.beatsPerBar

    oscillator.type = 'sine'
    oscillator.frequency.value = beatInBar === 0 ? 1320 : 880
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.24, context.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.07)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.08)

    currentBeat.value += 1
  }

  async function start() {
    if (!result.value || isPlaying.value) return

    const context = getAudioContext()
    if (context?.state === 'suspended') {
      await context.resume()
    }

    currentBeat.value = 0
    isPlaying.value = true
    click()
    timerId = window.setInterval(click, result.value.intervalMs)
  }

  function stop() {
    if (timerId !== null) {
      window.clearInterval(timerId)
      timerId = null
    }
    isPlaying.value = false
    currentBeat.value = 0
  }

  async function togglePlayback() {
    if (isPlaying.value) {
      stop()
      return
    }

    await start()
  }

  onBeforeUnmount(() => {
    stop()
    void audioContext?.close()
  })

  return {
    input,
    cadenceModes,
    result,
    isPlaying,
    currentBeat,
    getIssue,
    togglePlayback,
    stop,
  }
}
