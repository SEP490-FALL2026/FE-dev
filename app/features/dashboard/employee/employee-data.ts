export interface EmployeeSummaryCard {
  accent: 'primary' | 'warning' | 'danger' | 'info'
  change?: number
  footerKey: string
  subtitleKey: string
  titleKey: string
  value: number
}

export interface EmployeeSoftwareItem {
  assignedDate: string
  category: string
  costPerMonth: number
  daysLeft?: number
  description: string
  expirationDate: string | null
  id: string
  licenseKey: string
  logoUrl: string
  name: string
  plan: string
  status: 'active' | 'expiringSoon' | 'pending' | 'returned'
  usage: number
  vendor: string
}

export interface EmployeeRequestItem {
  businessReason: string
  currentApprover: string
  currentStep: {
    descriptionKey: string
    nameKey: string
    status: 'pending' | 'approved' | 'rejected' | 'completed'
    stepIndex: number
    totalSteps: number
  }
  history: {
    actor: string
    comment?: string
    date: string
    stage: string
    status: string
  }[]
  id: string
  plan: string
  priority: 'normal' | 'urgent'
  project: string
  requestType: 'newSoftware' | 'changePlan' | 'renewal' | 'returnLicense'
  softwareLogoUrl: string
  softwareName: string
  status: 'pending' | 'approved' | 'completed' | 'rejected' | 'cancelled'
  submittedDate: string
  submittedTime: string
}

export interface CatalogSoftwareItem {
  category: string
  cost: string
  descriptionKey: string
  id: string
  isAvailable: boolean
  logoUrl: string
  name: string
  popularBadge?: string
}

export const employeeSummaryCards: EmployeeSummaryCard[] = [
  {
    accent: 'primary',
    change: 1,
    footerKey: 'overview.cards.mySoftware.footer',
    subtitleKey: 'overview.cards.mySoftware.subtitle',
    titleKey: 'overview.cards.mySoftware.title',
    value: 6
  },
  {
    accent: 'warning',
    change: 1,
    footerKey: 'overview.cards.pendingRequests.footer',
    subtitleKey: 'overview.cards.pendingRequests.subtitle',
    titleKey: 'overview.cards.pendingRequests.title',
    value: 2
  },
  {
    accent: 'danger',
    change: 0,
    footerKey: 'overview.cards.expiringSoon.footer',
    subtitleKey: 'overview.cards.expiringSoon.subtitle',
    titleKey: 'overview.cards.expiringSoon.title',
    value: 1
  },
  {
    accent: 'info',
    change: 3,
    footerKey: 'overview.cards.totalRequests.footer',
    subtitleKey: 'overview.cards.totalRequests.subtitle',
    titleKey: 'overview.cards.totalRequests.title',
    value: 12
  }
]

