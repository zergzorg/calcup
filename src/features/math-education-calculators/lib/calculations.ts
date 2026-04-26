export type Shape2D = 'rectangle' | 'circle' | 'triangle' | 'trapezoid'
export type Solid3D = 'box' | 'cylinder' | 'sphere' | 'cone'
export type MissingPythagoreanSide = 'a' | 'b' | 'c'

export interface ResultRow {
  key: string
  value: string
}

export interface CalculationResult {
  primary: ResultRow
  rows: ResultRow[]
  formula: string
  steps?: string[]
}

const EPSILON = 1e-10

export function formatNumber(value: number, digits = 6): string {
  if (!Number.isFinite(value)) return '—'
  const rounded = Math.abs(value) < EPSILON ? 0 : value
  return Number(rounded.toFixed(digits)).toString()
}

export function parseNumberList(input: string): number[] {
  return input
    .trim()
    .replace(/,\s+/g, ' ')
    .split(/[\s;]+/)
    .filter(Boolean)
    .map(token => Number(token.replace(',', '.')))
    .filter(Number.isFinite)
}

export function geometryArea(shape: Shape2D, input: Record<string, number>): CalculationResult | null {
  if (shape === 'rectangle') {
    const { a, b } = input
    if (a <= 0 || b <= 0) return null
    return {
      primary: { key: 'area', value: formatNumber(a * b) },
      rows: [
        { key: 'perimeter', value: formatNumber(2 * (a + b)) },
        { key: 'diagonal', value: formatNumber(Math.hypot(a, b)) },
      ],
      formula: 'S = a × b, P = 2 × (a + b)',
    }
  }

  if (shape === 'circle') {
    const { radius } = input
    if (radius <= 0) return null
    return {
      primary: { key: 'area', value: formatNumber(Math.PI * radius ** 2) },
      rows: [
        { key: 'perimeter', value: formatNumber(2 * Math.PI * radius) },
        { key: 'diameter', value: formatNumber(radius * 2) },
      ],
      formula: 'S = πr², C = 2πr',
    }
  }

  if (shape === 'triangle') {
    const { base, height } = input
    if (base <= 0 || height <= 0) return null
    return {
      primary: { key: 'area', value: formatNumber(base * height / 2) },
      rows: [{ key: 'doubleArea', value: formatNumber(base * height) }],
      formula: 'S = a × h / 2',
    }
  }

  const { a, b, height } = input
  if (a <= 0 || b <= 0 || height <= 0) return null
  return {
    primary: { key: 'area', value: formatNumber((a + b) * height / 2) },
    rows: [{ key: 'middleLine', value: formatNumber((a + b) / 2) }],
    formula: 'S = (a + b) × h / 2',
  }
}

export function solidVolume(solid: Solid3D, input: Record<string, number>): CalculationResult | null {
  if (solid === 'box') {
    const { a, b, c } = input
    if (a <= 0 || b <= 0 || c <= 0) return null
    return {
      primary: { key: 'volume', value: formatNumber(a * b * c) },
      rows: [{ key: 'surface', value: formatNumber(2 * (a * b + a * c + b * c)) }],
      formula: 'V = a × b × c',
    }
  }

  if (solid === 'cylinder') {
    const { radius, height } = input
    if (radius <= 0 || height <= 0) return null
    return {
      primary: { key: 'volume', value: formatNumber(Math.PI * radius ** 2 * height) },
      rows: [{ key: 'surface', value: formatNumber(2 * Math.PI * radius * (radius + height)) }],
      formula: 'V = πr²h',
    }
  }

  if (solid === 'sphere') {
    const { radius } = input
    if (radius <= 0) return null
    return {
      primary: { key: 'volume', value: formatNumber(4 / 3 * Math.PI * radius ** 3) },
      rows: [{ key: 'surface', value: formatNumber(4 * Math.PI * radius ** 2) }],
      formula: 'V = 4/3 × πr³',
    }
  }

  const { radius, height } = input
  if (radius <= 0 || height <= 0) return null
  return {
    primary: { key: 'volume', value: formatNumber(Math.PI * radius ** 2 * height / 3) },
    rows: [{ key: 'surfaceBase', value: formatNumber(Math.PI * radius ** 2) }],
    formula: 'V = πr²h / 3',
  }
}

