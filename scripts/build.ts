import { spawnSync } from 'node:child_process'
import process from 'node:process'

const [base, ...args] = process.argv.slice(2)

if (!base?.startsWith('/') || !base.endsWith('/'))
  throw new Error(`Expected a base such as /2026-10-17-slug/, got ${base}`)

const { status } = spawnSync('slidev', ['build', '--base', base, '--out', `../../dist${base}`, ...args], { stdio: 'inherit', shell: true })
process.exit(status ?? 1)