export const employeeSoftwareItems: EmployeeSoftwareItem[] = [
  {
    assignedDate: '15/01/2026',
    category: 'Design',
    costPerMonth: 350000,
    daysLeft: 128,
    description: 'Thiết kế giao diện và hệ thống thiết kế cho các dự án web và mobile.',
    expirationDate: '31/12/2026',
    id: '1',
    licenseKey: 'FIG-PRO-2026-8819',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAY2oGXwrNswloS79c3TYFFMeuKDhIXnXy9TbH6L45gO5C4iqaJbdP4nHMhVyYyp8OUy6N8LnEY5UmvOvFc4oc8c8iJ1rPXe2H5eDHF-Yw0KK19QfjGq13_t9TzQk1BtiFSCTlPZrBYDeqSWBTkpuXfj_xBoL4ZFR4GUDHOowEHTwp5WOvwhu28ur4pcZMxs8fokdIGomLcFSKWSvInOLOQrAXQ5ov7npHE9Sn_C8_Jnf125b28Z19A',
    name: 'Figma',
    plan: 'Professional',
    status: 'active',
    usage: 84,
    vendor: 'Figma, Inc.'
  },
  {
    assignedDate: '03/02/2026',
    category: 'Development',
    costPerMonth: 500000,
    description: 'Quản lý kho mã nguồn, CI/CD và cộng tác lập trình.',
    expirationDate: null,
    id: '2',
    licenseKey: 'GH-ENT-2026-9041',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnpmmCjyTSEXXNq7UWRzodxjG1Px9wi0KT_EUU5HoWjFDkUCFgr2-3yO8nUfZR17g41UKtxHDjZJcuzNH0Ti33hGioyJa6ybmK3rjh9VUAoLac9-ekte9Bqx28CL2dgoNLNuoFbh_oyByyYYbahUkdme-uj_jcFZlDYEkhpSxMWAgcvOHAAhqHGc5Gbi62UkKNP48WY6zhwWbpAJ8XfrIs1EqHDpckcKXzcgujEaomnxygHpklLWM7',
    name: 'GitHub',
    plan: 'Enterprise',
    status: 'active',
    usage: 95,
    vendor: 'GitHub, Inc.'
  },
  {
    assignedDate: '12/03/2026',
    category: 'Productivity',
    costPerMonth: 210000,
    description: 'Quản lý tác vụ dự án và theo dõi lỗi phát triển phần mềm.',
    expirationDate: null,
    id: '3',
    licenseKey: 'ATL-JIRA-STD-5521',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYweHTA7aXpPqNqwpQNlTa2hrupGMR1dtt44E4zMdhQKNDgCiEnGzhZIzUzLcGJtiVc-RWDLG65bJIE-QPgfUodFy8Xfq6jGgWxu_bfsDwfMjQlacDH-HIYlJFf_8mXcqxkKdl_Z29XfiTwpTtP6IhaixTo6OKGDxvXwnXRhkceXKAoV1loaAjuZLK1KMRyZqhS4hB80G6IS1wUrGilHukmJoPQOkIoiId_paOKiTrxbYVFLBwSlXD',
    name: 'Jira',
    plan: 'Standard',
    status: 'active',
    usage: 72,
    vendor: 'Atlassian'
  },
  {
    assignedDate: '20/03/2026',
    category: 'Communication',
    costPerMonth: 180000,
    description: 'Kênh giao tiếp và trao đổi công việc nội bộ theo thời gian thực.',
    expirationDate: null,
    id: '4',
    licenseKey: 'SLK-PRO-2026-4439',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0e52KaBz-wrj7aVR5RGtohKukMuYMijRura1Z8h2MTZ-032zUhY885RIHJL1sjP3QjFVFOMsK2u9d6idARJL3oPL4__3SoaMuI7KXDzAMDtqke6zS7jzHoXH2s_jBwvPb1ImSXMJ_8VtVvJEj2vc3iwuEMDcG6C141Y_r3Y4648MfpJuCT7tmojFP8oTc1R5QJIWMhxtrSY1ciISw1u4DXtEb1JGNgvfmk0GQUjNFo-uhU7CyO60c',
    name: 'Slack',
    plan: 'Pro',
    status: 'active',
    usage: 88,
    vendor: 'Slack Technologies'
  },
  {
    assignedDate: '05/04/2026',
    category: 'Productivity',
    costPerMonth: 280000,
    description: 'Bộ ứng dụng văn phòng đám mây bao gồm Outlook, Word, Excel, Teams.',
    expirationDate: null,
    id: '5',
    licenseKey: 'MS-365-BIZ-1092',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXhxSWl4qJL-6-gyaTbcJeww-yW2wz4JqkdAnpH6XLJhUJKD1WpwOVAbLgRmIs2WGIWBDuMK31GMT1xUo8IRc_5ILHhYFnS1W6U5MBmIrWzYU5nlhd6HqZrXWvalulVD8dLIoq7o3Si6m3prs29wgAmwMmHS8xZ1qGtS2Ciix6tH_ftLdPqcX9LF1TUY8fyML_Q09A79lIVMT0rC3UwznaWmLjrSTk-8sKGlyQit0Q7hiB6wuE0GNa',
    name: 'Microsoft 365',
    plan: 'Business',
    status: 'active',
    usage: 65,
    vendor: 'Microsoft'
  },
  {
    assignedDate: '18/04/2026',
    category: 'Communication',
    costPerMonth: 320000,
    daysLeft: 14,
    description: 'Họp trực tuyến và gọi video độ phân giải cao cho nhóm dự án.',
    expirationDate: '18/05/2026',
    id: '6',
    licenseKey: 'ZM-PRO-2026-6644',
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDEtaDbbvQWTCU1sQX9WTrEmuyg6zro-5UosuEjQZ--JsL1udrUmsw_Nms4I7lEh1EVvYLYfnKcjbNDGsbQhugpOCFUHXf91NeRi8QEXwvXIZ2BeS5yZavU3a8zK5gVWusDPZuS_XAStn6-jODJBsWuVGskgza-ECKb9Ot4Bo6jA77XMN_QNW7gQ2rrsopnaR7CKQagRFcYo47xJd-jrmD5sNavW6OULz9tWVG4SmIN8Q6LDIXX5KgO',
    name: 'Zoom',
    plan: 'Pro',
    status: 'expiringSoon',
    usage: 42,
    vendor: 'Zoom Video Comm.'
  }
]

