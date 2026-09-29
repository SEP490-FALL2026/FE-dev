/**
 * SaaS-Sentry - Pure Renderer for UF-16
 * IT Admin deploys browser collector, employee confirms tracking disclosure
 */

;(function () {
  'use strict'

  function escapeHtml(str) {
    if (!str) return ''
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }

  function renderApp(data, screenId) {
    const screen = data.screens.find((s) => s.id === screenId) || data.screens[0]
    const ledger = data.ledgers[screen.ledgerKey] || data.ledgers.l01
    const isEmployee = screen.screenCode === 'EMP-05'

    const actorName = isEmployee ? 'Lê Hoàng Long' : 'Trần Quốc Bảo'
    const actorRole = isEmployee ? 'Kỹ sư phần mềm · NV-0255' : 'IT Security Lead · IT Admin'
    const actorEmail = isEmployee ? 'long.le@company.com' : 'it-admin@company.com'
    const actorAvatar = isEmployee ? 'HL' : 'QB'

    // 1. Sidebar HTML
    const sidebarHtml = `
      <aside class="sidebar">
        <div class="brand-header">
          <div class="brand-logo">S</div>
          <div class="brand-title">SaaS-Sentry</div>
          <span class="brand-badge">${isEmployee ? 'PORTAL' : 'PRO'}</span>
        </div>
        <div class="nav-section">
          ${
            isEmployee
              ? `
            <div class="nav-label">Cổng nhân viên</div>
            <a class="nav-item">
              <span class="nav-icon">🏠</span>
              <span>Trang cá nhân</span>
            </a>
            <a class="nav-item">
              <span class="nav-icon">📦</span>
              <span>Phần mềm của tôi</span>
            </a>
            <a class="nav-item">
              <span class="nav-icon">💻</span>
              <span>Thiết bị công ty</span>
            </a>
            <a class="nav-item active">
              <span class="nav-icon">📩</span>
              <span>Thông báo theo dõi</span>
            </a>
            <a class="nav-item">
              <span class="nav-icon">🛡️</span>
              <span>Quyền dữ liệu cá nhân</span>
            </a>
          `
              : `
            <div class="nav-label">Quản trị SaaS</div>
            <a class="nav-item">
              <span class="nav-icon">📊</span>
              <span>Tổng quan</span>
            </a>
            <a class="nav-item">
              <span class="nav-icon">📁</span>
              <span>Danh mục phần mềm</span>
            </a>
            <a class="nav-item">
              <span class="nav-icon">🔑</span>
              <span>Cấp quyền & Thu hồi</span>
            </a>
            <a class="nav-item">
              <span class="nav-icon">⚖️</span>
              <span>Đối soát dữ liệu</span>
            </a>
            <a class="nav-item active">
              <span class="nav-icon">💻</span>
              <span>Thiết bị & Bộ thu thập</span>
            </a>
            <a class="nav-item">
              <span class="nav-icon">🛡️</span>
              <span>Tối ưu & Lãng phí</span>
            </a>
            <div class="nav-label" style="margin-top: 14px;">Hệ thống</div>
            <a class="nav-item">
              <span class="nav-icon">📜</span>
              <span>Nhật ký kiểm toán</span>
            </a>
            <a class="nav-item">
              <span class="nav-icon">⚙️</span>
              <span>Chính sách Allowlist</span>
            </a>
          `
          }
        </div>
        <div class="user-profile">
          <div class="avatar">${actorAvatar}</div>
          <div class="user-info">
            <div class="user-name">${escapeHtml(actorName)}</div>
            <div class="user-role">${escapeHtml(actorRole)}</div>
          </div>
        </div>
      </aside>
    `

    // 2. Topbar HTML
    const topbarHtml = `
      <header class="topbar">
        <div class="topbar-left">
          <span class="screen-tag">${escapeHtml(screen.screenCode)}</span>
          <nav class="breadcrumb-nav">
            <span>SaaS-Sentry</span>
            <span>/</span>
            <span class="active">${escapeHtml(screen.breadcrumb)}</span>
          </nav>
        </div>
        <div class="topbar-right">
          <div class="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Tìm thiết bị, nhân viên, tên miền..." value="" readonly />
          </div>
          <div class="theme-pill">
            <span>🖥️</span>
            <span>UF-16 Desktop 1440px</span>
          </div>
        </div>
      </header>
    `

    // 3. Stepper Bar HTML
    const stepperHtml = `
      <div class="stepper-bar">
        ${data.stages
          .map((st, idx) => {
            const isCompleted = screen.stage > st.id
            const isCurrent = screen.stage === st.id
            const stateClass = isCompleted ? 'completed' : isCurrent ? 'current' : ''
            const symbol = isCompleted ? '✓' : st.id
            const divider = idx < data.stages.length - 1 ? '<div class="step-divider"></div>' : ''
            return `
            <div class="stepper-item ${stateClass}">
              <div class="step-circle">${symbol}</div>
              <span>${escapeHtml(st.name)}</span>
            </div>
            ${divider}
          `
          })
          .join('')}
      </div>
    `

    // 4. Metric Grid HTML
    const metricsGridHtml = `
      <div class="metrics-grid">
        <div class="metric-card accent-info">
          <div class="metric-label">Thiết bị đã đăng ký</div>
          <div class="metric-value-row">
            <div class="metric-number">${ledger.registeredDevices}</div>
            <div class="metric-sub">Thiết bị công ty</div>
          </div>
        </div>
        <div class="metric-card accent-success">
          <div class="metric-label">Đã xác nhận chính sách</div>
          <div class="metric-value-row">
            <div class="metric-number">${ledger.confirmedDevices}</div>
            <div class="metric-sub">Đã mở Cổng Gateway</div>
          </div>
        </div>
        <div class="metric-card accent-warning">
          <div class="metric-label">Chờ nhân viên xác nhận</div>
          <div class="metric-value-row">
            <div class="metric-number">${ledger.pendingConfirmation}</div>
            <div class="metric-sub">Khóa nhận dữ liệu (BR-45.1)</div>
          </div>
        </div>
        <div class="metric-card accent-danger">
          <div class="metric-label">Bản ghi bị từ chối</div>
          <div class="metric-value-row">
            <div class="metric-number">${ledger.rejectedRecords}</div>
            <div class="metric-sub">Lỗi schema / chưa đăng ký</div>
          </div>
        </div>
      </div>
    `

    // 5. Screen Body Generator
    let bodyHtml = ''

    if (screen.id === '01') {
      bodyHtml = `
        <div class="alert-banner info">
          <span class="alert-icon">ℹ️</span>
          <div>
            <strong>Quy tắc BR-45.1 & BR-42.4:</strong> Tiện ích trình duyệt trên máy công ty chỉ được phép thu thập sau khi nhân viên bấm xác nhận chủ động. Chưa xác nhận thì Gateway khóa chặt, không nhận dữ liệu!
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>💻</span>
              <span>Danh sách thiết bị công ty & Tình trạng tiện ích trình duyệt</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary btn-sm">+ Đăng ký thiết bị mới</button>
              <button class="btn btn-secondary btn-sm">Chính sách Allowlist (ADR-10)</button>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã thiết bị</th>
                <th>Model & Cấu hình</th>
                <th>Nhân viên gán</th>
                <th>Phiên bản thông báo</th>
                <th>Lần gửi gần nhất</th>
                <th>Tình trạng Gateway</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr class="selected">
                <td><code>DEV-MBP-2026-088</code></td>
                <td>MacBook Pro 14" (Apple M3 Pro / 18GB)</td>
                <td><strong>Lê Hoàng Long</strong><br/><span style="color: var(--muted); font-size: 11px;">NV-0255 · Phòng Kỹ thuật</span></td>
                <td><span class="badge badge-info">v1.2 (15/09/2026)</span></td>
                <td>—</td>
                <td><span class="badge badge-warning">Chờ nhân viên xác nhận</span></td>
                <td><button class="btn btn-primary btn-sm">Chi tiết ➔</button></td>
              </tr>
              <tr>
                <td><code>DEV-DEL-2026-042</code></td>
                <td>Dell Latitude 7440 (i7-1365U / 32GB)</td>
                <td><strong>Nguyễn Minh An</strong><br/><span style="color: var(--muted); font-size: 11px;">NV-0248 · Phòng Kỹ thuật</span></td>
                <td><span class="badge badge-success">v1.2 (Đã xác nhận)</span></td>
                <td>17/09/2026 14:00</td>
                <td><span class="badge badge-success">Đang thu thập</span></td>
                <td><button class="btn btn-secondary btn-sm">Xem log</button></td>
              </tr>
              <tr>
                <td><code>DEV-MBP-2026-061</code></td>
                <td>MacBook Air 15" (Apple M2 / 16GB)</td>
                <td><strong>Trần Minh</strong><br/><span style="color: var(--muted); font-size: 11px;">NV-0174 · Thiết kế UX</span></td>
                <td><span class="badge badge-success">v1.2 (Đã xác nhận)</span></td>
                <td>17/09/2026 13:45</td>
                <td><span class="badge badge-success">Đang thu thập</span></td>
                <td><button class="btn btn-secondary btn-sm">Xem log</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    } else if (screen.id === '02') {
      bodyHtml = `
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Quản lý thiết bị — Đăng ký gán máy công ty</div>
            <span class="badge badge-info">ITA-16</span>
          </div>
          <div style="color: var(--muted); padding: 10px 0;">Đang mở hộp thoại gán thiết bị...</div>
        </div>
        <div class="modal-overlay">
          <div class="modal-dialog">
            <div class="modal-header">
              <div class="modal-title">
                <span>💻</span>
                <span>Đăng ký thiết bị công ty ↔ Nhân viên (ITA-16 · a1)</span>
              </div>
              <span style="color: var(--muted); cursor: pointer;">✕</span>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Mã thiết bị công ty (Device ID):</label>
                <input type="text" class="form-control" value="DEV-MBP-2026-088" readonly style="font-weight: 700;" />
              </div>
              <div class="comparison-grid">
                <div class="form-group">
                  <label>Model & Cấu hình phần cứng:</label>
                  <input type="text" class="form-control" value="Apple MacBook Pro 14 (Apple M3 Pro / 18GB / 512GB)" readonly />
                </div>
                <div class="form-group">
                  <label>Số Serial máy:</label>
                  <input type="text" class="form-control" value="C02G8490MD6R" readonly />
                </div>
              </div>
              <div class="comparison-grid">
                <div class="form-group">
                  <label>Nhân viên thụ hưởng (Gán trực tiếp):</label>
                  <input type="text" class="form-control" value="Lê Hoàng Long (NV-0255 · long.le@company.com)" readonly style="border-color: var(--primary);" />
                </div>
                <div class="form-group">
                  <label>Ngày bàn giao & Hiệu lực:</label>
                  <input type="text" class="form-control" value="17/09/2026 (Có hiệu lực ngay)" readonly />
                </div>
              </div>
              <div class="alert-banner warning">
                <span>⚠️</span>
                <span>Sau khi đăng ký, thiết bị ở trạng thái <strong>CHƯA XÁC NHẬN</strong>. Cổng nhận Gateway sẽ không tiếp nhận dữ liệu cho đến khi nhân viên bấm xác nhận thông báo theo dõi (BR-45.1).</span>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary">Đóng</button>
              <button class="btn btn-primary">Xác nhận đăng ký & Sinh Allowlist ➔</button>
            </div>
          </div>
        </div>
      `
    } else if (screen.id === '03') {
      bodyHtml = `
        <div class="alert-banner info">
          <span class="alert-icon">🛡️</span>
          <div>
            <strong>Quy tắc nghiệp vụ BR-45.4 & ADR-10:</strong> Danh sách cho phép (Allowlist) được sinh tự động từ danh mục phần mềm và từ điển nhà cung cấp. MỌI ỨNG DỤNG LIÊN LẠC (Slack, Teams, Zoom, Gmail...) BỊ LOẠI TRỪ TUYỆT ĐỐI!
          </div>
        </div>
        <div class="comparison-grid">
          <div class="card-panel">
            <div class="panel-header">
              <div class="panel-title" style="color: var(--success);">
                <span>✓</span>
                <span>Danh sách cho phép theo dõi (Allowlist)</span>
              </div>
              <span class="badge badge-success">4 Tên miền SaaS</span>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tên miền</th>
                  <th>Ứng dụng SaaS</th>
                  <th>Phân loại</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>github.com</code></td>
                  <td>GitHub Enterprise</td>
                  <td><span class="badge badge-info">Dev Tools</span></td>
                </tr>
                <tr>
                  <td><code>figma.com</code></td>
                  <td>Figma Professional</td>
                  <td><span class="badge badge-info">Design</span></td>
                </tr>
                <tr>
                  <td><code>atlassian.net</code></td>
                  <td>Jira & Confluence</td>
                  <td><span class="badge badge-info">Management</span></td>
                </tr>
                <tr>
                  <td><code>notion.so</code></td>
                  <td>Notion Team</td>
                  <td><span class="badge badge-info">Knowledge</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-panel">
            <div class="panel-header">
              <div class="panel-title" style="color: var(--danger);">
                <span>✕</span>
                <span>DANH SÁCH BỊ LOẠI TRỪ TUYỆT ĐỐI (ADR-10)</span>
              </div>
              <span class="badge badge-danger">Cấm thu thập</span>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tên miền</th>
                  <th>Ứng dụng</th>
                  <th>Lý do bảo vệ quyền riêng tư</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>slack.com</code></td>
                  <td>Slack Business+</td>
                  <td><span class="badge badge-danger">Cờ Communication</span></td>
                </tr>
                <tr>
                  <td><code>teams.microsoft.com</code></td>
                  <td>MS Teams</td>
                  <td><span class="badge badge-danger">Cờ Communication</span></td>
                </tr>
                <tr>
                  <td><code>zoom.us</code></td>
                  <td>Zoom Workplace</td>
                  <td><span class="badge badge-danger">Họp trực tuyến</span></td>
                </tr>
                <tr>
                  <td><code>mail.google.com</code></td>
                  <td>Gmail</td>
                  <td><span class="badge badge-danger">Thư điện tử</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `
    } else if (screen.id === '04') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">📨</span>
          <div>
            <strong>Phát hành thông báo minh bạch (s2 · BR-42.5):</strong> Đã tạo thông báo phiên bản <code>v1.2 (15/09/2026)</code> cập nhật theo Điều 25 Luật 91/2025 và gửi trực tiếp tới tài khoản nhân viên Lê Hoàng Long.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Chi tiết thông báo phát hành cho nhân viên</div>
            <span class="badge badge-info">Phiên bản v1.2</span>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card">
              <div class="card-subtitle">Thông tin gửi</div>
              <div class="detail-row">
                <span class="detail-label">Nhân sự nhận:</span>
                <span class="detail-value">Lê Hoàng Long (long.le@company.com)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Thiết bị áp dụng:</span>
                <span class="detail-value">DEV-MBP-2026-088 (MacBook Pro)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Thời điểm phát hành:</span>
                <span class="detail-value">17/09/2026 · 15:15 ICT</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Kênh thông báo:</span>
                <span class="detail-value">Cổng nhân viên EMP-05 & Email nội bộ</span>
              </div>
            </div>
            <div class="comparison-card">
              <div class="card-subtitle">Trạng thái Cổng Gateway</div>
              <div class="detail-row">
                <span class="detail-label">Tình trạng tiếp nhận:</span>
                <span class="detail-value" style="color: var(--warning);">Đang khóa (Chờ nhân viên bấm xác nhận)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Quy định BR-45.1:</span>
                <span class="detail-value">Không có xác nhận thì không nhận dữ liệu</span>
              </div>
              <div style="margin-top: 14px;">
                <button class="btn btn-primary btn-sm" style="width: 100%;">Xem góc nhìn nhân viên (EMP-05) ➔</button>
              </div>
            </div>
          </div>
        </div>
      `
    } else if (screen.id === '05') {
      bodyHtml = `
        <div class="alert-banner warning">
          <span class="alert-icon">🔔</span>
          <div>
            <strong>Thông báo mới cần xác nhận:</strong> Công ty vừa bàn giao thiết bị làm việc <code>DEV-MBP-2026-088</code>. Bạn có 1 thông báo minh bạch về chính sách đo lường mức độ sử dụng SaaS cần xác nhận đọc.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>📬</span>
              <span>Hộp thư chính sách & Thông báo cá nhân (EMP-05)</span>
            </div>
            <span class="badge badge-warning">1 Thông báo chưa xác nhận</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Tiêu đề thông báo</th>
                <th>Thiết bị áp dụng</th>
                <th>Phiên bản</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr class="selected">
                <td><strong>Thông báo minh bạch về đo lường mức độ sử dụng phần mềm SaaS</strong><br/><span style="color: var(--muted); font-size: 11px;">Căn cứ Điều 25 Luật 91/2025/QH15</span></td>
                <td><code>DEV-MBP-2026-088</code> (MacBook Pro)</td>
                <td><span class="badge badge-info">v1.2</span></td>
                <td>17/09/2026 15:15</td>
                <td><span class="badge badge-warning">Chờ bạn xác nhận</span></td>
                <td><button class="btn btn-primary btn-sm">Xem chi tiết & Xác nhận ➔</button></td>
              </tr>
              <tr>
                <td>Cấp phát quyền sử dụng GitHub Business Enterprise</td>
                <td>Toàn công ty</td>
                <td>v1.0</td>
                <td>10/09/2026</td>
                <td><span class="badge badge-success">Đã hoàn tất</span></td>
                <td><button class="btn btn-secondary btn-sm">Xem lại</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    } else if (screen.id === '06') {
      bodyHtml = `
        <div class="alert-banner info">
          <span class="alert-icon">📜</span>
          <div>
            <strong>Bản tuyên bố minh bạch (Căn cứ Điều 25 khoản 3 Luật 91/2025 & BR-42.4):</strong> Để đảm bảo quyền riêng tư của người lao động, SaaS-Sentry công khai chi tiết 5 mục theo dõi trên máy công ty.
          </div>
        </div>
        <div class="transparency-box">
          <div class="transparency-item">
            <span class="transparency-badge yes">1. THU GÌ</span>
            <div>
              <strong>Chỉ ghi nhận tên miền SaaS trong Allowlist và thời gian cửa sổ làm việc:</strong> Tiện ích đo số phút tab làm việc đang ở phía trước khi trình duyệt không rảnh rỗi (ví dụ: <code>github.com: 85 phút</code>).
            </div>
          </div>
          <div class="transparency-item">
            <span class="transparency-badge no">2. KHÔNG THU GÌ</span>
            <div>
              <strong>TUYỆT ĐỐI KHÔNG THU THẬP:</strong> Không thu URL chi tiết, không đọc tiêu đề trang, không đọc nội dung email/chat, không ghi lại phím gõ (keystroke), không chụp màn hình, không bật webcam, không theo dõi tên miền ngoài Allowlist.
            </div>
          </div>
          <div class="transparency-item">
            <span class="transparency-badge yes">3. MỤC ĐÍCH</span>
            <div>
              <strong>Tối ưu hóa chi phí bản quyền công nghệ:</strong> Phát hiện các tài khoản bản quyền không được sử dụng để điều chuyển hoặc thu hồi, tiết kiệm ngân sách công ty. Không dùng để chấm công hay đánh giá KPIs.
            </div>
          </div>
          <div class="transparency-item">
            <span class="transparency-badge yes">4. THỜI HẠN LƯU</span>
            <div>
              <strong>Lưu trữ tối đa 6 tháng:</strong> Bản ghi chi tiết mức phút được tự động xóa vĩnh viễn sau 6 tháng theo chính sách bảo mật dữ liệu F-44.
            </div>
          </div>
          <div class="transparency-item">
            <span class="transparency-badge yes">5. QUYỀN YÊU CẦU DỪNG</span>
            <div>
              <strong>Quyền chủ thể dữ liệu (F-40 · BR-42.6):</strong> Nhân viên có quyền gửi yêu cầu tạm dừng tiện ích hoặc xem lại toàn bộ dữ liệu đo lường của chính mình bất kỳ lúc nào.
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-secondary btn-sm">Xem quy trình yêu cầu dừng (F-40)</button>
          <button class="btn btn-primary">Tiến hành Xác nhận đã đọc ➔</button>
        </div>
      `
    } else if (screen.id === '07') {
      bodyHtml = `
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Quyền chủ thể dữ liệu của người lao động (F-40 · BR-42.6)</div>
            <span class="badge badge-info">EMP-05</span>
          </div>
          <div style="color: var(--muted); padding: 10px 0;">Đang mở hộp thoại quyền chủ thể dữ liệu...</div>
        </div>
        <div class="modal-overlay">
          <div class="modal-dialog">
            <div class="modal-header">
              <div class="modal-title">
                <span>🛡️</span>
                <span>Quyền chủ thể dữ liệu & Yêu cầu tạm dừng (BR-42.6)</span>
              </div>
              <span style="color: var(--muted); cursor: pointer;">✕</span>
            </div>
            <div class="modal-body">
              <p style="margin: 0; color: var(--text);">
                Theo quy định tại <strong>Điều 25 Luật 91/2025</strong> và chính sách nội bộ của công ty, người lao động có các quyền đối với dữ liệu đo lường tiện ích:
              </p>
              <div class="transparency-box" style="padding: 12px;">
                <div><strong>• Quyền tra cứu:</strong> Xem toàn bộ nhật ký số phút theo ngày của chính mình tại cổng EMP-03.</div>
                <div><strong>• Quyền khiếu nại:</strong> Phản ánh nếu tiện ích ghi nhận sai lệch hoặc máy dùng cho dự án nghiên cứu đặc thù.</div>
                <div><strong>• Quyền yêu cầu dừng:</strong> Tạm dừng thu thập trong thời gian máy phục vụ công việc nghiên cứu bảo mật.</div>
              </div>
              <div class="form-group">
                <label>Lý do yêu cầu tạm dừng (Nếu muốn opt-out):</label>
                <textarea class="form-control" rows="2" placeholder="Nhập lý do gửi đến IT Admin..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary">Đóng hộp thoại</button>
              <button class="btn btn-primary">Quay lại màn hình xác nhận chính sách</button>
            </div>
          </div>
        </div>
      `
    } else if (screen.id === '08') {
      bodyHtml = `
        <div class="alert-banner danger">
          <span class="alert-icon">⛔</span>
          <div>
            <strong>Nhánh CHƯA XÁC NHẬN (b1 ➔ e1 · BR-45.1):</strong> Nhân viên chưa bấm xác nhận thông báo theo dõi. Cổng nhận dữ liệu khóa chặt; hệ thống KHÔNG NHẬN DỮ LIỆU TỪ THIẾT BỊ NÀY!
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>🔒</span>
              <span>Trạng thái Gateway thiết bị: DEV-MBP-2026-088 (Chưa xác nhận)</span>
            </div>
            <span class="badge badge-danger">GATEWAY LOCKED (BR-45.1)</span>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card">
              <div class="card-subtitle">Tình trạng cổng tiếp nhận</div>
              <div class="detail-row">
                <span class="detail-label">Cổng Gateway:</span>
                <span class="detail-value" style="color: var(--danger);">ĐÓNG HOÀN TOÀN</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Ingestion Token:</span>
                <span class="detail-value">Chưa cấp phép</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Số gói tin đã nhận:</span>
                <span class="detail-value">0 bytes</span>
              </div>
            </div>
            <div class="comparison-card">
              <div class="card-subtitle">Hậu quả đối với phân hệ Tối ưu (UF-10)</div>
              <div class="detail-row">
                <span class="detail-label">Dữ liệu nguồn tiện ích:</span>
                <span class="detail-value" style="color: var(--muted);">Không có</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Nguồn thay thế:</span>
                <span class="detail-value">Chỉ còn G1/G2 từ nguồn nhà cung cấp (e1)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Hành động của IT:</span>
                <span class="detail-value">Hệ thống gửi email nhắc nhở nhân viên</span>
              </div>
            </div>
          </div>
        </div>
      `
    } else if (screen.id === '09') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">✍️</span>
          <div>
            <strong>Nhân viên bấm xác nhận chủ động (d1 ➔ s3 · BR-42.4):</strong> Hệ thống ghi nhận biên bản điện tử, lưu trữ phiên bản nội dung <code>v1.2</code> và thời điểm xác nhận.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Biên bản điện tử xác nhận theo dõi minh bạch</div>
            <span class="badge badge-success">Sẵn sàng kích hoạt</span>
          </div>
          <div class="transparency-box">
            <div style="font-weight: 600; color: var(--text);">
              Tôi, <strong>Lê Hoàng Long (NV-0255)</strong>, xác nhận đã đọc và hiểu rõ nội dung theo dõi minh bạch phiên bản v1.2 trên thiết bị công ty <code>DEV-MBP-2026-088</code>.
            </div>
            <div style="font-size: 12px; color: var(--muted);">
              • Thời điểm ký điện tử: 17/09/2026 · 15:20:14 ICT<br/>
              • Địa chỉ IP mạng nội bộ: 192.168.10.142 (Văn phòng Tầng 4)<br/>
              • Mã băm phiên bản: SHA-256 (v1.2-Luat91-QH15-2025)
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
            <input type="checkbox" id="chk-confirm" checked disabled />
            <label for="chk-confirm" style="font-weight: 600; color: var(--text);">Tôi đồng ý kích hoạt tiện ích đo lường trên thiết bị làm việc công ty</label>
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
            <button class="btn btn-primary">Xác nhận hoàn tất & Mở cổng Gateway ➔</button>
          </div>
        </div>
      `
    } else if (screen.id === '10') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">🔓</span>
          <div>
            <strong>Mở Cổng Gateway & Cấp Token (s3 · BR-42.4):</strong> Thiết bị <code>DEV-MBP-2026-088</code> đã chuyển sang trạng thái <strong>ĐÃ XÁC NHẬN (v1.2)</strong>. Cổng Ingestion Gateway mở khóa tiếp nhận dữ liệu!
          </div>
        </div>
        <div class="comparison-grid">
          <div class="comparison-card highlight">
            <div class="card-subtitle">Thông số Cổng Ingestion Gateway</div>
            <div class="detail-row">
              <span class="detail-label">Thiết bị:</span>
              <span class="detail-value">DEV-MBP-2026-088</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Trạng thái cổng:</span>
              <span class="detail-value" style="color: var(--success); font-weight: 700;">MỞ TIẾP NHẬN (OPEN)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Ingestion Token:</span>
              <span class="detail-value"><code>ingest-tok_7f9a2b84c10e</code></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phiên bản xác nhận:</span>
              <span class="detail-value">v1.2 (Đạt chuẩn Điều 25 Luật 91)</span>
            </div>
          </div>
          <div class="comparison-card">
            <div class="card-subtitle">Biến động Ledger hệ thống</div>
            <div class="detail-row">
              <span class="detail-label">Đã xác nhận:</span>
              <span class="detail-value">18 ➔ 19 (+1 thiết bị)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Chờ xác nhận:</span>
              <span class="detail-value">7 ➔ 6 (-1 thiết bị)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tiện ích client:</span>
              <span class="detail-value" style="color: var(--primary);">Đã kết nối an toàn</span>
            </div>
          </div>
        </div>
      `
    } else if (screen.id === '11') {
      bodyHtml = `
        <div class="alert-banner info">
          <span class="alert-icon">💻</span>
          <div>
            <strong>Cơ chế lọc tại nguồn (s4 · BR-45.2 · BR-45.3):</strong> Tiện ích chỉ đo khi tab ở phía trước và trình duyệt không rảnh. Bỏ ngay trên máy URL chi tiết, chỉ gửi bản tổng hợp ngày tối giản.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Gói tin tổng hợp ngày tối giản gửi từ Browser Client</div>
            <span class="badge badge-info">JSON Payload (BR-45.3)</span>
          </div>
          <div class="code-block">{
  "device_id": "DEV-MBP-2026-088",
  "domain": "github.com",
  "date": "2026-09-17",
  "active_minutes": 85,
  "client_signature": "sha256_9b84e10c78a..."
}</div>
          <div class="alert-banner success" style="margin-top: 10px;">
            <span>✓</span>
            <span>Payload hoàn toàn sạch: Không chứa path, query, phím gõ, hay bất kỳ dữ liệu nhạy cảm nào (BR-45.3).</span>
          </div>
        </div>
      `
    } else if (screen.id === '12') {
      bodyHtml = `
        <div class="alert-banner danger">
          <span class="alert-icon">🚨</span>
          <div>
            <strong>Cổng nhận từ chối bản ghi (d2=sai ➔ s5):</strong> Phát hiện bản ghi chứa trường dữ liệu lạ không đúng lược đồ hoặc từ thiết bị chưa cấp phép. Gateway từ chối ngay lập tức!
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Kiểm tra lược đồ Gateway: Bản ghi bị từ chối</div>
            <span class="badge badge-danger">REJECTED (Mã lỗi ERR_INVALID_SCHEMA)</span>
          </div>
          <div class="code-block" style="border-color: var(--danger);">{
  "device_id": "UNKNOWN_DEVICE_999",
  "domain": "github.com",
  "full_url": "https://github.com/company/repo/secret-branch/PR#14",  <-- TRƯỜNG LẠ BỊ CHẶN!
  "date": "2026-09-17",
  "active_minutes": 45
}</div>
          <div class="detail-row" style="margin-top: 10px;">
            <span class="detail-label">Lý do từ chối:</span>
            <span class="detail-value" style="color: var(--danger);">Chứa trường full_url vi phạm BR-45.3 & thiết bị chưa đăng ký</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tác động Ledger:</span>
            <span class="detail-value">Bản ghi bị từ chối tăng: 3 ➔ 4 (+1)</span>
          </div>
        </div>
      `
    } else if (screen.id === '13') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">✅</span>
          <div>
            <strong>Cổng nhận phê duyệt bản ghi hợp lệ (d2=đúng ➔ s6):</strong> Gói tin từ thiết bị <code>DEV-MBP-2026-088</code> vượt qua kiểm tra 3 bước: Đã đăng ký · Đã xác nhận v1.2 · Đúng lược đồ!
          </div>
        </div>
        <div class="comparison-grid">
          <div class="comparison-card highlight">
            <div class="card-subtitle">Kết quả kiểm tra 3 bước Gateway</div>
            <div class="detail-row">
              <span class="detail-label">1. Thiết bị đã đăng ký:</span>
              <span class="detail-value" style="color: var(--success);">✓ Hợp lệ (DEV-MBP-2026-088)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">2. Đã xác nhận thông báo:</span>
              <span class="detail-value" style="color: var(--success);">✓ Phiên bản v1.2</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">3. Đúng lược đồ JSON:</span>
              <span class="detail-value" style="color: var(--success);">✓ Chuẩn BR-45.3</span>
            </div>
          </div>
          <div class="comparison-card">
            <div class="card-subtitle">Chuyển tiếp xử lý</div>
            <div class="detail-row">
              <span class="detail-label">Trạng thái:</span>
              <span class="detail-value" style="color: var(--primary);">ĐÃ TIẾP NHẬN ➔ CHUYỂN SANG KHỚP DANH TÍNH</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Thời điểm tiếp nhận:</span>
              <span class="detail-value">17/09/2026 · 15:30:00 ICT</span>
            </div>
            <div style="margin-top: 14px;">
              <button class="btn btn-primary btn-sm" style="width: 100%;">Tiến hành khớp danh tính & tính usage ➔</button>
            </div>
          </div>
        </div>
      `
    } else if (screen.id === '14') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">📊</span>
          <div>
            <strong>Khớp danh tính & Đánh giá mức độ sử dụng (s6 · BR-45.5):</strong> Ghép 85 phút GitHub vào Assignment <code>ASN-4901</code> của Lê Hoàng Long. Đạt ngưỡng ≥15 phút/ngày ➔ Đánh dấu <strong>Active Day</strong>.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Kết quả tính toán mức độ sử dụng: Lê Hoàng Long (NV-0255)</div>
            <span class="badge badge-success">TRẠNG THÁI: ACTIVE</span>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card">
              <div class="card-subtitle">Thông tin Assignment</div>
              <div class="detail-row">
                <span class="detail-label">Phần mềm:</span>
                <span class="detail-value">GitHub Business Enterprise</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Mã Assignment:</span>
                <span class="detail-value">ASN-4901</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Thiết bị ghi nhận:</span>
                <span class="detail-value">DEV-MBP-2026-088</span>
              </div>
            </div>
            <div class="comparison-card">
              <div class="card-subtitle">Định nghĩa hoạt động BR-45.5</div>
              <div class="detail-row">
                <span class="detail-label">Thời gian đo lường:</span>
                <span class="detail-value">85 phút (Ngày 17/09/2026)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Ngưỡng tối thiểu:</span>
                <span class="detail-value">≥ 15 phút / ngày</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Kết luận hệ thống:</span>
                <span class="detail-value" style="color: var(--success); font-weight: 700;">HỢP LỆ · ĐANG HOẠT ĐỘNG</span>
              </div>
            </div>
          </div>
        </div>
      `
    } else if (screen.id === '15') {
      bodyHtml = `
        <div class="alert-banner warning">
          <span class="alert-icon">⚠️</span>
          <div>
            <strong>QUY TẮC BẢO VỆ CON NGƯỜI BR-45.6 & SoD-2:</strong> Chỉ dùng dữ liệu cho mục đích tối ưu license. TUYỆT ĐỐI KHÔNG HIỂN THỊ BẢNG XẾP HẠNG THỜI GIAN THEO CON NGƯỜI ĐỂ SO SÁNH HAY ĐÁNH GIÁ NHÂN SỰ!
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>🩺</span>
              <span>Bảng giám sát sức khỏe thiết bị & Tiện ích (Device Health Monitoring)</span>
            </div>
            <span class="badge badge-success">19 Thiết bị đang hoạt động</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã thiết bị</th>
                <th>Người dùng</th>
                <th>Phiên bản thông báo</th>
                <th>Lần gửi gần nhất</th>
                <th>Tình trạng tiện ích</th>
                <th>Đánh giá theo BR-45.6</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>DEV-MBP-2026-088</code></td>
                <td>Lê Hoàng Long</td>
                <td><span class="badge badge-info">v1.2</span></td>
                <td>17/09/2026 15:30</td>
                <td><span class="badge badge-success">Đã xác nhận & Mở Gateway</span></td>
                <td><span class="badge badge-info">Chỉ ghi Có/Không dùng</span></td>
              </tr>
              <tr>
                <td><code>DEV-DEL-2026-042</code></td>
                <td>Nguyễn Minh An</td>
                <td><span class="badge badge-info">v1.2</span></td>
                <td>17/09/2026 14:00</td>
                <td><span class="badge badge-success">Đã xác nhận & Mở Gateway</span></td>
                <td><span class="badge badge-info">Chỉ ghi Có/Không dùng</span></td>
              </tr>
              <tr>
                <td><code>DEV-MBP-2026-061</code></td>
                <td>Trần Minh</td>
                <td><span class="badge badge-info">v1.2</span></td>
                <td>17/09/2026 13:45</td>
                <td><span class="badge badge-success">Đã xác nhận & Mở Gateway</span></td>
                <td><span class="badge badge-info">Chỉ ghi Có/Không dùng</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    } else if (screen.id === '16') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">🎯</span>
          <div>
            <strong>Hoàn tất quy trình UF-16 (e2):</strong> Dữ liệu đo lường mức độ sử dụng từ tiện ích trình duyệt đã được thu thập hợp pháp và kiểm chứng đầy đủ. Sẵn sàng làm đầu vào cho phân hệ Tối ưu License <code>UF-10</code> (Cắt giảm lãng phí G3/G4).
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Tổng kết phiên bàn giao dữ liệu sang UF-10</div>
            <span class="badge badge-success">SẴN SÀNG CHO UF-10</span>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card">
              <div class="card-subtitle">Chỉ số tuân thủ pháp lý</div>
              <div class="detail-row">
                <span class="detail-label">Căn cứ pháp lý:</span>
                <span class="detail-value">Điều 25 Luật 91/2025/QH15</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Xác nhận chủ động:</span>
                <span class="detail-value" style="color: var(--success);">100% nhân viên bấm xác nhận</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Loại trừ liên lạc:</span>
                <span class="detail-value" style="color: var(--success);">100% loại trừ Slack/Teams/Zoom</span>
              </div>
            </div>
            <div class="comparison-card">
              <div class="card-subtitle">Sẵn sàng phân tích UF-10</div>
              <div class="detail-row">
                <span class="detail-label">Ứng dụng đã có usage:</span>
                <span class="detail-value">GitHub, Figma, Jira, Notion</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Đầu ra phục vụ:</span>
                <span class="detail-value">Phát hiện lãng phí G3/G4</span>
              </div>
              <div style="margin-top: 14px;">
                <button class="btn btn-primary btn-sm" style="width: 100%;">Mở Bảng tối ưu license (UF-10) ➔</button>
              </div>
            </div>
          </div>
        </div>
      `
    }

    // Wrap everything in app shell
    return `
      <div class="app-shell"
           data-screen="${escapeHtml(screen.id)}"
           data-stage="${screen.stage}"
           data-total-stages="${screen.totalStages}"
           data-registered-devices="${ledger.registeredDevices}"
           data-confirmed-devices="${ledger.confirmedDevices}"
           data-pending-confirmation="${ledger.pendingConfirmation}"
           data-rejected-records="${ledger.rejectedRecords}"
           data-render-ready="true"
           data-overflow="false">
        ${sidebarHtml}
        <div class="main-container">
          ${topbarHtml}
          ${stepperHtml}
          <main class="content-area">
            <div class="page-header">
              <div class="page-titles">
                <h1>${escapeHtml(screen.title)}</h1>
                <p>${escapeHtml(screen.subtitle)}</p>
              </div>
              <div class="header-actions">
                <span class="badge badge-info">Chặng ${screen.stage} / 6</span>
                <span class="badge badge-success">Chính sách v1.2</span>
              </div>
            </div>
            ${metricsGridHtml}
            ${bodyHtml}
          </main>
        </div>
      </div>
    `.trim()
  }

  const moduleExports = { renderApp }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = moduleExports
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.UF16Renderer = moduleExports
  }
})()
