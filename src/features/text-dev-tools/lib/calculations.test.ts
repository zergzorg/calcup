import { describe, expect, it } from 'vitest'
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
  utmGenerator,
  yamlJson,
} from './calculations'

describe('text and dev tools', () => {
  it('counts characters, words and lines', () => {
    const result = characterCounter('hello world\nagain')
    expect(result.primary).toBe('17')
    expect(result.rows.find(row => row.key === 'words')?.value).toBe('3')
  })

  it('converts case and replaces text', () => {
    expect(convertCase('Hello World', 'slug').output).toBe('hello-world')
    expect(findReplace('cat cat', 'cat', 'dog').output).toBe('dog dog')
  })

  it('sorts and compares lists', () => {
    expect(sortLines('b\na', 'asc').output).toBe('a\nb')
    expect(compareLists('a\nb', 'b\nc').primary).toBe('1')
  })

  it('formats json and encodes data', () => {
    expect(formatJson('{"a":1}').primary).toBe('valid')
    expect(urlCodec('a b', 'encode').output).toBe('a%20b')
    expect(base64Codec('тест', 'encode').primary).toBeTruthy()
    expect(yamlJson('{"a":1}', 'json-to-yaml').output).toBe('a: 1')
  })

  it('converts timestamp, color and utm', () => {
    expect(timestampConverter('0').rows.find(row => row.key === 'iso')?.value).toBe('1970-01-01T00:00:00.000Z')
    expect(colorConverter('#0d9488').rows.find(row => row.key === 'rgb')?.value).toBe('rgb(13, 148, 136)')
    expect(utmGenerator('https://example.com', { utm_source: 'search' }).output).toContain('utm_source=search')
  })

  it('parses cron and subnet inputs', () => {
    expect(cronParser('*/5 * * * *').rows[0].value).toBe('каждые 5')
    expect(ipSubnet('192.168.1.10/24').primary).toBe('192.168.1.0/24')
  })

  it('generates passwords with requested length', () => {
    expect(passwordGenerator(16, true).primary).toHaveLength(16)
  })
})