export function pythagorean(missing: MissingPythagoreanSide, input: Record<string, number>): CalculationResult | null {
  const { a, b, c } = input
  if (missing === 'c') {
    if (a <= 0 || b <= 0) return null
    return {
      primary: { key: 'sideC', value: formatNumber(Math.hypot(a, b)) },
      rows: [{ key: 'squareSum', value: formatNumber(a ** 2 + b ** 2) }],
      formula: 'c = √(a² + b²)',
    }
  }

  if (missing === 'a') {
    if (b <= 0 || c <= 0 || c <= b) return null
    return {
      primary: { key: 'sideA', value: formatNumber(Math.sqrt(c ** 2 - b ** 2)) },
      rows: [{ key: 'squareDiff', value: formatNumber(c ** 2 - b ** 2) }],
      formula: 'a = √(c² − b²)',
    }
  }

  if (a <= 0 || c <= 0 || c <= a) return null
  return {
    primary: { key: 'sideB', value: formatNumber(Math.sqrt(c ** 2 - a ** 2)) },
    rows: [{ key: 'squareDiff', value: formatNumber(c ** 2 - a ** 2) }],
    formula: 'b = √(c² − a²)',
  }
}

export function triangleBySides(a: number, b: number, c: number): CalculationResult | null {
  if (a <= 0 || b <= 0 || c <= 0) return null
  if (a + b <= c || a + c <= b || b + c <= a) return null

  const perimeter = a + b + c
  const semi = perimeter / 2
  const area = Math.sqrt(semi * (semi - a) * (semi - b) * (semi - c))
  const angleA = Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)) * 180 / Math.PI
  const angleB = Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c)) * 180 / Math.PI
  const angleC = 180 - angleA - angleB

  return {
    primary: { key: 'area', value: formatNumber(area) },
    rows: [
      { key: 'perimeter', value: formatNumber(perimeter) },
      { key: 'angleA', value: `${formatNumber(angleA, 3)}°` },
      { key: 'angleB', value: `${formatNumber(angleB, 3)}°` },
      { key: 'angleC', value: `${formatNumber(angleC, 3)}°` },
    ],
    formula: 'S = √(p(p − a)(p − b)(p − c))',
  }
}

export function quadraticEquation(a: number, b: number, c: number): CalculationResult | null {
  if (a === 0 || ![a, b, c].every(Number.isFinite)) return null
  const d = b ** 2 - 4 * a * c
  const steps = [`D = ${formatNumber(b)}² − 4 × ${formatNumber(a)} × ${formatNumber(c)} = ${formatNumber(d)}`]

  if (d < 0) {
    return {
      primary: { key: 'roots', value: 'нет действительных корней' },
      rows: [{ key: 'discriminant', value: formatNumber(d) }],
      formula: 'x = (−b ± √D) / 2a',
      steps,
    }
  }

  if (Math.abs(d) < EPSILON) {
    const x = -b / (2 * a)
    steps.push(`x = −${formatNumber(b)} / (2 × ${formatNumber(a)}) = ${formatNumber(x)}`)
    return {
      primary: { key: 'roots', value: formatNumber(x) },
      rows: [{ key: 'discriminant', value: formatNumber(d) }],
      formula: 'x = −b / 2a',
      steps,
    }
  }

  const sqrtD = Math.sqrt(d)
  const x1 = (-b - sqrtD) / (2 * a)
  const x2 = (-b + sqrtD) / (2 * a)
  steps.push(`x₁ = (${formatNumber(-b)} − √${formatNumber(d)}) / ${formatNumber(2 * a)} = ${formatNumber(x1)}`)
  steps.push(`x₂ = (${formatNumber(-b)} + √${formatNumber(d)}) / ${formatNumber(2 * a)} = ${formatNumber(x2)}`)
  return {
    primary: { key: 'roots', value: `${formatNumber(x1)}; ${formatNumber(x2)}` },
    rows: [
      { key: 'discriminant', value: formatNumber(d) },
      { key: 'sqrtD', value: formatNumber(sqrtD) },
    ],
    formula: 'x = (−b ± √D) / 2a',
    steps,
  }
}

export function gcdTwo(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a))
  let y = Math.abs(Math.trunc(b))
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

export function gcdLcm(numbers: number[]): CalculationResult | null {
  const ints = numbers.map(Math.trunc).filter(value => Number.isFinite(value) && value > 0)
  if (ints.length === 0) return null
  const gcd = ints.reduce((acc, value) => gcdTwo(acc, value))
  const lcm = ints.reduce((acc, value) => Math.abs(acc * value) / gcdTwo(acc, value))
  return {
    primary: { key: 'gcd', value: formatNumber(gcd, 0) },
    rows: [{ key: 'lcm', value: formatNumber(lcm, 0) }],
    formula: 'НОК(a,b) = |a × b| / НОД(a,b)',
  }
}

