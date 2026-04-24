import { copyFile, mkdir, readdir } from 'node:fs/promises'
import { basename, dirname, join, relative } from 'node:path'

const DIST_DIR = 'dist'
const SKIP_FILES = new Set(['index.html', '404.html', ':pathMatch(.*)*.html'])

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(path))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path)
    }
  }

  return files
}

const htmlFiles = await collectHtmlFiles(DIST_DIR)

for (const source of htmlFiles) {
  const name = basename(source)
  if (SKIP_FILES.has(name) || name === 'index.html') continue

  const routeName = name.replace(/\.html$/, '')
  const target = join(dirname(source), routeName, 'index.html')
  if (relative(DIST_DIR, target).startsWith('assets/')) continue

  await mkdir(dirname(target), { recursive: true })
  await copyFile(source, target)
}
