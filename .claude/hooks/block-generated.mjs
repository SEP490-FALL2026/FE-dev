// PreToolUse (Edit|Write|MultiEdit): chặn sửa tay file sinh tự động hoặc nhạy cảm.
import { readFileSync } from 'node:fs'
import path from 'node:path'

const RULES = [
  [
    /^app\/shared\/api\/generated\//,
    'thư mục này do Orval sinh từ openapi/openapi.yaml; sửa openapi.yaml rồi chạy `pnpm api:generate`'
  ],
  [/^build\//, 'build/ là output của `pnpm build`'],
  [/^\.react-router\//, '.react-router/ do `react-router typegen` sinh'],
  [/^pnpm-lock\.yaml$/, 'pnpm-lock.yaml do pnpm quản lý (dùng pnpm add/remove)'],
  [/(^|\/)\.env(\.(?!example$)[^/]+)?$/, 'file .env chứa bí mật (chỉ sửa .env.example)']
]

let input = {}
try {
  input = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  process.exit(0)
}

const file = input?.tool_input?.file_path
if (typeof file !== 'string') process.exit(0)

const root = process.env.CLAUDE_PROJECT_DIR || process.cwd()
const rel = path.relative(root, path.resolve(root, file)).split(path.sep).join('/')
if (rel.startsWith('..')) process.exit(0)

for (const [re, why] of RULES) {
  if (re.test(rel)) {
    process.stderr.write(`Chặn sửa tay ${rel}: ${why}. Nếu thật sự cần, hãy nhờ Owner sửa.\n`)
    process.exit(2)
  }
}