export function primeNumber(value: number): CalculationResult | null {
  const n = Math.trunc(value)
  if (!Number.isFinite(n) || n < 2) return null
  const factors: number[] = []
  let rest = n
  for (let d = 2; d * d <= rest; d += d === 2 ? 1 : 2) {
    while (rest % d === 0) {
      factors.push(d)
      rest /= d
    }
  }
  if (rest > 1) factors.push(rest)
  return {
    primary: { key: 'isPrime', value: factors.length === 1 && factors[0] === n ? 'да' : 'нет' },
    rows: [
      { key: 'factors', value: factors.join(' × ') },
      { key: 'divisorsCount', value: formatNumber(countDivisors(factors), 0) },
    ],
    formula: 'Проверка делителей до √n',
  }
}

function countDivisors(factors: number[]): number {
  const powers = new Map<number, number>()
  factors.forEach(factor => powers.set(factor, (powers.get(factor) ?? 0) + 1))
  return [...powers.values()].reduce((total, power) => total * (power + 1), 1)
}

export function decimalToFraction(input: string): CalculationResult | null {
  const normalized = input.trim().replace(',', '.')
  const value = Number(normalized)
  if (!Number.isFinite(value)) return null
  const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0
  const denominatorRaw = 10 ** decimals
  const numeratorRaw = Math.round(value * denominatorRaw)
  const divisor = gcdTwo(numeratorRaw, denominatorRaw)
  const numerator = numeratorRaw / divisor
  const denominator = denominatorRaw / divisor
  return {
    primary: { key: 'fraction', value: denominator === 1 ? `${numerator}` : `${numerator}/${denominator}` },
    rows: [
      { key: 'decimal', value: formatNumber(value) },
      { key: 'mixed', value: toMixedFraction(numerator, denominator) },
    ],
    formula: 'decimal × 10ⁿ → сократить на НОД',
  }
}

function toMixedFraction(numerator: number, denominator: number): string {
  if (denominator === 1) return `${numerator}`
  const sign = numerator < 0 ? '-' : ''
  const abs = Math.abs(numerator)
  const whole = Math.trunc(abs / denominator)
  const rest = abs % denominator
  if (whole === 0) return `${numerator}/${denominator}`
  if (rest === 0) return `${sign}${whole}`
  return `${sign}${whole} ${rest}/${denominator}`
}

export function statistics(values: number[]): CalculationResult | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const count = sorted.length
  const mean = sorted.reduce((sum, value) => sum + value, 0) / count
  const variance = sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / count
  const sampleVariance = count > 1
    ? sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (count - 1)
    : 0
  return {
    primary: { key: 'mean', value: formatNumber(mean) },
    rows: [
      { key: 'median', value: formatNumber(quantile(sorted, 0.5)) },
      { key: 'q1', value: formatNumber(quantile(sorted, 0.25)) },
      { key: 'q3', value: formatNumber(quantile(sorted, 0.75)) },
      { key: 'variance', value: formatNumber(variance) },
      { key: 'sampleVariance', value: formatNumber(sampleVariance) },
      { key: 'stdev', value: formatNumber(Math.sqrt(variance)) },
    ],
    formula: 'σ² = Σ(x − x̄)² / n',
  }
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 1) return sorted[0]
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  return sorted[base + 1] === undefined ? sorted[base] : sorted[base] + rest * (sorted[base + 1] - sorted[base])
}

export function factorial(n: number): number | null {
  const integer = Math.trunc(n)
  if (!Number.isFinite(integer) || integer < 0 || integer > 170) return null
  let result = 1
  for (let i = 2; i <= integer; i += 1) result *= i
  return result
}

export function combinatorics(n: number, k: number): CalculationResult | null {
  const ni = Math.trunc(n)
  const ki = Math.trunc(k)
  if (ni < 0 || ki < 0 || ki > ni) return null
  const nf = factorial(ni)
  const kf = factorial(ki)
  const nkf = factorial(ni - ki)
  if (nf === null || kf === null || nkf === null) return null
  const arrangements = nf / nkf
  const combinations = nf / (kf * nkf)
  return {
    primary: { key: 'combinations', value: formatNumber(combinations, 0) },
    rows: [
      { key: 'arrangements', value: formatNumber(arrangements, 0) },
      { key: 'permutations', value: formatNumber(nf, 0) },
      { key: 'factorialK', value: formatNumber(kf, 0) },
    ],
    formula: 'C(n,k)=n!/(k!(n−k)!), A(n,k)=n!/(n−k)!',
  }
}
