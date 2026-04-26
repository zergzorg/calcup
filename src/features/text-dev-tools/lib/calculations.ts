export interface ToolResult {
  primary: string
  rows: Array<{ key: string; value: string }>
  output?: string
  error?: string
}

export function characterCounter(input: string): ToolResult {
  const words = input.trim() ? input.trim().split(/\s+/).length : 0
  const lines = input.length === 0 ? 0 : input.split(/\r\n|\r|\n/).length
  const noSpaces = input.replace(/\s/g, '').length
  return {
    primary: String(input.length),
    rows: [
      { key: 'words', value: String(words) },
      { key: 'lines', value: String(lines) },
      { key: 'noSpaces', value: String(noSpaces) },
    ],
  }
}

export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'slug'

export function convertCase(input: string, mode: CaseMode): ToolResult {
  const output = mode === 'upper'
    ? input.toUpperCase()
    : mode === 'lower'
      ? input.toLowerCase()
      : mode === 'title'
        ? input.toLowerCase().replace(/(^|\s|[-–—])(\p{L})/gu, match => match.toUpperCase())
        : mode === 'slug'
          ? input.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '')
          : input.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s*\p{L})/gu, match => match.toUpperCase())

  return {
    primary: String(output.length),
    rows: [{ key: 'changed', value: output === input ? 'нет' : 'да' }],
    output,
  }
}

export function findReplace(input: string, find: string, replace: string, caseSensitive = false): ToolResult {
  if (!find) {
    return { primary: '0', rows: [], output: input, error: 'Введите строку поиска' }
  }
  const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const flags = caseSensitive ? 'g' : 'gi'
  let count = 0
  const output = input.replace(new RegExp(escaped, flags), () => {
    count += 1
    return replace
  })
  return {
    primary: String(count),
    rows: [{ key: 'length', value: String(output.length) }],
    output,
  }
}

export type SortMode = 'asc' | 'desc' | 'natural' | 'unique'

export function sortLines(input: string, mode: SortMode): ToolResult {
  const lines = input.split(/\r\n|\r|\n/).filter(line => line.length > 0)
  const collator = new Intl.Collator(undefined, { numeric: mode === 'natural', sensitivity: 'base' })
  const sorted = [...lines].sort((a, b) => collator.compare(a, b))
  if (mode === 'desc') sorted.reverse()
  const output = mode === 'unique' ? [...new Set(sorted)].join('\n') : sorted.join('\n')
  return {
    primary: String(lines.length),
    rows: [{ key: 'unique', value: String(new Set(lines).size) }],
    output,
  }
}

export function compareLists(leftInput: string, rightInput: string): ToolResult {
  const left = new Set(leftInput.split(/\r\n|\r|\n/).map(line => line.trim()).filter(Boolean))
  const right = new Set(rightInput.split(/\r\n|\r|\n/).map(line => line.trim()).filter(Boolean))
  const onlyLeft = [...left].filter(item => !right.has(item))
  const onlyRight = [...right].filter(item => !left.has(item))
  const both = [...left].filter(item => right.has(item))
  return {
    primary: String(both.length),
    rows: [
      { key: 'onlyLeft', value: String(onlyLeft.length) },
      { key: 'onlyRight', value: String(onlyRight.length) },
    ],
    output: [
      'Общие:',
      ...both,
      '',
      'Только в первом:',
      ...onlyLeft,
      '',
      'Только во втором:',
      ...onlyRight,
    ].join('\n'),
  }
}

export function formatJson(input: string, minify = false): ToolResult {
  try {
    const parsed = JSON.parse(input)
    const output = JSON.stringify(parsed, null, minify ? 0 : 2)
    const type = Array.isArray(parsed) ? 'array' : typeof parsed
    return {
      primary: 'valid',
      rows: [
        { key: 'type', value: type },
        { key: 'length', value: String(output.length) },
      ],
      output,
    }
  } catch (error) {
    return {
      primary: 'invalid',
      rows: [],
      output: input,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}

export function yamlJson(input: string, mode: 'yaml-to-json' | 'json-to-yaml'): ToolResult {
  try {
    if (mode === 'json-to-yaml') {
      const parsed = JSON.parse(input)
      const output = objectToYaml(parsed)
      return { primary: 'valid', rows: [{ key: 'length', value: String(output.length) }], output }
    }

    const parsed = simpleYamlToObject(input)
    const output = JSON.stringify(parsed, null, 2)
    return { primary: 'valid', rows: [{ key: 'length', value: String(output.length) }], output }
  } catch (error) {
    return {
      primary: 'invalid',
      rows: [],
      output: input,
      error: error instanceof Error ? error.message : 'YAML/JSON parse error',
    }
  }
}

function objectToYaml(value: unknown, indent = 0): string {
  const pad = ' '.repeat(indent)
  if (Array.isArray(value)) {
    return value.map(item => `${pad}- ${typeof item === 'object' && item !== null ? `\n${objectToYaml(item, indent + 2)}` : yamlScalar(item)}`).join('\n')
  }
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, item]) => typeof item === 'object' && item !== null
        ? `${pad}${key}:\n${objectToYaml(item, indent + 2)}`
        : `${pad}${key}: ${yamlScalar(item)}`)
      .join('\n')
  }
  return `${pad}${yamlScalar(value)}`
}

