import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  Info,
  Key,
  Layers,
  Lock,
  Package,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Unlock,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  initialItDepartments,
  initialItCatalogItems,
  type ItCatalogItem
} from '../it-admin-data'
import type { ItAdminTabKey } from '../it-admin-nav'

type ItDeptCatalogViewProps = {
  onSelectTab?: (tab: ItAdminTabKey, extraParams?: Record<string, string>) => void
}

export function ItDeptCatalogView({ onSelectTab }: ItDeptCatalogViewProps) {
  const { t } = useTranslation('dashboard')

  const [departments] = useState(initialItDepartments)
  const [selectedDeptName, setSelectedDeptName] = useState<string>('Kỹ thuật phần mềm')
  const [catalogItems, setCatalogItems] = useState<ItCatalogItem[]>(initialItCatalogItems)
  const [selectedItem, setSelectedItem] = useState<ItCatalogItem | null>(catalogItems[0])

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newSoftwareName, setNewSoftwareName] = useState('')
  const [newVendor, setNewVendor] = useState('')
  const [newPlanName, setNewPlanName] = useState('')
  const [newProvisioningType, setNewProvisioningType] = useState<'Tài khoản' | 'API key' | 'Quyền truy cập SSO'>('Tài khoản')
  const [newDescription, setNewDescription] = useState('')
  const [newSelectedDepts, setNewSelectedDepts] = useState<string[]>(['Kỹ thuật phần mềm'])
  const [newApiReady, setNewApiReady] = useState(false)

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filter items for selected department
  const deptItems = catalogItems.filter((item) =>
    item.departments.includes(selectedDeptName)
  )

  // Handle Toggle Allowed / Stopped (IT-AC-14)
  const handleToggleStatus = (item: ItCatalogItem) => {
    // If draft without API ready, cannot turn on directly
    if (item.status === 'draft' && !item.apiReady) {
      showToast('Gói đang ở trạng thái Nháp do cổng API cấp phát chưa sẵn sàng. Hãy kết nối API trước khi bật Cho phép xin.')
      return
    }

    setCatalogItems((prev) =>
      prev.map((i) => {
        if (i.id === item.id) {
          const nextStatus = i.status === 'allowed' ? 'stopped' : 'allowed'
          if (nextStatus === 'stopped') {
            showToast(`Đã chuyển ${i.softwareName} sang "Ngừng cho xin" (ẩn khỏi form xin mới nhưng giữ trọn vẹn lịch sử).`)
          } else {
            showToast(`Đã bật "Cho phép xin" cho ${i.softwareName}!`)
          }
          return { ...i, status: nextStatus }
        }
        return i
      })
    )
  }

  // Handle Delete or Stop
  const handleDeleteOrStop = (item: ItCatalogItem) => {
    if (item.hasHistory) {
      // If has history, cannot delete permanently, switch to "Ngừng cho xin"
      setCatalogItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'stopped' } : i))
      )
      showToast(`Mục ${item.softwareName} đã có lịch sử yêu cầu/giao dịch nên không thể xóa vĩnh viễn. Đã chuyển sang "Ngừng cho xin".`)
    } else {
      // No history: delete permanently
      setCatalogItems((prev) => prev.filter((i) => i.id !== item.id))
      if (selectedItem?.id === item.id) {
        setSelectedItem(null)
      }
      showToast(`Đã xóa vĩnh viễn mục danh mục ${item.softwareName}!`)
    }
  }

  // Handle Create New Item
  const handleCreateItem = () => {
    if (!newSoftwareName.trim() || !newPlanName.trim()) {
      showToast('Vui lòng nhập tên phần mềm và tên gói.')
      return
    }

    const initialStatus: ItCatalogItem['status'] = newApiReady ? 'allowed' : 'draft'

    const newItem: ItCatalogItem = {
      id: `CAT-${Date.now()}`,
      softwareName: newSoftwareName.trim(),
      vendor: newVendor.trim() || 'Nhà cung cấp',
      planName: newPlanName.trim(),
      provisioningType: newProvisioningType,
      status: initialStatus,
      departments: newSelectedDepts.length > 0 ? newSelectedDepts : [selectedDeptName],
      openRequests: 0,
      purchasedCount: 0,
      availableCount: 0,
      apiReady: newApiReady,
      description: newDescription.trim() || 'Mô tả tính năng phần mềm/AI agent',
      hasHistory: false
    }

    setCatalogItems((prev) => [...prev, newItem])
    setSelectedItem(newItem)
    setIsCreateModalOpen(false)

    // Reset fields
    setNewSoftwareName('')
    setNewVendor('')
    setNewPlanName('')
    setNewDescription('')
    setNewApiReady(false)

    if (initialStatus === 'draft') {
      showToast('Lưu gói mới thành công ở trạng thái "Nháp" do chưa kết nối API cấp phát. Gói chưa hiển thị trên form của nhân viên.')
    } else {
      showToast(`Đã thêm thành công ${newItem.softwareName} vào danh mục!`)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Toast Notification */}
      {toastMessage && (
        <div className='fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-success/40 bg-surface/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl'>
          <CheckCircle2 className='size-5 text-success shrink-0' />
          <span className='text-sm font-semibold text-foreground'>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <div className='inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary'>
            <span className='size-2 rounded-full bg-primary' />
            Danh mục phần mềm theo phòng
          </div>
          <h1 className='mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Cấu hình danh mục phần mềm được phép xin
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Quản lý các phần mềm, AI agent và gói được phép đề xuất cho từng phòng ban; kiểm tra trạng thái API cấp phát trước khi mở quyền xin.
          </p>
        </div>

        <button
          className='flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90'
          onClick={() => setIsCreateModalOpen(true)}
          type='button'
        >
          <Plus className='size-4' />
          <span>Thêm phần mềm / gói mới</span>
        </button>
      </div>

      {/* Department Tabs */}
      <div className='flex flex-wrap items-center gap-2 border-b border-border pb-3'>
        {departments.map((dept) => (
          <button
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedDeptName === dept.name
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-surface text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
            }`}
            key={dept.id}
            onClick={() => setSelectedDeptName(dept.name)}
            type='button'
          >
            <span>{dept.name}</span>
            <span className='ml-2 rounded-md bg-white/20 px-1.5 py-0.5 text-[0.65rem]'>
              {catalogItems.filter((i) => i.departments.includes(dept.name)).length} gói
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Catalog Table (Left) + Selected Item Detail (Right) */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Table of items */}
        <div className='lg:col-span-2 rounded-2xl border border-border bg-surface shadow-sm overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead className='border-b border-border bg-surface-subtle/80 text-[0.7rem] uppercase tracking-wider text-muted-foreground'>
                <tr>
                  <th className='px-4 py-3'>Phần mềm & Nhà cung cấp</th>
                  <th className='px-3 py-3'>Gói</th>
                  <th className='px-3 py-3'>Loại cấp</th>
                  <th className='px-3 py-3 text-center'>Yêu cầu mở</th>
                  <th className='px-3 py-3 text-center'>API cấp phát</th>
                  <th className='px-3 py-3 text-center'>Trạng thái xin</th>
                  <th className='px-4 py-3 text-right'>Hành động</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border/60'>
                {deptItems.length === 0 ? (
                  <tr>
                    <td className='px-4 py-8 text-center text-muted-foreground' colSpan={7}>
                      Phòng ban này chưa có phần mềm nào trong danh mục
                    </td>
                  </tr>
                ) : (
                  deptItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id

                    return (
                      <tr
                        className={`cursor-pointer transition hover:bg-primary-soft/30 ${
                          isSelected ? 'bg-primary-soft/40 font-medium' : ''
                        }`}
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                      >
                        <td className='px-4 py-3.5'>
                          <span className='font-bold text-foreground block'>{item.softwareName}</span>
                          <span className='text-[0.68rem] text-muted-foreground'>{item.vendor}</span>
                        </td>
                        <td className='px-3 py-3.5 font-bold text-primary'>
                          {item.planName}
                        </td>
                        <td className='px-3 py-3.5 text-muted-foreground'>
                          {item.provisioningType}
                        </td>
                        <td className='px-3 py-3.5 text-center font-bold text-foreground'>
                          {item.openRequests}
                        </td>
                        <td className='px-3 py-3.5 text-center'>
                          {item.apiReady ? (
                            <span className='inline-flex items-center gap-1 rounded bg-success/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-success border border-success/20'>
                              Sẵn sàng
                            </span>
                          ) : (
                            <span className='inline-flex items-center gap-1 rounded bg-warning/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-warning border border-warning/20'>
                              Chưa có
                            </span>
                          )}
                        </td>
                        <td className='px-3 py-3.5 text-center'>
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.68rem] font-bold ${
                              item.status === 'allowed'
                                ? 'border-success/30 bg-success/10 text-success'
                                : item.status === 'stopped'
                                  ? 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
                                  : 'border-warning/30 bg-warning/10 text-warning'
                            }`}
                          >
                            {item.status === 'allowed'
                              ? 'Cho phép xin'
                              : item.status === 'stopped'
                                ? 'Ngừng cho xin'
                                : 'Nháp'}
                          </span>
                        </td>
                        <td className='px-4 py-3.5 text-right' onClick={(e) => e.stopPropagation()}>
                          <div className='flex items-center justify-end gap-1.5'>
                            <button
                              className='rounded-lg border border-border bg-surface p-1.5 text-muted-foreground hover:text-foreground'
                              onClick={() => handleToggleStatus(item)}
                              title={item.status === 'allowed' ? 'Chuyển sang Ngừng cho xin' : 'Bật Cho phép xin'}
                              type='button'
                            >
                              {item.status === 'allowed' ? (
                                <ToggleRight className='size-4 text-success' />
                              ) : (
                                <ToggleLeft className='size-4' />
                              )}
                            </button>
                            <button
                              className='rounded-lg border border-border bg-surface p-1.5 text-danger hover:bg-danger/10'
                              onClick={() => handleDeleteOrStop(item)}
                              title={item.hasHistory ? 'Ngừng dùng (Giữ lịch sử)' : 'Xóa vĩnh viễn'}
                              type='button'
                            >
                              <Trash2 className='size-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Item Detail Card */}
        {selectedItem ? (
          <div className='rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-5 flex flex-col justify-between'>
            <div className='space-y-4'>
              <div className='pb-3 border-b border-border/80'>
                <div className='flex items-center justify-between'>
                  <span className='font-mono text-xs text-muted-foreground'>{selectedItem.id}</span>
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.68rem] font-bold ${
                      selectedItem.status === 'allowed'
                        ? 'border-success/30 bg-success/10 text-success'
                        : selectedItem.status === 'stopped'
                          ? 'border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground'
                          : 'border-warning/30 bg-warning/10 text-warning'
                    }`}
                  >
                    {selectedItem.status === 'allowed'
                      ? 'Cho phép xin'
                      : selectedItem.status === 'stopped'
                        ? 'Ngừng cho xin'
                        : 'Bản nháp (Draft)'}
                  </span>
                </div>
                <h3 className='text-xl font-bold text-foreground mt-1'>
                  {selectedItem.softwareName} — {selectedItem.planName}
                </h3>
                <p className='text-xs text-muted-foreground'>{selectedItem.vendor}</p>
              </div>

              {/* Description */}
              <div className='text-xs space-y-1'>
                <span className='font-bold text-muted-foreground uppercase text-[0.68rem]'>Mô tả gói:</span>
                <p className='rounded-xl border border-border bg-surface-subtle p-3 text-foreground leading-relaxed'>
                  {selectedItem.description}
                </p>
              </div>

              {/* Scope & Provisioning Type */}
              <div className='grid grid-cols-2 gap-2 text-xs'>
                <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                  <span className='text-[0.68rem] text-muted-foreground block'>Loại cấp phát:</span>
                  <span className='font-bold text-foreground'>{selectedItem.provisioningType}</span>
                </div>
                <div className='rounded-xl border border-border bg-surface-subtle p-2.5'>
                  <span className='text-[0.68rem] text-muted-foreground block'>API Cấp phát:</span>
                  <span className={`font-bold ${selectedItem.apiReady ? 'text-success' : 'text-warning'}`}>
                    {selectedItem.apiReady ? 'Sẵn sàng tự động' : 'Chưa hỗ trợ API'}
                  </span>
                </div>
              </div>

              {/* Allowed Departments */}
              <div className='text-xs space-y-1.5'>
                <span className='font-bold text-muted-foreground uppercase text-[0.68rem] block'>
                  Các phòng ban được phép xin:
                </span>
                <div className='flex flex-wrap items-center gap-1.5'>
                  {selectedItem.departments.map((deptName, idx) => (
                    <span
                      className='rounded-md border border-border bg-surface-subtle px-2 py-0.5 text-xs font-semibold text-foreground'
                      key={idx}
                    >
                      {deptName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notice about draft and history */}
              {selectedItem.status === 'draft' && (
                <div className='rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-muted-foreground leading-relaxed'>
                  <span className='font-bold text-warning block'>Trạng thái Nháp:</span>
                  Gói chưa có kết nối API tự động và đang được ẩn khỏi form đề xuất của nhân viên thuộc các phòng ban trên.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='pt-4 border-t border-border flex items-center justify-between gap-3'>
              <button
                className='flex-1 rounded-xl border border-border bg-surface py-2 text-xs font-bold text-foreground hover:bg-surface-subtle'
                onClick={() => handleToggleStatus(selectedItem)}
                type='button'
              >
                {selectedItem.status === 'allowed' ? 'Ngừng cho xin' : 'Bật Cho phép xin'}
              </button>
              <button
                className='flex-1 rounded-xl border border-danger/40 bg-danger/10 py-2 text-xs font-bold text-danger hover:bg-danger/20'
                onClick={() => handleDeleteOrStop(selectedItem)}
                type='button'
              >
                {selectedItem.hasHistory ? 'Ngừng dùng (Giữ lịch sử)' : 'Xóa gói'}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: THÊM PHẦN MỀM / GÓI MỚI                                            */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-foreground'>Thêm phần mềm / AI Agent vào danh mục</h3>
              <button
                className='rounded-lg p-1 text-muted-foreground hover:bg-surface-subtle hover:text-foreground'
                onClick={() => setIsCreateModalOpen(false)}
                type='button'
              >
                <X className='size-5' />
              </button>
            </div>

            <div className='space-y-3 text-xs'>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='font-bold text-foreground'>Tên phần mềm / AI Agent:</label>
                  <input
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                    onChange={(e) => setNewSoftwareName(e.target.value)}
                    placeholder='Ví dụ: Claude, Cursor, ChatGPT...'
                    type='text'
                    value={newSoftwareName}
                  />
                </div>
                <div>
                  <label className='font-bold text-foreground'>Nhà cung cấp (Vendor):</label>
                  <input
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                    onChange={(e) => setNewVendor(e.target.value)}
                    placeholder='Ví dụ: Anthropic, OpenAI...'
                    type='text'
                    value={newVendor}
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='font-bold text-foreground'>Tên gói (Plan):</label>
                  <input
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 outline-none focus:border-primary'
                    onChange={(e) => setNewPlanName(e.target.value)}
                    placeholder='Ví dụ: Pro 5x, Team, Plus...'
                    type='text'
                    value={newPlanName}
                  />
                </div>
                <div>
                  <label className='font-bold text-foreground'>Loại cấp phát:</label>
                  <select
                    className='mt-1 h-9 w-full rounded-xl border border-border bg-surface-subtle px-3 font-semibold text-foreground outline-none focus:border-primary'
                    onChange={(e) => setNewProvisioningType(e.target.value as any)}
                    value={newProvisioningType}
                  >
                    <option value='Tài khoản'>Tài khoản (Username & Mật khẩu)</option>
                    <option value='API key'>Mã khóa API Key định danh</option>
                    <option value='Quyền truy cập SSO'>Quyền truy cập SSO miền công ty</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='font-bold text-foreground'>Mô tả tính năng gói:</label>
                <textarea
                  className='mt-1 w-full rounded-xl border border-border bg-surface-subtle p-3 outline-none focus:border-primary'
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder='Nhập mô tả tóm tắt tính năng gói bản quyền...'
                  rows={2}
                  value={newDescription}
                />
              </div>

              {/* Allowed Departments Multi-select */}
              <div>
                <label className='font-bold text-foreground block mb-1'>Phòng ban được phép xin:</label>
                <div className='flex flex-wrap gap-2'>
                  {departments.map((d) => {
                    const isChecked = newSelectedDepts.includes(d.name)
                    return (
                      <button
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                          isChecked
                            ? 'border-primary bg-primary text-primary-foreground font-bold'
                            : 'border-border bg-surface text-muted-foreground hover:bg-surface-subtle'
                        }`}
                        key={d.id}
                        onClick={() => {
                          if (isChecked) {
                            setNewSelectedDepts((prev) => prev.filter((n) => n !== d.name))
                          } else {
                            setNewSelectedDepts((prev) => [...prev, d.name])
                          }
                        }}
                        type='button'
                      >
                        {d.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* API Integration Readiness Toggle (IT-AC-15) */}
              <div className='rounded-xl border border-border bg-surface-subtle p-3 space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <span className='font-bold text-foreground'>Tích hợp API cấp phát tự động sẵn sàng:</span>
                  <input
                    checked={newApiReady}
                    className='size-4'
                    onChange={(e) => setNewApiReady(e.target.checked)}
                    type='checkbox'
                  />
                </div>
                <p className='text-[0.68rem] text-muted-foreground leading-relaxed'>
                  * Quy tắc IT-AC-15: Nếu chưa có đường kết nối API cấp phát sẵn sàng, mục mới sẽ được lưu dưới dạng{' '}
                  <strong>Nháp</strong> và ẩn khỏi form gửi yêu cầu của nhân viên để tránh phát sinh yêu cầu không thể cấp.
                </p>
              </div>
            </div>

            <div className='flex items-center justify-end gap-3 pt-3 border-t border-border'>
              <button
                className='rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-subtle'
                onClick={() => setIsCreateModalOpen(false)}
                type='button'
              >
                Hủy
              </button>
              <button
                className='rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90'
                onClick={handleCreateItem}
                type='button'
              >
                Lưu vào danh mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
