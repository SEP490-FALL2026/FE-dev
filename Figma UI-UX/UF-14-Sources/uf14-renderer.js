/**
 * SaaS-Sentry - Pure Renderer for UF-14
 * Converts canonical data and screen ID into pixel-perfect 1440 × 1024 markup
 */

(function () {
  'use strict';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderApp(data, screenId) {
    const screen = data.screens.find(s => s.id === screenId) || data.screens[0];
    const ledger = data.ledgers[screen.ledgerKey] || data.ledgers.l01;
    const isFinance = screen.role.includes('Finance') && !screen.role.includes('IT Admin');

    const actorName = isFinance ? 'Nguyễn Thị Hoa' : 'Trần Quốc Bảo';
    const actorRole = isFinance ? 'Kế toán trưởng · Finance' : 'IT Security Lead · IT Admin';
    const actorEmail = isFinance ? 'finance@company.com' : 'it-admin@company.com';
    const actorAvatar = isFinance ? 'TH' : 'QB';

    // 1. Sidebar HTML
    const sidebarHtml = `
      <aside class="sidebar">
        <div class="brand-header">
          <div class="brand-logo">S</div>
          <div class="brand-title">SaaS-Sentry</div>
          <span class="brand-badge">PRO</span>
        </div>
        <div class="nav-section">
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
          <a class="nav-item active">
            <span class="nav-icon">⚖️</span>
            <span>Đối soát dữ liệu</span>
          </a>
          <a class="nav-item">
            <span class="nav-icon">💳</span>
            <span>Quản lý chi phí & HĐ</span>
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
            <span>Cấu hình kết nối</span>
          </a>
        </div>
        <div class="user-profile">
          <div class="avatar">${actorAvatar}</div>
          <div class="user-info">
            <div class="user-name">${escapeHtml(actorName)}</div>
            <div class="user-role">${escapeHtml(actorRole)}</div>
          </div>
        </div>
      </aside>
    `;

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
            <input type="text" placeholder="Tìm bản ghi đối soát, user, app..." value="" readonly />
          </div>
          <div class="theme-pill">
            <span>🖥️</span>
            <span>UF-14 Desktop 1440px</span>
          </div>
        </div>
      </header>
    `;

    // 3. Stepper Bar HTML
    const stepperHtml = `
      <div class="stepper-bar">
        ${data.stages.map((st, idx) => {
          const isCompleted = screen.stage > st.id;
          const isCurrent = screen.stage === st.id;
          const stateClass = isCompleted ? 'completed' : isCurrent ? 'current' : '';
          const symbol = isCompleted ? '✓' : st.id;
          const divider = idx < data.stages.length - 1 ? '<div class="step-divider"></div>' : '';
          return `
            <div class="stepper-item ${stateClass}">
              <div class="step-circle">${symbol}</div>
              <span>${escapeHtml(st.name)}</span>
            </div>
            ${divider}
          `;
        }).join('')}
      </div>
    `;

    // 4. Metric Grid HTML
    const metricsGridHtml = `
      <div class="metrics-grid">
        <div class="metric-card accent-warning">
          <div class="metric-label">Sai lệch thành viên NCC</div>
          <div class="metric-value-row">
            <div class="metric-number">${ledger.openMember}</div>
            <div class="metric-sub">Hệ thống ≠ NCC</div>
          </div>
        </div>
        <div class="metric-card accent-info">
          <div class="metric-label">Lệch số suất hóa đơn</div>
          <div class="metric-value-row">
            <div class="metric-number">${ledger.openInvoice}</div>
            <div class="metric-sub">Hóa đơn ≠ Thuê bao</div>
          </div>
        </div>
        <div class="metric-card accent-danger">
          <div class="metric-label">Tác vụ chờ chấp nhận</div>
          <div class="metric-value-row">
            <div class="metric-number">${ledger.pendingAcceptance}</div>
            <div class="metric-sub">Bắt tay UF-08 (QĐ-03)</div>
          </div>
        </div>
        <div class="metric-card accent-success">
          <div class="metric-label">Đã giải quyết hôm nay</div>
          <div class="metric-value-row">
            <div class="metric-number">${ledger.resolvedToday}</div>
            <div class="metric-sub">Có biên bản người thật</div>
          </div>
        </div>
      </div>
    `;

    // 5. Screen Body Generator
    let bodyHtml = '';

    if (screen.id === '01') {
      bodyHtml = `
        <div class="alert-banner info">
          <span class="alert-icon">ℹ️</span>
          <div>
            <strong>Quy tắc BR-43.1 & BR-43.2:</strong> Khi các nguồn dữ liệu mâu thuẫn, hệ thống giữ nguyên CẢ HAI giá trị, tuyệt đối KHÔNG tự ghi đè. Mọi mâu thuẫn phải có người chịu trách nhiệm và không tự đóng theo thời gian.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>📋</span>
              <span>Phiên đối soát tự động & Hóa đơn đang mở (${data.entities.session.id})</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-primary btn-sm">▶ Chạy đối soát ngay</button>
              <button class="btn btn-secondary btn-sm">📥 Nhập hóa đơn</button>
            </div>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Ứng dụng SaaS</th>
                <th>Kênh kết nối</th>
                <th>Loại đối soát</th>
                <th>Số suất nội bộ</th>
                <th>Số thực tế / Hóa đơn</th>
                <th>Tình trạng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr class="selected">
                <td><strong>GitHub Business Enterprise</strong><br/><span style="color: var(--muted); font-size: 11px;">SUB-GH-BIZ-01</span></td>
                <td><span class="badge badge-success">API Connector</span></td>
                <td>Thành viên NCC</td>
                <td>50 seats</td>
                <td>52 members</td>
                <td><span class="badge badge-warning">Cần đối soát (2 lệch)</span></td>
                <td><button class="btn btn-primary btn-sm">Chi tiết ➔</button></td>
              </tr>
              <tr>
                <td><strong>Slack Business+</strong><br/><span style="color: var(--muted); font-size: 11px;">SUB-SLK-BP-01</span></td>
                <td><span class="badge badge-success">API Connector</span></td>
                <td>Hóa đơn T09/2026</td>
                <td>50 seats ($750)</td>
                <td>55 seats ($825)</td>
                <td><span class="badge badge-info">Lệch +5 suất HĐ</span></td>
                <td><button class="btn btn-secondary btn-sm">Xem HĐ</button></td>
              </tr>
              <tr>
                <td><strong>Figma Professional</strong><br/><span style="color: var(--muted); font-size: 11px;">SUB-FIG-PRO-02</span></td>
                <td><span class="badge badge-success">API Connector</span></td>
                <td>Thành viên NCC</td>
                <td>35 seats</td>
                <td>34 active</td>
                <td><span class="badge badge-warning">Thiếu 1 TK Figma</span></td>
                <td><button class="btn btn-secondary btn-sm">Xử lý</button></td>
              </tr>
              <tr>
                <td><strong>Canva Team</strong><br/><span style="color: var(--muted); font-size: 11px;">SUB-CNV-01</span></td>
                <td><span class="badge badge-manual">Thủ công</span></td>
                <td>Không đối soát tự động</td>
                <td>15 seats</td>
                <td>—</td>
                <td><span class="badge badge-manual">Không sinh sai lệch</span></td>
                <td><button class="btn btn-secondary btn-sm">Cấu hình</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (screen.id === '02') {
      bodyHtml = `
        <div class="alert-banner warning">
          <span class="alert-icon">⚠️</span>
          <div>
            <strong>Phát hiện đối tượng gắn với ProvisioningTask chờ chấp nhận:</strong> Tài khoản <code>an.nguyen@company.com</code> đang gắn với <code>PV-2041</code> (gửi lời mời ngày 16/09). Cần kiểm tra trạng thái active trước khi kết luận sai lệch (QĐ-03).
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>🐙</span>
              <span>Đối soát thành viên: GitHub Business Enterprise (SUB-GH-BIZ-01)</span>
            </div>
            <span class="badge badge-success">API Kết nối trực tiếp · Quét lúc 14:30</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Họ tên & Email</th>
                <th>Assignment Nội bộ</th>
                <th>Trạng thái phía GitHub</th>
                <th>Phân loại theo UF-14</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr class="selected">
                <td><strong>Nguyễn Minh An</strong><br/><span style="color: var(--muted); font-size: 11px;">an.nguyen@company.com · NV-0248</span></td>
                <td><span class="badge badge-info">ASN-4901 (Đã duyệt chi)</span></td>
                <td><span class="badge badge-warning">Pending Invitation</span></td>
                <td>Gắn với <code>PV-2041</code> chờ chấp nhận (QĐ-03)</td>
                <td><button class="btn btn-primary btn-sm">Kiểm tra API ➔</button></td>
              </tr>
              <tr>
                <td><strong>Alex Vũ (External)</strong><br/><span style="color: var(--muted); font-size: 11px;">alex.vu@partner-corp.com</span></td>
                <td><span class="badge badge-danger">Không có Assignment</span></td>
                <td><span class="badge badge-danger">Member (Write Admin)</span></td>
                <td><span class="badge badge-danger">MỨC RẤT CAO · Shadow Access</span></td>
                <td><button class="btn btn-secondary btn-sm">Điều tra</button></td>
              </tr>
              <tr>
                <td><strong>Lê Thu Hà</strong><br/><span style="color: var(--muted); font-size: 11px;">ha.le@company.com · NV-0311</span></td>
                <td><span class="badge badge-success">ASN-4894</span></td>
                <td><span class="badge badge-success">Active Member</span></td>
                <td>Khớp 100%</td>
                <td><span style="color: var(--success); font-weight: 600;">✓ Đồng bộ</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (screen.id === '03') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">✅</span>
          <div>
            <strong>Bắt tay UF-08 thành công (QĐ-03 · BRD mục 5.12.3):</strong> GitHub Enterprise API xác nhận tài khoản <code>an.nguyen@company.com</code> đã chấp nhận lời mời và chính thức active lúc 14:15 ICT. Tác vụ <code>PV-2041</code> tự động chuyển sang <strong>HOÀN TẤT</strong>, không sinh sai lệch giả!
          </div>
        </div>
        <div class="comparison-grid">
          <div class="comparison-card highlight">
            <div class="card-subtitle">Bằng chứng xác thực từ GitHub API</div>
            <div class="detail-row">
              <span class="detail-label">Mã tác vụ liên kết:</span>
              <span class="detail-value">PV-2041 (UF-08)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Nhân sự thụ hưởng:</span>
              <span class="detail-value">Nguyễn Minh An (NV-0248)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tài khoản GitHub:</span>
              <span class="detail-value">an.nguyen@company.com</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Thời điểm Active:</span>
              <span class="detail-value">17/09/2026 · 14:15:32 ICT</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Trạng thái mới:</span>
              <span class="detail-value" style="color: var(--success);">HOÀN TẤT (Assignment ASN-4901 Active)</span>
            </div>
          </div>
          <div class="comparison-card">
            <div class="card-subtitle">Cập nhật Ledger hệ thống</div>
            <div class="detail-row">
              <span class="detail-label">Tác vụ chờ chấp nhận:</span>
              <span class="detail-value">2 ➔ 1 (-1 hoàn tất)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Đã giải quyết hôm nay:</span>
              <span class="detail-value">4 ➔ 5 (+1)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Nhật ký kiểm toán:</span>
              <span class="detail-value">Ghi nhận chứng thực API tự động</span>
            </div>
            <div style="margin-top: 14px;">
              <button class="btn btn-secondary btn-sm" style="width: 100%;">Tiếp tục xử lý các sai lệch khác ➔</button>
            </div>
          </div>
        </div>
      `;
    } else if (screen.id === '04') {
      bodyHtml = `
        <div class="alert-banner info">
          <span class="alert-icon">🛡️</span>
          <div>
            <strong>Quy tắc nghiệp vụ BR-28.1 (Ranh giới kết nối tự động):</strong> Chỉ đối soát ứng dụng có kết nối tự động. Ứng dụng quản lý thủ công TUYỆT ĐỐI KHÔNG sinh sai lệch giả khi chưa có dữ liệu kết nối.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>🎨</span>
              <span>Ứng dụng quản lý thủ công: Canva Team (SUB-CNV-01)</span>
            </div>
            <span class="badge badge-manual">Manual / No API</span>
          </div>
          <div style="padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <div style="font-size: 48px;">🔌</div>
            <div style="font-size: 16px; font-weight: 700; color: var(--text);">Ứng dụng chưa được kích hoạt API Connector</div>
            <p style="max-width: 600px; color: var(--muted); margin: 0;">
              Canva Team đang được vận hành ở chế độ cấp phát và thu hồi thủ công (Manual Provisioning). Hệ thống không đối soát tự động nền và <strong>không tạo ra bất kỳ cảnh báo sai lệch giả nào</strong> theo đúng quy định BR-28.1.
            </p>
            <div style="display: flex; gap: 10px; margin-top: 8px;">
              <button class="btn btn-secondary btn-sm">Xem danh sách Assignment nội bộ (15 seats)</button>
              <button class="btn btn-primary btn-sm">Cấu hình API Connector</button>
            </div>
          </div>
        </div>
      `;
    } else if (screen.id === '05') {
      bodyHtml = `
        <div class="alert-banner warning">
          <span class="alert-icon">⚠️</span>
          <div>
            <strong>Mức độ Trung bình (BR-28.2 · BR-43.1):</strong> Hệ thống có quyền được cấp nhưng nhà cung cấp không có tài khoản. Người dùng không thể truy cập phần mềm dù đã được duyệt. Hệ thống giữ nguyên cả 2 giá trị, không tự xóa Assignment!
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>🔍</span>
              <span>Chi tiết sai lệch DISC-2026-081: Figma Professional</span>
            </div>
            <span class="badge badge-warning">Mức Trung bình · Chờ IT Admin quyết định</span>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card highlight">
              <div class="card-subtitle">Ý định nội bộ (Đã qua phê duyệt)</div>
              <div class="detail-row">
                <span class="detail-label">Nhân sự:</span>
                <span class="detail-value">Đặng Hoàng Long (NV-0195)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email công ty:</span>
                <span class="detail-value">long.dang@company.com</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Mã Assignment:</span>
                <span class="detail-value">ASN-4102</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Người phê duyệt:</span>
                <span class="detail-value">Trần Minh (QL Trực tiếp) · 10/09/2026</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Trạng thái:</span>
                <span class="detail-value" style="color: var(--success);">Đã duyệt hợp lệ</span>
              </div>
            </div>
            <div class="comparison-card">
              <div class="card-subtitle">Thực tế nhà cung cấp (Figma API)</div>
              <div class="detail-row">
                <span class="detail-label">Workspace:</span>
                <span class="detail-value">Company Workspace (Pro)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tài khoản tồn tại:</span>
                <span class="detail-value" style="color: var(--danger);">KHÔNG TÌM THẤY</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Lần quét gần nhất:</span>
                <span class="detail-value">17/09/2026 14:30 ICT</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Người chịu trách nhiệm:</span>
                <span class="detail-value">Trần Quốc Bảo (IT Admin)</span>
              </div>
              <div style="margin-top: 14px;">
                <button class="btn btn-primary btn-sm" style="width: 100%;">Mở màn hình xử lý cấp lại (ITA-05) ➔</button>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (screen.id === '06') {
      bodyHtml = `
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Figma Professional — Xử lý sai lệch DISC-2026-081</div>
            <span class="badge badge-warning">Đang thao tác trên ITA-05</span>
          </div>
          <div style="padding: 10px 0; color: var(--muted);">Đang mở hộp thoại xử lý cấp lại...</div>
        </div>
        <div class="modal-overlay">
          <div class="modal-dialog">
            <div class="modal-header">
              <div class="modal-title">
                <span>⚙️</span>
                <span>Quyết định xử lý sai lệch: DISC-2026-081 (ITA-05)</span>
              </div>
              <span style="color: var(--muted); cursor: pointer;">✕</span>
            </div>
            <div class="modal-body">
              <div class="alert-banner warning">
                <span>⚠️</span>
                <span>Nhân viên Đặng Hoàng Long (NV-0195) đã được duyệt quyền nhưng chưa có tài khoản trên Figma. Vui lòng chọn hướng xử lý:</span>
              </div>
              <div class="radio-card-group">
                <div class="radio-card active">
                  <div class="radio-indicator"></div>
                  <div>
                    <div style="font-weight: 700; color: var(--text);">Kích hoạt cấp lại tài khoản phía nhà cung cấp (Đề xuất)</div>
                    <div style="font-size: 11.5px; color: var(--muted);">Tạo tác vụ cấp phát mới (ProvisioningTask) chuyển sang hàng đợi UF-08 để IT thực thi hoặc chạy qua API.</div>
                  </div>
                </div>
                <div class="radio-card">
                  <div class="radio-indicator"></div>
                  <div>
                    <div style="font-weight: 700; color: var(--text);">Xác nhận nhân viên không cần dùng nữa (Hủy Assignment)</div>
                    <div style="font-size: 11.5px; color: var(--muted);">Thu hồi quyết định cấp quyền trong nội bộ, yêu cầu có biên bản và thông báo người quản lý.</div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Lý do quyết định (Bắt buộc theo BR-43.2):</label>
                <textarea class="form-control" rows="3" readonly>Tài khoản bị sót sau đợt reset workspace đầu tháng 9, cần cấp lại ngay để nhân sự làm việc dự án FinTech.</textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary">Đóng</button>
              <button class="btn btn-primary">Xác nhận & Chuyển UF-08 (PV-2065)</button>
            </div>
          </div>
        </div>
      `;
    } else if (screen.id === '07') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">✅</span>
          <div>
            <strong>Hoàn tất đóng sai lệch DISC-2026-081 (BR-43.2 · BR-43.3):</strong> Đã tạo tác vụ cấp lại <code>PV-2065</code> sang hàng đợi thực thi của <code>UF-08</code>. Bản ghi sai lệch chính thức được đóng kèm quyết định của người thật!
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>📜</span>
              <span>Biên bản giải quyết mâu thuẫn dữ liệu</span>
            </div>
            <span class="badge badge-success">ĐÃ GIẢI QUYẾT · Mã DEC-4401</span>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card">
              <div class="card-subtitle">Thông tin đóng bản ghi</div>
              <div class="detail-row">
                <span class="detail-label">Mã sai lệch:</span>
                <span class="detail-value">DISC-2026-081</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Người ra quyết định:</span>
                <span class="detail-value">Trần Quốc Bảo (it-admin@company.com)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Thời gian giải quyết:</span>
                <span class="detail-value">17/09/2026 · 14:45 ICT</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tác vụ phát sinh:</span>
                <span class="detail-value" style="color: var(--primary);">PV-2065 (Đã chuyển UF-08)</span>
              </div>
            </div>
            <div class="comparison-card">
              <div class="card-subtitle">Tác động Ledger</div>
              <div class="detail-row">
                <span class="detail-label">Sai lệch thành viên mở:</span>
                <span class="detail-value">3 ➔ 2 (-1 bản ghi)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Đã giải quyết hôm nay:</span>
                <span class="detail-value">5 ➔ 6 (+1 bản ghi)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tuân thủ BR-43.3:</span>
                <span class="detail-value" style="color: var(--success);">100% người thật đóng</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (screen.id === '08') {
      bodyHtml = `
        <div class="alert-banner info">
          <span class="alert-icon">💳</span>
          <div>
            <strong>Đối soát hóa đơn Tài chính (F-35 · BR-35.1):</strong> Hệ thống tự động ghép dòng hóa đơn <code>INV-2026-09-001</code> từ Slack Technologies về thuê bao nội bộ <code>SUB-SLK-BP-01</code>.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>📄</span>
              <span>Thông tin hóa đơn INV-2026-09-001 (Slack Technologies Inc.)</span>
            </div>
            <span class="badge badge-warning">Phát hiện chênh lệch số suất (+5)</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Dòng chi phí hóa đơn</th>
                <th>Kỳ thanh toán</th>
                <th>Số tiền nguyên tệ</th>
                <th>Thuê bao ghép nội bộ</th>
                <th>Tình trạng khớp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr class="selected">
                <td><strong>Slack Business+ Tier</strong><br/><span style="color: var(--muted); font-size: 11px;">Invoice #INV-2026-09-001</span></td>
                <td>01/09/2026 – 30/09/2026</td>
                <td><strong>$825.00 USD</strong></td>
                <td><code>SUB-SLK-BP-01</code> (Slack Business+)</td>
                <td><span class="badge badge-warning">Lệch số suất (55 vs 50)</span></td>
                <td><button class="btn btn-primary btn-sm">Đối chiếu 3 con số ➔</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (screen.id === '09') {
      bodyHtml = `
        <div class="alert-banner warning">
          <span class="alert-icon">⚠️</span>
          <div>
            <strong>Quy tắc nghiệp vụ BR-35.1 & BR-43.1:</strong> Luôn hiển thị BA con số cạnh nhau để so sánh minh bạch. Hệ thống TUYỆT ĐỐI KHÔNG tự sửa số suất thuê bao theo hóa đơn!
          </div>
        </div>
        <div class="three-numbers-grid">
          <div class="number-card highlight-diff">
            <div class="num-label">1. Trên hóa đơn thanh toán</div>
            <div class="num-val" style="color: var(--warning);">55</div>
            <div class="num-sub">$825.00 / tháng ($15/seat)</div>
          </div>
          <div class="number-card">
            <div class="num-label">2. Khai trong thuê bao nội bộ</div>
            <div class="num-val">50</div>
            <div class="num-sub">$750.00 / tháng (Hồ sơ cũ)</div>
          </div>
          <div class="number-card">
            <div class="num-label">3. Đang thực sự sử dụng</div>
            <div class="num-val" style="color: var(--success);">48</div>
            <div class="num-sub">Active members (Slack API)</div>
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Phân tích chênh lệch: +5 seats ($75.00 / tháng)</div>
            <button class="btn btn-primary btn-sm">Quy về 1 trong 3 nguyên nhân (BR-35.2) ➔</button>
          </div>
          <p style="color: var(--muted); margin: 0; font-size: 12.5px;">
            Hóa đơn tính tiền cho 55 seats, cao hơn 5 seats so với hồ sơ thuê bao 50 seats đang lưu trữ. Cần phân định nguyên nhân để giải tỏa khoản cam kết hoặc khiếu nại nhà cung cấp.
          </p>
        </div>
      `;
    } else if (screen.id === '10') {
      bodyHtml = `
        <div class="alert-banner info">
          <span class="alert-icon">⚖️</span>
          <div>
            <strong>Quy tắc nghiệp vụ BR-35.2:</strong> Chênh lệch bắt buộc phải quy được về MỘT trong ba nguyên nhân: (1) Mua thêm chưa cập nhật, (2) Nhà cung cấp tính sai, (3) Dữ liệu nội bộ sai.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Biên bản phân định nguyên nhân chênh lệch hóa đơn Slack</div>
            <span class="badge badge-info">Xác nhận bởi Finance & IT Lead</span>
          </div>
          <div class="radio-card-group">
            <div class="radio-card active">
              <div class="radio-indicator"></div>
              <div>
                <div style="font-weight: 700; color: var(--text);">1. Đã mua thêm nhưng chưa cập nhật hồ sơ thuê bao nội bộ (Đã chọn)</div>
                <div style="font-size: 11.5px; color: var(--muted);">Đã có phê duyệt mua thêm suất nhưng IT/Tài chính chưa cập nhật lại hạn mức trong phân hệ Thuê bao.</div>
              </div>
            </div>
            <div class="radio-card">
              <div class="radio-indicator"></div>
              <div>
                <div style="font-weight: 700; color: var(--text);">2. Nhà cung cấp tính sai / overbilled</div>
                <div style="font-size: 11.5px; color: var(--muted);">Slack tính thừa phí, cần xuất biên bản khiếu nại hoàn tiền (Credit note).</div>
              </div>
            </div>
            <div class="radio-card">
              <div class="radio-indicator"></div>
              <div>
                <div style="font-weight: 700; color: var(--text);">3. Dữ liệu nội bộ sai sót do nhập liệu</div>
                <div style="font-size: 11.5px; color: var(--muted);">Hồ sơ khai báo sai thông tin gói cước ban đầu.</div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Căn cứ chứng từ phê duyệt (Ticket / Request ID):</label>
            <input type="text" class="form-control" value="REQ-2026-0889 — Duyệt chi mở rộng 5 seats Slack cho Dự án AI (Khoản cam kết COM-2026-0889)" readonly />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn btn-secondary">Quay lại</button>
            <button class="btn btn-primary">Chuyển sang ITA-04 cập nhật hồ sơ thuê bao ➔</button>
          </div>
        </div>
      `;
    } else if (screen.id === '11') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">✏️</span>
          <div>
            <strong>Màn hình ITA-04 (Cập nhật dữ liệu thuê bao nội bộ):</strong> Điều chỉnh số suất khai báo từ 50 lên 55 seats theo đúng căn cứ REQ-2026-0889. Lịch sử lưu cả 2 phiên bản cũ và mới trong Audit Log (BR-43.1).
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Chỉnh sửa hồ sơ thuê bao: SUB-SLK-BP-01 (Slack Business+)</div>
            <span class="badge badge-success">ITA-04</span>
          </div>
          <div class="comparison-grid">
            <div class="form-group">
              <label>Số suất cũ (Trước điều chỉnh):</label>
              <input type="text" class="form-control" value="50 seats ($750.00/tháng)" readonly style="background: var(--surface-2);" />
            </div>
            <div class="form-group">
              <label>Số suất mới sau cập nhật:</label>
              <input type="text" class="form-control" value="55 seats ($825.00/tháng)" readonly style="border-color: var(--primary); font-weight: 700;" />
            </div>
          </div>
          <div class="form-group">
            <label>Căn cứ thay đổi dữ liệu:</label>
            <textarea class="form-control" rows="2" readonly>Đối soát hóa đơn INV-2026-09-001 khớp với quyết định duyệt chi REQ-2026-0889 (Khoản cam kết COM-2026-0889 $75.00).</textarea>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-primary">Lưu thay đổi & Đóng đối soát hóa đơn ➔</button>
          </div>
        </div>
      `;
    } else if (screen.id === '12') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">✅</span>
          <div>
            <strong>Hoàn tất đối soát hóa đơn Slack (F-35 · BR-35.2 · s4 → e1):</strong> Số suất thuê bao nội bộ đã khớp 55 seats với hóa đơn. Khoản cam kết <code>COM-2026-0889</code> ($75.00) chính thức chuyển sang <strong>Đã thành chi phí</strong>.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Hóa đơn INV-2026-09-001: ĐÃ ĐỐI SOÁT & GIẢI TỎA CAM KẾT</div>
            <span class="badge badge-success">HOÀN TẤT</span>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card">
              <div class="card-subtitle">Trạng thái kế toán</div>
              <div class="detail-row">
                <span class="detail-label">Số tiền hóa đơn:</span>
                <span class="detail-value">$825.00 USD</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Khoản cam kết liên kết:</span>
                <span class="detail-value">COM-2026-0889 ($75.00)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Trạng thái cam kết mới:</span>
                <span class="detail-value" style="color: var(--success);">ĐÃ THÀNH CHI PHÍ</span>
              </div>
            </div>
            <div class="comparison-card">
              <div class="card-subtitle">Tác động Ledger</div>
              <div class="detail-row">
                <span class="detail-label">Lệch hóa đơn mở:</span>
                <span class="detail-value">1 ➔ 0 (-1 đã khớp)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Đã giải quyết hôm nay:</span>
                <span class="detail-value">6 ➔ 7 (+1 hoàn tất)</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (screen.id === '13') {
      bodyHtml = `
        <div class="alert-banner danger">
          <span class="alert-icon">🚨</span>
          <div>
            <strong>CẢNH BÁO MỨC RẤT CAO (BR-28.3):</strong> Nhà cung cấp có tài khoản nhưng hệ thống nội bộ KHÔNG BIẾT. Dấu hiệu có người được cấp quyền ngoài quy trình kiểm soát (Shadow Access)!
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>⚠️</span>
              <span>Bản ghi sai lệch: DISC-2026-094 (GitHub Business)</span>
            </div>
            <span class="badge badge-danger">MỨC RẤT CAO · SHADOW ACCESS</span>
          </div>
          <div class="comparison-grid">
            <div class="comparison-card" style="border: 2px solid var(--danger);">
              <div class="card-subtitle">Phát hiện trên GitHub Organization</div>
              <div class="detail-row">
                <span class="detail-label">Tài khoản:</span>
                <span class="detail-value">alex.vu@partner-corp.com</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Vai trò phía GitHub:</span>
                <span class="detail-value" style="color: var(--danger); font-weight: 700;">Member (Admin Rights)</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Người gán quyền:</span>
                <span class="detail-value">dev-lead@company.com</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Thời điểm phát hiện:</span>
                <span class="detail-value">17/09/2026 · 14:30 ICT</span>
              </div>
            </div>
            <div class="comparison-card">
              <div class="card-subtitle">Hồ sơ nội bộ SaaS-Sentry</div>
              <div class="detail-row">
                <span class="detail-label">Mã Assignment:</span>
                <span class="detail-value" style="color: var(--danger);">HOÀN TOÀN KHÔNG CÓ</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Yêu cầu duyệt chi:</span>
                <span class="detail-value">Không có Ticket hợp lệ</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Người chịu trách nhiệm:</span>
                <span class="detail-value">Trần Quốc Bảo (IT Security Lead)</span>
              </div>
              <div style="margin-top: 14px;">
                <button class="btn btn-danger btn-sm" style="width: 100%;">Mở điều tra an ninh (ITA-15) ➔</button>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (screen.id === '14') {
      bodyHtml = `
        <div class="alert-banner danger">
          <span class="alert-icon">🛡️</span>
          <div>
            <strong>Màn hình ITA-15 (Điều tra vi phạm cấp quyền):</strong> Phân tích nguồn gốc tài khoản ngoài luồng trước khi ra quyết định Hợp thức hóa (UF-12) hoặc Thu hồi khẩn cấp.
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Báo cáo điều tra tài khoản: alex.vu@partner-corp.com</div>
            <span class="badge badge-danger">ITA-15</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Nhật ký tạo tài khoản:</span>
            <span class="detail-value">Tạo trực tiếp trên GitHub lúc 22:15 ngày 12/09/2026 bởi user dev-lead@company.com</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Các repository đã truy cập:</span>
            <span class="detail-value" style="color: var(--danger);">core-banking-api, payment-gateway, infra-terraform</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Nhận định an ninh:</span>
            <span class="detail-value">Cấp quyền đối tác ngoài luồng, không qua quy trình thẩm định bảo mật & duyệt chi</span>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
            <button class="btn btn-secondary">Hợp thức hóa quyền (Chuyển UF-12)</button>
            <button class="btn btn-danger">Thu hồi tài khoản khẩn cấp (o2 → s4) ➔</button>
          </div>
        </div>
      `;
    } else if (screen.id === '15') {
      bodyHtml = `
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">Điều tra vi phạm DISC-2026-094</div>
            <span class="badge badge-danger">Đang mở Modal quyết định</span>
          </div>
          <div style="color: var(--muted); padding: 10px 0;">Đang mở hộp thoại xử lý vi phạm bảo mật...</div>
        </div>
        <div class="modal-overlay">
          <div class="modal-dialog">
            <div class="modal-header" style="background: var(--danger-soft);">
              <div class="modal-title" style="color: var(--danger);">
                <span>🚨</span>
                <span>Quyết định xử lý Shadow Access: DISC-2026-094</span>
              </div>
              <span style="color: var(--muted); cursor: pointer;">✕</span>
            </div>
            <div class="modal-body">
              <div class="alert-banner danger">
                <span>⚠️</span>
                <span>Tài khoản <strong>alex.vu@partner-corp.com</strong> được xác nhận vi phạm chính sách cấp quyền ngoài quy trình.</span>
              </div>
              <div class="form-group">
                <label>Hành động xử lý:</label>
                <input type="text" class="form-control" value="Thu hồi tài khoản khẩn cấp phía GitHub & Khóa quyền truy cập" readonly style="font-weight: 700; color: var(--danger);" />
              </div>
              <div class="form-group">
                <label>Kết luận kiểm toán & lý do (Bắt buộc theo BR-43.2):</label>
                <textarea class="form-control" rows="3" readonly>Tài khoản đối tác nhà thầu phụ chưa qua phê duyệt chính thức theo quy trình F-07/F-08. Yêu cầu thu hồi ngay lập tức và chuyển hồ sơ rà soát trách nhiệm của dev-lead.</textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary">Đóng</button>
              <button class="btn btn-danger">Xác nhận thu hồi & Đóng bản ghi</button>
            </div>
          </div>
        </div>
      `;
    } else if (screen.id === '16') {
      bodyHtml = `
        <div class="alert-banner success">
          <span class="alert-icon">🏆</span>
          <div>
            <strong>Tuân thủ 100% BR-43.2 & BR-43.3:</strong> Mọi sai lệch đều có một quyết định của người thật kèm lý do và bằng chứng; TUYỆT ĐỐI KHÔNG có sai lệch nào tự đóng theo thời gian!
          </div>
        </div>
        <div class="card-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span>📚</span>
              <span>Sổ nhật ký kiểm toán toàn diện các trường hợp sai lệch (Master Ledger)</span>
            </div>
            <span class="badge badge-success">8 vụ việc đã giải quyết hôm nay</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Mã bản ghi</th>
                <th>Ứng dụng SaaS</th>
                <th>Loại mâu thuẫn dữ liệu</th>
                <th>Mức độ</th>
                <th>Người quyết định</th>
                <th>Biện pháp xử lý</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>DISC-2026-081</code></td>
                <td>Figma Pro</td>
                <td>Hệ thống có, NCC không có</td>
                <td><span class="badge badge-warning">Trung bình</span></td>
                <td>Trần Quốc Bảo (IT)</td>
                <td>Tạo task cấp lại <code>PV-2065</code> sang UF-08</td>
                <td><span class="badge badge-success">Đã giải quyết</span></td>
              </tr>
              <tr>
                <td><code>INV-2026-09-001</code></td>
                <td>Slack Business+</td>
                <td>Hóa đơn lệch (+5 seats)</td>
                <td><span class="badge badge-info">Trung bình</span></td>
                <td>Nguyễn Thị Hoa (Finance)</td>
                <td>Sửa thuê bao 50→55 theo REQ-2026-0889</td>
                <td><span class="badge badge-success">Đã giải quyết</span></td>
              </tr>
              <tr>
                <td><code>DISC-2026-094</code></td>
                <td>GitHub Business</td>
                <td>NCC có, Hệ thống không biết</td>
                <td><span class="badge badge-danger">Rất cao</span></td>
                <td>Trần Quốc Bảo (Security)</td>
                <td>Thu hồi tài khoản & lập biên bản kỷ luật</td>
                <td><span class="badge badge-success">Đã giải quyết</span></td>
              </tr>
              <tr>
                <td><code>PV-2041</code></td>
                <td>GitHub Business</td>
                <td>Chờ chấp nhận ➔ Active</td>
                <td><span class="badge badge-info">Thông tin</span></td>
                <td>Tác vụ hệ thống (QĐ-03)</td>
                <td>Ghi bằng chứng API hoàn tất cấp phát</td>
                <td><span class="badge badge-success">Hoàn tất tự động</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    // Wrap everything in app shell
    return `
      <div class="app-shell"
           data-screen="${escapeHtml(screen.id)}"
           data-stage="${screen.stage}"
           data-total-stages="${screen.totalStages}"
           data-open-member="${ledger.openMember}"
           data-open-invoice="${ledger.openInvoice}"
           data-pending-acceptance="${ledger.pendingAcceptance}"
           data-resolved-today="${ledger.resolvedToday}"
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
                <span class="badge badge-success">Phiên REC-2026-0917</span>
              </div>
            </div>
            ${metricsGridHtml}
            ${bodyHtml}
          </main>
        </div>
      </div>
    `.trim();
  }

  const moduleExports = { renderApp };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = moduleExports;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.UF14Renderer = moduleExports;
  }
})();
