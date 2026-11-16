export const policy = {
  checklist: {
    title: 'Câu hỏi kiểm tra theo chính sách',
    version: '{{policy}} · phiên bản {{version}}',
    yes: 'Có',
    no: 'Không',
    answerAllYes: 'Có cho tất cả',
    systemChecked: 'Hệ thống tự kiểm tra',
    loadError: 'Không tải được câu hỏi kiểm tra. Vui lòng thử lại.',
    retry: 'Tải lại câu hỏi',
    loading: 'Đang tải câu hỏi kiểm tra…',
    incomplete: 'Trả lời đủ các câu hỏi trước khi quyết định.',
    hasNo: 'Có câu trả lời "Không" nên chỉ còn từ chối hoặc trả về.',
    hasNoBlocking: 'Có câu trả lời "Không" nên không thể tiếp tục.',
    noReason: 'Không đạt: {{items}}'
  },
  gate: {
    title: 'Xác nhận đã đọc chính sách',
    hint: 'Bạn cần đọc và xác nhận các chính sách mới trước khi tiếp tục làm việc.',
    progress: 'Chính sách {{current}} / {{total}}',
    version: 'Phiên bản {{version}}',
    changeNote: 'Thay đổi trong phiên bản này',
    acknowledge: 'Tôi đã đọc và hiểu',
    acknowledged: 'Đã ghi nhận xác nhận của bạn.',
    error: 'Chưa ghi nhận được xác nhận. Vui lòng thử lại.',
    loadError: 'Không tải được nội dung chính sách.',
    retry: 'Tải lại',
    loading: 'Đang tải chính sách…'
  },
  errors: {
    versionChanged: 'Chính sách vừa có phiên bản mới. Hãy đọc lại các câu hỏi rồi trả lời lại.',
    incomplete: 'Bạn chưa trả lời đủ các câu hỏi của bước này.',
    hasNo: 'Không thể tiếp tục vì có câu trả lời "Không". Bạn có thể từ chối hoặc trả lại.',
    notInForce:
      'Bước này chưa có chính sách đang hiệu lực nên chưa thể ra quyết định. Hãy báo Super Admin ban hành chính sách.'
  }
} as const
