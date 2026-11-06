export const managerRenewals = {
  title: 'Điều chỉnh thuê bao',
  hint: 'Xác nhận đề xuất của IT cho thuê bao phòng mình sở hữu.',
  proposal: 'Phương án IT đề xuất',
  quantity: 'Số ghế đề xuất',
  activeUsers: 'Số ghế đang dùng',
  acknowledge: 'Tôi xác nhận hủy thuê bao khi vẫn còn người đang sử dụng.',
  stale: 'Đề xuất đã thay đổi. IT cần gửi lại đề xuất trước khi xác nhận.',
  usageUnavailable: 'Chưa có dữ liệu sử dụng để đánh giá mức hoạt động.',
  selectedSeat: 'Ghế đã được IT đề xuất thu hồi',
  confirm: 'Xác nhận đề xuất',
  state: {
    PROPOSED: 'Chờ xác nhận',
    DECIDED: 'Đã xác nhận',
    OUTCOME_RECORDED: 'Đã ghi kết quả',
    STALE: 'Cần đề xuất lại'
  },
  choice: { RENEW: 'Gia hạn', REDUCE: 'Giảm ghế', CANCEL: 'Hủy thuê bao' }
} as const
