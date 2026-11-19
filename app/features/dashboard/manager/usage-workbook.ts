import type { TeamMember } from './manager-data'

export type UsageLabels = {
  activeMinutes: string
  creditsConsumed: string
  creditsLimit: string
  dayPeriod: string
  plan: string
  period: string
  requestPeriod: string
  sessionEnd: string
  sessionStart: string
  sheetName: string
  software: string
  status: string
  title: string
  usageActive: string
  usageAgentActive: string
  usageInactive: string
  usageLow: string
}

const encoder = new TextEncoder()

function xml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff
  for (const byte of bytes) {
    crc ^= byte
    for (let index = 0; index < 8; index += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function zip(files: { name: string; content: string }[]) {
  const chunks: Uint8Array[] = []
  const directory: Uint8Array[] = []
  let offset = 0

  for (const file of files) {
    const name = encoder.encode(file.name)
    const data = encoder.encode(file.content)
    const local = new Uint8Array(30 + name.length)
    const localView = new DataView(local.buffer)
    localView.setUint32(0, 0x04034b50, true)
    localView.setUint16(4, 20, true)
    localView.setUint32(14, crc32(data), true)
    localView.setUint32(18, data.length, true)
    localView.setUint32(22, data.length, true)
    localView.setUint16(26, name.length, true)
    local.set(name, 30)
    chunks.push(local, data)

    const central = new Uint8Array(46 + name.length)
    const centralView = new DataView(central.buffer)
    centralView.setUint32(0, 0x02014b50, true)
    centralView.setUint16(4, 20, true)
    centralView.setUint16(6, 20, true)
    centralView.setUint32(16, crc32(data), true)
    centralView.setUint32(20, data.length, true)
    centralView.setUint32(24, data.length, true)
    centralView.setUint16(28, name.length, true)
    centralView.setUint32(42, offset, true)
    central.set(name, 46)
    directory.push(central)
    offset += local.length + data.length
  }

  const directorySize = directory.reduce((sum, part) => sum + part.length, 0)
  const end = new Uint8Array(22)
  const endView = new DataView(end.buffer)
  endView.setUint32(0, 0x06054b50, true)
  endView.setUint16(8, files.length, true)
  endView.setUint16(10, files.length, true)
  endView.setUint32(12, directorySize, true)
  endView.setUint32(16, offset, true)
  const parts = [...chunks, ...directory, end]
  const output = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0))
  let position = 0
  for (const part of parts) {
    output.set(part, position)
    position += part.length
  }
  return new Blob([output.buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
}

export function createUsageWorkbook(member: TeamMember, labels: UsageLabels) {
  const rows: (string | number)[][] = [
    [labels.title, member.name],
    [],
    [
      labels.software,
      labels.plan,
      labels.activeMinutes,
      labels.creditsConsumed,
      labels.creditsLimit,
      labels.period,
      labels.sessionStart,
      labels.sessionEnd,
      labels.status
    ],
    ...member.assignedSoftware.map((item) => [
      item.name,
      item.plan,
      item.kind === 'ai-agent' ? '' : item.activeMinutes30d,
      item.kind === 'ai-agent' ? item.creditUsage.consumed : '',
      item.kind === 'ai-agent' ? item.creditUsage.limit : '',
      item.kind === 'ai-agent'
        ? item.creditUsage.period.kind === 'day'
          ? `${labels.dayPeriod}: ${item.creditUsage.period.date}`
          : `${labels.requestPeriod}: ${item.creditUsage.period.requestCode}`
        : '',
      item.kind === 'ai-agent' ? '' : item.latestSession.startedAt,
      item.kind === 'ai-agent' ? '' : item.latestSession.endedAt,
      item.kind === 'ai-agent'
        ? labels.usageAgentActive
        : item.status === 'ACTIVE'
          ? labels.usageActive
          : item.status === 'LOW_USAGE'
            ? labels.usageLow
            : labels.usageInactive
    ])
  ]
  const sheetRows = rows.map((row, rowIndex) => {
    const cells = row.map((value, columnIndex) => {
      const address = `${String.fromCharCode(65 + columnIndex)}${rowIndex + 1}`
      return typeof value === 'number'
        ? `<c r="${address}"><v>${value}</v></c>`
        : `<c r="${address}" t="inlineStr"><is><t>${xml(value)}</t></is></c>`
    })
    return `<row r="${rowIndex + 1}">${cells.join('')}</row>`
  })

  return zip([
    {
      name: '[Content_Types].xml',
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'
    },
    {
      name: '_rels/.rels',
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'
    },
    {
      name: 'xl/workbook.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xml(labels.sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      content:
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'
    },
    {
      name: 'xl/worksheets/sheet1.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows.join('')}</sheetData></worksheet>`
    }
  ])
}

export function downloadUsageWorkbook(member: TeamMember, labels: UsageLabels) {
  const url = URL.createObjectURL(createUsageWorkbook(member, labels))
  const link = document.createElement('a')
  link.href = url
  link.download = `usage-${member.id}.xlsx`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