function yamlScalar(value: unknown): string {
  if (typeof value === 'string') return /[:#\n]/.test(value) ? JSON.stringify(value) : value
  return String(value)
}

function simpleYamlToObject(input: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const lines = input.split(/\r\n|\r|\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#'))
  for (const line of lines) {
    const index = line.indexOf(':')
    if (index <= 0) throw new Error(`Invalid YAML line: ${line}`)
    const key = line.slice(0, index).trim()
    const value = line.slice(index + 1).trim()
    result[key] = parseYamlValue(value)
  }
  return result
}

function parseYamlValue(value: string): unknown {
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === 'null') return null
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  return value.replace(/^["']|["']$/g, '')
}

export function urlCodec(input: string, mode: 'encode' | 'decode'): ToolResult {
  try {
    const output = mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)
    return { primary: String(output.length), rows: [], output }
  } catch (error) {
    return { primary: 'error', rows: [], output: input, error: error instanceof Error ? error.message : 'Decode error' }
  }
}

export function base64Codec(input: string, mode: 'encode' | 'decode'): ToolResult {
  try {
    const output = mode === 'encode'
      ? btoa(unescape(encodeURIComponent(input)))
      : decodeURIComponent(escape(atob(input)))
    return { primary: String(output.length), rows: [], output }
  } catch {
    return { primary: 'error', rows: [], output: input, error: 'Некорректная Base64-строка' }
  }
}

export function timestampConverter(input: string): ToolResult {
  const raw = input.trim()
  const numeric = Number(raw)
  const date = Number.isFinite(numeric)
    ? new Date(raw.length <= 10 ? numeric * 1000 : numeric)
    : new Date(raw)
  if (Number.isNaN(date.getTime())) {
    return { primary: 'invalid', rows: [], error: 'Некорректная дата или timestamp' }
  }
  return {
    primary: String(Math.floor(date.getTime() / 1000)),
    rows: [
      { key: 'milliseconds', value: String(date.getTime()) },
      { key: 'iso', value: date.toISOString() },
      { key: 'local', value: date.toLocaleString() },
    ],
  }
}

export function cronParser(input: string): ToolResult {
  const parts = input.trim().split(/\s+/)
  if (parts.length !== 5) {
    return { primary: 'invalid', rows: [], error: 'Cron должен состоять из 5 полей' }
  }
  const labels = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek']
  const rows = parts.map((part, index) => ({ key: labels[index], value: describeCronPart(part) }))
  return {
    primary: parts.join(' '),
    rows,
    output: rows.map(row => `${row.key}: ${row.value}`).join('\n'),
  }
}

function describeCronPart(part: string): string {
  if (part === '*') return 'каждое значение'
  if (/^\*\/\d+$/.test(part)) return `каждые ${part.slice(2)}`
  if (/^\d+$/.test(part)) return `значение ${part}`
  if (/^\d+-\d+$/.test(part)) return `диапазон ${part}`
  if (/^\d+(,\d+)+$/.test(part)) return `список ${part}`
  return part
}

export function uuidValue(): ToolResult {
  const value = globalThis.crypto?.randomUUID?.() ?? fallbackUuid()
  return { primary: value, rows: [], output: value }
}

function fallbackUuid(): string {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (Number(c) ^ Math.random() * 16 >> Number(c) / 4).toString(16),
  )
}

export function passwordGenerator(length: number, useSymbols: boolean): ToolResult {
  const safeLength = Math.min(Math.max(Math.trunc(length), 6), 128)
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const digits = '23456789'
  const symbols = '!@#$%^&*_-+=?'
  const alphabet = letters + digits + (useSymbols ? symbols : '')
  const bytes = new Uint32Array(safeLength)
  globalThis.crypto?.getRandomValues?.(bytes)
  const output = Array.from(bytes, value => alphabet[value % alphabet.length] ?? alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
  return {
    primary: output,
    rows: [
      { key: 'length', value: String(safeLength) },
      { key: 'alphabet', value: String(alphabet.length) },
    ],
    output,
  }
}

export function colorConverter(input: string): ToolResult {
  const rgb = parseColor(input)
  if (!rgb) return { primary: 'invalid', rows: [], error: 'Введите HEX или RGB' }
  const [r, g, b] = rgb
  const hex = `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
  const [h, s, l] = rgbToHsl(r, g, b)
  return {
    primary: hex,
    rows: [
      { key: 'rgb', value: `rgb(${r}, ${g}, ${b})` },
      { key: 'hsl', value: `hsl(${h}, ${s}%, ${l}%)` },
    ],
    output: `${hex}\nrgb(${r}, ${g}, ${b})\nhsl(${h}, ${s}%, ${l}%)`,
  }
}

export function ipSubnet(input: string): ToolResult {
  const [ipPart, prefixPart = '24'] = input.trim().split('/')
  const prefix = Number(prefixPart)
  const ip = ipv4ToInt(ipPart)
  if (ip === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    return { primary: 'invalid', rows: [], error: 'Введите IPv4/CIDR, например 192.168.1.10/24' }
  }
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const network = (ip & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const total = 2 ** (32 - prefix)
  const usable = prefix >= 31 ? total : Math.max(total - 2, 0)
  return {
    primary: `${intToIpv4(network)}/${prefix}`,
    rows: [
      { key: 'mask', value: intToIpv4(mask) },
      { key: 'broadcast', value: intToIpv4(broadcast) },
      { key: 'firstHost', value: prefix >= 31 ? intToIpv4(network) : intToIpv4(network + 1) },
      { key: 'lastHost', value: prefix >= 31 ? intToIpv4(broadcast) : intToIpv4(broadcast - 1) },
      { key: 'hosts', value: String(usable) },
    ],
    output: `Network: ${intToIpv4(network)}/${prefix}\nMask: ${intToIpv4(mask)}\nBroadcast: ${intToIpv4(broadcast)}\nHosts: ${usable}`,
  }
}

function ipv4ToInt(value: string): number | null {
  const parts = value.split('.').map(Number)
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return null
  return parts.reduce((acc, part) => ((acc << 8) + part) >>> 0, 0)
}

function intToIpv4(value: number): string {
  return [24, 16, 8, 0].map(shift => (value >>> shift) & 255).join('.')
}

function parseColor(input: string): [number, number, number] | null {
  const trimmed = input.trim()
  const hex = trimmed.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex) {
    const value = hex[1].length === 3
      ? hex[1].split('').map(char => char + char).join('')
      : hex[1]
    return [
      parseInt(value.slice(0, 2), 16),
      parseInt(value.slice(2, 4), 16),
      parseInt(value.slice(4, 6), 16),
    ]
  }
  const rgb = trimmed.match(/^rgb\(?\s*(\d{1,3})[,\s]+(\d{1,3})[,\s]+(\d{1,3})\s*\)?$/i)
  if (!rgb) return null
  const values = [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  return values.every(value => value >= 0 && value <= 255) ? values as [number, number, number] : null
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const light = (max + min) / 2
  if (max === min) return [0, 0, Math.round(light * 100)]
  const delta = max - min
  const saturation = light > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  const hue = max === rn
    ? (gn - bn) / delta + (gn < bn ? 6 : 0)
    : max === gn
      ? (bn - rn) / delta + 2
      : (rn - gn) / delta + 4
  return [Math.round(hue * 60), Math.round(saturation * 100), Math.round(light * 100)]
}

export function utmGenerator(baseUrl: string, params: Record<string, string>): ToolResult {
  try {
    const url = new URL(baseUrl)
    Object.entries(params).forEach(([key, value]) => {
      if (value.trim()) url.searchParams.set(key, value.trim())
    })
    return {
      primary: url.toString(),
      rows: [{ key: 'params', value: String([...url.searchParams.keys()].length) }],
      output: url.toString(),
    }
  } catch {
    return { primary: 'invalid', rows: [], error: 'Введите корректный URL' }
  }
}
