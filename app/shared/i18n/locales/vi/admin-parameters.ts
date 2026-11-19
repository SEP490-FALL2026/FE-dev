export const parameterPresentation = {
  usingDefault: 'Đang dùng mặc định',
  customized: 'Đã tùy chỉnh',
  notChanged: 'Chưa ghi nhận thay đổi',
  unknownName: 'Tham số khác',
  unknownDescription: 'Tham số này chưa có mô tả hiển thị.',
  unknownUnit: 'Đơn vị chưa có nhãn',
  currentlyApplied: 'Đang áp dụng',
  noLongerApplied: 'Đã ngừng áp dụng',
  historyTitle: 'Lịch sử · {{name}}',
  validFrom: 'Áp dụng từ',
  validUntil: 'Áp dụng đến',
  units: {
    workingDays: 'Ngày làm việc',
    steps: 'Bước xử lý',
    minutesPerDay: 'Phút mỗi ngày',
    monthOfYear: 'Tháng trong năm',
    days: 'Ngày',
    minutes: 'Phút',
    hours: 'Giờ',
    months: 'Tháng',
    percent: 'Phần trăm'
  },
  definitions: {
    approvalSla: {
      name: 'Thời hạn xử lý phê duyệt',
      description: 'Thời hạn tính theo ngày làm việc cho bước phê duyệt.'
    },
    backlogAlert: {
      name: 'Ngưỡng cảnh báo tồn đọng',
      description: 'Ngưỡng số bước xử lý dùng để cảnh báo công việc tồn đọng.'
    },
    activityWindow: {
      name: 'Ngưỡng hoạt động mỗi ngày',
      description: 'Số phút hoạt động mỗi ngày dùng để đánh giá việc sử dụng phần mềm.'
    },
    fiscalYearStart: {
      name: 'Tháng bắt đầu năm tài chính',
      description: 'Tháng dùng làm mốc bắt đầu năm tài chính.'
    },
    spendSubmissionWait: {
      name: 'Thời hạn chờ trình duyệt chi',
      description: 'Thời hạn tính theo ngày làm việc cho việc trình duyệt chi.'
    },
    transferReview: {
      name: 'Thời hạn rà soát sau điều chuyển',
      description: 'Thời hạn rà soát quyền sử dụng sau khi nhân viên chuyển phòng ban.'
    }
  }
} as const
