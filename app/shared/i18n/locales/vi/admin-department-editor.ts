export const adminDepartmentEditor = {
  editor: {
    codePlaceholder: 'Ví dụ: ENG hoặc PEOPLE-OPS',
    namePlaceholder: 'Nhập tên phòng ban',
    functionPlaceholder: 'Mô tả chức năng, nhiệm vụ của phòng ban',
    headChoice: 'Thay đổi trưởng phòng',
    keepHead: 'Giữ trưởng phòng hiện tại',
    assignHead: 'Chọn trưởng phòng mới',
    vacateHead: 'Để trống',
    chooseHead: 'Chọn người quản lý',
    chooseHeadPlaceholder: 'Chọn người giữ vai Quản lý trong phòng',
    managerHelp:
      'Chỉ liệt kê thành viên phòng có tài khoản Quản lý đã kích hoạt, đang hoạt động. Nếu chưa có, gán vai Quản lý tại Tài khoản trước.',
    vacateHelp:
      'Từ ngày hiệu lực, yêu cầu sẽ chờ có trưởng phòng. Trưởng phòng cũ vẫn giữ vai Quản lý cho tới khi được thu hồi.',
    partialSave: 'Đã lưu thông tin phòng; chưa đổi trưởng phòng. Sửa trường được đánh dấu rồi lưu lại.',
    unknownOutcome:
      'Chưa xác định được kết quả ghi. Đối chiếu bản nhập với dữ liệu phòng mới nhất trước khi lưu lại. Trưởng phòng có lịch hiệu lực trong tương lai có thể chưa xuất hiện ở mục hiện tại.',
    latestTitle: 'Dữ liệu phòng mới nhất',
    review: 'Tôi đã đối chiếu dữ liệu phòng mới nhất',
    readLatest: 'Đọc lại dữ liệu phòng',
    readFailed: 'Chưa đọc được dữ liệu phòng. Hãy tải lại trước khi lưu tiếp.',
    errors: {
      name: 'Tên gồm 1–200 ký tự; chức năng tối đa 1.000 ký tự.',
      itAdmin: 'Chọn nhân viên đang làm việc có tài khoản quản trị viên công nghệ thông tin có thể sử dụng.',
      headMembership: 'Chọn thành viên của phòng vào ngày hiệu lực.',
      managerRequired: 'Gán vai Quản lý cho nhân viên tại Tài khoản trước.',
      headRole: 'Quản trị viên hệ thống và người duyệt chi không được làm trưởng phòng.',
      anotherDepartment: 'Nhân viên đang làm trưởng phòng khác trong cùng khoảng thời gian.',
      employeeInactive: 'Nhân viên không còn tồn tại hoặc đã ngừng hoạt động.',
      date: 'Chọn hôm nay hoặc ngày nghiệp vụ trong tương lai.',
      inactive: 'Phòng đã ngừng hoạt động. Đóng biểu mẫu và tải lại phòng.',
      validation: 'Kiểm tra thông tin phòng, trưởng phòng và ngày hiệu lực.'
    }
  }
}
