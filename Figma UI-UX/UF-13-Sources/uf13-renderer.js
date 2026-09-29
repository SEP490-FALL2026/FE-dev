/**
 * SaaS-Sentry - Pure Renderer for UF-13
 * Super Admin manages system configurations, detection thresholds, and approval policy workflows
 * Screen Codes: ADM-02, ADM-03, SYS-04
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
    const isSys04 = screen.screenCode === 'SYS-04'

    const actorName = 'Nguyễn Văn Quản'
    const actorRole = 'Quản trị hệ thống · Super Admin'
    const actorEmail = 'quan.nguyen@company.com'
    const actorAvatar = 'VQ'

    // 1. Sidebar HTML
    const sidebarHtml = `
      <aside class="sidebar">
        <div class="brand-header">
          <div class="brand-logo">S</div>
          <div class="brand-title">SaaS-Sentry</div>
          <span class="brand-badge">SUPER ADMIN</span>
        </div>
        <div class="nav-group">
          <div class="nav-label">Quản trị cốt lõi</div>
          <a class="nav-item ${screen.id === '01' ? 'active' : ''}">
            <span class="icon">📊</span>
            <span>Tổng quan hệ thống</span>
          </a>
          <a class="nav-item ${['02', '03', '04', '06', '07', '08', '09'].includes(screen.id) ? 'active' : ''}">
            <span class="icon">⚙️</span>
            <span>Cấu hình & Ngưỡng (ADM-02)</span>
          </a>
          <a class="nav-item ${['10', '11', '12', '13', '14', '15', '16'].includes(screen.id) ? 'active' : ''}">
            <span class="icon">🔀</span>
            <span>Luồng phê duyệt (ADM-03)</span>
          </a>
          <a class="nav-item ${isSys04 ? 'active' : ''}">
            <span class="icon">🛡️</span>
            <span>Phân quyền & SoD (SYS-04)</span>
          </a>
          <a class="nav-item ${screen.id === '15' ? 'active' : ''}">
            <span class="icon">📜</span>
            <span>Nhật ký kiểm toán (BR-38.1)</span>
          </a>
          <a class="nav-item">
            <span class="icon">⚠️</span>
            <span>Cảnh báo tắc nghẽn</span>
          </a>
        </div>
        <div class="user-footer">
          <div class="user-avatar">${actorAvatar}</div>
          <div class="user-info">
            <div class="user-name">${escapeHtml(actorName)}</div>
            <div class="user-role">${escapeHtml(actorRole)}</div>
          </div>
        </div>
      </aside>
    `

    // 2. Top Bar HTML
    const topBarHtml = `
      <header class="topbar">
        <div class="topbar-left">
          <span class="screen-tag">${escapeHtml(screen.screenCode)}</span>
          <div class="breadcrumb">
            <span class="breadcrumb-item">${escapeHtml(screen.breadcrumb.split('/')[0].trim())}</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item">${escapeHtml(screen.breadcrumb.split('/')[1]?.trim() || '')}</span>
            ${
              screen.breadcrumb.split('/')[2]
                ? `
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">${escapeHtml(screen.breadcrumb.split('/')[2].trim())}</span>
            `
                : ''
            }
          </div>
        </div>
        <div class="topbar-right">
          <span class="badge badge-primary">Super Admin Active</span>
          <span class="badge badge-info">SoD-1 Enforced</span>
          <span class="badge ${isSys04 ? 'badge-danger' : 'badge-success'}">
            ${isSys04 ? '● Vi phạm SoD chặn' : '● Không thao tác nghiệp vụ'}
          </span>
        </div>
      </header>
    `

    // 3. Stepper HTML
    const stepperHtml = `
      <div class="stepper-container">
        <div class="stepper">
          ${data.stages
            .map((st, idx) => {
              const isCompleted = screen.stage > st.id
              const isActive = screen.stage === st.id
              const cls = isCompleted ? 'completed' : isActive ? 'active' : ''
              return `
              <div class="step-node ${cls}">
                <div class="step-num">${isCompleted ? '✓' : st.id}</div>
                <span>${escapeHtml(st.name)}</span>
              </div>
              ${idx < data.stages.length - 1 ? `<div class="step-line ${isCompleted ? 'completed' : ''}"></div>` : ''}
            `
            })
            .join('')}
        </div>
        <div class="badge badge-info" style="margin-left: 16px;">
          Chặng ${screen.stage}/6 · Frame ${screen.id}/16
        </div>
      </div>
    `

    // 4. Metric Grid HTML
    const metricGridHtml = `
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">
            <span>Chính sách phê duyệt</span>
            <span class="icon">📜</span>
          </div>
          <div class="metric-value">${ledger.activePolicies}</div>
          <div class="metric-foot">
            <span class="badge badge-primary" style="padding: 1px 6px;">${ledger.policyVersion}</span>
            <span>Quy trình hoạt động</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-label">
            <span>Thông báo theo dõi</span>
            <span class="icon">📩</span>
          </div>
          <div class="metric-value">${ledger.noticeVersion}</div>
          <div class="metric-foot">
            <span class="badge badge-info" style="padding: 1px 6px;">Luật 91/2025</span>
            <span>Minh bạch 5 mục</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-label">
            <span>Nhật ký kiểm toán (Log)</span>
            <span class="icon">🛡️</span>
          </div>
          <div class="metric-value">${ledger.auditLogCount}</div>
          <div class="metric-foot">
            <span class="badge badge-success" style="padding: 1px 6px;">Append-only</span>
            <span>Bất biến (BR-38.1)</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-label">
            <span>Yêu cầu đang chạy (In-flight)</span>
            <span class="icon">⏳</span>
          </div>
          <div class="metric-value">${ledger.inFlightRequests}</div>
          <div class="metric-foot">
            <span class="badge badge-warning" style="padding: 1px 6px;">Giữ chính sách cũ</span>
            <span>Không đứt đoạn (BR-37.2)</span>
          </div>
        </div>
      </div>
    `

    // 5. Dynamic Body Content by Screen
    let bodyContentHtml = ''

    switch (screen.id) {
      case '01': // ADM-02 Dashboard
        bodyContentHtml = `
          <div class="workspace-card">
            <div class="card-header">
              <div class="card-title">
                <span>⚙️ Bàn làm việc Cấu hình Hệ thống & Tham số lõi (ADM-02)</span>
              </div>
              <div class="card-actions">
                <button class="btn btn-primary btn-sm">+ Cấu hình ngưỡng mới</button>
                <button class="btn btn-outline btn-sm">Xem tài liệu BRD v3.11</button>
              </div>
            </div>
            <div class="hierarchy-banner">
              <div class="hierarchy-steps">
                <span>Quy tắc phân giải thứ tự ưu tiên ngưỡng lãng phí (BR-20.1):</span>
                <span class="hierarchy-pill active">1. Từng ứng dụng riêng</span>
                <span>></span>
                <span class="hierarchy-pill">2. Cấp toàn tổ chức</span>
                <span>></span>
                <span class="hierarchy-pill">3. Mặc định hệ thống</span>
              </div>
              <span class="badge badge-info">Đã bãi bỏ cấp phòng ban (QĐ-23)</span>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Ứng dụng / Phạm vi</th>
                    <th>Phân cấp áp dụng</th>
                    <th>Ngưỡng không dùng (ngày)</th>
                    <th>Ghi đè mức tổ chức</th>
                    <th>Chính sách nguồn</th>
                    <th>Ghi chú nghiệp vụ</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.thresholds
                    .map(
                      (t) => `
                    <tr>
                      <td style="font-weight: 600;">${escapeHtml(t.app)}</td>
                      <td><span class="badge badge-info">${escapeHtml(t.scope)}</span></td>
                      <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--primary);">${t.inactiveDays} ngày</td>
                      <td>
                        <span class="badge ${t.override ? 'badge-warning' : 'badge-success'}">
                          ${t.override ? '● GHI ĐÈ' : 'Mặc định'}
                        </span>
                      </td>
                      <td style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">${escapeHtml(t.source)}</td>
                      <td style="color: var(--muted);">${escapeHtml(t.note)}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `
        break

      case '02': // ADM-02 Edit Threshold
        bodyContentHtml = `
          <div class="workspace-card" style="position: relative;">
            <div class="card-header">
              <div class="card-title">
                <span>⚙️ Thiết lập Ngưỡng Lãng phí Đa tầng (BR-20.1)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-primary">Chế độ Super Admin</span>
              </div>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Ứng dụng</th>
                    <th>Cấp độ</th>
                    <th>Ngưỡng không dùng</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.thresholds
                    .map(
                      (t) => `
                    <tr>
                      <td style="font-weight: 600;">${escapeHtml(t.app)}</td>
                      <td>${escapeHtml(t.scope)}</td>
                      <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${t.inactiveDays} ngày</td>
                      <td><span class="badge badge-success">Đang áp dụng</span></td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>

            <!-- Modal Chỉnh sửa Ngưỡng Figma -->
            <div class="modal-overlay">
              <div class="modal-dialog">
                <div class="modal-header">
                  <h3 class="modal-title">Cấu hình Ngưỡng không hoạt động: Figma Enterprise</h3>
                  <span class="badge badge-warning">Ghi đè cấp tổ chức</span>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label class="form-label">Phạm vi áp dụng</label>
                    <input class="form-input" value="Ứng dụng riêng lẻ (Figma Enterprise - Design Dept)" disabled />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Số ngày không phát sinh hoạt động để đánh dấu Lãng phí (Idle)</label>
                    <input class="form-input" type="number" value="30" style="font-weight: 700; color: var(--primary);" />
                    <span style="font-size: 11px; color: var(--muted);">Mức chung của toàn tổ chức là 60 ngày. Ngưỡng riêng 30 ngày sẽ ưu tiên áp dụng cho Figma (BR-20.1).</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Lý do điều chỉnh</label>
                    <input class="form-input" value="License Figma Enterprise chi phí cao ($75/seat/tháng), cần phát hiện thu hồi sớm sau 30 ngày không dùng." />
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-outline">Hủy bỏ</button>
                  <button class="btn btn-primary">Lưu cấu hình ngưỡng (30 ngày)</button>
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '03': // ADM-02 Resolution Matrix
        bodyContentHtml = `
          <div class="workspace-card">
            <div class="card-header">
              <div class="card-title">
                <span>📊 Ma trận Phân giải Ưu tiên Ghi đè Ngưỡng (s1)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-success">Phân giải tự động</span>
              </div>
            </div>
            <div class="hierarchy-banner" style="background: var(--surface-3); border-color: var(--primary);">
              <div class="hierarchy-steps">
                <span style="font-weight: 700; color: var(--primary);">Quy tắc phân giải:</span>
                <span class="hierarchy-pill active">Từng ứng dụng riêng</span>
                <span>ghi đè</span>
                <span class="hierarchy-pill">Toàn tổ chức (60 ngày)</span>
                <span>ghi đè</span>
                <span class="hierarchy-pill">Mặc định hệ thống (90 ngày)</span>
              </div>
              <span class="badge badge-warning">Figma & GitHub đang ghi đè</span>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>SaaS Application</th>
                    <th>Ngưỡng tổ chức</th>
                    <th>Ngưỡng riêng ứng dụng</th>
                    <th>Kết quả phân giải áp dụng</th>
                    <th>Trạng thái ghi đè</th>
                    <th>Minh chứng xử lý</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight: 600;">Figma Enterprise</td>
                    <td style="color: var(--muted);">60 ngày</td>
                    <td style="font-weight: 700; color: var(--primary);">30 ngày</td>
                    <td style="font-weight: 800; color: var(--success); font-family: 'JetBrains Mono', monospace;">30 NGÀY</td>
                    <td><span class="badge badge-warning">● Ghi đè tổ chức</span></td>
                    <td style="font-size: 11px; color: var(--muted);">Figma dùng ngưỡng riêng, ghi đè mức tổ chức</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600;">GitHub Enterprise</td>
                    <td style="color: var(--muted);">60 ngày</td>
                    <td style="font-weight: 700; color: var(--primary);">45 ngày</td>
                    <td style="font-weight: 800; color: var(--success); font-family: 'JetBrains Mono', monospace;">45 NGÀY</td>
                    <td><span class="badge badge-warning">● Ghi đè tổ chức</span></td>
                    <td style="font-size: 11px; color: var(--muted);">GitHub dùng ngưỡng riêng, ghi đè mức tổ chức</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600;">Jira Software Cloud</td>
                    <td style="color: var(--text); font-weight: 600;">60 ngày</td>
                    <td style="color: var(--muted-2);">Không thiết lập</td>
                    <td style="font-weight: 800; color: var(--text); font-family: 'JetBrains Mono', monospace;">60 NGÀY</td>
                    <td><span class="badge badge-info">Thừa hưởng tổ chức</span></td>
                    <td style="font-size: 11px; color: var(--muted);">Áp dụng mức chung tổ chức do không có ngưỡng riêng</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600;">Notion Enterprise</td>
                    <td style="color: var(--text); font-weight: 600;">60 ngày</td>
                    <td style="color: var(--muted-2);">Không thiết lập</td>
                    <td style="font-weight: 800; color: var(--text); font-family: 'JetBrains Mono', monospace;">60 NGÀY</td>
                    <td><span class="badge badge-info">Thừa hưởng tổ chức</span></td>
                    <td style="font-size: 11px; color: var(--muted);">Áp dụng mức chung tổ chức do không có ngưỡng riêng</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `
        break

      case '04': // ADM-02 Simulate Operational Action (d2)
        bodyContentHtml = `
          <div class="workspace-card" style="position: relative;">
            <div class="card-header">
              <div class="card-title">
                <span>⚠️ Giả lập Thao tác Tác nghiệp Nghiệp vụ (d2)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-danger">Thao tác nguy cơ vi phạm SoD-1</span>
              </div>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Mã yêu cầu</th>
                    <th>Nhân viên yêu cầu</th>
                    <th>Phần mềm</th>
                    <th>Loại thao tác nghiệp vụ</th>
                    <th>Quyền hạn cho phép</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-family: 'JetBrains Mono', monospace;">REQ-2026-9012</td>
                    <td>Lê Hoàng Long (NV-0255)</td>
                    <td>Figma Enterprise Seat</td>
                    <td>Gán trực tiếp suất bản quyền (Provision Seat)</td>
                    <td><span class="badge badge-info">IT Admin Only</span></td>
                  </tr>
                  <tr>
                    <td style="font-family: 'JetBrains Mono', monospace;">REQ-2026-9015</td>
                    <td>Trần Thảo My (NV-0190)</td>
                    <td>GitHub Copilot Business</td>
                    <td>Phê duyệt chi phí bản quyền (Approve Cost)</td>
                    <td><span class="badge badge-warning">Người duyệt chi Only</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Modal Giả lập Super Admin can thiệp -->
            <div class="modal-overlay">
              <div class="modal-dialog">
                <div class="modal-header" style="background: var(--surface-3);">
                  <h3 class="modal-title">Thử nghiệm: Super Admin can thiệp gán suất</h3>
                  <span class="badge badge-warning">Kiểm tra rào chắn SoD</span>
                </div>
                <div class="modal-body">
                  <div style="padding: 12px; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border);">
                    <p style="margin: 0 0 8px 0; font-weight: 600;">Thao tác đang kích hoạt:</p>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--primary);">
                      SuperAdmin.AssignLicense(user="NV-0255", license="Figma Enterprise")
                    </div>
                  </div>
                  <p style="margin: 0; color: var(--muted);">
                    Hệ thống sẽ chuyển kiểm tra quyền điều kiện: <strong>Thao tác có thuộc quyền quản trị hệ thống không (d2)?</strong>
                  </p>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-outline">Hủy bỏ</button>
                  <button class="btn btn-danger">Thực thi thao tác gán suất ➔</button>
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '05': // SYS-04 CHẶN PHÂN QUYỀN
        bodyContentHtml = `
          <div class="workspace-card" style="display: flex; align-items: center; justify-content: center; background: var(--surface-2);">
            <div class="sod-block-card">
              <div class="sod-icon-circle">🚫</div>
              <h2 class="sod-title">CHẶN PHÂN QUYỀN — VI PHẠM NGUYÊN TẮC PHÂN TÁCH TRÁCH NHIỆM (SoD-1)</h2>
              <div class="badge badge-danger" style="font-size: 12px; padding: 4px 12px;">MÃ MÀN HÌNH: SYS-04 · QUY TẮC BR-37.1</div>
              <p class="sod-desc">
                <strong>Hệ thống từ chối thực thi:</strong> Super Admin (Quản trị hệ thống) chỉ được phép cấu hình luật,
                <strong>tuyệt đối không được gán suất bản quyền</strong> và <strong>không được phê duyệt yêu cầu nghiệp vụ</strong>.
                Hành động này vi phạm nguyên tắc kiểm soát nội bộ và bảo mật hệ thống.
              </p>
              <div class="sod-log-box">
                <div><strong>[SECURITY ALERT]</strong> Giao dịch đã bị đình chỉ và ghi nhận vào Nhật ký kiểm toán bất biến:</div>
                <div style="margin-top: 6px; color: var(--danger);">• Mã sự kiện: AUD-2026-9940 (SOD_VIOLATION_BLOCKED)</div>
                <div>• Tài khoản kích hoạt: quan.nguyen@company.com (Super Admin)</div>
                <div>• Thao tác bị chặn: Gán suất bản quyền trực tiếp cho NV-0255</div>
                <div>• Tính toàn vẹn: Log Append-only (SHA-256: 3c19b4...99a4) · Không sửa không xóa (BR-38.1)</div>
              </div>
              <div style="display: flex; gap: 12px; margin-top: 8px;">
                <button class="btn btn-primary">Quay lại Bàn làm việc Cấu hình (ADM-02)</button>
                <button class="btn btn-outline">Xem báo cáo Audit Log chi tiết</button>
              </div>
            </div>
          </div>
        `
        break

      case '06': // ADM-02 Config Approver (CEO)
        bodyContentHtml = `
          <div class="workspace-card" style="position: relative;">
            <div class="card-header">
              <div class="card-title">
                <span>👤 Cấu hình Vai trò & Chính sách Phê duyệt (FR-3.13)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-primary">Quyền Super Admin (Cấu hình, không phải phê duyệt)</span>
              </div>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Vai trò hệ thống</th>
                    <th>Người nắm giữ hiện tại</th>
                    <th>Email liên kết</th>
                    <th>Thẩm quyền quyết định</th>
                    <th>Cơ sở dữ liệu ra quyết định</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight: 700;">Người duyệt chi (DC)</td>
                    <td style="font-weight: 600; color: var(--primary);">Phạm Hoàng Nam</td>
                    <td style="font-family: 'JetBrains Mono', monospace;">nv_ceo@company.com</td>
                    <td>Quyết định chi phí và duyệt SaaS mới (CEO)</td>
                    <td><span class="badge badge-info">Snapshot ngân sách (QĐ-29b)</span></td>
                  </tr>
                  <tr>
                    <td style="font-weight: 700;">Người thay thế xung đột</td>
                    <td style="font-weight: 600;">Vũ Đình Khoa</td>
                    <td style="font-family: 'JetBrains Mono', monospace;">nv_coo@company.com</td>
                    <td>Duyệt thay khi CEO là người thụ hưởng (BR-13.10)</td>
                    <td>Cấu hình tĩnh do QT lập trước</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Modal Chọn Người duyệt chi -->
            <div class="modal-overlay">
              <div class="modal-dialog">
                <div class="modal-header">
                  <h3 class="modal-title">Cấu hình Người duyệt chi (DC) toàn tổ chức</h3>
                  <span class="badge badge-info">FR-3.13</span>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label class="form-label">Chọn một Employee giữ vai Người duyệt chi (Mặc định CEO)</label>
                    <select class="form-select" style="font-weight: 600;">
                      <option selected>Phạm Hoàng Nam (CEO · nv_ceo@company.com)</option>
                      <option>Vũ Đình Khoa (Phó Chủ tịch / COO · nv_coo@company.com)</option>
                    </select>
                  </div>
                  <div style="padding: 12px; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border);">
                    <div style="font-size: 12px; font-weight: 600; color: var(--text);">Quy tắc nghiệp vụ QĐ-29b & SoD-1:</div>
                    <div style="font-size: 11px; color: var(--muted); margin-top: 4px;">
                      Người duyệt chi quyết định dựa trên Snapshot ngân sách do hệ thống chụp tại thời điểm duyệt.
                      Tài chính (TC) không nằm trên đường duyệt, chỉ trả lời tư vấn song song nếu được hỏi.
                      Super Admin chỉ thực hiện cấu hình người giữ vai, KHÔNG duyệt thay.
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-outline">Hủy bỏ</button>
                  <button class="btn btn-primary">Xác nhận gán Người duyệt chi: Phạm Hoàng Nam</button>
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '07': // ADM-02 Config Substitute (Conflict of Interest)
        bodyContentHtml = `
          <div class="workspace-card" style="position: relative;">
            <div class="card-header">
              <div class="card-title">
                <span>🛡️ Cấu hình Người Thay Thế khi Xung Đột Lợi Ích (BR-13.10)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-warning">QĐ-28c</span>
              </div>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Tình huống xung đột</th>
                    <th>Người duyệt chi chính</th>
                    <th>Người thay thế được chỉ định trước</th>
                    <th>Cơ chế kích hoạt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CEO tự yêu cầu phần mềm hoặc là người thụ hưởng</td>
                    <td>Phạm Hoàng Nam (CEO)</td>
                    <td style="font-weight: 700; color: var(--primary);">Vũ Đình Khoa (COO / Phó Chủ tịch)</td>
                    <td><span class="badge badge-danger">Tự động chuyển nhánh</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Modal Cấu hình Người thay thế -->
            <div class="modal-overlay">
              <div class="modal-dialog">
                <div class="modal-header">
                  <h3 class="modal-title">Chỉ định Người thay thế khi xung đột lợi ích</h3>
                  <span class="badge badge-warning">BR-13.10</span>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label class="form-label">Người thay thế cho vai trò Người duyệt chi (CEO)</label>
                    <select class="form-select" style="font-weight: 600;">
                      <option selected>Vũ Đình Khoa (COO / Phó Chủ tịch HĐQT · nv_coo@company.com)</option>
                    </select>
                  </div>
                  <div style="padding: 12px; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border);">
                    <div style="font-size: 12px; font-weight: 600; color: var(--text);">Quy định bắt buộc theo BR-13.10:</div>
                    <div style="font-size: 11px; color: var(--muted); margin-top: 4px;">
                      • Là cấu hình tĩnh của Quản trị hệ thống, phải lập trước.<br/>
                      • Chỉ áp dụng khi Người duyệt chi là người yêu cầu hoặc thụ hưởng license.<br/>
                      • KHÔNG do Quản lý hay người yêu cầu tự chọn; KHÔNG áp dụng cho backlog; KHÔNG tạo ứng viên song song.
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-outline">Hủy bỏ</button>
                  <button class="btn btn-primary">Lưu cấu hình người thay thế</button>
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '08': // ADM-02 Config Backlog Threshold
        bodyContentHtml = `
          <div class="workspace-card" style="position: relative;">
            <div class="card-header">
              <div class="card-title">
                <span>⏱️ Cấu hình Ngưỡng Backlog & Cảnh báo Tắc nghẽn SLA (FR-3.8)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-info">Giám sát hiệu năng duyệt</span>
              </div>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Bước duyệt</th>
                    <th>Thời hạn SLA xử lý</th>
                    <th>Ngưỡng cảnh báo tồn đọng (Backlog)</th>
                    <th>Hình thức cảnh báo</th>
                    <th>Quy tắc xử lý</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="font-weight: 600;">Quản lý trực tiếp (QL)</td>
                    <td>48 giờ làm việc</td>
                    <td style="font-weight: 700; color: var(--warning);">> 5 yêu cầu hoặc > 3 ngày</td>
                    <td>Gửi thông báo Escalate</td>
                    <td>Không tự duyệt, không tự chuyển người khác (BR-13.9)</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600;">Người duyệt chi (DC)</td>
                    <td>72 giờ làm việc</td>
                    <td style="font-weight: 700; color: var(--danger);">> 8 yêu cầu hoặc > 3 ngày</td>
                    <td>Cảnh báo bảng điều khiển CEO</td>
                    <td>Escalate chỉ là thông báo, không tự gán lại (QĐ-28d)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Modal Cấu hình Ngưỡng Backlog -->
            <div class="modal-overlay">
              <div class="modal-dialog">
                <div class="modal-header">
                  <h3 class="modal-title">Thiết lập Ngưỡng cảnh báo Backlog cho Người duyệt chi</h3>
                  <span class="badge badge-info">FR-3.8</span>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label class="form-label">Số ngày tồn đọng tối đa trước khi phát cảnh báo</label>
                    <input class="form-input" type="number" value="3" style="font-weight: 700;" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Số lượng yêu cầu trong danh sách chờ tối đa</label>
                    <input class="form-input" type="number" value="8" style="font-weight: 700;" />
                  </div>
                  <div style="font-size: 11px; color: var(--muted); padding: 8px 12px; background: var(--surface-2); border-radius: 6px;">
                    Lưu ý: Tắc nghẽn cao chỉ gửi thông báo nhắc nhở, KHÔNG tự động phê duyệt và KHÔNG tự động đổi người duyệt (QĐ-28d).
                  </div>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-outline">Hủy bỏ</button>
                  <button class="btn btn-primary">Lưu ngưỡng backlog SLA</button>
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '09': // ADM-02 Disclosure Notice Editor v1.3
        bodyContentHtml = `
          <div class="workspace-card" style="position: relative;">
            <div class="card-header">
              <div class="card-title">
                <span>📝 Soạn thảo Nội dung Thông báo Minh bạch Theo dõi (BR-42.5)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-warning">Nâng phiên bản v1.2 ➔ v1.3</span>
              </div>
            </div>
            <div style="display: flex; gap: 16px; flex: 1; overflow: hidden;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
                <div class="form-group">
                  <label class="form-label">Tiêu đề thông báo</label>
                  <input class="form-input" value="Thông báo đo lường mức độ sử dụng ứng dụng SaaS doanh nghiệp (v1.3)" />
                </div>
                <div class="form-group" style="flex: 1;">
                  <label class="form-label">Nội dung tuyên bố minh bạch (5 mục Điều 25 Luật 91/2025/QH15)</label>
                  <textarea class="form-input" style="height: 140px; line-height: 1.5; resize: none; font-size: 12px;">1. Thu gì: Tên miền ứng dụng trong Allowlist và số phút hoạt động làm tròn.
2. KHÔNG thu gì: Không thu URL chi tiết, tiêu đề tab, nội dung trao đổi, phím gõ, webcam hay ảnh chụp màn hình.
3. Mục đích: Tối ưu chi phí bản quyền công nghệ và phát hiện lãng phí license không dùng.
4. Thời hạn lưu trữ: 6 tháng theo chính sách lưu giữ dữ liệu F-44.
5. Quyền của nhân viên: Nhân viên có quyền yêu cầu tạm dừng thu thập bất kỳ lúc nào theo phân hệ F-40.</textarea>
                </div>
              </div>
              <div style="width: 340px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 10px;">
                <div style="font-weight: 700; font-size: 12px; color: var(--danger);">RÀNG BUỘC NGHIỆP VỤ BR-42.5:</div>
                <div style="font-size: 11px; color: var(--text); line-height: 1.5;">
                  Khi nội dung thông báo thay đổi:
                  <ul style="margin: 6px 0; padding-left: 18px;">
                    <li>Hệ thống tự động nâng lên <strong>phiên bản mới (v1.3)</strong>.</li>
                    <li>Toàn bộ nhân viên công ty phải <strong>bấm xác nhận chủ động lại</strong>.</li>
                    <li>Cổng nhận Gateway tạm khóa dữ liệu từ các thiết bị chưa xác nhận v1.3.</li>
                  </ul>
                </div>
                <button class="btn btn-primary" style="margin-top: auto;">Ban hành Thông báo Phiên bản v1.3</button>
              </div>
            </div>
          </div>
        `
        break

      case '10': // ADM-03 Policy List
        bodyContentHtml = `
          <div class="workspace-card">
            <div class="card-header">
              <div class="card-title">
                <span>🔀 Quản lý Luồng Phê duyệt & Chính sách Áp dụng (ADM-03)</span>
              </div>
              <div class="card-actions">
                <button class="btn btn-primary btn-sm">+ Tạo chính sách mới</button>
                <button class="btn btn-outline btn-sm">Mở Khối xem thử Sandbox</button>
              </div>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Mã chính sách</th>
                    <th>Tên chính sách</th>
                    <th>Ứng dụng áp dụng</th>
                    <th>Phân loại</th>
                    <th>Chuỗi bước duyệt hiện hành</th>
                    <th>Trạng thái phiên bản</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.approvalPolicies
                    .map(
                      (p) => `
                    <tr style="${p.code === 'POL-DES-2026' ? 'background: var(--surface-3);' : ''}">
                      <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700;">${escapeHtml(p.code)}</td>
                      <td style="font-weight: 600;">${escapeHtml(p.name)}</td>
                      <td>${escapeHtml(p.app)}</td>
                      <td><span class="badge badge-info">${escapeHtml(p.category)}</span></td>
                      <td style="font-size: 11px; font-weight: 600;">${escapeHtml(p.steps)}</td>
                      <td>
                        <span class="badge ${p.code === 'POL-DES-2026' ? 'badge-warning' : 'badge-success'}">
                          ${escapeHtml(p.status)}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn-outline btn-sm" style="${p.code === 'POL-DES-2026' ? 'border-color: var(--primary); color: var(--primary); font-weight: 700;' : ''}">
                          ${p.code === 'POL-DES-2026' ? 'Biên tập luồng ➔' : 'Chỉnh sửa'}
                        </button>
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `
        break

      case '11': // ADM-03 Edit Policy Nodes
        bodyContentHtml = `
          <div class="workspace-card">
            <div class="card-header">
              <div class="card-title">
                <span>✏️ Soạn thảo Điều kiện & Chuỗi Bước Duyệt: POL-DES-2026 (Figma Enterprise)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-warning">Phiên bản soạn thảo v2.2</span>
                <button class="btn btn-primary btn-sm">Kiểm tra qua Khối xem thử ➔</button>
              </div>
            </div>
            <div class="sandbox-container">
              <div class="sandbox-controls" style="grid-template-columns: 2fr 1fr 1fr;">
                <div class="form-group">
                  <label class="form-label">Điều kiện kích hoạt chính sách</label>
                  <input class="form-input" value="Ứng dụng = Figma Enterprise AND Chi phí ước tính > 5.000.000 VNĐ / năm" />
                </div>
                <div class="form-group">
                  <label class="form-label">Tài chính (TC) tham gia?</label>
                  <input class="form-input" value="Tư vấn song song (QĐ-29b)" disabled />
                </div>
                <div class="form-group">
                  <label class="form-label">Quyết định chi phí</label>
                  <input class="form-input" value="Người duyệt chi (CEO)" disabled />
                </div>
              </div>
              <div class="sandbox-flow-view">
                <div style="font-weight: 700; font-size: 13px; text-align: center; color: var(--muted);">CHUỖI BƯỚC PHÊ DUYỆT ĐANG SOẠN THẢO</div>
                <div class="flow-step-chain">
                  <div class="flow-node-box">
                    <div class="flow-node-title">
                      <span>BƯỚC 1</span>
                      <span class="badge badge-info">Nhu cầu</span>
                    </div>
                    <div style="font-weight: 700; font-size: 13px;">Quản lý trực tiếp (QL)</div>
                    <div class="flow-node-sub">Xác nhận nhu cầu nghiệp vụ thực tế của nhân viên. SLA: 48h.</div>
                  </div>
                  <div class="flow-arrow">
                    <span>➔</span>
                    <span class="flow-arrow-label">Nhu cầu duyệt</span>
                  </div>
                  <div class="flow-node-box highlight">
                    <div class="flow-node-title">
                      <span>BƯỚC 2</span>
                      <span class="badge badge-warning">Chi phí</span>
                    </div>
                    <div style="font-weight: 700; font-size: 13px;">Người duyệt chi (DC)</div>
                    <div class="flow-node-sub">CEO quyết định trên Snapshot ngân sách. Có thể hỏi Tài chính.</div>
                  </div>
                  <div class="flow-arrow">
                    <span>➔</span>
                    <span class="flow-arrow-label">Đồng ý chi</span>
                  </div>
                  <div class="flow-node-box">
                    <div class="flow-node-title">
                      <span>BƯỚC 3</span>
                      <span class="badge badge-success">Cấp phát</span>
                    </div>
                    <div style="font-weight: 700; font-size: 13px;">IT Cấp phát (ITA)</div>
                    <div class="flow-node-sub">IT tạo tài khoản phía nhà cung cấp và ghi nhận chứng từ.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '12': // ADM-03 Simulation Sandbox Case 1
        bodyContentHtml = `
          <div class="workspace-card">
            <div class="card-header">
              <div class="card-title">
                <span>🧪 Khối Xem Thử (Simulation Sandbox) — Tình huống Giả định 1 (a3)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-primary">Mô phỏng an toàn (Không ảnh hưởng dữ liệu thật)</span>
              </div>
            </div>
            <div class="sandbox-container">
              <div class="sandbox-controls">
                <div class="form-group">
                  <label class="form-label">Người yêu cầu giả định</label>
                  <input class="form-input" value="Lê Hoàng Long (Kỹ sư phần mềm · Phòng Kỹ thuật)" />
                </div>
                <div class="form-group">
                  <label class="form-label">Phần mềm yêu cầu</label>
                  <input class="form-input" value="Figma Enterprise Seat" />
                </div>
                <div class="form-group">
                  <label class="form-label">Giá trị & Nguồn cấp</label>
                  <input class="form-input" value="12.000.000 VNĐ / năm (Mua mới, kho trống)" />
                </div>
                <button class="btn btn-primary" style="height: 34px;">▶ Chạy mô phỏng</button>
              </div>
              <div class="sandbox-flow-view">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 700; font-size: 13px; color: var(--success);">✔ KẾT QUẢ MÔ PHỎNG: Khớp chính sách [POL-DES-2026]</span>
                  <span class="badge badge-success">Chuỗi bước sinh ra hợp lệ</span>
                </div>
                <div class="flow-step-chain">
                  <div class="flow-node-box success">
                    <div class="flow-node-title">
                      <span>B1: Quản lý</span>
                      <span class="badge badge-success">Khớp</span>
                    </div>
                    <div style="font-weight: 700;">Trần Minh Tuấn (Lead)</div>
                    <div class="flow-node-sub">Xác nhận nhu cầu thiết kế UI/UX cho dự án mới.</div>
                  </div>
                  <div class="flow-arrow">➔</div>
                  <div class="flow-node-box success">
                    <div class="flow-node-title">
                      <span>B2: Người duyệt chi</span>
                      <span class="badge badge-success">Khớp</span>
                    </div>
                    <div style="font-weight: 700;">Phạm Hoàng Nam (CEO)</div>
                    <div class="flow-node-sub">Duyệt ngân sách 12.000.000 VNĐ trên Snapshot Q3/2026.</div>
                  </div>
                  <div class="flow-arrow">➔</div>
                  <div class="flow-node-box success">
                    <div class="flow-node-title">
                      <span>B3: IT Cấp phát</span>
                      <span class="badge badge-success">Khớp</span>
                    </div>
                    <div style="font-weight: 700;">Trần Quốc Bảo (IT)</div>
                    <div class="flow-node-sub">Gán bản quyền trên Figma Admin Console.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '13': // ADM-03 Sandbox Logic Flaw Detected
        bodyContentHtml = `
          <div class="workspace-card">
            <div class="card-header">
              <div class="card-title">
                <span>⚠️ Khối Xem Thử — Phát hiện Chuỗi Bước Chưa Đúng Ý (d3 ➔ a4)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-danger">Phát hiện thiếu điều kiện nghiệp vụ</span>
              </div>
            </div>
            <div class="sandbox-container">
              <div class="sandbox-controls">
                <div class="form-group">
                  <label class="form-label">Người yêu cầu giả định</label>
                  <input class="form-input" value="Lê Hoàng Long (NV-0255)" />
                </div>
                <div class="form-group">
                  <label class="form-label">Tình huống kiểm thử</label>
                  <input class="form-input" value="Cấp phát từ KHO SẴN CÓ (Chi phí = 0 VNĐ)" style="color: var(--danger); font-weight: 700;" />
                </div>
                <div class="form-group">
                  <label class="form-label">Kỳ vọng nghiệp vụ</label>
                  <input class="form-input" value="Bỏ qua Người duyệt chi theo QĐ-29a" />
                </div>
                <button class="btn btn-outline" style="height: 34px;">Chạy lại</button>
              </div>
              <div class="sandbox-flow-view">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 700; font-size: 13px; color: var(--danger);">✖ PHÁT HIỆN SAI SÓT: Yêu cầu 0 VNĐ vẫn bị đưa lên Người duyệt chi (CEO)!</span>
                  <span class="badge badge-danger">Vi phạm QĐ-29a</span>
                </div>
                <div class="flow-step-chain">
                  <div class="flow-node-box">
                    <div class="flow-node-title">B1: Quản lý</div>
                    <div style="font-weight: 700;">Trần Minh Tuấn</div>
                  </div>
                  <div class="flow-arrow">➔</div>
                  <div class="flow-node-box error">
                    <div class="flow-node-title">
                      <span>B2: Duyệt chi (LỖI)</span>
                      <span class="badge badge-danger">Thừa bước</span>
                    </div>
                    <div style="font-weight: 700;">Phạm Hoàng Nam (CEO)</div>
                    <div class="flow-node-sub" style="color: var(--danger);">0 VNĐ không cần CEO duyệt chi! Gây nghẽn quy trình.</div>
                  </div>
                  <div class="flow-arrow">➔</div>
                  <div class="flow-node-box">
                    <div class="flow-node-title">B3: Cấp phát</div>
                    <div style="font-weight: 700;">IT Admin</div>
                  </div>
                </div>
                <div style="display: flex; justify-content: center; gap: 12px; margin-top: 10px;">
                  <button class="btn btn-danger">Sửa lại điều kiện & chuỗi bước (a4) ➔</button>
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '14': // ADM-03 Sandbox Fixed & Verified
        bodyContentHtml = `
          <div class="workspace-card">
            <div class="card-header">
              <div class="card-title">
                <span>✔ Đã Bổ Sung Nhánh QĐ-29a & Mô Phỏng Lại Thành Công (a4 ➔ a3 ➔ d3)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-success">Khớp hoàn toàn quy tắc BRD</span>
              </div>
            </div>
            <div class="sandbox-container">
              <div class="hierarchy-banner" style="background: var(--success-soft); border-color: var(--success);">
                <div class="hierarchy-steps">
                  <span style="font-weight: 700; color: var(--success);">Rẽ nhánh thông minh:</span>
                  <span class="hierarchy-pill active">Nếu cấp từ kho sẵn có (0 VNĐ) ➔ Chỉ cần Quản lý duyệt (Bỏ qua CEO)</span>
                  <span class="hierarchy-pill">Nếu phát sinh chi phí mới (> 0 VNĐ) ➔ Qua Người duyệt chi</span>
                </div>
                <span class="badge badge-success">Đạt chuẩn QĐ-29a</span>
              </div>
              <div class="sandbox-flow-view">
                <div style="font-weight: 700; font-size: 13px; color: var(--success); text-align: center;">
                  LUỒNG ĐƯỢC MÔ PHỎNG LẠI CHO TRƯỜNG HỢP 0 VNĐ (KHO SẴN CÓ)
                </div>
                <div class="flow-step-chain">
                  <div class="flow-node-box success">
                    <div class="flow-node-title">
                      <span>BƯỚC 1</span>
                      <span class="badge badge-success">Xác nhận</span>
                    </div>
                    <div style="font-weight: 700;">Quản lý trực tiếp (QL)</div>
                    <div class="flow-node-sub">Xác nhận nhu cầu sử dụng công việc.</div>
                  </div>
                  <div class="flow-arrow">
                    <span>➔</span>
                    <span class="flow-arrow-label">0 VNĐ (Kho sẵn có)</span>
                  </div>
                  <div class="flow-node-box success" style="border: 2px dashed var(--success);">
                    <div class="flow-node-title">
                      <span>NHÁNH NHANH</span>
                      <span class="badge badge-info">Fast-track</span>
                    </div>
                    <div style="font-weight: 700; color: var(--success);">Bỏ qua Duyệt chi</div>
                    <div class="flow-node-sub">Không phát sinh ngân sách mới (QĐ-29a).</div>
                  </div>
                  <div class="flow-arrow">➔</div>
                  <div class="flow-node-box success">
                    <div class="flow-node-title">
                      <span>BƯỚC 2</span>
                      <span class="badge badge-success">Cấp phát</span>
                    </div>
                    <div style="font-weight: 700;">IT Admin Cấp phát</div>
                    <div class="flow-node-sub">Gán trực tiếp từ kho bản quyền hiện có.</div>
                  </div>
                </div>
                <div style="display: flex; justify-content: center; gap: 12px; margin-top: 10px;">
                  <button class="btn btn-primary">Xác nhận chuỗi bước đúng ý & Tiến hành Lưu áp dụng ➔</button>
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '15': // ADM-03 Publish Policy & Append-Only Audit Log
        bodyContentHtml = `
          <div class="workspace-card">
            <div class="card-header">
              <div class="card-title">
                <span>📜 Lưu Áp Dụng Chính Sách & Ghi Nhật Ký Kiểm Toán (s3 · BR-38.1)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-success">Chính sách v2.2 Đã Ban Hành</span>
              </div>
            </div>
            <div style="display: flex; gap: 16px; flex: 1; overflow: hidden;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
                <div style="padding: 16px; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border);">
                  <div style="font-weight: 700; font-size: 14px; color: var(--text);">Chính sách POL-DES-2026 (Phiên bản v2.2) đã kích hoạt</div>
                  <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">
                    Cập nhật thành công luồng phê duyệt bản quyền Figma Enterprise.
                    Bổ sung nhánh fast-track không qua Người duyệt chi cho license cấp từ kho (QĐ-29a).
                  </div>
                </div>
                <div style="font-weight: 700; font-size: 13px; color: var(--text); margin-top: 4px;">NHẬT KÝ KIỂM TOÁN CHỈ GHI THÊM (APPEND-ONLY · BR-38.1):</div>
                <div class="audit-list">
                  ${data.auditStream
                    .map(
                      (a) => `
                    <div class="audit-item">
                      <div>
                        <span class="audit-id">${escapeHtml(a.id)}</span>
                        <span style="margin: 0 8px; color: var(--muted-2);">|</span>
                        <span class="audit-action">${escapeHtml(a.action)}</span>
                        <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">
                          ${escapeHtml(a.user)} · ${escapeHtml(a.target)}
                        </div>
                      </div>
                      <div style="text-align: right;">
                        <span class="badge ${a.status.includes('DENIED') ? 'badge-danger' : 'badge-success'}">${escapeHtml(a.status)}</span>
                        <div class="audit-hash" style="margin-top: 4px;">SHA256: ${escapeHtml(a.hash)}</div>
                      </div>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            </div>
          </div>
        `
        break

      case '16': // ADM-03 Effective Handoff
        bodyContentHtml = `
          <div class="workspace-card">
            <div class="card-header">
              <div class="card-title">
                <span>🏁 Xác nhận Hiệu lực Chính sách & Handoff Yêu cầu Mới (s4 ➔ e2)</span>
              </div>
              <div class="card-actions">
                <span class="badge badge-success">Cấu hình có hiệu lực từ nay</span>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 16px; flex: 1;">
              <div style="padding: 16px; border-radius: 10px; background: var(--surface-3); border: 1px solid var(--primary); display: flex; align-items: center; gap: 16px;">
                <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;">
                  ✓
                </div>
                <div>
                  <div style="font-size: 16px; font-weight: 700; color: var(--text);">Cấu hình hệ thống và chính sách phê duyệt mới đã chính thức áp dụng!</div>
                  <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
                    Hiệu lực thi hành: Từ 17/09/2026 20:00 ICT. Tất cả các yêu cầu mới tạo sẽ đi theo chính sách v2.2.
                  </div>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1;">
                <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                  <div style="font-weight: 700; font-size: 13px; color: var(--warning);">1. YÊU CẦU ĐANG CHẠY (IN-FLIGHT · BR-37.2)</div>
                  <div style="font-size: 12px; color: var(--muted); line-height: 1.5;">
                    • <strong>5 yêu cầu đang chạy</strong> tiếp tục giữ nguyên chính sách cũ (v2.1).<br/>
                    • Quy trình duyệt không bị ngắt quãng, đảm bảo tính liên tục của doanh nghiệp.<br/>
                    • Nếu đổi người giữ vai (CEO), các bước đang chờ được xác định lại theo BR-13.9 mà SLA không bị đặt lại.
                  </div>
                </div>
                <div style="background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                  <div style="font-weight: 700; font-size: 13px; color: var(--success);">2. YÊU CẦU TẠO TỪ NAY (E2 · HOÀN TẤT)</div>
                  <div style="font-size: 12px; color: var(--muted); line-height: 1.5;">
                    • Áp dụng chuỗi bước mới v2.2.<br/>
                    • Tự động rẽ nhánh fast-track (0 VNĐ) khi cấp phát từ kho sẵn có.<br/>
                    • Nhân viên đã nhận thông báo v1.3 để xác nhận theo dõi minh bạch.
                  </div>
                </div>
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: auto;">
                <button class="btn btn-outline">Xem toàn bộ Nhật ký kiểm toán</button>
                <button class="btn btn-primary">Hoàn tất quy trình Quản trị (UF-13)</button>
              </div>
            </div>
          </div>
        `
        break

      default:
        bodyContentHtml = `<div class="workspace-card"><p>Screen ID ${screen.id} not found</p></div>`
    }

    // Return Complete 1440x1024 Shell
    return `
      <div class="app-shell" data-screen="${escapeHtml(screen.id)}" data-stage="${screen.stage}">
        ${sidebarHtml}
        <main class="main-wrapper">
          ${topBarHtml}
          ${stepperHtml}
          <div class="content-body">
            <div class="page-header">
              <div>
                <h1 class="page-title">${escapeHtml(screen.title)}</h1>
                <p class="page-subtitle">${escapeHtml(screen.subtitle)}</p>
              </div>
              <div>
                <span class="badge badge-info">SaaS-Sentry Governance Engine</span>
              </div>
            </div>
            ${metricGridHtml}
            ${bodyContentHtml}
          </div>
        </main>
      </div>
    `
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { renderApp }
  } else {
    window.UF13Renderer = { renderApp }
  }
})()
