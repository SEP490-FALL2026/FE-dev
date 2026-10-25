import React from 'react'
import { Building2, CheckCircle2, AlertTriangle, Users } from 'lucide-react'
import type { Department } from '../../super-admin-data'

export function DepartmentStatsCards({ departments }: { departments: Department[] }) {
  const configuredCount = departments.filter((d) => d.status === 'CONFIGURED').length
  const incompleteCount = departments.filter((d) => d.status === 'INCOMPLETE').length
  const deprecatedCount = departments.filter((d) => d.status === 'DEPRECATED').length

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-semibold text-muted-foreground'>Tổng số phòng ban</span>
          <Building2 className='size-4 text-primary' />
        </div>
        <p className='mt-2 text-2xl font-black text-foreground'>{departments.length}</p>
        <span className='text-[0.7rem] text-muted-foreground'>Toàn bộ doanh nghiệp</span>
      </div>

      <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-semibold text-muted-foreground'>Đã cấu hình chuẩn</span>
          <CheckCircle2 className='size-4 text-success' />
        </div>
        <p className='mt-2 text-2xl font-black text-success'>{configuredCount}</p>
        <span className='text-[0.7rem] text-muted-foreground'>Đã có Manager phụ trách</span>
      </div>

      <div className='rounded-2xl border border-warning/30 bg-warning/10 p-4 shadow-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-semibold text-warning'>Chưa hoàn tất</span>
          <AlertTriangle className='size-4 text-warning' />
        </div>
        <p className='mt-2 text-2xl font-black text-warning'>{incompleteCount}</p>
        <span className='text-[0.7rem] text-warning'>Cần chỉ định Manager ngay</span>
      </div>

      <div className='rounded-2xl border border-border bg-surface p-4 shadow-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-xs font-semibold text-muted-foreground'>Đang ngừng dùng</span>
          <Users className='size-4 text-muted-foreground' />
        </div>
        <p className='mt-2 text-2xl font-black text-muted-foreground'>{deprecatedCount}</p>
        <span className='text-[0.7rem] text-muted-foreground'>Lưu vết kiểm toán</span>
      </div>
    </div>
  )
}
