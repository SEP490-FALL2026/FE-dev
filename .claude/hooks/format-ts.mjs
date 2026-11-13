// PostToolUse (Edit|Write|MultiEdit): chạy prettier --write cho đúng file vừa sửa.
// Không chạy eslint/tsc ở đây (chậm). Dùng `pnpm lint` / `pnpm typecheck` khi kết thúc hạng mục.
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const INCLUDE = /^(app|test|scripts)\/.+\.(ts|tsx|js|jsx|mjs|cjs)$/
const GENERATED = /^app\/shared\/api\/generated\// // Orval sinh, không format tay

let input = {}
try {
  input = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  process.exit(0)
}

const file = input?.tool_input?.file_path
if (typeof file !== 'string') process.exit(0)

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const abs = path.resolve(root, file)
const rel = path.relative(root, abs).split(path.sep).join('/')

if (rel.startsWith('..') || !INCLUDE.test(rel) || GENERATED.test(rel)) process.exit(0)
if (!existsSync(abs)) process.exit(0)

const bin = path.join(root, 'node_modules', 'prettier', 'bin', 'prettier.cjs')
if (!existsSync(bin)) process.exit(0)

const res = spawnSync(process.execPath, [bin, '--write', abs], { cwd: root, encoding: 'utf8' })
if (res.status !== 0) {
  process.stderr.write(`prettier lỗi trên ${rel}:\n${res.stderr || res.stdout}`)
  process.exit(2)
}
