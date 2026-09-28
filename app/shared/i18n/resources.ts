export const resources = {
  en: {
    translation: {
      common: {
        brand: 'SaaS-Sentry',
        brandSubtitle: 'License Management',
        language: {
          english: 'English',
          englishShort: 'EN',
          selector: 'Language',
          switchTo: 'Switch to {{language}}',
          vietnamese: 'Vietnamese',
          vietnameseShort: 'VI'
        }
      },
      dashboard: {
        cards: {
          expiringSoon: {
            footer: 'No change',
            subtitle: 'Within 30 days',
            title: 'Expiring Soon'
          },
          mySoftware: {
            footer: 'from last month',
            subtitle: 'Active licenses',
            title: 'My Software'
          },
          pendingRequests: {
            footer: 'from last week',
            subtitle: 'Awaiting approval',
            title: 'Pending Requests'
          },
          totalRequests: {
            footer: 'from last month',
            subtitle: 'This year',
            title: 'Total Requests'
          }
        },
        deadlines: {
          expiresIn: 'Expires in {{count}} days',
          title: 'Upcoming Deadlines',
          viewAll: 'View all'
        },
        greeting: {
          afternoon: 'Good afternoon, {{name}}! 👋',
          evening: 'Good evening, {{name}}! 👋',
          morning: 'Good morning, {{name}}! 👋',
          subtitle: "Here's an overview of your software access."
        },
        meta: {
          description: 'Overview of your software licenses and requests.',
          title: 'Dashboard | SaaS-Sentry'
        },
        quickActions: {
          changePlan: 'Change Plan',
          createRequest: 'Create New Request',
          requestRenewal: 'Request Renewal',
          returnLicense: 'Return License',
          title: 'Quick Actions'
        },
        recommended: {
          requestAccess: 'Request Access',
          subtitle: 'Popular tools used in your department',
          title: 'Recommended Software',
          viewCatalog: 'View catalog'
        },
        software: {
          assignedDate: 'Assigned Date',
          daysLeft: '{{count}} days left',
          expiration: 'Expiration',
          noExpiration: 'No expiration',
          plan: 'Plan',
          showingOf: 'Showing {{shown}} of {{total}} software',
          software: 'Software',
          status: 'Status',
          usage: 'Usage',
          view: 'View',
          viewAll: 'View all',
          viewAllSoftware: 'View all software'
        },
        tips: {
          learnMore: 'Learn more',
          message: 'Return licenses you no longer need to help the company optimize software costs!',
          title: 'Tips'
        },
        usageSummary: {
          activelyUsed: 'Actively used',
          avgUsage: 'Avg. Usage',
          lowUsage: 'Low usage',
          notUsed: 'Not used',
          title: 'My Usage Summary'
        }
      },
      errors: {
        genericDetails: 'An unexpected error occurred.',
        genericTitle: 'Error',
        loading: 'Starting SaaS-Sentry…',
        notFoundDetails: 'The requested page could not be found.',
        notFoundTitle: '404'
      },
      home: {
        description:
          'React Router owns routing, TanStack Query owns server state, and Orval keeps the client synchronized with the API contract.',
        foundationHeading: 'Architecture foundations',
        foundations: {
          ai: {
            description: 'Every agent follows the same architecture, verification commands, and generated-code rules.',
            title: 'AI-ready workflow'
          },
          boundaries: {
            description:
              'Routes only orchestrate URLs; business workflows stay inside features and never leak back into shared.',
            title: 'Feature boundaries'
          },
          contract: {
            description: 'OpenAPI is the source for the TypeScript client, TanStack Query hooks, and mock factories.',
            title: 'Contract-first API'
          }
        },
        title: 'The frontend foundation is ready for business-module development.'
      },
      layout: {
        header: {
          avatarAlt: 'User avatar',
          help: 'Help',
          notifications: 'Notifications',
          searchPlaceholder: 'Search software, requests...',
          userRole: 'Product Designer'
        },
        helpBanner: {
          action: 'View Help Center',
          subtitle: 'Check our guides or contact IT support',
          title: 'Need help?'
        },
        nav: {
          createRequest: 'Create Request',
          dashboard: 'Dashboard',
          logout: 'Logout',
          myProfile: 'My Profile',
          myRequests: 'My Requests',
          mySoftware: 'My Software',
          sectionEmployee: 'Employee'
        }
      },
      mySoftware: {
        breadcrumbs: {
          ariaLabel: 'Breadcrumb',
          current: 'My Software',
          dashboard: 'Dashboard'
        },
        filters: {
          searchPlaceholder: 'Search software...',
          sortAssignedDate: 'Sort by: Assigned Date',
          sortExpiration: 'Sort by: Expiration',
          sortName: 'Sort by: Name',
          statusActive: 'Active',
          statusAll: 'All Status',
          statusExpiring: 'Expiring Soon'
        },
        header: {
          requestSoftware: 'Request Software',
          subtitle: 'Software and licenses currently assigned to you.',
          title: 'My Software'
        },
        modal: {
          assignedDate: 'Assigned Date',
          close: 'Close',
          expirationDate: 'Expiration Date',
          licenseKey: 'License Key / Seat ID',
          planTier: 'Plan Tier',
          requestAction: 'Actions',
          requestRenewal: 'Request Renewal',
          returnLicense: 'Return License',
          softwareInfo: 'Software Information',
          title: 'Software Details',
          vendor: 'Vendor'
        },
        pagination: {
          next: 'Next',
          page: 'Page {{page}}',
          previous: 'Previous',
          showingResults: 'Showing {{from}} to {{to}} of {{total}} results'
        },
        status: {
          active: 'Active',
          expiringSoon: 'Expiring Soon',
          pending: 'Pending',
          returned: 'Returned'
        },
        table: {
          action: 'Action',
          assignedDate: 'Assigned Date',
          emptyDescription: 'Try adjusting your search or filters.',
          emptyTitle: 'No software found',
          expiration: 'Expiration',
          moreOptions: 'More options',
          noExpiration: 'No expiration',
          plan: 'Plan',
          software: 'Software',
          status: 'Status',
          viewDetails: 'View Details'
        },
        tabs: {
          active: 'Active',
          all: 'All',
          expiringSoon: 'Expiring Soon',
          pending: 'Pending',
          returned: 'Returned'
        }
      },
      myRequests: {
        breadcrumbs: {
          ariaLabel: 'Breadcrumb',
          current: 'My Requests',
          home: 'Home'
        },
        filters: {
          clearFilters: 'Clear Filters',
          searchPlaceholder: 'Search request by ID or software...',
          statusAll: 'All',
          statusApproved: 'Approved',
          statusCancelled: 'Cancelled',
          statusCompleted: 'Completed',
          statusLabel: 'Status',
          statusPending: 'Pending',
          statusRejected: 'Rejected',
          typeAll: 'All',
          typeChangePlan: 'Change Plan',
          typeLabel: 'Request Type',
          typeNew: 'New Software',
          typeRenewal: 'Renewal'
        },
        header: {
          createRequest: 'Create Request',
          subtitle: 'Track the status of your software requests.',
          title: 'My Requests'
        },
        modal: {
          approvalTimeline: 'Approval Timeline',
          cancelRequest: 'Cancel Request',
          close: 'Close',
          contactSupport: 'Contact Support',
          currentStatus: 'Current Status',
          dateSubmitted: 'Submitted Date',
          requestId: 'Request ID',
          requestType: 'Request Type',
          software: 'Software',
          stepCompleted: 'License Provisioned & Delivered',
          stepIT: 'IT Admin Provisioning',
          stepManager: 'Department Manager Approval',
          stepSubmitted: 'Request Submitted',
          title: 'Request Details'
        },
        pagination: {
          ariaLabel: 'Pagination',
          next: 'Next',
          page: 'Page {{page}}',
          previous: 'Previous',
          showingRequests: 'Showing {{from}} to {{to}} of {{total}} requests'
        },
        status: {
          approved: 'Approved',
          cancelled: 'Cancelled',
          completed: 'Completed',
          pending: 'Pending',
          rejected: 'Rejected'
        },
        steps: {
          accessExtended: 'Access extended',
          accessGranted: 'Access granted',
          cancelled: 'Cancelled',
          cancelledByYou: 'Cancelled by you',
          completed: 'Completed',
          itProcessing: 'IT Processing',
          itProvisioning: 'Provisioning in progress',
          managerApproval: 'Manager Approval',
          managerRejected: 'Rejected',
          managerWaiting: 'Waiting for approval'
        },
        table: {
          action: 'Action',
          currentStep: 'Current Step',
          emptyDescription: 'Try adjusting your search query or filters.',
          emptyTitle: 'No requests found',
          moreOptions: 'More options',
          requestId: 'Request ID',
          requestType: 'Request Type',
          software: 'Software',
          status: 'Status',
          submitted: 'Submitted',
          viewDetails: 'View Details'
        },
        types: {
          changePlan: 'Change Plan',
          newSoftware: 'New Software',
          renewal: 'Renewal'
        }
      },
      softwareDetail: {
        actions: {
          moreOptions: 'More options',
          requestChange: 'Request Change',
          requestChangePlan: 'Request Change Plan',
          requestRenewal: 'Request Temporary Renewal',
          returnLicense: 'Return License',
          viewCostDetails: 'View Cost Details',
          viewDataPolicy: 'View Data Policy'
        },
        backLink: 'Back to My Software',
        descriptionCard: {
          figmaDesc:
            'Figma is a collaborative design tool used by our product and engineering teams to create user interfaces, prototypes, and design systems.',
          title: 'Description'
        },
        generalInfo: {
          appName: 'Application Name',
          assignedDate: 'Assigned Date',
          autoRenewal: 'Auto-Renewal',
          autoRenewalOn: 'On',
          category: 'Category',
          costCenter: 'Cost Center',
          expirationDate: 'Expiration Date',
          licenseType: 'License Type',
          owner: 'Owner',
          plan: 'Plan',
          project: 'Project',
          provider: 'Provider',
          status: 'Status',
          statusActive: 'Active',
          title: 'General Information'
        },
        licenseCostSummary: {
          assigned: 'Assigned',
          available: 'Available',
          estimatedAnnualCost: 'Estimated Annual Cost',
          monthlyCost: 'Monthly Cost',
          title: 'License & Cost Summary',
          totalLicenses: 'Total Licenses'
        },
        relatedInfo: {
          businessOwner: 'Business Owner',
          department: 'Department',
          project: 'Project',
          team: 'Team',
          title: 'Related Information'
        },
        tabs: {
          licenseCost: 'License & Cost',
          overview: 'Overview',
          relatedRequests: 'Related Requests',
          usageActivity: 'Usage & Activity'
        },
        tags: {
          design: 'Design',
          productivity: 'Productivity',
          saas: 'SaaS'
        },
        usageMonitoring: {
          applicationEvents: 'Application events (limited)',
          dataCollectedTitle: 'Data Collected',
          dataSourceTitle: 'Data Source',
          dataSourceValue: 'Figma API (via integration)',
          enabled: 'Enabled',
          lastActivityDate: 'Last activity date',
          notice: 'We collect usage data to optimize licenses and ensure proper access management.',
          purposeTitle: 'Purpose',
          purposeValue: 'License optimization & access review',
          title: 'Usage Monitoring',
          usageSummary: 'Usage summary (aggregated)'
        },
        usageStatus: {
          activeCount: 'Active ({{count}})',
          activeUsage: 'Active Usage',
          healthy: 'Healthy',
          inactiveCount: 'Inactive ({{count}})',
          lastActivity: 'Last meaningful activity',
          lastActivityValue: 'Apr 28, 2025 (12 days ago)',
          title: 'Usage Status'
        }
      },
      requestDetail: {
        backToRequests: 'Back to My Requests',
        breadcrumbs: {
          myRequests: 'My Requests'
        },
        flow: {
          employee: 'Employee',
          employeeSub: 'You',
          finance: 'Finance',
          financeSub: '(If required)',
          itAdmin: 'IT Admin',
          itAdminSub: 'Provisioning',
          manager: 'Manager',
          title: 'Approval Flow'
        },
        header: {
          currentStatusDesc: 'Your request is waiting for your manager to review.',
          currentStatusTitle: 'Current Status',
          currentStatusValue: 'Pending Manager Approval',
          newSoftwareAccess: 'New Software Access',
          submittedOn: 'Submitted on {{date}} at {{time}}'
        },
        history: {
          event1Desc: 'Your request has been sent to {{name}} for review.',
          event1Title: 'Request sent to manager',
          event2Desc: 'You have submitted the request.',
          event2Title: 'Request submitted',
          title: 'Request History'
        },
        info: {
          businessReason: 'Business Reason',
          costCenter: 'Cost Center',
          plan: 'Plan',
          project: 'Project',
          requestType: 'Request Type',
          requiredFrom: 'Required From',
          requiredUntil: 'Required Until',
          software: 'Software',
          submittedBy: 'Submitted By',
          submittedDate: 'Submitted Date',
          title: 'Request Information'
        },
        progress: {
          cancelAction: 'Cancel Request',
          cancelDisclaimer: 'You can cancel this request while it is in approval process.',
          step1Status: 'Completed',
          step1Title: '1. Request Submitted',
          step2Desc: 'Your manager will review your request.',
          step2NoticeDesc: 'Your request has been sent to {{name}} for review.',
          step2NoticeTitle: 'Waiting for your manager',
          step2Status: 'In Progress',
          step2Title: '2. Manager Review',
          step3Desc: 'Required if the request has budget impact.',
          step3Status: 'Not Required',
          step3Title: '3. Finance Review',
          step4Desc: 'IT Admin will provision the software.',
          step4Status: 'Pending',
          step4Title: '4. IT Provisioning',
          step5Desc: 'The request will be completed.',
          step5Status: 'Pending',
          step5Title: '5. Completed',
          title: 'Approval Progress'
        }
      },
      createRequest: {
        banner: {
          description:
            'Your request will be reviewed and approved by the appropriate people before any changes are applied.',
          learnMore: 'Learn more about the approval process',
          title: 'All requests require approval'
        },
        breadcrumbs: {
          ariaLabel: 'Breadcrumb',
          current: 'Create Request',
          home: 'Home'
        },
        header: {
          subtitle: 'Choose the type of software request you want to submit.',
          title: 'What do you need?'
        },
        meta: {
          description: 'Submit a new software access, plan change, temporary renewal, or license return request.',
          title: 'Create Request | SaaS-Sentry'
        },
        types: {
          changePlan: {
            callout: 'Upgrade, downgrade, or switch to another plan.',
            description: 'Request a different plan for software you already use.',
            title: '2. Change Plan'
          },
          newSoftware: {
            callout: 'Request access to approved software you need for your work.',
            description: "Get access to a software you don't currently have.",
            title: '1. Request New Software'
          },
          returnLicense: {
            callout: "Tell us why you're returning it so we can reallocate the license.",
            description: 'Return software access you no longer need.',
            title: '4. Return License'
          },
          temporaryRenewal: {
            callout: 'Request an extension when you need more time to complete your work.',
            description: 'Extend your access to a software for a specific period.',
            title: '3. Temporary Renewal'
          }
        }
      },
      requestNewSoftware: {
        actions: {
          back: 'Back',
          cancel: 'Cancel',
          continue: 'Continue'
        },
        details: {
          approvalAlert: 'Your request will be reviewed and you will be notified about the approval status.',
          businessReasonLabel: 'Business Reason',
          businessReasonPlaceholder: 'Enter your business reason...',
          businessReasonRequired: '*',
          changeSoftware: 'Change',
          costCenterLabel: 'Cost Center',
          costCenterOptions: {
            cc001: 'CC-001 - Product Design',
            cc002: 'CC-002 - Engineering',
            cc003: 'CC-003 - Marketing'
          },
          costCenterRequired: '*',
          planLabel: 'Plan',
          planOptions: {
            enterprise: 'Enterprise',
            organization: 'Organization',
            professional: 'Professional'
          },
          planRequired: '*',
          projectLabel: 'Project',
          projectOptions: {
            alpha: 'Project Alpha',
            beta: 'Project Beta',
            designSystem: 'Design System'
          },
          projectRequired: '*',
          requiredFromLabel: 'Required From',
          requiredFromRequired: '*',
          requiredUntilLabel: 'Required Until',
          selectedSoftware: 'Selected Software',
          stepIndicator: 'Step 2 of 4',
          subtitle: 'Please provide details about your request.',
          title: 'Request Details'
        },
        header: {
          subtitle: "Get access to a software you don't currently have.",
          title: 'Request New Software'
        },
        meta: {
          description: 'Submit an access request for newly approved software.',
          title: 'Request New Software | SaaS-Sentry'
        },
        selection: {
          cantFind: "Can't find the software you need?",
          contactSupport: 'Contact IT Support',
          figmaDesc: 'Collaborative interface design tool for teams.',
          githubDesc: 'Code hosting platform for version control and collaboration.',
          jiraDesc: 'Project and issue tracking software.',
          searchPlaceholder: 'Search approved software...',
          statusAvailable: 'Available',
          stepIndicator: 'Step 1 of 4',
          subtitle: 'Search and select the software you need.',
          title: 'Choose Software'
        },
        stepper: {
          step1: 'Software',
          step1Sub: 'Choose software',
          step2: 'Request Details',
          step2Sub: 'Provide information',
          step3: 'Review',
          step3Sub: 'Review your request',
          step4: 'Submitted',
          step4Sub: 'Request submitted'
        }
      },
      temporaryRenewal: {
        actions: {
          cancel: 'Cancel',
          review: 'Review Renewal Request'
        },
        alert: {
          description: 'Submit a renewal request before expiration to avoid interruption.',
          title: 'Your current access expires on Sep 30, 2026 (in 14 days)'
        },
        breadcrumbs: {
          ariaLabel: 'Breadcrumb',
          createRequest: 'Create Request',
          current: 'Temporary Renewal Request',
          dashboard: 'Dashboard',
          mySoftware: 'My Software',
          software: 'Figma'
        },
        form: {
          additionalNotesHelper: 'Add any additional information if needed.',
          additionalNotesLabel: 'Additional notes',
          additionalNotesOptional: '(optional)',
          additionalNotesPlaceholder: 'Add any additional notes here...',
          clearDate: 'Clear date',
          costCenterLabel: 'Cost Center',
          costCenterOptions: {
            cc001: 'CC-001 - Product Development',
            cc002: 'CC-002 - Engineering'
          },
          costCenterRequired: '*',
          durationHelper: 'From Oct 01, 2026 to Dec 31, 2026',
          durationLabel: 'Requested extension duration',
          newExpirationDateHelper: 'Select the date you need access until.',
          newExpirationDateLabel: 'New expiration date',
          newExpirationDateRequired: '*',
          projectLabel: 'Project',
          projectOptions: {
            alpha: 'Project Alpha',
            beta: 'Project Beta'
          },
          projectRequired: '*',
          reasonHelper: 'Explain why you need an extension.',
          reasonLabel: 'Reason for renewal',
          reasonPlaceholder: 'Explain why you need an extension...',
          reasonRequired: '*'
        },
        header: {
          subtitle: 'Extend your access to Figma for a specific period.',
          title: 'Temporary Renewal Request'
        },
        meta: {
          description: 'Submit a temporary renewal request to extend your software license access.',
          title: 'Temporary Renewal Request | SaaS-Sentry'
        },
        stepper: {
          step1: 'Details',
          step2: 'Review',
          step3: 'Submitted'
        },
        summary: {
          costCenter: 'Cost Center',
          currentExpiration: 'Current Expiration',
          extensionDuration: 'Extension Duration',
          newExpiration: 'New Expiration',
          noticeDescription: 'Your renewal will be reviewed and approved by your Manager and IT team.',
          noticeTitle: 'This is a request, not immediate access.',
          planName: 'Professional Plan',
          project: 'Project',
          requestType: 'Request Type',
          requestTypeValue: 'Temporary Renewal',
          requestedBy: 'Requested By',
          softwareName: 'Figma',
          statusActive: 'Active',
          title: 'Request Summary'
        }
      },
      returnLicense: {
        actions: {
          cancel: 'Cancel',
          review: 'Review Request'
        },
        additionalNotes: {
          helperText: 'Provide any additional information that can help the IT team.',
          label: '3. Additional note',
          optional: '(optional)',
          placeholder: 'Provide any additional information that can help the IT team.'
        },
        breadcrumbs: {
          ariaLabel: 'Breadcrumb',
          current: 'Return License Request',
          dashboard: 'Dashboard',
          myRequests: 'My Requests'
        },
        header: {
          subtitle: 'Request to return a software license you no longer need.',
          title: 'Return License Request'
        },
        meta: {
          description: 'Request to return a software license you no longer need.',
          title: 'Return License Request | SaaS-Sentry'
        },
        reasons: {
          noLongerNeeded: {
            description: "I don't need this software for my current work.",
            title: 'No longer needed'
          },
          other: {
            description: 'Please specify the reason below.',
            title: 'Other'
          },
          projectCompleted: {
            description: 'I have finished the project that required this software.',
            title: 'Project completed'
          },
          required: '*',
          sectionTitle: '2. Why are you returning this license?',
          switchingTool: {
            description: 'Our team is using a different tool now.',
            title: 'Switching to another tool'
          }
        },
        softwareCard: {
          assignedByLabel: 'Assigned By',
          assignedByValue: 'IT Admin',
          assignedDateLabel: 'Assigned Date',
          assignedDateValue: 'Jan 15, 2026',
          expirationDateLabel: 'Expiration Date',
          expirationDateValue: 'Dec 31, 2026',
          planName: 'Professional Plan',
          sectionTitle: '1. Software to return',
          softwareLogoAlt: 'Figma Logo',
          softwareName: 'Figma',
          statusActive: 'Active'
        },
        stepper: {
          step1: 'Details',
          step2: 'Review',
          step3: 'Submitted'
        },
        summary: {
          assignedDate: 'Assigned Date',
          costCenter: 'Cost Center',
          costCenterValue: 'CC-001',
          expirationDate: 'Expiration Date',
          noticeLine1: 'Your license will remain active until the IT team processes your request.',
          noticeLine2: 'You will be notified when it is completed.',
          noticeTitle: 'Important to know',
          planName: 'Professional Plan',
          project: 'Project',
          projectValue: 'Project Alpha',
          requestType: 'Request Type',
          requestTypeValue: 'Return License',
          requestedBy: 'Requested By',
          requestedByValue: 'Nguyễn Minh An',
          softwareName: 'Figma',
          statusActive: 'Active',
          title: 'Return Summary'
        }
      },
      profile: {
        meta: {
          description: 'Manage your personal information and control your data privacy.',
          title: 'My Profile | SaaS-Sentry'
        },
        header: {
          subtitle: 'Manage your personal information and control your data privacy.',
          title: 'My Profile'
        },
        subnav: {
          dataPrivacy: 'My Data & Privacy',
          profile: 'Profile'
        },
        personalInfo: {
          editAction: 'Edit',
          fields: {
            department: 'Department',
            email: 'Email',
            employeeId: 'Employee ID',
            fullName: 'Full name',
            joinDate: 'Join date',
            phone: 'Phone',
            position: 'Position'
          },
          subtitle: 'Your basic information',
          title: 'Personal Information'
        },
        organization: {
          editAction: 'Edit',
          fields: {
            company: 'Company',
            costCenter: 'Cost Center',
            department: 'Department',
            team: 'Team'
          },
          subtitle: 'Your organizational information',
          title: 'Organization'
        },
        dataPrivacy: {
          compliance: {
            and: 'and',
            decree: 'Decree No. 356/2025/NĐ-CP',
            law: 'Personal Data Protection Law (Law No. 91/2025/QH15)',
            prefix: 'We collect and process your data in accordance with the',
            suffix: '. Your data is stored securely and only accessible to authorized personnel.'
          },
          dataStored: {
            categories: {
              orgInfo: {
                bold: 'Organization information',
                text: '(department, team, position, etc.)'
              },
              personalInfo: {
                bold: 'Personal information',
                text: '(name, email, phone, etc.)'
              },
              requestHistory: {
                bold: 'Request history',
                text: 'and approval records'
              },
              softwareAssignments: {
                bold: 'Software assignments',
                text: 'and license information'
              },
              usageSummary: {
                bold: 'Usage summary',
                text: '(when you have enabled tracking)'
              }
            },
            description: 'The following types of data are collected and stored in our system:',
            title: 'Data We Store About You',
            viewDetailedCategories: 'View detailed data categories'
          },
          notification: {
            description: 'You will be notified when we start collecting usage data for any application you use.',
            disabled: 'Disabled',
            enabled: 'Enabled',
            title: 'Data Usage Notification',
            toggleAriaLabel: 'Toggle data usage notification'
          },
          privacyRights: {
            actions: {
              manageConsent: {
                subtitle: 'Control your data preferences',
                title: 'Manage consent'
              },
              requestExport: {
                subtitle: 'Get a copy of your personal data',
                title: 'Request data export'
              },
              viewUsage: {
                subtitle: 'See how your data is used',
                title: 'View data usage'
              }
            },
            description: 'You have the right to access, export and manage your personal data.',
            title: 'Your Privacy Rights'
          },
          subtitle: 'View the data we store about you and manage your privacy rights.',
          title: 'My Data & Privacy'
        }
      },
      dataExport: {
        actions: {
          cancel: 'Cancel',
          submit: 'Submit Export Request'
        },
        header: {
          backLink: 'Back to My Profile / My Data & Privacy',
          regulatoryBadge: 'Compliant with PDP Decree 356/2025/NĐ-CP',
          subtitle:
            'Submit a request to download a certified copy of your personal and activity data stored in SaaS-Sentry.',
          title: 'Request Data Export'
        },
        meta: {
          description:
            'Submit a request to download a certified copy of your personal and activity data stored in SaaS-Sentry.',
          title: 'Request Data Export | SaaS-Sentry'
        },
        recent: {
          download: 'Download',
          expired: 'Expired',
          export1: {
            details: 'Jan 15, 2026 • 640 KB • All Profile Data',
            name: 'export_2026_01_15.zip'
          },
          export2: {
            details: 'Jun 10, 2025 • Expired (7-day SLA passed)',
            name: 'export_2025_06_10.zip'
          },
          timeframe: 'Last 6 months',
          title: 'Recent Exports'
        },
        step1: {
          categories: {
            personal: {
              description:
                'Full name, email, Employee ID (EMP00123), department, phone number, and direct manager hierarchy.',
              size: '~ 120 KB',
              title: 'Personal Information & Employment Profile'
            },
            requests: {
              description:
                'All submitted software requests (REQ-1024, REQ-1021, REQ-1018), justification notes, and approval timeline stamps.',
              size: '~ 480 KB',
              title: 'Request History & Approvals Log'
            },
            software: {
              description:
                'Assigned apps (Figma, GitHub, Jira, Slack, Microsoft 365), plans, assignment dates, and cost center mappings.',
              size: '~ 240 KB',
              title: 'Software Assignments & License Allocation'
            },
            telemetry: {
              description:
                '30-day/90-day aggregated telemetry, last meaningful login stamps, and access review status timestamps.',
              size: '~ 1.8 MB',
              title: 'Aggregated Usage Statistics & Activity Logs'
            }
          },
          deselectAll: 'Deselect All',
          selectAll: 'Select All ({{count}})',
          title: 'Select Data Categories to Export'
        },
        step2: {
          destination: {
            helper: 'For security, exported packages can only be sent to your verified corporate email.',
            label: 'Notification & Download Link Destination'
          },
          formats: {
            csv: {
              badge: 'CSV',
              subtitle: 'Spreadsheet tables with an executive summary in PDF format.',
              title: 'CSV & PDF Package'
            },
            json: {
              subtitle: 'Machine-readable data for import or programmatic audit.',
              title: 'JSON Archive'
            }
          },
          password: {
            inputLabel: 'Set Archive Passphrase',
            inputPlaceholder: 'Enter archive password...',
            subtitle: 'Encrypt the exported archive with a one-time passphrase',
            title: 'Password Protection (ZIP AES-256)',
            toggleAriaLabel: 'Toggle password protection'
          },
          purpose: {
            label: 'Purpose / Notes',
            optional: '(Optional)',
            placeholder: 'e.g., Annual personal data review, compliance verification...'
          },
          title: 'Choose Export Format & Encryption'
        },
        summary: {
          categoriesLabel: 'Selected Categories:',
          categoriesValue: '{{count}} Categories (~{{size}})',
          encryptionDisabled: 'Standard (No Password)',
          encryptionEnabled: 'AES-256 Enabled',
          encryptionLabel: 'Encryption:',
          formatCsv: 'CSV & PDF Package (.zip)',
          formatJson: 'JSON Archive (.zip)',
          formatLabel: 'Format:',
          requesterLabel: 'Requester:',
          requesterValue: 'Nguyen Van Tuan (EMP00123)',
          retentionNotice: 'Export download links expire automatically after 7 days for privacy protection.',
          slaLabel: 'Estimated Generation SLA:',
          slaValue: 'Within 24 Hours',
          title: 'Request Summary'
        },
        workflow: {
          step1Desc: 'Your export request is verified against security policies and scheduled for batch generation.',
          step1Title: '1. Request Queued',
          step2Desc: 'System compiles database logs and applies privacy redactions (e.g. sensitive API keys).',
          step2Title: '2. Data Compilation & Redaction',
          step3Desc: 'You will receive a notification and secure download token directly in your corporate email.',
          step3Title: '3. Archive Ready & Delivered',
          title: 'Export Workflow'
        }
      },
      dataUsage: {
        apps: {
          badge: '1',
          cards: {
            collectedLabel: 'Data Collected:',
            excludedLabel: 'Excluded by Policy:',
            purposeLabel: 'Purpose:'
          },
          figma: {
            collected: 'Last file open, session timestamp',
            excluded: 'File names, canvas content, design data',
            integration: 'Integration: Figma SCIM & Audit Log API • Frequency: Every 6 hours',
            lastActivity: 'Apr 28, 2026 (12 days ago)',
            purpose: 'Ghost seat detection & reallocation',
            tier: 'Professional'
          },
          github: {
            collected: 'PR, commit, issue activity timestamp',
            excluded: 'Source code, branch names, commit messages',
            integration: 'Integration: GitHub Organization Audit API • Frequency: Daily',
            lastActivity: 'Today (2 hours ago)',
            purpose: 'License tier utilization audit',
            tier: 'Enterprise'
          },
          lastActivityLabel: 'Last Activity',
          slack: {
            collected: 'Active status boolean, last presence date',
            excluded: 'Messages, channel names, attachments, DMs',
            integration: 'Integration: Enterprise Grid Discovery API • Frequency: Daily',
            lastActivity: 'Yesterday (Mar 20, 2026)',
            purpose: 'Corporate communication seat management',
            tier: 'Pro'
          },
          subtitle: 'Specific data points collected per assigned software license',
          syncStatus: 'Real-time Sync',
          title: 'Application Telemetry & Ingestion Status',
          trackingActive: 'Tracking Active'
        },
        auditLog: {
          logs: {
            log1: {
              actor: 'Le Thi Mai (Manager)',
              meta: 'IP: 10.14.20.118',
              purpose: 'Review request REQ-1024 for Figma Pro license approval.',
              status: 'Authorized View',
              time: 'May 18, 10:20 AM'
            },
            log2: {
              actor: 'Automated Ghost Engine',
              meta: 'Service: rule-engine-v3',
              purpose: 'Scheduled quarterly inactivity check (>60 days threshold).',
              status: 'System Audit',
              time: 'Apr 28, 09:15 AM'
            },
            log3: {
              actor: 'Sarah Jenkins (IT Admin)',
              meta: 'IP: 10.12.0.45',
              purpose: 'Annual Access Review Q1 2026 Audit assignment verification.',
              status: 'Access Review Audit',
              time: 'Jan 12, 02:45 PM'
            }
          },
          purposePrefix: 'Purpose:',
          subtitle: 'Who accessed your data records',
          timeframe: '30 Days',
          title: 'Access Audit Log',
          viewHistory: 'View Complete Audit History (18 events) →'
        },
        classification: {
          badge: '2',
          cols: {
            category: 'DATA CATEGORY',
            encryption: 'ENCRYPTION',
            legalBasis: 'LEGAL BASIS (PDP)',
            recipients: 'RECIPIENTS / ACCESS',
            retention: 'RETENTION PERIOD'
          },
          rows: {
            entitlements: {
              encryption: 'AES-256',
              legalBasis: 'Legitimate Business Interest',
              recipients: 'Department Manager, IT Ops',
              retention: 'Active Assignment + 2 yrs audit',
              subtitle: 'License tiers, cost centers, assignments',
              title: 'Software Entitlements'
            },
            identity: {
              encryption: 'AES-256',
              legalBasis: 'Employment Contract / Law 91',
              recipients: 'Line Manager, HR, IT Admin',
              retention: 'Duration of Employment + 5 yrs',
              subtitle: 'Name, Email, EMP ID, Org Hierarchy',
              title: 'Identity & Employment'
            },
            requests: {
              encryption: 'AES-256',
              legalBasis: 'Audit & Compliance Trail',
              recipients: 'Finance Audit, Approver, You',
              retention: '3 Years from resolution',
              subtitle: 'Justification notes, approval steps',
              title: 'Request & Approval Log'
            },
            telemetry: {
              encryption: 'AES-256',
              legalBasis: 'Resource Optimization & Consent',
              recipients: 'Automated Engine, IT Admin',
              retention: '90 Days Rolling Window',
              subtitle: 'Last login, activity stamps (0/1 flag)',
              title: 'Usage Telemetry'
            }
          },
          subtitle: 'How each category of your employee information is processed and retained',
          title: 'Data Classification & Processing Legality'
        },
        guarantees: {
          item1Bold: 'No content tracking:',
          item1Text: 'Never reads code, messages, emails, documents, or design layers.',
          item2Bold: 'No keystroke or screen logging:',
          item2Text: 'Zero keystroke dynamics, screen captures, or mouse path telemetry.',
          item3Bold: 'No external data selling:',
          item3Text: 'Data remains in dedicated enterprise tenancy with zero third-party broker sharing.',
          title: 'What SaaS-Sentry Never Collects',
          toggleAriaLabel: 'Toggle data usage notifications',
          toggleLabel: 'Data Usage Notifications',
          toggleSubtitle: 'Alert me whenever a new app connector begins gathering usage telemetry.'
        },
        header: {
          backLink: 'Back to My Profile / My Data & Privacy',
          exportUsageLog: 'Export Usage Log',
          pdpBadge: 'PDP Compliance Notice (Law 91/2025/QH15)',
          subtitle:
            'Transparent breakdown of what data SaaS-Sentry collects, how usage is tracked, and access log frequency.',
          title: 'View Data Usage'
        },
        meta: {
          description:
            'Transparent breakdown of what data SaaS-Sentry collects, how usage is tracked, and access log frequency.',
          title: 'View Data Usage | SaaS-Sentry'
        },
        metrics: {
          auditedAccess: {
            label: 'Audited Access Queries',
            sub: 'All logged with justification',
            suffix: 'queries',
            value: '18'
          },
          monitoredApps: {
            label: 'Monitored Apps',
            sub: 'Privacy boundaries enforced',
            suffix: '/ 6 active',
            value: '4'
          },
          retention: {
            label: 'Telemetry Retention',
            sub: 'Auto-purged afterwards',
            suffix: '',
            value: '90 Days'
          },
          telemetryEvents: {
            label: 'Telemetry Events',
            sub: 'Aggregated, non-invasive',
            suffix: 'last 30d',
            value: '1,420'
          }
        },
        relatedControls: {
          manageConsents: 'Manage Privacy Consents',
          requestExport: 'Request Certified Data Export',
          title: 'Related Privacy Controls'
        }
      },
      reviewRequest: {
        actions: {
          back: 'Back',
          submit: 'Submit Request'
        },
        breadcrumbs: {
          createRequest: 'Create Request',
          dashboard: 'Dashboard',
          newSoftware: 'New Software',
          review: 'Review',
          temporaryRenewal: 'Temporary Renewal',
          returnLicense: 'Return License'
        },
        types: {
          newSoftware: 'New Software Access',
          temporaryRenewal: 'Temporary Renewal',
          returnLicense: 'Return License'
        },
        details: {
          alertDescription: "You won't be able to edit this request after submission.",
          alertTitle: 'Please ensure all information is correct.',
          businessReason: 'Business Reason',
          businessReasonValue: 'Need Figma Professional for UI/UX design tasks in Project Alpha.',
          costCenter: 'Cost Center',
          costCenterValue: 'CC-001 - Product Development',
          project: 'Project',
          projectValue: 'Project Alpha',
          requiredFrom: 'Required From',
          requiredFromValue: 'Jun 01, 2026',
          requiredUntil: 'Required Until',
          requiredUntilValue: 'Dec 31, 2026 (214 days)',
          title: 'Request Details',
          assignedDate: 'Assigned Date',
          assignedDateValue: 'Jan 15, 2026',
          expirationDate: 'Expiration Date',
          expirationDateValue: 'Dec 31, 2026',
          currentExpiration: 'Current Expiration',
          currentExpirationValue: 'Sep 30, 2026',
          newExpiration: 'New Expiration',
          newExpirationValue: 'Dec 31, 2026 (92 days)',
          additionalNotes: 'Additional Notes',
          temporaryRenewalReasonValue: 'Project extended. Need more time to complete design work for Project Alpha.',
          temporaryRenewalNotesValue:
            'We are entering the final design phase and need to continue using Figma for collaboration and handoff.',
          returnLicenseReasonValue: 'Project Alpha is complete. We no longer need Figma for the current phase.',
          returnLicenseNotesValue:
            'Project Alpha is complete. We no longer need Figma for the current phase. Thank you!'
        },
        flow: {
          notice: 'You will be notified at each step of the approval process and when the request is completed.',
          step1Status: 'Completed',
          step1Sub: 'Submit request',
          step1Title: 'You (Requester)',
          step2Status: 'Pending',
          step2Sub: 'Review and approve',
          step2Title: 'Manager',
          step3Status: 'Not required',
          step3Sub: 'Review budget impact',
          step3Title: 'Finance (if required)',
          step4Status: 'Upcoming',
          step4Sub: 'Provision and assign license',
          step4Title: 'IT Admin',
          title: 'Approval Flow'
        },
        header: {
          subtitle: 'Please review all information before submitting your request.',
          title: 'Review Your Request'
        },
        meta: {
          description: 'Please review all information before submitting your software request.',
          title: 'Review Your Request | SaaS-Sentry'
        },
        stepper: {
          step1: 'Software',
          step2: 'Details',
          step3: 'Review',
          step4: 'Submitted'
        },
        summary: {
          department: 'Department',
          departmentValue: 'Product Design',
          email: 'Email',
          emailValue: 'an.nguyen@company.com',
          plan: 'Plan',
          planValue: 'Professional',
          requestDate: 'Request Date',
          requestDateValue: 'May 18, 2026',
          requestType: 'Request Type',
          requestTypeValue: 'New Software Access',
          requestedBy: 'Requested By',
          requestedByValue: 'Nguyen Minh An',
          software: 'Software',
          softwareValue: 'Figma',
          title: 'Request Summary',
          vendor: 'Vendor',
          vendorValue: 'Figma, Inc.'
        },
        whatNext: {
          item1: 'Your request will be sent to your Manager for review.',
          item2: 'You can track the progress in My Requests.',
          item3: 'You will be notified once the request is approved or if more information is needed.',
          title: 'What happens next?'
        }
      },
      submissionSuccess: {
        actions: {
          backDashboard: 'Back to Dashboard',
          viewDetails: 'View Request Details'
        },
        breadcrumbs: {
          createRequest: 'Create Request',
          dashboard: 'Dashboard',
          newSoftware: 'New Software',
          returnLicense: 'Return License',
          submissionSuccess: 'Submission Success',
          temporaryRenewal: 'Temporary Renewal'
        },
        hero: {
          requestIdLabel: 'Request ID',
          requestIdValue: 'REQ-1027',
          submittedAt: 'Submitted on May 18, 2026 at 10:30 AM',
          subtitle: 'Your request has been submitted and is now being reviewed. You will be notified as it progresses.',
          title: 'Request submitted successfully!'
        },
        meta: {
          description: 'Your request has been submitted successfully.',
          title: 'Submission Success | SaaS-Sentry'
        },
        summary: {
          costCenterLabel: 'Cost Center',
          defaultCostCenter: 'CC-001 – Product Development',
          defaultProject: 'Project Alpha',
          defaultRequestedBy: 'Nguyễn Minh An',
          periodDays: '({{count}} days)',
          planName: 'Professional Plan',
          projectLabel: 'Project',
          requestedByLabel: 'Requested by',
          requestedPeriodLabel: 'Requested Period',
          requestTypeLabel: 'Request Type',
          softwareLogoAlt: 'Figma Logo',
          softwareName: 'Figma',
          title: 'Request Summary'
        },
        timeline: {
          alertBanner: 'Your request is now in the approval process.',
          bottomNotice: 'You will receive a notification at each step of the approval process.',
          currentStep: 'Current step',
          step1Date: 'May 18, 2026 at 10:30 AM',
          step1Title: 'Request submitted',
          step2Desc: 'Your manager will review and approve your request.',
          step2Status: 'Pending',
          step2Title: 'Manager review',
          step3Badge: 'If required',
          step3Title: 'Finance review',
          step4Badge: 'Upcoming',
          step4Title: 'IT provisioning',
          step5Badge: 'Upcoming',
          step5Title: 'Completed',
          title: 'What happens next?'
        }
      },
      notFound: {
        action: 'Back to home',
        description: 'This route does not exist or has moved.',
        documentTitle: 'Page not found | SaaS-Sentry',
        eyebrow: '404',
        title: 'Page not found'
      }
    }
  },
  vi: {
    translation: {
      common: {
        brand: 'SaaS-Sentry',
        brandSubtitle: 'Quản lý bản quyền',
        language: {
          english: 'Tiếng Anh',
          englishShort: 'EN',
          selector: 'Ngôn ngữ',
          switchTo: 'Chuyển sang {{language}}',
          vietnamese: 'Tiếng Việt',
          vietnameseShort: 'VI'
        }
      },
      dashboard: {
        cards: {
          expiringSoon: {
            footer: 'Không thay đổi',
            subtitle: 'Trong 30 ngày',
            title: 'Sắp hết hạn'
          },
          mySoftware: {
            footer: 'so với tháng trước',
            subtitle: 'Bản quyền đang hoạt động',
            title: 'Phần mềm của tôi'
          },
          pendingRequests: {
            footer: 'so với tuần trước',
            subtitle: 'Chờ phê duyệt',
            title: 'Yêu cầu chờ xử lý'
          },
          totalRequests: {
            footer: 'so với tháng trước',
            subtitle: 'Năm nay',
            title: 'Tổng yêu cầu'
          }
        },
        deadlines: {
          expiresIn: 'Hết hạn trong {{count}} ngày',
          title: 'Hạn chót sắp tới',
          viewAll: 'Xem tất cả'
        },
        greeting: {
          afternoon: 'Chào buổi chiều, {{name}}! 👋',
          evening: 'Chào buổi tối, {{name}}! 👋',
          morning: 'Chào buổi sáng, {{name}}! 👋',
          subtitle: 'Tổng quan về quyền truy cập phần mềm của bạn.'
        },
        meta: {
          description: 'Tổng quan về bản quyền phần mềm và yêu cầu của bạn.',
          title: 'Bảng điều khiển | SaaS-Sentry'
        },
        quickActions: {
          changePlan: 'Đổi gói',
          createRequest: 'Tạo yêu cầu mới',
          requestRenewal: 'Yêu cầu gia hạn',
          returnLicense: 'Trả bản quyền',
          title: 'Thao tác nhanh'
        },
        recommended: {
          requestAccess: 'Yêu cầu truy cập',
          subtitle: 'Công cụ phổ biến trong phòng ban của bạn',
          title: 'Phần mềm đề xuất',
          viewCatalog: 'Xem danh mục'
        },
        software: {
          assignedDate: 'Ngày gán',
          daysLeft: 'Còn {{count}} ngày',
          expiration: 'Hạn dùng',
          noExpiration: 'Không hết hạn',
          plan: 'Gói',
          showingOf: 'Hiển thị {{shown}} trên {{total}} phần mềm',
          software: 'Phần mềm',
          status: 'Trạng thái',
          usage: 'Sử dụng',
          view: 'Xem',
          viewAll: 'Xem tất cả',
          viewAllSoftware: 'Xem tất cả phần mềm'
        },
        tips: {
          learnMore: 'Tìm hiểu thêm',
          message: 'Trả lại bản quyền bạn không còn cần để giúp công ty tối ưu chi phí phần mềm!',
          title: 'Mẹo'
        },
        usageSummary: {
          activelyUsed: 'Đang sử dụng',
          avgUsage: 'TB sử dụng',
          lowUsage: 'Ít sử dụng',
          notUsed: 'Không sử dụng',
          title: 'Tổng quan sử dụng'
        }
      },
      errors: {
        genericDetails: 'Đã xảy ra lỗi không mong muốn.',
        genericTitle: 'Lỗi',
        loading: 'Đang khởi tạo SaaS-Sentry…',
        notFoundDetails: 'Không tìm thấy trang bạn yêu cầu.',
        notFoundTitle: '404'
      },
      home: {
        description:
          'React Router quản lý route, TanStack Query quản lý server state và Orval giữ client đồng bộ với hợp đồng API.',
        foundationHeading: 'Các nền tảng kiến trúc',
        foundations: {
          ai: {
            description: 'Mọi agent dùng chung kiến trúc, lệnh kiểm tra và quy tắc không sửa generated code.',
            title: 'Quy trình sẵn sàng cho AI'
          },
          boundaries: {
            description: 'Route chỉ điều phối URL; nghiệp vụ nằm trong feature và không rò ngược vào shared.',
            title: 'Ranh giới feature'
          },
          contract: {
            description: 'OpenAPI là nguồn dữ liệu cho TypeScript client, TanStack Query hooks và mock factories.',
            title: 'API theo hợp đồng'
          }
        },
        title: 'Nền tảng frontend đã sẵn sàng để phát triển theo module nghiệp vụ.'
      },
      layout: {
        header: {
          avatarAlt: 'Ảnh đại diện người dùng',
          help: 'Trợ giúp',
          notifications: 'Thông báo',
          searchPlaceholder: 'Tìm phần mềm, yêu cầu...',
          userRole: 'Chuyên viên thiết kế'
        },
        helpBanner: {
          action: 'Xem Trung tâm hỗ trợ',
          subtitle: 'Xem hướng dẫn hoặc liên hệ bộ phận IT',
          title: 'Cần hỗ trợ?'
        },
        nav: {
          createRequest: 'Tạo yêu cầu',
          dashboard: 'Bảng điều khiển',
          logout: 'Đăng xuất',
          myProfile: 'Hồ sơ của tôi',
          myRequests: 'Yêu cầu của tôi',
          mySoftware: 'Phần mềm của tôi',
          sectionEmployee: 'Nhân viên'
        }
      },
      mySoftware: {
        breadcrumbs: {
          ariaLabel: 'Thanh điều hướng',
          current: 'Phần mềm của tôi',
          dashboard: 'Bảng điều khiển'
        },
        filters: {
          searchPlaceholder: 'Tìm kiếm phần mềm...',
          sortAssignedDate: 'Sắp xếp theo: Ngày cấp',
          sortExpiration: 'Sắp xếp theo: Ngày hết hạn',
          sortName: 'Sắp xếp theo: Tên',
          statusActive: 'Đang hoạt động',
          statusAll: 'Tất cả trạng thái',
          statusExpiring: 'Sắp hết hạn'
        },
        header: {
          requestSoftware: 'Yêu cầu phần mềm',
          subtitle: 'Các phần mềm và bản quyền đang được cấp cho bạn.',
          title: 'Phần mềm của tôi'
        },
        modal: {
          assignedDate: 'Ngày cấp',
          close: 'Đóng',
          expirationDate: 'Ngày hết hạn',
          licenseKey: 'Mã bản quyền / Vị trí',
          planTier: 'Gói bản quyền',
          requestAction: 'Thao tác',
          requestRenewal: 'Gia hạn bản quyền',
          returnLicense: 'Hoàn trả bản quyền',
          softwareInfo: 'Thông tin phần mềm',
          title: 'Chi tiết phần mềm',
          vendor: 'Nhà cung cấp'
        },
        pagination: {
          next: 'Sau',
          page: 'Trang {{page}}',
          previous: 'Trước',
          showingResults: 'Hiển thị {{from}} đến {{to}} trong số {{total}} kết quả'
        },
        status: {
          active: 'Đang hoạt động',
          expiringSoon: 'Sắp hết hạn',
          pending: 'Chờ duyệt',
          returned: 'Đã hoàn trả'
        },
        table: {
          action: 'Hành động',
          assignedDate: 'Ngày cấp',
          emptyDescription: 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.',
          emptyTitle: 'Không tìm thấy phần mềm',
          expiration: 'Ngày hết hạn',
          moreOptions: 'Tùy chọn khác',
          noExpiration: 'Không thời hạn',
          plan: 'Gói dịch vụ',
          software: 'Phần mềm',
          status: 'Trạng thái',
          viewDetails: 'Xem chi tiết'
        },
        tabs: {
          active: 'Đang hoạt động',
          all: 'Tất cả',
          expiringSoon: 'Sắp hết hạn',
          pending: 'Chờ duyệt',
          returned: 'Đã hoàn trả'
        }
      },
      myRequests: {
        breadcrumbs: {
          ariaLabel: 'Thanh điều hướng',
          current: 'Yêu cầu của tôi',
          home: 'Trang chủ'
        },
        filters: {
          clearFilters: 'Xóa bộ lọc',
          searchPlaceholder: 'Tìm theo mã yêu cầu hoặc tên phần mềm...',
          statusAll: 'Tất cả',
          statusApproved: 'Đã duyệt',
          statusCancelled: 'Đã hủy',
          statusCompleted: 'Hoàn thành',
          statusLabel: 'Trạng thái',
          statusPending: 'Chờ duyệt',
          statusRejected: 'Từ chối',
          typeAll: 'Tất cả',
          typeChangePlan: 'Đổi gói',
          typeLabel: 'Loại yêu cầu',
          typeNew: 'Phần mềm mới',
          typeRenewal: 'Gia hạn'
        },
        header: {
          createRequest: 'Tạo yêu cầu',
          subtitle: 'Theo dõi tiến độ và trạng thái các yêu cầu phần mềm của bạn.',
          title: 'Yêu cầu của tôi'
        },
        modal: {
          approvalTimeline: 'Quy trình phê duyệt',
          cancelRequest: 'Hủy yêu cầu này',
          close: 'Đóng',
          contactSupport: 'Liên hệ hỗ trợ',
          currentStatus: 'Trạng thái hiện tại',
          dateSubmitted: 'Thời gian gửi',
          requestId: 'Mã yêu cầu',
          requestType: 'Loại yêu cầu',
          software: 'Phần mềm',
          stepCompleted: 'Bản quyền đã được kích hoạt',
          stepIT: 'IT cấp phát bản quyền',
          stepManager: 'Trưởng bộ phận phê duyệt',
          stepSubmitted: 'Đã gửi yêu cầu',
          title: 'Chi tiết yêu cầu'
        },
        pagination: {
          ariaLabel: 'Phân trang',
          next: 'Sau',
          page: 'Trang {{page}}',
          previous: 'Trước',
          showingRequests: 'Hiển thị {{from}} đến {{to}} trong số {{total}} yêu cầu'
        },
        status: {
          approved: 'Đã duyệt',
          cancelled: 'Đã hủy',
          completed: 'Hoàn thành',
          pending: 'Chờ duyệt',
          rejected: 'Từ chối'
        },
        steps: {
          accessExtended: 'Đã gia hạn quyền truy cập',
          accessGranted: 'Đã cấp quyền truy cập',
          cancelled: 'Đã hủy',
          cancelledByYou: 'Bạn đã hủy yêu cầu',
          completed: 'Hoàn thành',
          itProcessing: 'Bộ phận IT xử lý',
          itProvisioning: 'Đang cấp phát bản quyền',
          managerApproval: 'Trưởng bộ phận duyệt',
          managerRejected: 'Đã bị từ chối',
          managerWaiting: 'Đang chờ phê duyệt'
        },
        table: {
          action: 'Hành động',
          currentStep: 'Bước hiện tại',
          emptyDescription: 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.',
          emptyTitle: 'Không tìm thấy yêu cầu',
          moreOptions: 'Tùy chọn khác',
          requestId: 'Mã yêu cầu',
          requestType: 'Loại yêu cầu',
          software: 'Phần mềm',
          status: 'Trạng thái',
          submitted: 'Ngày gửi',
          viewDetails: 'Xem chi tiết'
        },
        types: {
          changePlan: 'Đổi gói',
          newSoftware: 'Phần mềm mới',
          renewal: 'Gia hạn'
        }
      },
      softwareDetail: {
        actions: {
          moreOptions: 'Tùy chọn khác',
          requestChange: 'Yêu cầu thay đổi',
          requestChangePlan: 'Yêu cầu đổi gói',
          requestRenewal: 'Yêu cầu gia hạn tạm thời',
          returnLicense: 'Hoàn trả bản quyền',
          viewCostDetails: 'Xem chi tiết chi phí',
          viewDataPolicy: 'Xem chính sách dữ liệu'
        },
        backLink: 'Quay lại Phần mềm của tôi',
        descriptionCard: {
          figmaDesc:
            'Figma là nền tảng thiết kế và tạo nguyên mẫu tương tác được các nhóm sản phẩm và kỹ thuật của chúng tôi sử dụng để xây dựng giao diện người dùng và hệ thống thiết kế.',
          title: 'Mô tả'
        },
        generalInfo: {
          appName: 'Tên ứng dụng',
          assignedDate: 'Ngày cấp',
          autoRenewal: 'Tự động gia hạn',
          autoRenewalOn: 'Bật',
          category: 'Danh mục',
          costCenter: 'Trung tâm chi phí',
          expirationDate: 'Ngày hết hạn',
          licenseType: 'Loại bản quyền',
          owner: 'Chủ sở hữu',
          plan: 'Gói bản quyền',
          project: 'Dự án',
          provider: 'Nhà cung cấp',
          status: 'Trạng thái',
          statusActive: 'Đang hoạt động',
          title: 'Thông tin chung'
        },
        licenseCostSummary: {
          assigned: 'Đã phân bổ',
          available: 'Còn trống',
          estimatedAnnualCost: 'Chi phí ước tính hàng năm',
          monthlyCost: 'Chi phí hàng tháng',
          title: 'Tóm tắt bản quyền & chi phí',
          totalLicenses: 'Tổng số bản quyền'
        },
        relatedInfo: {
          businessOwner: 'Người phụ trách nghiệp vụ',
          department: 'Phòng ban',
          project: 'Dự án',
          team: 'Nhóm làm việc',
          title: 'Thông tin liên quan'
        },
        tabs: {
          licenseCost: 'Bản quyền & Chi phí',
          overview: 'Tổng quan',
          relatedRequests: 'Yêu cầu liên quan',
          usageActivity: 'Sử dụng & Hoạt động'
        },
        tags: {
          design: 'Thiết kế',
          productivity: 'Năng suất',
          saas: 'SaaS'
        },
        usageMonitoring: {
          applicationEvents: 'Sự kiện ứng dụng (giới hạn)',
          dataCollectedTitle: 'Dữ liệu thu thập',
          dataSourceTitle: 'Nguồn dữ liệu',
          dataSourceValue: 'Figma API (thông qua tích hợp)',
          enabled: 'Đang bật',
          lastActivityDate: 'Ngày hoạt động gần nhất',
          notice:
            'Chúng tôi thu thập dữ liệu sử dụng để tối ưu hóa bản quyền và đảm bảo quản lý quyền truy cập phù hợp.',
          purposeTitle: 'Mục đích',
          purposeValue: 'Tối ưu hóa bản quyền & đánh giá quyền truy cập',
          title: 'Giám sát sử dụng',
          usageSummary: 'Tóm tắt mức độ sử dụng (tổng hợp)'
        },
        usageStatus: {
          activeCount: 'Đang dùng ({{count}})',
          activeUsage: 'Đang sử dụng',
          healthy: 'Tốt',
          inactiveCount: 'Không dùng ({{count}})',
          lastActivity: 'Hoạt động gần nhất',
          lastActivityValue: '28/04/2025 (12 ngày trước)',
          title: 'Trạng thái sử dụng'
        }
      },
      requestDetail: {
        backToRequests: 'Quay lại Yêu cầu của tôi',
        breadcrumbs: {
          myRequests: 'Yêu cầu của tôi'
        },
        flow: {
          employee: 'Nhân viên',
          employeeSub: 'Bạn',
          finance: 'Tài chính',
          financeSub: '(Nếu cần)',
          itAdmin: 'Quản trị IT',
          itAdminSub: 'Cấp phát',
          manager: 'Quản lý',
          title: 'Quy trình phê duyệt'
        },
        header: {
          currentStatusDesc: 'Yêu cầu của bạn đang chờ quản lý trực tiếp xem xét.',
          currentStatusTitle: 'Trạng thái hiện tại',
          currentStatusValue: 'Chờ trưởng bộ phận duyệt',
          newSoftwareAccess: 'Cấp quyền phần mềm mới',
          submittedOn: 'Đã gửi vào ngày {{date}} lúc {{time}}'
        },
        history: {
          event1Desc: 'Yêu cầu đã được chuyển tới {{name}} để phê duyệt.',
          event1Title: 'Yêu cầu đã chuyển đến quản lý',
          event2Desc: 'Bạn đã hoàn tất gửi đơn yêu cầu thành công.',
          event2Title: 'Đã gửi yêu cầu',
          title: 'Lịch sử yêu cầu'
        },
        info: {
          businessReason: 'Lý do nghiệp vụ',
          costCenter: 'Trung tâm chi phí',
          plan: 'Gói dịch vụ',
          project: 'Dự án',
          requestType: 'Loại yêu cầu',
          requiredFrom: 'Cần từ ngày',
          requiredUntil: 'Cần đến ngày',
          software: 'Phần mềm',
          submittedBy: 'Người gửi yêu cầu',
          submittedDate: 'Ngày gửi',
          title: 'Thông tin yêu cầu'
        },
        progress: {
          cancelAction: 'Hủy yêu cầu',
          cancelDisclaimer: 'Bạn có thể hủy yêu cầu này khi đơn đang trong quá trình duyệt.',
          step1Status: 'Hoàn thành',
          step1Title: '1. Đã gửi yêu cầu',
          step2Desc: 'Quản lý của bạn sẽ xem xét và đánh giá yêu cầu này.',
          step2NoticeDesc: 'Yêu cầu của bạn đã được chuyển tới {{name}} để xem xét.',
          step2NoticeTitle: 'Đang chờ quản lý phê duyệt',
          step2Status: 'Đang xử lý',
          step2Title: '2. Quản lý xem xét',
          step3Desc: 'Chỉ yêu cầu khi phát sinh chi phí hoặc ngân sách phòng ban.',
          step3Status: 'Không yêu cầu',
          step3Title: '3. Tài chính đánh giá',
          step4Desc: 'Bộ phận IT sẽ tiến hành cấp tài khoản/seat bản quyền.',
          step4Status: 'Đang chờ',
          step4Title: '4. IT cấp phát bản quyền',
          step5Desc: 'Quy trình hoàn tất và quyền truy cập sẵn sàng sử dụng.',
          step5Status: 'Đang chờ',
          step5Title: '5. Hoàn thành',
          title: 'Tiến độ phê duyệt'
        }
      },
      createRequest: {
        banner: {
          description: 'Yêu cầu của bạn sẽ được người phụ trách xem xét và phê duyệt trước khi áp dụng.',
          learnMore: 'Tìm hiểu thêm về quy trình phê duyệt',
          title: 'Tất cả yêu cầu đều cần phê duyệt'
        },
        breadcrumbs: {
          ariaLabel: 'Điều hướng trang',
          current: 'Tạo yêu cầu',
          home: 'Trang chủ'
        },
        header: {
          subtitle: 'Chọn loại yêu cầu phần mềm bạn muốn gửi.',
          title: 'Bạn đang cần gì?'
        },
        meta: {
          description: 'Gửi yêu cầu cấp phần mềm mới, đổi gói, gia hạn tạm thời hoặc hoàn trả bản quyền.',
          title: 'Tạo yêu cầu | SaaS-Sentry'
        },
        types: {
          changePlan: {
            callout: 'Nâng cấp, hạ cấp hoặc chuyển sang gói dịch vụ khác.',
            description: 'Yêu cầu đổi gói cho phần mềm bạn đang sử dụng.',
            title: '2. Đổi gói dịch vụ'
          },
          newSoftware: {
            callout: 'Yêu cầu quyền truy cập phần mềm đã được phê duyệt phục vụ công việc.',
            description: 'Nhận quyền truy cập vào phần mềm bạn chưa có.',
            title: '1. Yêu cầu phần mềm mới'
          },
          returnLicense: {
            callout: 'Cho chúng tôi biết lý do trả để tối ưu hóa và phân bổ lại bản quyền.',
            description: 'Hoàn trả quyền sử dụng phần mềm khi không còn nhu cầu.',
            title: '4. Trả lại bản quyền'
          },
          temporaryRenewal: {
            callout: 'Yêu cầu gia hạn khi bạn cần thêm thời gian để hoàn thành công việc.',
            description: 'Gia hạn thời gian sử dụng phần mềm thêm một khoảng thời gian.',
            title: '3. Gia hạn tạm thời'
          }
        }
      },
      requestNewSoftware: {
        actions: {
          back: 'Quay lại',
          cancel: 'Hủy',
          continue: 'Tiếp tục'
        },
        details: {
          approvalAlert: 'Yêu cầu của bạn sẽ được xem xét và bạn sẽ nhận được thông báo về kết quả duyệt.',
          businessReasonLabel: 'Lý do nghiệp vụ',
          businessReasonPlaceholder: 'Nhập lý do sử dụng cho công việc...',
          businessReasonRequired: '*',
          changeSoftware: 'Thay đổi',
          costCenterLabel: 'Trung tâm chi phí',
          costCenterOptions: {
            cc001: 'CC-001 - Thiết kế sản phẩm',
            cc002: 'CC-002 - Kỹ thuật công nghệ',
            cc003: 'CC-003 - Marketing'
          },
          costCenterRequired: '*',
          planLabel: 'Gói dịch vụ',
          planOptions: {
            enterprise: 'Enterprise',
            organization: 'Organization',
            professional: 'Professional'
          },
          planRequired: '*',
          projectLabel: 'Dự án',
          projectOptions: {
            alpha: 'Dự án Alpha',
            beta: 'Dự án Beta',
            designSystem: 'Hệ thống thiết kế'
          },
          projectRequired: '*',
          requiredFromLabel: 'Cần từ ngày',
          requiredFromRequired: '*',
          requiredUntilLabel: 'Cần đến ngày',
          selectedSoftware: 'Phần mềm đã chọn',
          stepIndicator: 'Bước 2 / 4',
          subtitle: 'Vui lòng cung cấp thông tin chi tiết về yêu cầu của bạn.',
          title: 'Chi tiết yêu cầu'
        },
        header: {
          subtitle: 'Nhận quyền truy cập vào phần mềm bạn chưa có.',
          title: 'Yêu cầu phần mềm mới'
        },
        meta: {
          description: 'Gửi yêu cầu cấp quyền sử dụng phần mềm mới được phê duyệt.',
          title: 'Yêu cầu phần mềm mới | SaaS-Sentry'
        },
        selection: {
          cantFind: 'Không tìm thấy phần mềm bạn cần?',
          contactSupport: 'Liên hệ bộ phận IT',
          figmaDesc: 'Nền tảng thiết kế giao diện và làm việc cộng tác cho các nhóm.',
          githubDesc: 'Nền tảng lưu trữ mã nguồn, quản lý phiên bản và cộng tác phát triển phần mềm.',
          jiraDesc: 'Phần mềm quản lý công việc và theo dõi dự án theo mô hình Agile.',
          searchPlaceholder: 'Tìm kiếm phần mềm được phê duyệt...',
          statusAvailable: 'Có sẵn',
          stepIndicator: 'Bước 1 / 4',
          subtitle: 'Tìm kiếm và chọn phần mềm bạn cần sử dụng.',
          title: 'Chọn phần mềm'
        },
        stepper: {
          step1: 'Phần mềm',
          step1Sub: 'Chọn phần mềm',
          step2: 'Chi tiết yêu cầu',
          step2Sub: 'Cung cấp thông tin',
          step3: 'Kiểm tra',
          step3Sub: 'Xem lại đơn yêu cầu',
          step4: 'Hoàn tất',
          step4Sub: 'Đã gửi yêu cầu'
        }
      },
      temporaryRenewal: {
        actions: {
          cancel: 'Hủy',
          review: 'Xem lại yêu cầu gia hạn'
        },
        alert: {
          description: 'Vui lòng gửi yêu cầu gia hạn trước khi hết hạn để tránh gián đoạn công việc.',
          title: 'Quyền truy cập hiện tại sẽ hết hạn vào 30/09/2026 (sau 14 ngày)'
        },
        breadcrumbs: {
          ariaLabel: 'Điều hướng trang',
          createRequest: 'Tạo yêu cầu',
          current: 'Yêu cầu gia hạn tạm thời',
          dashboard: 'Bảng điều khiển',
          mySoftware: 'Phần mềm của tôi',
          software: 'Figma'
        },
        form: {
          additionalNotesHelper: 'Bổ sung thêm thông tin cần thiết nếu có.',
          additionalNotesLabel: 'Ghi chú thêm',
          additionalNotesOptional: '(tùy chọn)',
          additionalNotesPlaceholder: 'Nhập thông tin bổ sung...',
          clearDate: 'Xóa ngày',
          costCenterLabel: 'Trung tâm chi phí',
          costCenterOptions: {
            cc001: 'CC-001 - Phát triển sản phẩm',
            cc002: 'CC-002 - Kỹ thuật công nghệ'
          },
          costCenterRequired: '*',
          durationHelper: 'Từ 01/10/2026 đến 31/12/2026',
          durationLabel: 'Thời gian gia hạn yêu cầu',
          newExpirationDateHelper: 'Chọn ngày bạn cần duy trì quyền truy cập đến.',
          newExpirationDateLabel: 'Ngày hết hạn mới',
          newExpirationDateRequired: '*',
          projectLabel: 'Dự án',
          projectOptions: {
            alpha: 'Dự án Alpha',
            beta: 'Dự án Beta'
          },
          projectRequired: '*',
          reasonHelper: 'Giải thích lý do bạn cần tiếp tục sử dụng thêm thời gian.',
          reasonLabel: 'Lý do gia hạn',
          reasonPlaceholder: 'Nhập lý do cần gia hạn...',
          reasonRequired: '*'
        },
        header: {
          subtitle: 'Gia hạn quyền truy cập Figma thêm một khoảng thời gian cụ thể.',
          title: 'Yêu cầu gia hạn tạm thời'
        },
        meta: {
          description: 'Gửi yêu cầu gia hạn tạm thời để kéo dài thời gian sử dụng bản quyền phần mềm.',
          title: 'Yêu cầu gia hạn tạm thời | SaaS-Sentry'
        },
        stepper: {
          step1: 'Chi tiết',
          step2: 'Kiểm tra',
          step3: 'Hoàn tất'
        },
        summary: {
          costCenter: 'Trung tâm chi phí',
          currentExpiration: 'Hết hạn hiện tại',
          extensionDuration: 'Thời gian gia hạn',
          newExpiration: 'Hết hạn mới',
          noticeDescription: 'Yêu cầu gia hạn sẽ được Quản lý và Bộ phận IT xem xét, phê duyệt.',
          noticeTitle: 'Đây là đơn yêu cầu, không phải cấp quyền ngay lập tức.',
          planName: 'Gói Professional',
          project: 'Dự án',
          requestType: 'Loại yêu cầu',
          requestTypeValue: 'Gia hạn tạm thời',
          requestedBy: 'Người yêu cầu',
          softwareName: 'Figma',
          statusActive: 'Đang hoạt động',
          title: 'Tóm tắt yêu cầu'
        }
      },
      returnLicense: {
        actions: {
          cancel: 'Hủy',
          review: 'Xem lại yêu cầu'
        },
        additionalNotes: {
          helperText: 'Cung cấp thêm thông tin chi tiết hỗ trợ đội ngũ IT xử lý.',
          label: '3. Ghi chú bổ sung',
          optional: '(không bắt buộc)',
          placeholder: 'Cung cấp thêm thông tin chi tiết hỗ trợ đội ngũ IT xử lý.'
        },
        breadcrumbs: {
          ariaLabel: 'Đường dẫn liên kết',
          current: 'Yêu cầu hoàn trả bản quyền',
          dashboard: 'Bảng điều khiển',
          myRequests: 'Yêu cầu của tôi'
        },
        header: {
          subtitle: 'Gửi yêu cầu hoàn trả lại bản quyền phần mềm khi bạn không còn nhu cầu sử dụng.',
          title: 'Yêu cầu hoàn trả bản quyền'
        },
        meta: {
          description: 'Yêu cầu hoàn trả bản quyền phần mềm khi bạn không còn nhu cầu sử dụng.',
          title: 'Yêu cầu hoàn trả bản quyền | SaaS-Sentry'
        },
        reasons: {
          noLongerNeeded: {
            description: 'Tôi không cần dùng phần mềm này cho công việc hiện tại nữa.',
            title: 'Không còn nhu cầu'
          },
          other: {
            description: 'Vui lòng cung cấp chi tiết lý do bên dưới.',
            title: 'Lý do khác'
          },
          projectCompleted: {
            description: 'Tôi đã hoàn thành xong dự án cần sử dụng phần mềm này.',
            title: 'Dự án đã hoàn thành'
          },
          required: '*',
          sectionTitle: '2. Tại sao bạn hoàn trả bản quyền này?',
          switchingTool: {
            description: 'Nhóm của chúng tôi đang chuyển sang dùng một công cụ khác.',
            title: 'Chuyển sang công cụ khác'
          }
        },
        softwareCard: {
          assignedByLabel: 'Người cấp',
          assignedByValue: 'Quản trị viên IT',
          assignedDateLabel: 'Ngày cấp',
          assignedDateValue: '15/01/2026',
          expirationDateLabel: 'Ngày hết hạn',
          expirationDateValue: '31/12/2026',
          planName: 'Gói Professional',
          sectionTitle: '1. Phần mềm hoàn trả',
          softwareLogoAlt: 'Logo Figma',
          softwareName: 'Figma',
          statusActive: 'Đang hoạt động'
        },
        stepper: {
          step1: 'Chi tiết',
          step2: 'Xem lại',
          step3: 'Đã gửi'
        },
        summary: {
          assignedDate: 'Ngày cấp',
          costCenter: 'Trung tâm chi phí',
          costCenterValue: 'CC-001',
          expirationDate: 'Ngày hết hạn',
          noticeLine1: 'Bản quyền của bạn vẫn hoạt động cho đến khi đội ngũ IT xử lý yêu cầu.',
          noticeLine2: 'Bạn sẽ nhận được thông báo ngay khi quá trình hoàn tất.',
          noticeTitle: 'Thông tin quan trọng cần biết',
          planName: 'Gói Professional',
          project: 'Dự án',
          projectValue: 'Dự án Alpha',
          requestType: 'Loại yêu cầu',
          requestTypeValue: 'Hoàn trả bản quyền',
          requestedBy: 'Người yêu cầu',
          requestedByValue: 'Nguyễn Minh An',
          softwareName: 'Figma',
          statusActive: 'Hoạt động',
          title: 'Tóm tắt hoàn trả'
        }
      },
      profile: {
        meta: {
          description: 'Quản lý thông tin cá nhân và kiểm soát quyền riêng tư dữ liệu của bạn.',
          title: 'Hồ sơ của tôi | SaaS-Sentry'
        },
        header: {
          subtitle: 'Quản lý thông tin cá nhân và kiểm soát quyền riêng tư dữ liệu của bạn.',
          title: 'Hồ sơ của tôi'
        },
        subnav: {
          dataPrivacy: 'Dữ liệu & Quyền riêng tư',
          profile: 'Hồ sơ'
        },
        personalInfo: {
          editAction: 'Chỉnh sửa',
          fields: {
            department: 'Phòng ban',
            email: 'Email',
            employeeId: 'Mã nhân viên',
            fullName: 'Họ và tên',
            joinDate: 'Ngày vào công ty',
            phone: 'Số điện thoại',
            position: 'Vị trí công việc'
          },
          subtitle: 'Thông tin cơ bản của bạn',
          title: 'Thông tin cá nhân'
        },
        organization: {
          editAction: 'Chỉnh sửa',
          fields: {
            company: 'Công ty',
            costCenter: 'Trung tâm chi phí',
            department: 'Phòng ban',
            team: 'Nhóm làm việc'
          },
          subtitle: 'Thông tin về mặt tổ chức của bạn',
          title: 'Tổ chức'
        },
        dataPrivacy: {
          compliance: {
            and: 'và',
            decree: 'Nghị định số 356/2025/NĐ-CP',
            law: 'Luật Bảo vệ Dữ liệu Cá nhân (Luật số 91/2025/QH15)',
            prefix: 'Chúng tôi thu thập và xử lý dữ liệu của bạn tuân thủ theo',
            suffix: '. Dữ liệu của bạn được lưu trữ an toàn và chỉ người có thẩm quyền mới được truy cập.'
          },
          dataStored: {
            categories: {
              orgInfo: {
                bold: 'Thông tin tổ chức',
                text: '(phòng ban, nhóm làm việc, vị trí, v.v.)'
              },
              personalInfo: {
                bold: 'Thông tin cá nhân',
                text: '(họ tên, email, số điện thoại, v.v.)'
              },
              requestHistory: {
                bold: 'Lịch sử yêu cầu',
                text: 'và hồ sơ các lần phê duyệt'
              },
              softwareAssignments: {
                bold: 'Cấp phát phần mềm',
                text: 'và thông tin bản quyền được giao'
              },
              usageSummary: {
                bold: 'Tóm tắt mức độ sử dụng',
                text: '(khi bạn đã bật tính năng theo dõi)'
              }
            },
            description: 'Các loại dữ liệu sau đây được thu thập và lưu trữ trong hệ thống:',
            title: 'Dữ liệu chúng tôi lưu trữ về bạn',
            viewDetailedCategories: 'Xem chi tiết các danh mục dữ liệu'
          },
          notification: {
            description:
              'Bạn sẽ nhận được thông báo khi chúng tôi bắt đầu thu thập dữ liệu sử dụng cho bất kỳ ứng dụng nào bạn dùng.',
            disabled: 'Đang tắt',
            enabled: 'Đang bật',
            title: 'Thông báo sử dụng dữ liệu',
            toggleAriaLabel: 'Bật/tắt thông báo sử dụng dữ liệu'
          },
          privacyRights: {
            actions: {
              manageConsent: {
                subtitle: 'Kiểm soát tùy chọn dữ liệu của bạn',
                title: 'Quản lý quyền đồng thuận'
              },
              requestExport: {
                subtitle: 'Nhận bản sao lưu dữ liệu cá nhân của bạn',
                title: 'Yêu cầu trích xuất dữ liệu'
              },
              viewUsage: {
                subtitle: 'Tìm hiểu cách dữ liệu của bạn được sử dụng',
                title: 'Xem mục đích sử dụng dữ liệu'
              }
            },
            description: 'Bạn có quyền truy cập, trích xuất và quản lý dữ liệu cá nhân của mình.',
            title: 'Quyền riêng tư của bạn'
          },
          subtitle: 'Xem dữ liệu chúng tôi lưu trữ về bạn và quản lý các quyền riêng tư.',
          title: 'Dữ liệu & Quyền riêng tư của tôi'
        }
      },
      dataExport: {
        actions: {
          cancel: 'Hủy bỏ',
          submit: 'Gửi yêu cầu trích xuất'
        },
        header: {
          backLink: 'Quay lại Hồ sơ / Dữ liệu & Quyền riêng tư',
          regulatoryBadge: 'Tuân thủ Nghị định 356/2025/NĐ-CP về BV dữ liệu',
          subtitle: 'Gửi yêu cầu tải về bản sao chứng thực dữ liệu cá nhân và hoạt động lưu trữ trong SaaS-Sentry.',
          title: 'Yêu cầu trích xuất dữ liệu'
        },
        meta: {
          description: 'Gửi yêu cầu tải về bản sao chứng thực dữ liệu cá nhân và hoạt động lưu trữ trong SaaS-Sentry.',
          title: 'Yêu cầu trích xuất dữ liệu | SaaS-Sentry'
        },
        recent: {
          download: 'Tải xuống',
          expired: 'Hết hạn',
          export1: {
            details: '15/01/2026 • 640 KB • Toàn bộ hồ sơ',
            name: 'export_2026_01_15.zip'
          },
          export2: {
            details: '10/06/2025 • Đã hết hạn (quá 7 ngày)',
            name: 'export_2025_06_10.zip'
          },
          timeframe: '6 tháng qua',
          title: 'Các lần trích xuất gần đây'
        },
        step1: {
          categories: {
            personal: {
              description:
                'Họ và tên, email, Mã nhân viên (EMP00123), phòng ban, số điện thoại và cấp quản lý trực tiếp.',
              size: '~ 120 KB',
              title: 'Thông tin cá nhân & Hồ sơ nhân sự'
            },
            requests: {
              description:
                'Toàn bộ các đơn yêu cầu phần mềm đã gửi (REQ-1024, REQ-1021, REQ-1018), ghi chú lý do và dấu thời gian phê duyệt.',
              size: '~ 480 KB',
              title: 'Lịch sử yêu cầu & Nhật ký phê duyệt'
            },
            software: {
              description:
                'Các ứng dụng được giao (Figma, GitHub, Jira, Slack, Microsoft 365), gói cước, ngày cấp và trung tâm chi phí.',
              size: '~ 240 KB',
              title: 'Cấp phát phần mềm & Phân bổ bản quyền'
            },
            telemetry: {
              description:
                'Dữ liệu đo lường tổng hợp 30 ngày/90 ngày, thời điểm đăng nhập gần nhất và nhật ký rà soát quyền truy cập.',
              size: '~ 1.8 MB',
              title: 'Thống kê sử dụng tổng hợp & Nhật ký hoạt động'
            }
          },
          deselectAll: 'Bỏ chọn tất cả',
          selectAll: 'Chọn tất cả ({{count}})',
          title: 'Chọn các danh mục dữ liệu cần trích xuất'
        },
        step2: {
          destination: {
            helper: 'Vì lý do bảo mật, gói dữ liệu trích xuất chỉ được gửi đến email doanh nghiệp đã xác thực của bạn.',
            label: 'Email nhận thông báo và đường dẫn tải về'
          },
          formats: {
            csv: {
              badge: 'CSV',
              subtitle: 'Bảng tính dữ liệu chi tiết kèm tóm tắt báo cáo dưới định dạng PDF.',
              title: 'Gói CSV & PDF'
            },
            json: {
              subtitle: 'Dữ liệu có thể đọc bằng máy dùng để nhập hoặc kiểm toán tự động.',
              title: 'Kho lưu trữ JSON'
            }
          },
          password: {
            inputLabel: 'Thiết lập mật khẩu gói nén',
            inputPlaceholder: 'Nhập mật khẩu cho tệp...',
            subtitle: 'Mã hóa gói dữ liệu trích xuất bằng mật khẩu một lần',
            title: 'Bảo vệ bằng mật khẩu (ZIP AES-256)',
            toggleAriaLabel: 'Bật/tắt bảo vệ bằng mật khẩu'
          },
          purpose: {
            label: 'Mục đích / Ghi chú',
            optional: '(Tùy chọn)',
            placeholder: 'Ví dụ: Đánh giá dữ liệu cá nhân hàng năm, xác minh tuân thủ...'
          },
          title: 'Chọn định dạng tệp & Phương thức mã hóa'
        },
        summary: {
          categoriesLabel: 'Danh mục đã chọn:',
          categoriesValue: '{{count}} danh mục (~{{size}})',
          encryptionDisabled: 'Tiêu chuẩn (Không mật khẩu)',
          encryptionEnabled: 'Đã bật AES-256',
          encryptionLabel: 'Mã hóa:',
          formatCsv: 'Gói CSV & PDF (.zip)',
          formatJson: 'Kho lưu trữ JSON (.zip)',
          formatLabel: 'Định dạng:',
          requesterLabel: 'Người yêu cầu:',
          requesterValue: 'Nguyen Van Tuan (EMP00123)',
          retentionNotice: 'Đường dẫn tải về tự động hết hạn sau 7 ngày nhằm đảm bảo quyền riêng tư.',
          slaLabel: 'Thời gian hoàn tất dự kiến:',
          slaValue: 'Trong vòng 24 giờ',
          title: 'Tóm tắt yêu cầu'
        },
        workflow: {
          step1Desc: 'Yêu cầu trích xuất được xác thực theo chính sách bảo mật và đưa vào hàng đợi xử lý định kỳ.',
          step1Title: '1. Xếp hàng yêu cầu',
          step2Desc:
            'Hệ thống tổng hợp nhật ký từ cơ sở dữ liệu và tự động làm mờ các thông tin nhạy cảm (như API key).',
          step2Title: '2. Tổng hợp dữ liệu & Ẩn danh',
          step3Desc: 'Bạn sẽ nhận được email thông báo kèm mã bảo mật để tải gói dữ liệu về máy.',
          step3Title: '3. Hoàn tất & Gửi liên kết',
          title: 'Quy trình xử lý trích xuất'
        }
      },
      dataUsage: {
        apps: {
          badge: '1',
          cards: {
            collectedLabel: 'Dữ liệu thu thập:',
            excludedLabel: 'Loại trừ theo chính sách:',
            purposeLabel: 'Mục đích:'
          },
          figma: {
            collected: 'Thời điểm mở tệp gần nhất, dấu thời gian phiên làm việc',
            excluded: 'Tên tệp, nội dung canvas, dữ liệu thiết kế',
            integration: 'Tích hợp: Figma SCIM & Audit Log API • Tần suất: Mỗi 6 giờ',
            lastActivity: '28/04/2026 (12 ngày trước)',
            purpose: 'Phát hiện seat không dùng & phân bổ lại',
            tier: 'Professional'
          },
          github: {
            collected: 'Dấu thời gian hoạt động PR, commit, issue',
            excluded: 'Mã nguồn, tên nhánh, nội dung commit',
            integration: 'Tích hợp: GitHub Organization Audit API • Tần suất: Hàng ngày',
            lastActivity: 'Hôm nay (2 giờ trước)',
            purpose: 'Kiểm toán mức sử dụng gói bản quyền',
            tier: 'Enterprise'
          },
          lastActivityLabel: 'Hoạt động gần nhất',
          slack: {
            collected: 'Trạng thái hoạt động (boolean), ngày hiện diện gần nhất',
            excluded: 'Nội dung tin nhắn, tên kênh, tệp đính kèm, DM',
            integration: 'Tích hợp: Enterprise Grid Discovery API • Tần suất: Hàng ngày',
            lastActivity: 'Hôm qua (20/03/2026)',
            purpose: 'Quản lý seat giao tiếp doanh nghiệp',
            tier: 'Pro'
          },
          subtitle: 'Các điểm dữ liệu cụ thể được thu thập theo từng bản quyền phần mềm được giao',
          syncStatus: 'Đồng bộ thời gian thực',
          title: 'Đo lường ứng dụng & Trạng thái thu thập',
          trackingActive: 'Đang theo dõi'
        },
        auditLog: {
          logs: {
            log1: {
              actor: 'Lê Thị Mai (Quản lý)',
              meta: 'IP: 10.14.20.118',
              purpose: 'Xem xét yêu cầu REQ-1024 phê duyệt bản quyền Figma Pro.',
              status: 'Truy cập hợp lệ',
              time: '18/05, 10:20'
            },
            log2: {
              actor: 'Công cụ Ghost tự động',
              meta: 'Dịch vụ: rule-engine-v3',
              purpose: 'Kiểm tra định kỳ quý về tình trạng không hoạt động (>60 ngày).',
              status: 'Kiểm toán hệ thống',
              time: '28/04, 09:15'
            },
            log3: {
              actor: 'Sarah Jenkins (Quản trị IT)',
              meta: 'IP: 10.12.0.45',
              purpose: 'Rà soát quyền truy cập thường niên Q1 2026 xác minh phân bổ.',
              status: 'Kiểm toán rà soát',
              time: '12/01, 14:45'
            }
          },
          purposePrefix: 'Mục đích:',
          subtitle: 'Những ai đã truy cập hồ sơ dữ liệu của bạn',
          timeframe: '30 Ngày qua',
          title: 'Nhật ký truy cập dữ liệu',
          viewHistory: 'Xem toàn bộ lịch sử kiểm toán (18 sự kiện) →'
        },
        classification: {
          badge: '2',
          cols: {
            category: 'DANH MỤC DỮ LIỆU',
            encryption: 'MÃ HÓA',
            legalBasis: 'CƠ SỞ PHÁP LÝ (PDP)',
            recipients: 'ĐỐI TƯỢNG TRUY CẬP',
            retention: 'THỜI GIAN LƯU TRỮ'
          },
          rows: {
            entitlements: {
              encryption: 'AES-256',
              legalBasis: 'Lợi ích kinh doanh hợp pháp',
              recipients: 'Quản lý bộ phận, IT Ops',
              retention: 'Thời gian cấp + 2 năm kiểm toán',
              subtitle: 'Gói bản quyền, trung tâm chi phí, phân bổ',
              title: 'Cấp phát phần mềm'
            },
            identity: {
              encryption: 'AES-256',
              legalBasis: 'Hợp đồng lao động / Luật 91',
              recipients: 'Quản lý trực tiếp, HR, Quản trị IT',
              retention: 'Thời gian làm việc + 5 năm',
              subtitle: 'Họ tên, Email, Mã NV, Cơ cấu tổ chức',
              title: 'Danh tính & Hồ sơ nhân sự'
            },
            requests: {
              encryption: 'AES-256',
              legalBasis: 'Dấu vết kiểm toán & Tuân thủ',
              recipients: 'Kiểm toán tài chính, Người duyệt, Bạn',
              retention: '3 năm kể từ khi xử lý',
              subtitle: 'Ghi chú lý do, các bước phê duyệt',
              title: 'Nhật ký yêu cầu & Phê duyệt'
            },
            telemetry: {
              encryption: 'AES-256',
              legalBasis: 'Tối ưu hóa tài nguyên & Đồng thuận',
              recipients: 'Công cụ tự động, Quản trị IT',
              retention: 'Cửa sổ xoay vòng 90 ngày',
              subtitle: 'Đăng nhập cuối, cờ hoạt động (0/1)',
              title: 'Dữ liệu đo lường sử dụng'
            }
          },
          subtitle: 'Cách thức từng danh mục thông tin nhân viên được xử lý và lưu giữ',
          title: 'Phân loại dữ liệu & Tính hợp pháp trong xử lý'
        },
        guarantees: {
          item1Bold: 'Không theo dõi nội dung:',
          item1Text: 'Không bao giờ đọc code, tin nhắn, email, tài liệu hoặc layer thiết kế.',
          item2Bold: 'Không ghi phím bấm hay quay màn hình:',
          item2Text: 'Hoàn toàn không có thao tác phím, chụp màn hình hay đường rê chuột.',
          item3Bold: 'Không bán dữ liệu ra bên ngoài:',
          item3Text: 'Dữ liệu chỉ nằm trong hạ tầng riêng biệt của tổ chức, không chia sẻ với bên thứ ba.',
          title: 'Những gì SaaS-Sentry không bao giờ thu thập',
          toggleAriaLabel: 'Bật/tắt thông báo sử dụng dữ liệu',
          toggleLabel: 'Thông báo sử dụng dữ liệu',
          toggleSubtitle: 'Báo cho tôi khi có kết nối ứng dụng mới bắt đầu thu thập số liệu sử dụng.'
        },
        header: {
          backLink: 'Quay lại Hồ sơ của tôi / Dữ liệu & Quyền riêng tư',
          exportUsageLog: 'Xuất nhật ký sử dụng',
          pdpBadge: 'Thông báo tuân thủ PDP (Luật 91/2025/QH15)',
          subtitle:
            'Bảng phân tích minh bạch về dữ liệu SaaS-Sentry thu thập, cách theo dõi việc sử dụng và tần suất nhật ký truy cập.',
          title: 'Xem việc sử dụng dữ liệu'
        },
        meta: {
          description:
            'Bảng phân tích minh bạch về dữ liệu SaaS-Sentry thu thập, cách theo dõi việc sử dụng và tần suất nhật ký truy cập.',
          title: 'Xem việc sử dụng dữ liệu | SaaS-Sentry'
        },
        metrics: {
          auditedAccess: {
            label: 'Truy vấn được kiểm toán',
            sub: 'Tất cả đều có lý do ghi nhận',
            suffix: 'truy vấn',
            value: '18'
          },
          monitoredApps: {
            label: 'Ứng dụng được giám sát',
            sub: 'Đã thực thi ranh giới bảo mật',
            suffix: '/ 6 đang hoạt động',
            value: '4'
          },
          retention: {
            label: 'Thời gian lưu trữ dữ liệu',
            sub: 'Tự động dọn dẹp sau thời hạn',
            suffix: '',
            value: '90 Ngày'
          },
          telemetryEvents: {
            label: 'Sự kiện đo lường',
            sub: 'Tổng hợp, không xâm phạm',
            suffix: '30 ngày qua',
            value: '1.420'
          }
        },
        relatedControls: {
          manageConsents: 'Quản lý quyền đồng thuận riêng tư',
          requestExport: 'Yêu cầu trích xuất dữ liệu chứng thực',
          title: 'Các quyền riêng tư liên quan'
        }
      },
      reviewRequest: {
        actions: {
          back: 'Quay lại',
          submit: 'Gửi yêu cầu'
        },
        breadcrumbs: {
          createRequest: 'Tạo yêu cầu',
          dashboard: 'Bảng điều khiển',
          newSoftware: 'Phần mềm mới',
          review: 'Xem lại',
          temporaryRenewal: 'Gia hạn tạm thời',
          returnLicense: 'Trả lại bản quyền'
        },
        types: {
          newSoftware: 'Cấp quyền phần mềm mới',
          temporaryRenewal: 'Gia hạn tạm thời',
          returnLicense: 'Trả lại bản quyền'
        },
        details: {
          alertDescription: 'Bạn sẽ không thể chỉnh sửa yêu cầu này sau khi đã gửi.',
          alertTitle: 'Vui lòng đảm bảo mọi thông tin đều chính xác.',
          businessReason: 'Lý do nghiệp vụ',
          businessReasonValue: 'Cần Figma Professional phục vụ công việc thiết kế UI/UX trong Dự án Alpha.',
          costCenter: 'Trung tâm chi phí',
          costCenterValue: 'CC-001 - Phát triển sản phẩm',
          project: 'Dự án',
          projectValue: 'Dự án Alpha',
          requiredFrom: 'Cần từ ngày',
          requiredFromValue: '01/06/2026',
          requiredUntil: 'Cần đến ngày',
          requiredUntilValue: '31/12/2026 (214 ngày)',
          title: 'Chi tiết yêu cầu',
          assignedDate: 'Ngày cấp',
          assignedDateValue: '15/01/2026',
          expirationDate: 'Ngày hết hạn',
          expirationDateValue: '31/12/2026',
          currentExpiration: 'Ngày hết hạn hiện tại',
          currentExpirationValue: '30/09/2026',
          newExpiration: 'Ngày hết hạn mới',
          newExpirationValue: '31/12/2026 (92 ngày)',
          additionalNotes: 'Ghi chú bổ sung',
          temporaryRenewalReasonValue: 'Dự án được gia hạn. Cần thêm thời gian hoàn thành thiết kế cho Dự án Alpha.',
          temporaryRenewalNotesValue:
            'Chúng tôi đang bước vào giai đoạn thiết kế cuối cùng và cần tiếp tục dùng Figma để phối hợp và bàn giao.',
          returnLicenseReasonValue: 'Dự án Alpha đã hoàn thành. Chúng tôi không còn cần Figma cho giai đoạn hiện tại.',
          returnLicenseNotesValue:
            'Dự án Alpha đã hoàn thành. Chúng tôi không còn cần Figma cho giai đoạn hiện tại. Cảm ơn bạn!'
        },
        flow: {
          notice: 'Bạn sẽ nhận được thông báo ở từng bước trong quy trình phê duyệt và khi yêu cầu hoàn tất.',
          step1Status: 'Hoàn thành',
          step1Sub: 'Gửi yêu cầu',
          step1Title: 'Bạn (Người yêu cầu)',
          step2Status: 'Đang chờ',
          step2Sub: 'Xem xét và phê duyệt',
          step2Title: 'Quản lý',
          step3Status: 'Không yêu cầu',
          step3Sub: 'Đánh giá ngân sách',
          step3Title: 'Tài chính (nếu cần)',
          step4Status: 'Tiếp theo',
          step4Sub: 'Cấp phát và gán bản quyền',
          step4Title: 'Quản trị IT',
          title: 'Quy trình phê duyệt'
        },
        header: {
          subtitle: 'Vui lòng kiểm tra lại toàn bộ thông tin trước khi gửi yêu cầu.',
          title: 'Xem lại yêu cầu của bạn'
        },
        meta: {
          description: 'Vui lòng kiểm tra lại toàn bộ thông tin trước khi gửi yêu cầu phần mềm.',
          title: 'Xem lại yêu cầu | SaaS-Sentry'
        },
        stepper: {
          step1: 'Phần mềm',
          step2: 'Chi tiết',
          step3: 'Xem lại',
          step4: 'Đã gửi'
        },
        summary: {
          department: 'Phòng ban',
          departmentValue: 'Thiết kế sản phẩm',
          email: 'Email',
          emailValue: 'an.nguyen@company.com',
          plan: 'Gói dịch vụ',
          planValue: 'Professional',
          requestDate: 'Ngày yêu cầu',
          requestDateValue: '18/05/2026',
          requestType: 'Loại yêu cầu',
          requestTypeValue: 'Cấp quyền phần mềm mới',
          requestedBy: 'Người yêu cầu',
          requestedByValue: 'Nguyễn Minh An',
          software: 'Phần mềm',
          softwareValue: 'Figma',
          title: 'Tóm tắt yêu cầu',
          vendor: 'Nhà cung cấp',
          vendorValue: 'Figma, Inc.'
        },
        whatNext: {
          item1: 'Yêu cầu của bạn sẽ được chuyển đến Quản lý trực tiếp để xem xét.',
          item2: 'Bạn có thể theo dõi tiến độ trong mục Yêu cầu của tôi.',
          item3: 'Bạn sẽ được thông báo ngay khi yêu cầu được duyệt hoặc khi cần thêm thông tin.',
          title: 'Điều gì xảy ra tiếp theo?'
        }
      },
      submissionSuccess: {
        actions: {
          backDashboard: 'Về bảng điều khiển',
          viewDetails: 'Xem chi tiết yêu cầu'
        },
        breadcrumbs: {
          createRequest: 'Tạo yêu cầu',
          dashboard: 'Bảng điều khiển',
          newSoftware: 'Phần mềm mới',
          returnLicense: 'Trả lại bản quyền',
          submissionSuccess: 'Gửi thành công',
          temporaryRenewal: 'Gia hạn tạm thời'
        },
        hero: {
          requestIdLabel: 'Mã yêu cầu',
          requestIdValue: 'REQ-1027',
          submittedAt: 'Đã gửi vào 18/05/2026 lúc 10:30',
          subtitle:
            'Yêu cầu của bạn đã được gửi và đang được xem xét. Bạn sẽ nhận được thông báo khi có tiến trình mới.',
          title: 'Gửi yêu cầu thành công!'
        },
        meta: {
          description: 'Yêu cầu của bạn đã được gửi thành công.',
          title: 'Gửi yêu cầu thành công | SaaS-Sentry'
        },
        summary: {
          costCenterLabel: 'Trung tâm chi phí',
          defaultCostCenter: 'CC-001 – Phát triển sản phẩm',
          defaultProject: 'Dự án Alpha',
          defaultRequestedBy: 'Nguyễn Minh An',
          periodDays: '({{count}} ngày)',
          planName: 'Gói Professional',
          projectLabel: 'Dự án',
          requestedByLabel: 'Người yêu cầu',
          requestedPeriodLabel: 'Thời gian yêu cầu',
          requestTypeLabel: 'Loại yêu cầu',
          softwareLogoAlt: 'Logo Figma',
          softwareName: 'Figma',
          title: 'Tóm tắt yêu cầu'
        },
        timeline: {
          alertBanner: 'Yêu cầu của bạn hiện đang trong quy trình phê duyệt.',
          bottomNotice: 'Bạn sẽ nhận được thông báo ở từng bước trong quy trình phê duyệt.',
          currentStep: 'Bước hiện tại',
          step1Date: '18/05/2026 lúc 10:30',
          step1Title: 'Yêu cầu đã gửi',
          step2Desc: 'Quản lý trực tiếp của bạn sẽ xem xét và phê duyệt yêu cầu.',
          step2Status: 'Đang chờ',
          step2Title: 'Quản lý xem xét',
          step3Badge: 'Nếu cần',
          step3Title: 'Tài chính xem xét',
          step4Badge: 'Sắp tới',
          step4Title: 'IT cấp phát bản quyền',
          step5Badge: 'Sắp tới',
          step5Title: 'Hoàn thành',
          title: 'Điều gì xảy ra tiếp theo?'
        }
      },
      notFound: {
        action: 'Về trang chính',
        description: 'Đường dẫn này không tồn tại hoặc đã được di chuyển.',
        documentTitle: 'Không tìm thấy | SaaS-Sentry',
        eyebrow: '404',
        title: 'Không tìm thấy trang'
      }
    }
  }
} as const

export type SupportedLanguage = keyof typeof resources