export const employeeRequestItems: EmployeeRequestItem[] = [
  {
    businessReason:
      'Cần nâng cấp gói Figma Enterprise để sử dụng tính năng Branching và Design Tokens cho team 15 người.',
    currentApprover: 'Lê Hoàng Nam (IT Admin)',
    currentStep: {
      descriptionKey: 'myRequests.steps.itReviewDesc',
      nameKey: 'myRequests.steps.itReview',
      status: 'pending',
      stepIndex: 2,
      totalSteps: 3
    },
    history: [
      {
        actor: 'Nguyễn Văn An (Employee)',
        comment: 'Đã gửi yêu cầu cấp đổi gói phần mềm',
        date: '28/09/2026 09:30',
        stage: 'Khởi tạo',
        status: 'completed'
      },
      {
        actor: 'Trần Thị Mai (Line Manager)',
        comment: 'Phê duyệt: Đã xác nhận nhu cầu nghiệp vụ cho dự án Alpha',
        date: '28/09/2026 14:15',
        stage: 'Quản lý duyệt',
        status: 'approved'
      },
      {
        actor: 'Lê Hoàng Nam (IT Admin)',
        date: '28/09/2026 14:30',
        stage: 'IT Admin xử lý',
        status: 'pending'
      }
    ],
    id: 'REQ-1024',
    plan: 'Enterprise',
    priority: 'urgent',
    project: 'Dự án Alpha Web Portal',
    requestType: 'changePlan',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAY2oGXwrNswloS79c3TYFFMeuKDhIXnXy9TbH6L45gO5C4iqaJbdP4nHMhVyYyp8OUy6N8LnEY5UmvOvFc4oc8c8iJ1rPXe2H5eDHF-Yw0KK19QfjGq13_t9TzQk1BtiFSCTlPZrBYDeqSWBTkpuXfj_xBoL4ZFR4GUDHOowEHTwp5WOvwhu28ur4pcZMxs8fokdIGomLcFSKWSvInOLOQrAXQ5ov7npHE9Sn_C8_Jnf125b28Z19A',
    softwareName: 'Figma',
    status: 'pending',
    submittedDate: '28/09/2026',
    submittedTime: '09:30'
  },
  {
    businessReason: 'Cần license Notion Team để tổng hợp tài liệu kiến trúc và hướng dẫn onboarding thành viên mới.',
    currentApprover: 'Trần Thị Mai (Line Manager)',
    currentStep: {
      descriptionKey: 'myRequests.steps.managerReviewDesc',
      nameKey: 'myRequests.steps.managerReview',
      status: 'pending',
      stepIndex: 1,
      totalSteps: 3
    },
    history: [
      {
        actor: 'Nguyễn Văn An (Employee)',
        comment: 'Đã gửi yêu cầu cấp license mới',
        date: '26/09/2026 10:15',
        stage: 'Khởi tạo',
        status: 'completed'
      },
      {
        actor: 'Trần Thị Mai (Line Manager)',
        date: '26/09/2026 10:20',
        stage: 'Quản lý duyệt',
        status: 'pending'
      }
    ],
    id: 'REQ-1025',
    plan: 'Team Workspace',
    priority: 'normal',
    project: 'Hạ tầng Tri thức Kỹ thuật',
    requestType: 'newSoftware',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZNsjx2ze-dBm-PlU2hui9RaJJoRnSHH3PKTpjTi9uMMfdmu-d-vVsX_QDCGoioA8nNv8or8ZPe6NLK35NcBt5KdjJLixQ2hpTGtCyfRWJyywQYS2EFaSf9azdGhsNPjvRAePJnKcIJXLkxRpS14BMUMnNLZ68dH3melYSI9yfRQK8FMrzLWuNXZNUS1DYPs_XDSoaCpEI0AJx_TUF36W55NOabZ2ggLxdTUBKkOJESfGvNpfgOg4H',
    softwareName: 'Notion',
    status: 'pending',
    submittedDate: '26/09/2026',
    submittedTime: '10:15'
  },
  {
    businessReason: 'Gia hạn tạm thời Zoom Pro thêm 3 tháng để phối hợp chạy thử nghiệm với đối tác Singapore.',
    currentApprover: 'Hoàn tất',
    currentStep: {
      descriptionKey: 'myRequests.steps.completedDesc',
      nameKey: 'myRequests.steps.completed',
      status: 'completed',
      stepIndex: 3,
      totalSteps: 3
    },
    history: [
      {
        actor: 'Nguyễn Văn An (Employee)',
        date: '10/09/2026 15:00',
        stage: 'Khởi tạo',
        status: 'completed'
      },
      {
        actor: 'Trần Thị Mai (Line Manager)',
        comment: 'Duyệt gia hạn theo tiến độ dự án',
        date: '11/09/2026 09:10',
        stage: 'Quản lý duyệt',
        status: 'approved'
      },
      {
        actor: 'Hệ thống tự động (API Connector)',
        comment: 'Đã gia hạn license Zoom Pro thành công',
        date: '11/09/2026 09:12',
        stage: 'Cấp phát tự động',
        status: 'completed'
      }
    ],
    id: 'REQ-1020',
    plan: 'Pro',
    priority: 'normal',
    project: 'Hợp tác Quốc tế APAC',
    requestType: 'renewal',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDEtaDbbvQWTCU1sQX9WTrEmuyg6zro-5UosuEjQZ--JsL1udrUmsw_Nms4I7lEh1EVvYLYfnKcjbNDGsbQhugpOCFUHXf91NeRi8QEXwvXIZ2BeS5yZavU3a8zK5gVWusDPZuS_XAStn6-jODJBsWuVGskgza-ECKb9Ot4Bo6jA77XMN_QNW7gQ2rrsopnaR7CKQagRFcYo47xJd-jrmD5sNavW6OULz9tWVG4SmIN8Q6LDIXX5KgO',
    softwareName: 'Zoom',
    status: 'approved',
    submittedDate: '10/09/2026',
    submittedTime: '15:00'
  },
  {
    businessReason: 'Trả lại bản quyền Tableau Desktop do team đã chuyển sang dùng Power BI của công ty.',
    currentApprover: 'Đã thu hồi',
    currentStep: {
      descriptionKey: 'myRequests.steps.completedDesc',
      nameKey: 'myRequests.steps.completed',
      status: 'completed',
      stepIndex: 3,
      totalSteps: 3
    },
    history: [
      {
        actor: 'Nguyễn Văn An (Employee)',
        date: '02/09/2026 14:00',
        stage: 'Gửi yêu cầu trả',
        status: 'completed'
      },
      {
        actor: 'Lê Hoàng Nam (IT Admin)',
        comment: 'Đã thu hồi seat license về pool chung',
        date: '03/09/2026 08:45',
        stage: 'Thu hồi bản quyền',
        status: 'completed'
      }
    ],
    id: 'REQ-1018',
    plan: 'Creator License',
    priority: 'normal',
    project: 'Tối ưu chi phí phần mềm',
    requestType: 'returnLicense',
    softwareLogoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYweHTA7aXpPqNqwpQNlTa2hrupGMR1dtt44E4zMdhQKNDgCiEnGzhZIzUzLcGJtiVc-RWDLG65bJIE-QPgfUodFy8Xfq6jGgWxu_bfsDwfMjQlacDH-HIYlJFf_8mXcqxkKdl_Z29XfiTwpTtP6IhaixTo6OKGDxvXwnXRhkceXKAoV1loaAjuZLK1KMRyZqhS4hB80G6IS1wUrGilHukmJoPQOkIoiId_paOKiTrxbYVFLBwSlXD',
    softwareName: 'Tableau',
    status: 'completed',
    submittedDate: '02/09/2026',
    submittedTime: '14:00'
  }
]

