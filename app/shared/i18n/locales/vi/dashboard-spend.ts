import { budgetPlan } from './dashboard-budget-plan'

/** Spending Approver (UF-15) screens and shared budget wording; Finance copy lives in the `finance*` namespaces. */
export const spendDashboard = {
  budgetPlan,
  ui: {
    all: 'Tất cả',
    cancel: 'Hủy',
    close: 'Đóng',
    save: 'Lưu'
  },
  budget: {
    actual: 'Thực chi',
    asOf: 'Số liệu ngày {{time}}',
    borneCost: 'Chi phí thực chịu',
    borneCostNote:
      'Mọi số tiền tính trên chi phí thực chịu; thuế GTGT được khấu trừ hiển thị ở cột riêng, không trừ vào ngân sách.',
    budget: 'Ngân sách',
    costCenter: 'Trung tâm chi phí',
    deductibleVat: 'Thuế GTGT được khấu trừ',
    deductibleVatSeparate: 'Thuế GTGT được khấu trừ (cột riêng)',
    estimateTitle: 'Chi phí ước tính',
    estimated: 'Ước tính',
    held: 'Cam kết đang giữ',
    noBudget: 'Chưa có ngân sách',
    nonDeductibleTax: 'Thuế không được khấu trừ',
    overCommitted: 'Đã cam kết vượt hạn mức',
    pending: 'Yêu cầu có chi phí đang chờ duyệt',
    preTax: 'Giá trước thuế',
    remaining: 'Còn lại',
    snapshotTitle: 'Bản chụp ngân sách',
    totalPayable: 'Tổng tiền phải trả',
    usedRatio: 'Tỷ lệ đã dùng và đã cam kết'
  }
} as const
