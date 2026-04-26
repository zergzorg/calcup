<template>
  <main v-if="config" class="tools-page" :aria-labelledby="`${config.id}-title`">
    <section class="tools-heading">
      <p class="tools-eyebrow">{{ lang === 'ru' ? 'Информатика' : 'Informatics' }}</p>
      <h1 :id="`${config.id}-title`">{{ text(config.title) }}</h1>
      <p>{{ text(config.intro) }}</p>
    </section>

    <div class="tools-workspace">
      <form class="tools-form" @submit.prevent>
        <section class="tools-section">
          <h2>{{ text(config.formTitle) }}</h2>

          <div v-if="config.options" class="tools-field">
            <label for="tools-mode">{{ text(config.optionLabel!) }}</label>
            <div class="tools-input-wrap">
              <select id="tools-mode" v-model="mode">
                <option v-for="option in config.options" :key="option.value" :value="option.value">
                  {{ text(option.label) }}
                </option>
              </select>
            </div>
          </div>

          <div v-for="field in config.fields" :key="field.key" class="tools-field">
            <label :for="`tools-${field.key}`">{{ text(field.label) }}</label>
            <div class="tools-input-wrap">
              <textarea
                v-if="field.type === 'textarea'"
                :id="`tools-${field.key}`"
                v-model="values[field.key]"
                rows="5"
                :placeholder="field.placeholder ? text(field.placeholder) : ''"
              />
              <input
                v-else
                :id="`tools-${field.key}`"
                v-model="values[field.key]"
                :type="field.type === 'number' ? 'number' : 'text'"
                :placeholder="field.placeholder ? text(field.placeholder) : ''"
              >
            </div>
          </div>
        </section>
      </form>

      <section class="tools-result" aria-live="polite">
        <p class="tools-result__label">{{ lang === 'ru' ? 'Результат' : 'Result' }}</p>

        <template v-if="result">
          <div class="tools-result__total">
            <span>{{ label(config.primaryLabel) }}</span>
            <strong>{{ result.primary }}</strong>
          </div>

          <div v-if="result.rows.length" class="tools-result__rows">
            <div v-for="row in result.rows" :key="row.key" class="tools-result__row">
              <span>{{ label(row.key) }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>

          <p v-if="result.error" class="tools-error">{{ result.error }}</p>

          <div v-if="result.output !== undefined" class="tools-field">
            <label for="tools-output">{{ lang === 'ru' ? 'Вывод' : 'Output' }}</label>
            <div class="tools-input-wrap">
              <textarea id="tools-output" :value="result.output" rows="7" readonly />
            </div>
          </div>

          <div v-if="qrSvg" class="tools-note">
            <strong>QR</strong>
            <span v-html="qrSvg" />
          </div>

          <p class="tools-formula">{{ text(config.formula) }}</p>
        </template>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import {
  base64Codec,
  characterCounter,
  colorConverter,
  compareLists,
  convertCase,
  cronParser,
  findReplace,
  formatJson,
  ipSubnet,
  passwordGenerator,
  sortLines,
  timestampConverter,
  urlCodec,
  uuidValue,
  utmGenerator,
  yamlJson,
} from '../lib/calculations'
import type { CaseMode, SortMode, ToolResult } from '../lib/calculations'

type Lang = 'ru' | 'en'
type Text = Record<Lang, string>

interface FieldConfig {
  key: string
  label: Text
  defaultValue: string
  type?: 'text' | 'textarea' | 'number'
  placeholder?: Text
}

interface OptionConfig {
  value: string
  label: Text
}

interface ToolConfig {
  id: string
  title: Text
  intro: Text
  formTitle: Text
  fields: FieldConfig[]
  options?: OptionConfig[]
  optionLabel?: Text
  primaryLabel: string
  formula: Text
  calculate: (mode: string, values: Record<string, string>) => ToolResult
}

const configs: Record<string, ToolConfig> = {
  'character-counter': {
    id: 'character-counter',
    title: { ru: 'Счётчик символов', en: 'Character Counter' },
    intro: { ru: 'Символы, слова, строки и длина текста без пробелов.', en: 'Characters, words, lines and text length without spaces.' },
    formTitle: { ru: 'Текст', en: 'Text' },
    fields: [{ key: 'text', label: { ru: 'Текст', en: 'Text' }, type: 'textarea', defaultValue: 'Calcup считает быстро' }],
    primaryLabel: 'characters',
    formula: { ru: 'Подсчёт выполняется локально в браузере.', en: 'Everything is calculated locally in the browser.' },
    calculate: (_, values) => characterCounter(values.text),
  },
  'case-converter': {
    id: 'case-converter',
    title: { ru: 'Смена регистра текста', en: 'Case Converter' },
    intro: { ru: 'Верхний, нижний, заголовочный, sentence case и slug.', en: 'Upper, lower, title, sentence case and slug.' },
    formTitle: { ru: 'Текст и режим', en: 'Text and mode' },
    optionLabel: { ru: 'Режим', en: 'Mode' },
    options: [
      { value: 'upper', label: { ru: 'ВЕРХНИЙ', en: 'UPPER' } },
      { value: 'lower', label: { ru: 'нижний', en: 'lower' } },
      { value: 'title', label: { ru: 'Заголовочный', en: 'Title Case' } },
      { value: 'sentence', label: { ru: 'Как предложение', en: 'Sentence case' } },
      { value: 'slug', label: { ru: 'slug', en: 'slug' } },
    ],
    fields: [{ key: 'text', label: { ru: 'Текст', en: 'Text' }, type: 'textarea', defaultValue: 'Hello World from Calcup' }],
    primaryLabel: 'length',
    formula: { ru: 'Текст преобразуется без отправки на сервер.', en: 'Text is transformed without sending it to a server.' },
    calculate: (mode, values) => convertCase(values.text, mode as CaseMode),
  },
  'find-replace': {
    id: 'find-replace',
    title: { ru: 'Поиск и замена', en: 'Find and Replace' },
    intro: { ru: 'Быстро замените все вхождения строки в тексте.', en: 'Replace all occurrences in text.' },
    formTitle: { ru: 'Параметры', en: 'Parameters' },
    fields: [
      { key: 'text', label: { ru: 'Текст', en: 'Text' }, type: 'textarea', defaultValue: 'кот, кот и кошка' },
      { key: 'find', label: { ru: 'Найти', en: 'Find' }, defaultValue: 'кот' },
      { key: 'replace', label: { ru: 'Заменить на', en: 'Replace with' }, defaultValue: 'пёс' },
    ],
    primaryLabel: 'replacements',
    formula: { ru: 'Поиск нечувствителен к регистру.', en: 'Search is case-insensitive.' },
    calculate: (_, values) => findReplace(values.text, values.find, values.replace),
  },
  'sort-lines': {
    id: 'sort-lines',
    title: { ru: 'Сортировка строк', en: 'Sort Lines' },
    intro: { ru: 'Сортируйте строки по алфавиту, обратно, натурально или с удалением дублей.', en: 'Sort lines alphabetically, reverse, naturally or with duplicates removed.' },
    formTitle: { ru: 'Список', en: 'List' },
    optionLabel: { ru: 'Режим', en: 'Mode' },
    options: [
      { value: 'asc', label: { ru: 'А-Я', en: 'A-Z' } },
      { value: 'desc', label: { ru: 'Я-А', en: 'Z-A' } },
      { value: 'natural', label: { ru: 'Натуральная', en: 'Natural' } },
      { value: 'unique', label: { ru: 'Уникальные', en: 'Unique' } },
    ],
    fields: [{ key: 'text', label: { ru: 'Строки', en: 'Lines' }, type: 'textarea', defaultValue: 'beta\nalpha\nalpha\nitem 10\nitem 2' }],
    primaryLabel: 'lines',
    formula: { ru: 'Пустые строки исключаются из сортировки.', en: 'Empty lines are excluded from sorting.' },
    calculate: (mode, values) => sortLines(values.text, mode as SortMode),
  },
  'list-compare': {
    id: 'list-compare',
    title: { ru: 'Сравнение списков', en: 'List Compare' },
    intro: { ru: 'Найдите общие и уникальные элементы двух списков.', en: 'Find common and unique items in two lists.' },
    formTitle: { ru: 'Два списка', en: 'Two lists' },
    fields: [
      { key: 'left', label: { ru: 'Первый список', en: 'First list' }, type: 'textarea', defaultValue: 'apple\nbanana\npear' },
      { key: 'right', label: { ru: 'Второй список', en: 'Second list' }, type: 'textarea', defaultValue: 'banana\npear\norange' },
    ],
    primaryLabel: 'common',
    formula: { ru: 'Сравнение идёт по непустым строкам.', en: 'Comparison uses non-empty lines.' },
    calculate: (_, values) => compareLists(values.left, values.right),
  },
  'json-formatter': {
    id: 'json-formatter',
    title: { ru: 'JSON formatter', en: 'JSON Formatter' },
    intro: { ru: 'Форматируйте или минифицируйте JSON локально.', en: 'Format or minify JSON locally.' },
    formTitle: { ru: 'JSON', en: 'JSON' },
    optionLabel: { ru: 'Режим', en: 'Mode' },
    options: [
      { value: 'format', label: { ru: 'Форматировать', en: 'Format' } },
      { value: 'minify', label: { ru: 'Минифицировать', en: 'Minify' } },
    ],
    fields: [{ key: 'text', label: { ru: 'JSON', en: 'JSON' }, type: 'textarea', defaultValue: '{"name":"Calcup","tools":100}' }],
    primaryLabel: 'status',
    formula: { ru: 'Используется стандартный JSON.parse/JSON.stringify.', en: 'Uses native JSON.parse/JSON.stringify.' },
    calculate: (mode, values) => formatJson(values.text, mode === 'minify'),
  },
  'yaml-json': {
    id: 'yaml-json',
    title: { ru: 'YAML ↔ JSON', en: 'YAML ↔ JSON' },
    intro: { ru: 'Базовое преобразование YAML в JSON и JSON в YAML.', en: 'Basic YAML to JSON and JSON to YAML conversion.' },
    formTitle: { ru: 'Данные', en: 'Data' },
    optionLabel: { ru: 'Режим', en: 'Mode' },
    options: [
      { value: 'yaml-to-json', label: { ru: 'YAML → JSON', en: 'YAML → JSON' } },
      { value: 'json-to-yaml', label: { ru: 'JSON → YAML', en: 'JSON → YAML' } },
    ],
    fields: [{ key: 'text', label: { ru: 'Текст', en: 'Text' }, type: 'textarea', defaultValue: 'name: Calcup\ntools: 100' }],
    primaryLabel: 'status',
    formula: { ru: 'Поддержан безопасный базовый YAML: ключ: значение.', en: 'Supports safe basic YAML: key: value.' },
    calculate: (mode, values) => yamlJson(values.text, mode as 'yaml-to-json' | 'json-to-yaml'),
  },
  'url-encode': simpleCodec('url-encode', 'URL encode/decode', 'URL encode/decode', value => urlCodec(value.text, value.mode as 'encode' | 'decode')),
  base64: simpleCodec('base64', 'Base64', 'Base64', value => base64Codec(value.text, value.mode as 'encode' | 'decode')),
  timestamp: {
    id: 'timestamp',
    title: { ru: 'Unix timestamp', en: 'Unix Timestamp Converter' },
    intro: { ru: 'Переведите timestamp в дату и дату в Unix timestamp.', en: 'Convert timestamps to dates and dates to Unix time.' },
    formTitle: { ru: 'Дата или timestamp', en: 'Date or timestamp' },
    fields: [{ key: 'text', label: { ru: 'Значение', en: 'Value' }, defaultValue: '0' }],
    primaryLabel: 'seconds',
    formula: { ru: '10 цифр считаются секундами, 13 цифр — миллисекундами.', en: '10 digits are seconds, 13 digits are milliseconds.' },
    calculate: (_, values) => timestampConverter(values.text),
  },
  uuid: {
    id: 'uuid',
    title: { ru: 'UUID generator', en: 'UUID Generator' },
    intro: { ru: 'Сгенерируйте UUID v4 локально в браузере.', en: 'Generate a UUID v4 locally in the browser.' },
    formTitle: { ru: 'Генерация', en: 'Generation' },
    fields: [],
    primaryLabel: 'uuid',
    formula: { ru: 'Используется crypto.randomUUID, если доступен.', en: 'Uses crypto.randomUUID when available.' },
    calculate: () => uuidValue(),
  },
  'qr-generator': {
    id: 'qr-generator',
    title: { ru: 'QR generator', en: 'QR Generator' },
    intro: { ru: 'Создайте QR-код для ссылки или текста.', en: 'Create a QR code for a URL or text.' },
    formTitle: { ru: 'Содержимое QR', en: 'QR content' },
    fields: [{ key: 'text', label: { ru: 'Текст или URL', en: 'Text or URL' }, type: 'textarea', defaultValue: 'https://calcup.app' }],
    primaryLabel: 'length',
    formula: { ru: 'QR генерируется локально в SVG.', en: 'QR is generated locally as SVG.' },
    calculate: (_, values) => ({ primary: String(values.text.length), rows: [], output: values.text }),
  },
  'password-generator': {
    id: 'password-generator',
    title: { ru: 'Генератор паролей', en: 'Password Generator' },
    intro: { ru: 'Создайте случайный пароль заданной длины.', en: 'Create a random password with selected length.' },
    formTitle: { ru: 'Параметры', en: 'Options' },
    optionLabel: { ru: 'Символы', en: 'Symbols' },
    options: [
      { value: 'symbols', label: { ru: 'С символами', en: 'With symbols' } },
      { value: 'plain', label: { ru: 'Без символов', en: 'No symbols' } },
    ],
    fields: [{ key: 'length', label: { ru: 'Длина', en: 'Length' }, type: 'number', defaultValue: '16' }],
    primaryLabel: 'password',
    formula: { ru: 'Генерация выполняется через Web Crypto.', en: 'Generated with Web Crypto.' },
    calculate: (mode, values) => passwordGenerator(Number(values.length), mode === 'symbols'),
  },
  'color-converter': {
    id: 'color-converter',
    title: { ru: 'Конвертер цветов', en: 'Color Converter' },
    intro: { ru: 'HEX, RGB и HSL представления цвета.', en: 'HEX, RGB and HSL color representations.' },
    formTitle: { ru: 'Цвет', en: 'Color' },
    fields: [{ key: 'text', label: { ru: 'HEX или RGB', en: 'HEX or RGB' }, defaultValue: '#0d9488' }],
    primaryLabel: 'hex',
    formula: { ru: 'Поддерживаются HEX и rgb(r,g,b).', en: 'Supports HEX and rgb(r,g,b).' },
    calculate: (_, values) => colorConverter(values.text),
  },
  'cron-parser': {
    id: 'cron-parser',
    title: { ru: 'Cron parser', en: 'Cron Parser' },
    intro: { ru: 'Разберите cron-выражение из 5 полей.', en: 'Parse a 5-field cron expression.' },
    formTitle: { ru: 'Cron', en: 'Cron' },
    fields: [{ key: 'text', label: { ru: 'Выражение', en: 'Expression' }, defaultValue: '*/5 * * * *' }],
    primaryLabel: 'status',
    formula: { ru: 'Поддерживается стандартный формат: minute hour day month weekday.', en: 'Supports standard format: minute hour day month weekday.' },
    calculate: (_, values) => cronParser(values.text),
  },
  'ip-subnet': {
    id: 'ip-subnet',
    title: { ru: 'IP subnet calculator', en: 'IP Subnet Calculator' },
    intro: { ru: 'IPv4 сеть, маска, broadcast и доступные адреса.', en: 'IPv4 network, mask, broadcast and usable addresses.' },
    formTitle: { ru: 'IPv4/CIDR', en: 'IPv4/CIDR' },
    fields: [{ key: 'text', label: { ru: 'Адрес', en: 'Address' }, defaultValue: '192.168.1.10/24' }],
    primaryLabel: 'network',
    formula: { ru: 'Расчёт выполняется по CIDR-префиксу.', en: 'Calculated from CIDR prefix.' },
    calculate: (_, values) => ipSubnet(values.text),
  },
  'utm-generator': {
    id: 'utm-generator',
    title: { ru: 'UTM generator', en: 'UTM Generator' },
    intro: { ru: 'Соберите ссылку с UTM-метками для кампании.', en: 'Build a campaign URL with UTM parameters.' },
    formTitle: { ru: 'Ссылка и метки', en: 'URL and tags' },
    fields: [
      { key: 'url', label: { ru: 'URL', en: 'URL' }, defaultValue: 'https://example.com/page' },
      { key: 'utm_source', label: { ru: 'utm_source', en: 'utm_source' }, defaultValue: 'google' },
      { key: 'utm_medium', label: { ru: 'utm_medium', en: 'utm_medium' }, defaultValue: 'cpc' },
      { key: 'utm_campaign', label: { ru: 'utm_campaign', en: 'utm_campaign' }, defaultValue: 'spring' },
      { key: 'utm_content', label: { ru: 'utm_content', en: 'utm_content' }, defaultValue: '' },
      { key: 'utm_term', label: { ru: 'utm_term', en: 'utm_term' }, defaultValue: '' },
    ],
    primaryLabel: 'url',
    formula: { ru: 'Пустые UTM-поля не добавляются.', en: 'Empty UTM fields are skipped.' },
    calculate: (_, values) => utmGenerator(values.url, values),
  },
}

const route = useRoute()
const { locale } = useI18n()
const mode = ref('')
const values = reactive<Record<string, string>>({})
const qrSvg = ref('')

const lang = computed<Lang>(() => String(locale.value).startsWith('ru') ? 'ru' : 'en')
const config = computed(() => configs[String(route.meta.toolSlug)])

watchEffect(() => {
  const current = config.value
  if (!current) return
  mode.value = mode.value || current.options?.[0]?.value || 'default'
  values.mode = mode.value
  for (const field of current.fields) {
    if (values[field.key] === undefined) values[field.key] = field.defaultValue
  }
})

const result = computed(() => {
  values.mode = mode.value
  return config.value?.calculate(mode.value, values) ?? null
})

watch(
  () => [config.value?.id, values.text],
  async () => {
    qrSvg.value = ''
    if (config.value?.id !== 'qr-generator' || !values.text) return
    qrSvg.value = await QRCode.toString(values.text, {
      type: 'svg',
      margin: 1,
      width: 220,
      color: { dark: '#111827', light: '#ffffff' },
    })
  },
  { immediate: true },
)

function text(value: Text): string {
  return value[lang.value]
}

function label(key: string): string {
  const labels: Record<string, Text> = {
    characters: { ru: 'Символы', en: 'Characters' },
    words: { ru: 'Слова', en: 'Words' },
    lines: { ru: 'Строки', en: 'Lines' },
    noSpaces: { ru: 'Без пробелов', en: 'No spaces' },
    length: { ru: 'Длина', en: 'Length' },
    changed: { ru: 'Изменено', en: 'Changed' },
    replacements: { ru: 'Замен', en: 'Replacements' },
    unique: { ru: 'Уникальных', en: 'Unique' },
    common: { ru: 'Общих', en: 'Common' },
    onlyLeft: { ru: 'Только в первом', en: 'Only first' },
    onlyRight: { ru: 'Только во втором', en: 'Only second' },
    status: { ru: 'Статус', en: 'Status' },
    type: { ru: 'Тип', en: 'Type' },
    seconds: { ru: 'Секунды', en: 'Seconds' },
    milliseconds: { ru: 'Миллисекунды', en: 'Milliseconds' },
    iso: { ru: 'ISO', en: 'ISO' },
    local: { ru: 'Локально', en: 'Local' },
    uuid: { ru: 'UUID', en: 'UUID' },
    password: { ru: 'Пароль', en: 'Password' },
    alphabet: { ru: 'Алфавит', en: 'Alphabet' },
    hex: { ru: 'HEX', en: 'HEX' },
    rgb: { ru: 'RGB', en: 'RGB' },
    hsl: { ru: 'HSL', en: 'HSL' },
    url: { ru: 'URL', en: 'URL' },
    network: { ru: 'Сеть', en: 'Network' },
    mask: { ru: 'Маска', en: 'Mask' },
    broadcast: { ru: 'Broadcast', en: 'Broadcast' },
    firstHost: { ru: 'Первый адрес', en: 'First host' },
    lastHost: { ru: 'Последний адрес', en: 'Last host' },
    hosts: { ru: 'Адресов', en: 'Hosts' },
    minute: { ru: 'Минуты', en: 'Minutes' },
    hour: { ru: 'Часы', en: 'Hours' },
    dayOfMonth: { ru: 'День месяца', en: 'Day of month' },
    month: { ru: 'Месяц', en: 'Month' },
    dayOfWeek: { ru: 'День недели', en: 'Day of week' },
    params: { ru: 'Параметров', en: 'Params' },
  }
  return labels[key]?.[lang.value] ?? key
}

function simpleCodec(id: string, titleRu: string, titleEn: string, calculate: (values: Record<string, string>) => ToolResult): ToolConfig {
  return {
    id,
    title: { ru: titleRu, en: titleEn },
    intro: { ru: 'Кодирование и декодирование строки локально в браузере.', en: 'Encode and decode strings locally in the browser.' },
    formTitle: { ru: 'Строка', en: 'String' },
    optionLabel: { ru: 'Режим', en: 'Mode' },
    options: [
      { value: 'encode', label: { ru: 'Encode', en: 'Encode' } },
      { value: 'decode', label: { ru: 'Decode', en: 'Decode' } },
    ],
    fields: [{ key: 'text', label: { ru: 'Текст', en: 'Text' }, type: 'textarea', defaultValue: id === 'base64' ? 'Calcup' : 'hello world' }],
    primaryLabel: 'length',
    formula: { ru: 'Данные не покидают страницу.', en: 'Data never leaves the page.' },
    calculate: (_, values) => calculate(values),
  }
}
</script>
