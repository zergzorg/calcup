export type DataSizeMode = 'decimal' | 'binary'

export type DataSizeUnit =
  | 'byte'
  | 'kilobyte'
  | 'megabyte'
  | 'gigabyte'
  | 'terabyte'
  | 'kibibyte'
  | 'mebibyte'
  | 'gibibyte'
  | 'tebibyte'

export interface DataSizeValidationIssue {
  messageKey: string
}