export const catalogSoftwareList: CatalogSoftwareItem[] = [
  {
    category: 'Design',
    cost: '350.000 ₫/tháng',
    descriptionKey: 'requestNewSoftware.catalog.figmaDesc',
    id: 'figma',
    isAvailable: true,
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAY2oGXwrNswloS79c3TYFFMeuKDhIXnXy9TbH6L45gO5C4iqaJbdP4nHMhVyYyp8OUy6N8LnEY5UmvOvFc4oc8c8iJ1rPXe2H5eDHF-Yw0KK19QfjGq13_t9TzQk1BtiFSCTlPZrBYDeqSWBTkpuXfj_xBoL4ZFR4GUDHOowEHTwp5WOvwhu28ur4pcZMxs8fokdIGomLcFSKWSvInOLOQrAXQ5ov7npHE9Sn_C8_Jnf125b28Z19A',
    name: 'Figma',
    popularBadge: 'Thiết kế UI/UX'
  },
  {
    category: 'Development',
    cost: '500.000 ₫/tháng',
    descriptionKey: 'requestNewSoftware.catalog.githubDesc',
    id: 'github',
    isAvailable: true,
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCnpmmCjyTSEXXNq7UWRzodxjG1Px9wi0KT_EUU5HoWjFDkUCFgr2-3yO8nUfZR17g41UKtxHDjZJcuzNH0Ti33hGioyJa6ybmK3rjh9VUAoLac9-ekte9Bqx28CL2dgoNLNuoFbh_oyByyYYbahUkdme-uj_jcFZlDYEkhpSxMWAgcvOHAAhqHGc5Gbi62UkKNP48WY6zhwWbpAJ8XfrIs1EqHDpckcKXzcgujEaomnxygHpklLWM7',
    name: 'GitHub Enterprise',
    popularBadge: 'Lập trình viên'
  },
  {
    category: 'Project Management',
    cost: '210.000 ₫/tháng',
    descriptionKey: 'requestNewSoftware.catalog.jiraDesc',
    id: 'jira',
    isAvailable: true,
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYweHTA7aXpPqNqwpQNlTa2hrupGMR1dtt44E4zMdhQKNDgCiEnGzhZIzUzLcGJtiVc-RWDLG65bJIE-QPgfUodFy8Xfq6jGgWxu_bfsDwfMjQlacDH-HIYlJFf_8mXcqxkKdl_Z29XfiTwpTtP6IhaixTo6OKGDxvXwnXRhkceXKAoV1loaAjuZLK1KMRyZqhS4hB80G6IS1wUrGilHukmJoPQOkIoiId_paOKiTrxbYVFLBwSlXD',
    name: 'Jira Software'
  },
  {
    category: 'Productivity',
    cost: '240.000 ₫/tháng',
    descriptionKey: 'requestNewSoftware.catalog.notionDesc',
    id: 'notion',
    isAvailable: true,
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZNsjx2ze-dBm-PlU2hui9RaJJoRnSHH3PKTpjTi9uMMfdmu-d-vVsX_QDCGoioA8nNv8or8ZPe6NLK35NcBt5KdjJLixQ2hpTGtCyfRWJyywQYS2EFaSf9azdGhsNPjvRAePJnKcIJXLkxRpS14BMUMnNLZ68dH3melYSI9yfRQK8FMrzLWuNXZNUS1DYPs_XDSoaCpEI0AJx_TUF36W55NOabZ2ggLxdTUBKkOJESfGvNpfgOg4H',
    name: 'Notion Workspace',
    popularBadge: 'Khuyên dùng'
  },
  {
    category: 'Development',
    cost: '320.000 ₫/tháng',
    descriptionKey: 'requestNewSoftware.catalog.linearDesc',
    id: 'linear',
    isAvailable: true,
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhr9SFldHrMa5q3T9MKe_jmoACS9runz-a5fQYjZnWFE-EunkTWAOLpzPxQwrd1ZUSTRTR-gXXWy5-vsBZCv6PymwLacs9Ekc6kR-Qm-HFC6NonQyS-sZJHN9evEtdVWZoPLNqU4wafNyARkb7zs6p1ka24vausqoS8RCjGrIkEf1Rw9TKFg0WGuZYNWFj5-aM3GG-XfFdb1Yxh6ubkvc7Kd7Y-UIuxckAbsDO0j-wGx2wFZHGs3Di',
    name: 'Linear App'
  },
  {
    category: 'Development',
    cost: '290.000 ₫/tháng',
    descriptionKey: 'requestNewSoftware.catalog.postmanDesc',
    id: 'postman',
    isAvailable: true,
    logoUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDMcH1LMD9Zp8tCwXTTQSojR5kjYQY_PTrArmhqSTKO0IpNDTV_E017QOFidEA2WEZ8RMZg_8n-RBqzn-WPpv0gFVCmYI9ovhTVXyOkv6x_JlO0bWrsTxZHfgnQRn2Q06O3CziIFqeX0WpjOJ1_5WvUgjIVpA5aTImVB6ZxTFGE9lHNdf6zGZ6zIJAqlw1wKWl9XNfNwHuovoW0_7QW9pxbnvIjUuy2yxYMeObPv5Z2bglFU5-Q4vYU',
    name: 'Postman'
  }
]

export const employeeProfileData = {
  organization: {
    company: 'SaaS-Sentry Enterprise Corp',
    costCenter: 'CC-041 (Engineering & Product)',
    department: 'Khối Công nghệ & Sản phẩm',
    directManager: 'Trần Thị Mai (Engineering Lead)',
    office: 'Tòa nhà Landmark, Tầng 18, TP.HCM'
  },
  personal: {
    department: 'Engineering',
    email: 'an.nguyen@saas-sentry.internal',
    employeeId: 'EMP-00428',
    fullName: 'Nguyễn Văn An',
    joinDate: '15/01/2024',
    phone: '+84 912 345 678',
    position: 'Senior Frontend Engineer'
  },
  privacy: {
    consentDate: '15/01/2024',
    dataRetentionDays: 90,
    lastAuditLog: '29/09/2026 10:20',
    monitoredAppsCount: 6,
    personalLogsShared: false
  }
}
