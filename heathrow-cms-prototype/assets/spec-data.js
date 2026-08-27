// Auto-generated from the CMS & Assessment System Screen & Component Specification (v01, 27 Aug 2026).
// Parsed from source docx — persona, screen, and component data below mirrors Section 7 verbatim.
window.SPEC_DATA = {
  "meta": {
    "title": "CMS & Assessment System",
    "subtitle": "Screen & Component Specification",
    "strapline": "A persona-based inventory of screens and components, decomposed and reconstituted from the Epic User Stories backlog to support Publicis Sapient's UI design work.",
    "project": "Project 679806 \u2014 Heathrow People Transformation Programme"
  },
  "personaModel": [
    {
      "name": "Colleague",
      "description": "Every employee in their capacity as the subject of their own competence \u2014 Security Officer, engineering technician, Airside operative. Includes \"Employee\" and edge-case \"End User\" tags."
    },
    {
      "name": "Manager / Supervisor",
      "description": "Line managers across all three divisions, including Security/Engineering Manager and Training Manager tags. Confirmed on 27 Aug to need two distinct views: personal compliance (as a Colleague) and team action."
    },
    {
      "name": "Trainer / Assessor",
      "description": "Combined per amendment A61: one role in Security, configurable as separate roles for Engineering/Airside. Delivers training and/or conducts assessments."
    },
    {
      "name": "Assessment Administrator",
      "description": "The back office of the Assessment System \u2014 content, scheduling, quality assurance, compliance reporting. Currently a governance gap: HAL\u2019s own scheme documentation defines this as a distinct actor; PS\u2019s actor model does not yet represent it separately from Trainer/Assessor (see live Use Case Catalogue review)."
    },
    {
      "name": "Competency Administrator",
      "description": "Builds and governs the competency scheme itself: frameworks, levels, requirements, validity rules, versioning."
    },
    {
      "name": "System Administrator",
      "description": "Merges Global/System/Security Administrator tags. Platform-level configuration: users, roles, audiences, integrations, system health."
    },
    {
      "name": "Leadership & Workforce Planning",
      "description": "Executive and workforce-forecasting consumers of aggregated compliance and progression data."
    }
  ],
  "journeyStages": [
    {
      "name": "Initial Training",
      "description": "Induction, initial course attendance, pre-testing, first formal assessment. The system\u2019s job is largely to schedule, deliver and record."
    },
    {
      "name": "On-the-Job",
      "description": "Provisional/mentored period: structured observations, supervised activity, sign-off toward full authorisation."
    },
    {
      "name": "Maintain Competence (BAU)",
      "description": "Stage three \u2014 the period once authorised, discussed at length on 27 Aug. Digitises the ongoing supervisory activity (briefings, one-to-ones, toolbox talks) that currently happens manually and undocumented."
    },
    {
      "name": "Recurrent / Assessment",
      "description": "Time-windowed re-assessment, TIP/TIR evaluation, recurrent training \u2014 modelled as a stage of time-windowed requirements rather than a separate object."
    },
    {
      "name": "Remediation / Referral",
      "description": "Triggered by a failed or borderline outcome: referral back to training, additional supervision, retake coordination."
    },
    {
      "name": "Exception States (cross-cutting)",
      "description": "Suspension, restriction, exemption, override, pause, absence/return-to-duty \u2014 applicable at any stage and requiring an explicit, audited transaction rather than an implicit status change."
    }
  ],
  "systemWide": [
    {
      "storyId": "SYS-1",
      "component": "System Login",
      "what": "Access a secure login platform with authentication",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-4",
      "component": "SSO Authentication",
      "what": "Log in using my Heathrow Microsoft credentials via Single Sign-On",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-5",
      "component": "Standard Authentication",
      "what": "Log in using a username and password",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-2",
      "component": "Global Dashboard",
      "what": "See high level dashboard information that is relevant to the whole ecosystem",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-3",
      "component": "Global Menu Structure",
      "what": "See all menu items available across the whole ecosystem in a consistent parent-child accordion structure",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-6",
      "component": "User Menu",
      "what": "Navigate easily to key areas of the platform via a consistent menu",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-7",
      "component": "Notification Indicator",
      "what": "See a notifications bell with a count of unread notifications",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-8",
      "component": "Notification Settings",
      "what": "Control what notifications I receive and how I receive them",
      "moscow": "Should \u00b7 Now"
    },
    {
      "storyId": "SYS-9",
      "component": "Profile View & Edit",
      "what": "View and update my profile information",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-44",
      "component": "Global Search",
      "what": "Search for content across the entire platform",
      "moscow": "Should \u00b7 Now"
    },
    {
      "storyId": "SYS-74",
      "component": "Deep Linking",
      "what": "Seamlessly navigate from Block 1 to Oracle LMS, CMS, Booking, or Assessment systems without re-authenticating",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-75",
      "component": "Unified Session",
      "what": "Have my session managed centrally across all systems",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-77",
      "component": "Graceful Degradation",
      "what": "Continue using Block 1 even when integrated systems are temporarily unavailable",
      "moscow": "Should \u00b7 Now"
    },
    {
      "storyId": "SYS-92",
      "component": "Responsive Layout",
      "what": "Access the system on any device (desktop, tablet, mobile)",
      "moscow": "Must \u00b7 Now"
    },
    {
      "storyId": "SYS-93",
      "component": "WCAG Compliance",
      "what": "Use the system inside set accessibility standards",
      "moscow": "Must \u00b7 Now"
    }
  ],
  "designPrinciples": [
    {
      "name": "Utility over data-dump",
      "description": "The failure mode identified in the session: screens built around \"18 competencies, colour-coded\" lose the actual message. Every screen\u2019s primary content should be \"what do I need to do, and by when\" \u2014 not a status grid."
    },
    {
      "name": "Quick actions, everywhere",
      "description": "A manager should be able to launch an observation, log a briefing, or record a one-to-one in one or two clicks from wherever they are \u2014 not by navigating into a competency first. This is a cross-cutting interaction pattern, not a single screen."
    },
    {
      "name": "Activity satisfies Requirement satisfies Competency",
      "description": "Don\u2019t surface the requirement in isolation; surface the activity the user is on the hook to complete. A competency can have 20 requirements, but a user should only ever see the handful of activities currently due \u2014 a task list, not a project plan."
    },
    {
      "name": "Two dashboards for anyone who is both a Colleague and a Manager",
      "description": "A manager\u2019s own compliance (no agency \u2014 recurrent training is rostered, not chosen) must be visually and functionally separated from their team view (full agency \u2014 they can and should act on what they see)."
    },
    {
      "name": "Widgetised and configurable, not hard-coded",
      "description": "Dashboard content should be built as a widget library that can be toggled per role/audience and saved as a reusable template, so that a wrong first guess at \"what a Security Officer needs to see\" is a configuration change, not a five-day re-build."
    },
    {
      "name": "Threshold and colour-coded, not raw percentages",
      "description": "A bare \"84%\" tells a colleague nothing. Figures need a threshold and colour-coding so the number carries a clear above/at/below-standard signal."
    },
    {
      "name": "Positive framing for colleague-facing performance data",
      "description": "Gamification for colleagues should motivate (quartile/streak framing) rather than shame (no \"bottom of the table\" framing). The same competitive mechanic for managers is framed around team coaching activity, not personal ranking."
    },
    {
      "name": "Progressive disclosure",
      "description": "The detailed competency-level view (all 18 competencies, expiry dates) is legitimate but secondary \u2014 available a click or two down, not the first thing a colleague or manager sees."
    }
  ],
  "personas": [
    {
      "name": "Colleague",
      "intro": "The largest single persona in the backlog (115 stories in this dataset). Covers every employee across Security, Engineering and Airside in their capacity as the subject of their own competence \u2014 whether that's a Security Officer, an engineering technician, or an Airside operative. A Manager or Assessor is also a Colleague in this sense: see the \"two dashboards\" note under Manager / Supervisor.",
      "screens": [
        {
          "name": "My Dashboard (Home)",
          "stage": "Cross-stage",
          "intro": "The landing screen on login. Aggregates status across both competency and assessment systems into a single, action-oriented view rather than a wall of competencies.",
          "components": [
            {
              "storyId": "CMS-45",
              "component": "Personal Competency Dashboard",
              "what": "See a personalised competency dashboard when I log in showing my most important competency information at a glance",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-4",
              "component": "Personal Assessment Dashboard",
              "what": "See a personalised assessment dashboard when I log in showing my assessment status and upcoming tests at a glance",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-58",
              "component": "Renewal Tracking",
              "what": "See which competencies need renewal on my homepage",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-53",
              "component": "Event Calendar",
              "what": "See my upcoming schedule and deadlines on my homepage",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-42",
              "component": "Gap Recommendations",
              "what": "See personalsed competeny progress based on my current competency gaps and current role requirements.",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-104",
              "component": "Confidence Level Assessment",
              "what": "Self-assess my confidence level for each competency alongside formal competency assessments",
              "moscow": "Should \u00b7 Now"
            }
          ]
        },
        {
          "name": "My Tasks & Actions",
          "stage": "Cross-stage",
          "intro": "Consolidated list of everything the colleague needs to do, across both systems, surfaced by due date rather than by which competency it sits under.",
          "components": [
            {
              "storyId": "CMS-46",
              "component": "Personal Competency Task List",
              "what": "View all competency-related tasks and actions assigned to me in one consolidated list",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-8",
              "component": "Personal Assessment Task List",
              "what": "View all assessment-related tasks and actions assigned to me in one consolidated list",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-9",
              "component": "Assessment Task Reminders",
              "what": "Receive automatic reminders before assessment deadlines and for required retakes",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-30",
              "component": "Competency Task Reminders",
              "what": "Receive automatic reminders before competency assessment deadlines and expiry dates",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "My Calendar",
          "stage": "Cross-stage",
          "intro": "Upcoming assessments, observations, TNCA reviews and deadlines in calendar form.",
          "components": [
            {
              "storyId": "CMS-44",
              "component": "Personal Competency Calendar",
              "what": "View my upcoming competency assessments, observations, and TNCA reviews in a calendar format",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-10",
              "component": "Personal Assessment Calendar",
              "what": "View my upcoming scheduled assessments, deadlines, and available test windows in a calendar format",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-11",
              "component": "Assessment Schedule Conflicts Alert",
              "what": "Be automatically alerted when there are scheduling conflicts between my operational roster and proctored assessments",
              "moscow": "Should \u00b7 Now"
            }
          ]
        },
        {
          "name": "My Competency Record",
          "stage": "On-the-Job / Maintain Competence",
          "intro": "The drill-down from a dashboard item into the underlying competency: role requirements, progression pathways, gaps, exemption requests, TNCA progression, and (where enabled) the wider hierarchy.",
          "components": [
            {
              "storyId": "CMS-48",
              "component": "Role Requirements",
              "what": "View the competency expectations and requirements for my current role and level",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-47",
              "component": "Progression Pathways",
              "what": "See the competency requirements for advancing to the next level or different roles",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-38",
              "component": "Competency Search",
              "what": "Search for competencies, user competency records, and competency frameworks using keywords",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-39",
              "component": "Competency Search Filters",
              "what": "Refine competency search results using filters such as status, type, framework level, and department",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-116",
              "component": "Self-Registration on Aspirational Competency Tracks",
              "what": "Register my interest in an aspirational competency track (e.g., a Core technician expressing interest in Tech Plus)",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-106",
              "component": "Progression Appetite Survey",
              "what": "Indicate my interest in career progression and target roles during regular competency reviews",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-35",
              "component": "Assessment Participation",
              "what": "Participate in competency assessments and view my results within the context of my relevant competencies",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-37",
              "component": "Competency Exemptions",
              "what": "Request exemptions from standard competency requirements when special circumstances apply",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-51",
              "component": "TNCA Progression Management",
              "what": "View and progress through TNCA pay progression routes with clear career pathways",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-98",
              "component": "Pre-Testing",
              "what": "Take a competency assessment before attending training to demonstrate existing knowledge",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-99",
              "component": "Recognition of Prior Learning",
              "what": "Upload evidence of external qualifications and prior competencies to have them recognised in the CMS",
              "moscow": "Should \u00b7 Next"
            }
          ]
        },
        {
          "name": "Evidence, Certificates & Skills Passport",
          "stage": "Maintain Competence",
          "intro": "Where the colleague manages proof of competence: downloadable certificates, external qualification evidence, and (Later) a portable skills passport.",
          "components": [
            {
              "storyId": "CMS-36",
              "component": "Competency Certificate Download",
              "what": "Download digital copies of my competency certificates and evidence of competence - where permissable (e.g. ASM)",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-41",
              "component": "Evidence Management",
              "what": "Add and manage external qualifications and certifications that contribute to my competency profile",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-49",
              "component": "Skills Passport",
              "what": "Maintain a digital comptency passport that provides rapid verification of my comptencies",
              "moscow": "Could \u00b7 Later"
            },
            {
              "storyId": "CMS-64",
              "component": "Equipment & Location Management",
              "what": "Manage my equipment assignments and work location details in my profile",
              "moscow": "Won't \u00b7 N/A"
            },
            {
              "storyId": "AS-20",
              "component": "Personal Assessment Data Export",
              "what": "Export my assessment history, results, and certificates",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-21",
              "component": "Assessment Certificate Download",
              "what": "Download digital copies of my assessment certificates and test results",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-30",
              "component": "Assessment History and Transcript",
              "what": "Access complete history of all assessments taken with dates, scores, and certification status for personal records and external verification",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "Taking an Assessment (task flow)",
          "stage": "Initial Training / Recurrent",
          "intro": "Not a persistent screen but a guided flow, triggered from a task or calendar item: preparation, the assessment itself, and what happens afterwards. This is the flow behind Rob's \"completing an online test\" example.",
          "components": [
            {
              "storyId": "AS-28",
              "component": "Assessment Preparation",
              "what": "Access study materials, practice questions, and preparation guidance before taking mandatory assessments",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-35",
              "component": "Pre-Test Knowledge Check",
              "what": "Complete optional pre-test knowledge checks to demonstrate existing competency and potentially skip formal training before assessment",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-38",
              "component": "Technical Readiness Check",
              "what": "Complete a technical readiness check before my scheduled assessment to ensure my device, browser, and connectivity meet requirements",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-39",
              "component": "Assessment Instructions and Expectations",
              "what": "Access clear, comprehensive instructions about what to expect during each assessment type before I begin",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-40",
              "component": "Readiness Self-Assessment",
              "what": "Complete a self-assessment to gauge my readiness for the actual assessment based on my study progress and practice performance",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-36",
              "component": "Practice Assessment Access",
              "what": "Access unlimited practice assessments that mirror real test format without affecting my competency status",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-37",
              "component": "Study Material Recommendations",
              "what": "Receive personalised study material recommendations based on the specific assessment I need to take and my knowledge gaps",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-41",
              "component": "Peer Support and Study Groups",
              "what": "Connect with colleagues preparing for the same assessment to form study groups and share preparation tips",
              "moscow": "Could \u00b7 Next"
            },
            {
              "storyId": "AS-31",
              "component": "Proctored Assessment Experience",
              "what": "Complete invigilated assessments with clear instructions and access via trainer-provided session codes in controlled classroom environments",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-26",
              "component": "Online Assessment Completion",
              "what": "Complete mandatory assessments with clear navigation, progress tracking, and appropriate feedback on submission based on exam configuration",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-27",
              "component": "Assessment Results View",
              "what": "View detailed results for completed assessments including scores, pass/fail status, and performance breakdown",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-32",
              "component": "Assessment Feedback Request",
              "what": "Request detailed feedback from assessors on failed assessments to understand specific gaps and improve future performance",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-33",
              "component": "Assessment Appeal",
              "what": "Formally appeal assessment results that I believe were graded incorrectly or unfairly, with a structured review process",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-34",
              "component": "Assessment Accommodations Request",
              "what": "Request reasonable accommodations for assessments due to disabilities, medical conditions, or other needs",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-29",
              "component": "Assessment Retake Request",
              "what": "Request and book retake assessments after failing, with clear understanding of retake policies, cooling-off periods, and available support",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-12",
              "component": "Assessment Search",
              "what": "Search for assessments, test results, and certificates using keywords",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-13",
              "component": "Assessment Search Filters",
              "what": "Refine assessment search results using filters such as status, type, competency area, and deadline",
              "moscow": "Should \u00b7 Now"
            }
          ]
        },
        {
          "name": "Notifications & Preferences",
          "stage": "Cross-stage",
          "intro": "The notification bell's settings surface, plus channel preferences for competency and assessment alerts.",
          "components": [
            {
              "storyId": "SYS-7",
              "component": "Notification Indicator",
              "what": "See a notifications bell with a count of unread notifications",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-8",
              "component": "Notification Settings",
              "what": "Control what notifications I receive and how I receive them",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-29",
              "component": "Competency Notification Preferences",
              "what": "Configure which competency notifications I receive and how I receive them (email, in-app, push)",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-31",
              "component": "Email Notifications",
              "what": "Receive email notifications for critical competency events, assessment deadlines, and expiry warnings",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-32",
              "component": "In-App Notifications",
              "what": "Receive notifications within the CMS about important competency updates, assessment deadlines, and expiry warnings",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-33",
              "component": "Push Notifications (Mobile)",
              "what": "Receive push notifications on my mobile device for time-sensitive competency alerts",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-5",
              "component": "In-App Notifications",
              "what": "Receive notifications within the assessment system about upcoming tests, results, and retake requirements",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-6",
              "component": "Email Notifications",
              "what": "Receive email notifications for assessment availability, deadlines, results, and retake requirements",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-7",
              "component": "Push Notifications (Mobile)",
              "what": "Receive push notifications on my mobile device for time-sensitive assessment reminders and results",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-14",
              "component": "Assessment Notification Preferences",
              "what": "Configure which assessment notifications I receive and how I receive them (email, in-app, push)",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-15",
              "component": "Assessment Display Preferences",
              "what": "customise how assessment information is displayed (dashboard layout, default views, items per page)",
              "moscow": "Could \u00b7 Next"
            },
            {
              "storyId": "CMS-121",
              "component": "Confidence Self-Assessment",
              "what": "Complete a brief confidence self-assessment after a Toolbox Talk or bulletin linked to a duty-critical competency, recording whether I feel confident to perform the relevant duty",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-34",
              "component": "Bulletin Distribution",
              "what": "Receive and acknowledge critical safety bulletins, operational instructions and notices via the CMS",
              "moscow": "Should \u00b7 Next"
            }
          ]
        },
        {
          "name": "Help & Support",
          "stage": "Cross-stage",
          "intro": "Contextual help and a support-ticket route, available from both systems.",
          "components": [
            {
              "storyId": "CMS-40",
              "component": "Contextual Help",
              "what": "Access help information relevant to the current competency management page or task I'm working on",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-50",
              "component": "Support Ticket System",
              "what": "Submit support requests directly from the CMS when I encounter issues or have questions about competency management",
              "moscow": "Should \u00b7 Later"
            },
            {
              "storyId": "AS-22",
              "component": "Contextual Help",
              "what": "Access help information relevant to the current assessment page or task I'm working on",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-23",
              "component": "Support Ticket System",
              "what": "Submit support requests directly from the assessment system when I encounter technical issues or have questions",
              "moscow": "Should \u00b7 Now"
            }
          ]
        },
        {
          "name": "Accessibility, Mobile & Offline",
          "stage": "Cross-stage",
          "intro": "Cross-cutting device and access requirements rather than a single screen: applies to every screen above.",
          "components": [
            {
              "storyId": "SYS-92",
              "component": "Responsive Layout",
              "what": "Access the system on any device (desktop, tablet, mobile)",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-93",
              "component": "WCAG Compliance",
              "what": "Use the system inside set accessibility standards",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-103",
              "component": "Mobile Experience",
              "what": "Access Block 1 via native mobile app (iOS and Android) or progress web app (BYOD)",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "SYS-104",
              "component": "Mobile-First Features",
              "what": "Access features designed specifically for mobile context",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "SYS-105",
              "component": "Download Content",
              "what": "Download content for offline access",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-54",
              "component": "Accessibility Settings",
              "what": "Configure accessibility features to meet my specific needs when using the CMS",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-57",
              "component": "Mobile Access",
              "what": "Access all key CMS functions via my mobile device while working on the operational floor",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-59",
              "component": "Offline Mode",
              "what": "Access critical competency information and complete observation recordings when offline or in areas with poor connectivity",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-60",
              "component": "Responsive Web Design",
              "what": "Access the CMS on any device (desktop, tablet, mobile phone) with an interface optimised for that device",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-63",
              "component": "WCAG 2.1 Compliance",
              "what": "Use the CMS effectively regardless of any disabilities I may have",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-65",
              "component": "Personal Data Management",
              "what": "Manage my personal information and privacy settings related to competency data",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-17",
              "component": "Responsive Web Design",
              "what": "Access the assessment system on any device (desktop, tablet, mobile phone) with an interface optimised for that device",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-18",
              "component": "Mobile App (Optional)",
              "what": "Have a dedicated mobile app for quick access to assessments and results",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-19",
              "component": "Offline Mode",
              "what": "Download assessments and complete them when offline or in areas with poor connectivity",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-24",
              "component": "WCAG 2.1 Compliance",
              "what": "Use the assessment system effectively regardless of any disabilities I may have",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-25",
              "component": "Accessibility Settings",
              "what": "Configure accessibility features to meet my specific needs when taking assessments",
              "moscow": "Should \u00b7 Now"
            }
          ]
        }
      ]
    },
    {
      "name": "Manager / Supervisor",
      "intro": "40 stories directly tagged, plus everything under Colleague for the manager's own compliance. Includes Security Manager, Engineering Manager, Workforce Planning-adjacent reporting roles, and the generic \"Manager\" tag used throughout. The 27 Aug session confirmed this persona needs two functionally separate views \u2014 personal compliance and team action \u2014 not one blended screen.",
      "screens": [
        {
          "name": "My Compliance (personal view)",
          "stage": "Cross-stage",
          "intro": "Every Manager is also a Colleague. This is not a separate screen so much as a confirmed design decision from the 27 Aug session: a manager's own competency status uses the Colleague dashboard and record screens above, kept visually and functionally distinct from the team view below \u2014 because a manager has no more agency over their own recurrent training deadline than any other colleague does.",
          "components": []
        },
        {
          "name": "My Team Dashboard",
          "stage": "Maintain Competence (BAU)",
          "intro": "The action-oriented team view: risk flags, compliance status and assessment tracking, not a flat grid of competencies per person. Composite scoring and heatmap format per CMS-68.",
          "components": [
            {
              "storyId": "SYS-62",
              "component": "Team Dashboard",
              "what": "View an overview of my team's learning and competency progress",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-63",
              "component": "Risk Management",
              "what": "See alerts and flags for key risks within my team",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-64",
              "component": "Training Tracking",
              "what": "See training completion status for each team member",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "SYS-65",
              "component": "Event Tracking",
              "what": "See upcoming training, events, deadlines my team is registered for",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "SYS-66",
              "component": "Competency Tracking",
              "what": "See competency status across my team",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-67",
              "component": "Assessment Tracking",
              "what": "See assessment results and pass rates for my team",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-68",
              "component": "Compliance Tracking",
              "what": "See all overdue training, competencies, and assessments for my team",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-69",
              "component": "Visual Analytics",
              "what": "See visual representations of my team's learning progress",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-68",
              "component": "Team Readiness Overview",
              "what": "View team competency readiness with composite scoring and risk indicators inc. a heatmap format",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-101",
              "component": "Covert Assessment Analytics",
              "what": "analyse patterns in covert assessment results to identify trends, high-risk individuals, and training effectiveness",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-105",
              "component": "Competency-Confidence Risk Dashboard",
              "what": "View a dashboard showing employees in the high-risk \"not competent but confident\" quadrant",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-42",
              "component": "Team Assessment Dashboard",
              "what": "View real-time assessment compliance status for my entire team with traffic light indicators and drill-down capability",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-48",
              "component": "Department-Level Compliance Heatmap",
              "what": "View a visual heatmap showing assessment compliance status across my department with drill-down capability",
              "moscow": "Should \u00b7 Now"
            }
          ]
        },
        {
          "name": "Quick Actions",
          "stage": "Cross-stage",
          "intro": "The single most important design principle from the 27 Aug session: a manager should be able to launch an observation, log a briefing, or record a one-to-one in one or two clicks, from wherever they are \u2014 not by navigating into a competency first. No dedicated backlog stories currently model this as a standalone component; it is realised through the observation/assessment-delivery stories below (see Trainer/Assessor) plus the widget/quick-action framework under System-Wide Components. Flagging this as a design principle the inventory must carry even though it isn't its own story.",
          "components": []
        },
        {
          "name": "Individual Team Member Record",
          "stage": "Cross-stage",
          "intro": "The drill-in from the team dashboard into one person: development plans, manual track assignment, absence/return-to-duty, TNCA observations, contextual assessment detail, and the restriction framework.",
          "components": [
            {
              "storyId": "CMS-67",
              "component": "Individual Competency Development Plans",
              "what": "Create and manage individual development plans for team members",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-115",
              "component": "Manual Competency Track Assignment",
              "what": "Manually assign a competency track (e.g., Core, Tech Plus, Specialist, Expert, Team Leader) to an individual or group",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-111",
              "component": "Suspension, Restriction, Exemption & Override Framework",
              "what": "Manipulate an individual's competency status through defined transaction types (restriction, suspension, exemption, override, pause) with full audit trail and role-based permissions",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-117",
              "component": "Absence / Return-to-Duty Transaction",
              "what": "Record an individual's absence and manage their return-to-duty requirements based on absence duration",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-70",
              "component": "Workforce Management",
              "what": "Record and manage role incapacities and work restrictions for employees",
              "moscow": "Won't \u00b7 N/A"
            },
            {
              "storyId": "CMS-66",
              "component": "Contextual Assessment Details",
              "what": "Record contextual details during assessments including environmental and situational factors",
              "moscow": "Could \u00b7 Later"
            },
            {
              "storyId": "CMS-69",
              "component": "TNCA Management",
              "what": "Manage Training Needs Competency Analysis (TNCAs) including competency observations for engineering roles",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-114",
              "component": "Competency Hierarchy Browser / Catalogue",
              "what": "Browse the entire competency framework through a navigable catalogue view (by division, role, competency, requirement)",
              "moscow": "Should \u00b7 Now"
            }
          ]
        },
        {
          "name": "Team Assessment Management",
          "stage": "Maintain Competence / Recurrent",
          "intro": "Calendar, outcome notifications, accommodation approval, delegation and performance analytics for the manager's team's assessments.",
          "components": [
            {
              "storyId": "AS-43",
              "component": "Team Assessment Calendar",
              "what": "View all upcoming and overdue assessments for my team in a calendar format to plan staffing and training activities",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-44",
              "component": "Assessment Outcome Notifications",
              "what": "Receive immediate notifications when team members complete assessments, especially for failures or critical certifications",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-46",
              "component": "Assessment Accommodation Approval",
              "what": "Review and approve assessment accommodation requests from team members requiring additional time or support",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-47",
              "component": "Team Assessment Delegation",
              "what": "Delegate assessment oversight responsibilities to team leaders or deputies when unavailable",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-45",
              "component": "Team Assessment Analytics",
              "what": "Access detailed analytics on team assessment performance including pass rates, trends, and comparisons to identify training needs",
              "moscow": "Should \u00b7 Next"
            }
          ]
        },
        {
          "name": "Communication & Bulletins",
          "stage": "Cross-stage",
          "intro": "Distributing and tracking acknowledgement of bulletins and Toolbox Talks, and recording TBT attendance against competence maintenance.",
          "components": [
            {
              "storyId": "CMS-108",
              "component": "Bulletin Management",
              "what": "Create, distribute and track acknowledgment of bulletins and briefings to my team or specific user groups",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-110",
              "component": "Tool Box Talk Recording",
              "what": "Record attendance and topics for Tool Box Talk (TBT) sessions and link them to competency maintenance",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "Manager Reporting & Analytics",
          "stage": "Maintain Competence (BAU)",
          "intro": "Gap analysis, confidence-competence risk analysis, assessor performance/calibration, departmental risk registers and end-of-course reporting \u2014 the second-line-of-supervision visibility discussed on 27 Aug.",
          "components": [
            {
              "storyId": "CMS-71",
              "component": "Gap Analysis",
              "what": "Conduct gap analysis with predictive modeling and scenario planning",
              "moscow": "Could \u00b7 Next"
            },
            {
              "storyId": "CMS-72",
              "component": "Advanced Data Visualisation",
              "what": "Access data visualisation tools that present competency insights in clear, actionable formats",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-73",
              "component": "Confidence Analysis",
              "what": "Identify individuals who are \"confidently incorrect\" through competence-confidence correlation analysis",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-74",
              "component": "Self-Service Analytics",
              "what": "Generate custom reports and analytics without relying on central IT teams",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-97",
              "component": "Work Order Competency Reporting",
              "what": "Generate reports showing competency compliance for completed work orders",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-102",
              "component": "Assessor Performance Analysis",
              "what": "analyse how individual assessors conduct assessments to identify those who are too strict, too lenient, or inconsistent",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-103",
              "component": "Assessor Calibration & Standardization",
              "what": "Facilitate assessor calibration sessions using system data to standardize assessment practices",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-122",
              "component": "End-of-Course Reporting, Notification & Dashboard",
              "what": "Receive a system-generated end-of-course report and routed notification, and view course outcomes on a team dashboard, instead of relying on a manually compiled and emailed report",
              "moscow": "Should \u00b7 Later"
            },
            {
              "storyId": "AS-49",
              "component": "Assessment Risk Register",
              "what": "Maintain a risk register of assessment-related compliance risks with severity ratings and mitigation actions",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-50",
              "component": "Senior Leadership Dashboard",
              "what": "Access executive-level assessment dashboard showing org-wide compliance, strategic capability gaps, and regulatory readiness",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-51",
              "component": "Assessment Cost Analysis",
              "what": "Analyse the full cost of assessment activities including time away from operations, retakes, and proctoring to optimise efficiency",
              "moscow": "Could \u00b7 Next"
            }
          ]
        },
        {
          "name": "Dashboard Configuration",
          "stage": "Cross-stage",
          "intro": "The widgetisation capability confirmed in the 27 Aug session: managers (and, per that session, PS) can select, arrange and save configurable dashboard widgets rather than commissioning bespoke layout changes.",
          "components": [
            {
              "storyId": "SYS-107",
              "component": "Dashboard Widget Customisation",
              "what": "Customise my dashboard by selecting, arranging, and saving configurable widgets from a widget library",
              "moscow": "Should \u00b7 Now"
            }
          ]
        }
      ]
    },
    {
      "name": "Trainer / Assessor",
      "intro": "Per the amendment ledger (A61), Trainer and Assessor are treated as one combined role in Security, with the pairing configurable so Engineering and Airside can opt in. 19 stories directly tagged; the persona also depends heavily on the Manager's \"Quick Actions\" pattern to actually get to an individual.",
      "screens": [
        {
          "name": "Assessor Home / Delivery Queue",
          "stage": "Cross-stage",
          "intro": "No dedicated dashboard or landing-page story currently exists for this persona, despite it owning 19 stories \u2014 confirmed as a live gap in Day 2 Session 3 (\"there's no trainer interface that gives me those names in front of me\"). Recommend this be raised as a candidate new story rather than assumed away.",
          "components": []
        },
        {
          "name": "Conduct an Observation",
          "stage": "On-the-Job",
          "intro": "Field, group (tabular) and covert observation delivery.",
          "components": [
            {
              "storyId": "AS-58",
              "component": "Field Observation",
              "what": "Conduct structured on-the-job observational assessments with standardized checklists and criteria",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-126",
              "component": "Group Observations",
              "what": "Conduct a single observation session against multiple individuals simultaneously using a tabular format",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-59",
              "component": "Practical Assessment Delivery and Scoring",
              "what": "Conduct practical assessments using digital checklists with real-time scoring and evidence capture on mobile devices",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-100",
              "component": "Covert Assessment Recording",
              "what": "Record results of covert competency assessments without the employee knowing in advance",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "Conduct an Exam / Invigilated Session",
          "stage": "Initial Training / Recurrent",
          "intro": "Session setup, access codes, progress monitoring and results release, plus offline/paper fallback. Note: AS-131 (Offline Exam / Paper-Based Fallback) carries a duplicate Backlog ID in the current PS backlog \u2014 flagged separately in the Traceability & Open Items appendix.",
          "components": [
            {
              "storyId": "AS-125",
              "component": "Trainer Exam Management \u2014 Invigilated Sessions",
              "what": "Create and manage invigilated exam sessions in real-time, including generating access codes, monitoring delegate progress, and controlling results release",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-131",
              "component": "Offline Exam / Paper-Based Fallback",
              "what": "Generate a printable version of an exam with a separate marking sheet, administer it on paper, and upload the results back into the system",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-52",
              "component": "Offline Assessment Capabilities",
              "what": "Conduct comprehensive assessments offline in areas with poor connectivity on mobile device",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "Conduct Alternative Assessment Types",
          "stage": "Initial Training / On-the-Job",
          "intro": "Professional discussion, portfolio/marked submission, video and case-study formats.",
          "components": [
            {
              "storyId": "AS-129",
              "component": "Professional Discussion Exam Type",
              "what": "Conduct professional discussion assessments where I verbally question an individual and record their responses with grading",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-130",
              "component": "Marked Submission / Portfolio Review Exam Type",
              "what": "Formally assess accumulated evidence submitted by a candidate (logbook, photos, switch schedules, etc.) against defined criteria",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-57",
              "component": "Video Assessment",
              "what": "Conduct video-based practical assessments with recording, review, and multi-assessor capabilities",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-60",
              "component": "Case Study Assessment Delivery",
              "what": "Present complex operational case studies to employees and evaluate their analysis, problem-solving, and decision-making",
              "moscow": "Could \u00b7 Later"
            }
          ]
        },
        {
          "name": "Post-Training Assessment & Retakes",
          "stage": "Initial Training",
          "intro": "Assessment immediately following a training session, results analysis, and retake coordination.",
          "components": [
            {
              "storyId": "AS-61",
              "component": "Conduct Post-Training Assessment",
              "what": "Conduct assessments immediately after training sessions to validate learning outcomes and certify completion",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-62",
              "component": "Assessment Results Analysis",
              "what": "Analyse assessment results across multiple training sessions to identify content areas needing improvement",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-63",
              "component": "Retake Coordination",
              "what": "Schedule and coordinate assessment retakes for attendees who failed initial post-training assessment",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "Assessment Evidence & Sign-off",
          "stage": "Cross-stage",
          "intro": "Photo evidence, e-signature, written feedback and free-text tagging \u2014 all Next/Later priority currently.",
          "components": [
            {
              "storyId": "AS-53",
              "component": "Photo Evidence Upload",
              "what": "Upload and manage photos as evidence for specific performance criteria during assessments",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-54",
              "component": "Electronic Signatures",
              "what": "Electronically sign assessments to acknowledge results, reviews, and feedback",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-55",
              "component": "Assessment Feedback & Summary",
              "what": "Write detailed assessment summaries and provide comprehensive written feedback to assessed individuals",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-56",
              "component": "Free Text Assessment Tagging",
              "what": "Tag free text assessment entries for audit trail creation and reporting",
              "moscow": "Could \u00b7 Later"
            }
          ]
        }
      ]
    },
    {
      "name": "Assessment Administrator",
      "intro": "58 stories in this dataset alone \u2014 the single largest concentration of back-office capability in the Assessment System, and (per the current Use Case Catalogue review) an actor HAL's own scheme documentation defines but PS's actor model does not currently represent as distinct from Trainer/Assessor. This gap needs resolving with Julie before screen design for this persona proceeds far, since several of these screens currently have no confirmed owner in PS's model.",
      "screens": [
        {
          "name": "Assessment Content & Question Bank",
          "stage": "Back office",
          "intro": "Authoring, review, bulk import/export, and cross-bank management of question content.",
          "components": [
            {
              "storyId": "AS-70",
              "component": "Question Bank Management",
              "what": "Maintain centralised question bank with metadata tagging, difficulty ratings, and usage tracking",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-76",
              "component": "Question Bank Creation and organisation",
              "what": "Create and organise question banks by competency area with appropriate difficulty levels and question types",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-80",
              "component": "Bulk Question Import from Excel",
              "what": "Import large sets of questions from Excel spreadsheets with validation and error checking",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-81",
              "component": "Question Authoring Workflow with SME Collaboration",
              "what": "Manage a structured authoring workflow where subject matter experts contribute questions with review and approval gates",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-82",
              "component": "Question Quality Standards and Templates",
              "what": "Define and enforce question quality standards with templates and automated quality checks",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-127",
              "component": "Question Import/Export",
              "what": "Import questions via a downloadable template and export existing questions to the same format",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-128",
              "component": "Question Move/Copy/Clone Between Pools and Banks",
              "what": "Move, copy, and clone questions between pools and banks, and perform the same actions at pool level between banks",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-83",
              "component": "Multi-Language Assessment Content Management",
              "what": "Manage assessment content in multiple languages with translation workflows and language-specific delivery",
              "moscow": "Won't \u00b7 Later"
            }
          ]
        },
        {
          "name": "Assessment Configuration & Blueprint",
          "stage": "Back office",
          "intro": "Building and configuring assessments themselves: scheduling rules, observation checklists, blueprint validation, and the full range of assessment types (oral, portfolio, simulation, blended, situational).",
          "components": [
            {
              "storyId": "AS-68",
              "component": "Custom Assessment Creation",
              "what": "Build custom assessments including observations, tests, and evidence collection forms",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-71",
              "component": "Assessment Scheduling Configuration",
              "what": "Configure assessment scheduling rules, booking windows, and capacity constraints",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-92",
              "component": "Observation Checklist Configuration",
              "what": "Create standardized observation checklists for practical skills assessment with clear performance criteria",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-101",
              "component": "Assessment Blueprint Validation",
              "what": "Validate that configured assessments properly cover required competency areas according to blueprint specifications",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-116",
              "component": "Oral Examination Configuration and Delivery",
              "what": "Configure and deliver oral examinations where assessors verbally question employees to evaluate knowledge and decision-making",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-117",
              "component": "Portfolio Assessment Configuration and Review",
              "what": "Configure portfolio-based assessments where employees compile evidence of competency over time for holistic evaluation",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-118",
              "component": "Simulation-Based Assessment Configuration",
              "what": "Configure high-fidelity simulation-based assessments using specialised simulators or virtual environments for realistic competency evaluation",
              "moscow": "Could \u00b7 Later"
            },
            {
              "storyId": "AS-119",
              "component": "Blended Assessment Orchestration",
              "what": "Configure blended assessments combining multiple assessment methods (written, practical, oral) into comprehensive certification",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-66",
              "component": "Situational Testing",
              "what": "Create scenario-based situational judgment assessments that measure decision-making under pressure",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-78",
              "component": "Scenario-Based Assessment Creation",
              "what": "Create scenario-based situational judgment tests that assess decision-making in realistic operational contexts",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-79",
              "component": "Performance Under Pressure Assessment",
              "what": "Include time pressure and distraction factors in assessments to simulate real operational conditions",
              "moscow": "Could \u00b7 Later"
            },
            {
              "storyId": "AS-64",
              "component": "Flexible Assessment Scales",
              "what": "Create flexible assessments and detailed criteria comments",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-69",
              "component": "Assessment Content Review",
              "what": "Review and update assessment content periodically to ensure alignment with current competency frameworks, regulations, and operational procedures",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "Item Analysis & Quality Assurance",
          "stage": "Back office",
          "intro": "Statistical quality control over question performance: difficulty, distractor and discrimination analysis, usage rotation, pilot testing and review cycles.",
          "components": [
            {
              "storyId": "AS-87",
              "component": "Question Difficulty Analysis",
              "what": "Analyse question difficulty through percentage correct statistics and flag questions that are too easy or too hard",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-88",
              "component": "Distractor Analysis",
              "what": "Analyse wrong answer selection patterns to identify ineffective distractors and improve question quality",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-89",
              "component": "Discrimination Index Analysis",
              "what": "Calculate discrimination index to measure how well each question differentiates between high and low performers",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-90",
              "component": "Question Usage Tracking and Rotation",
              "what": "Track question usage frequency and enforce rotation policies to prevent over-exposure and memorization",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-91",
              "component": "Assessment Reliability Metrics",
              "what": "Calculate and monitor assessment reliability metrics to ensure consistent and dependable measurement of competency",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-98",
              "component": "New Question Pilot Testing Process",
              "what": "Pilot test new questions with known-competency employees before deploying to high-stakes assessments",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-99",
              "component": "Regular Question Review Cycles",
              "what": "Schedule and manage periodic review of all questions to ensure continued relevance, accuracy, and alignment with current practices",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-100",
              "component": "Performance-Based Question Flagging",
              "what": "Automatically flag questions that perform poorly in live assessments based on statistical thresholds",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-65",
              "component": "Assessor Performance Analysis",
              "what": "Analyse assessor performance to identify assessment consistency issues and training needs",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-67",
              "component": "Advanced Assessment Analytics",
              "what": "Implement sophisticated assessment analytics to identify bias, inconsistency, and quality issues",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-102",
              "component": "Assessor Calibration Sessions",
              "what": "Conduct and document assessor calibration sessions to ensure consistent rating standards across all assessors",
              "moscow": "Should \u00b7 Next"
            }
          ]
        },
        {
          "name": "Security & Anti-Cheating Configuration",
          "stage": "Back office",
          "intro": "Configuration of randomisation, offline-submission prevention, browser lockdown and device/session integrity controls.",
          "components": [
            {
              "storyId": "AS-84",
              "component": "Offline Answer Submission Prevention",
              "what": "Prevent employees from turning off connectivity to avoid failed assessment results being logged",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-85",
              "component": "Section-Based Question Randomization with Blueprint Coverage",
              "what": "Configure section-based randomization that maintains assessment blueprint coverage while preventing question memorization",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-86",
              "component": "Answer Order Randomization",
              "what": "Randomize the order of answer options for multiple choice questions to prevent pattern recognition and cheating",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-114",
              "component": "Browser and Application Lockdown for High-Stakes Assessments",
              "what": "Enforce browser lockdown preventing tab switching, copy-paste, screenshots, and unauthorised application access during assessments",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-115",
              "component": "Device Fingerprinting and Session Integrity Monitoring",
              "what": "Implement device fingerprinting and continuous session integrity monitoring to detect and prevent assessment fraud",
              "moscow": "Could \u00b7 Next"
            }
          ]
        },
        {
          "name": "External Assessment Management",
          "stage": "Back office",
          "intro": "Recording, verifying and reporting on third-party and regulator-issued certifications.",
          "components": [
            {
              "storyId": "AS-72",
              "component": "Manual External Assessment Entry",
              "what": "Manually record external assessment results and certifications from third-party providers or regulatory bodies",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-73",
              "component": "External Assessment Verification Workflow",
              "what": "Verify authenticity of externally issued certifications through structured validation process",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-74",
              "component": "External Assessment Renewal Coordination",
              "what": "Track and coordinate renewal of expiring external certifications including notifying employees and facilitating external testing",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-75",
              "component": "External Assessment Reporting",
              "what": "Generate comprehensive reports on external certifications including current status, upcoming renewals, and compliance gaps",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "Scheduling & Logistics",
          "stage": "Back office",
          "intro": "Calendar and booking coordination, proctored-session resourcing, waitlist management, and conflict detection against HARRI rosters.",
          "components": [
            {
              "storyId": "AS-103",
              "component": "Assessment Calendar and Booking Coordination",
              "what": "View and manage comprehensive assessment calendar showing all scheduled assessments, capacity, and resource allocation",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-104",
              "component": "Proctored Session Resource Management",
              "what": "Manage proctored assessment sessions including room allocation, equipment setup, and invigilator assignment",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-111",
              "component": "Assessment Waitlist Management and Priority Allocation",
              "what": "Manage waitlists for overbooked assessment sessions with priority rules and automatic slot allocation",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-112",
              "component": "Conflict Detection with HARRI Operational Rosters",
              "what": "Automatically detect and resolve conflicts between assessment schedules and operational rostering requirements",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-113",
              "component": "Assessment Centre Walk-In Queue Management",
              "what": "Manage walk-in queue at assessment centres for employees needing urgent same-day assessments",
              "moscow": "Could \u00b7 Next"
            }
          ]
        },
        {
          "name": "Compliance & Regulatory Reporting",
          "stage": "Back office",
          "intro": "Real-time and heatmap compliance dashboards, CAA audit-format reporting, non-compliance forecasting, and 7-year historical retrieval.",
          "components": [
            {
              "storyId": "AS-77",
              "component": "Assessment Program Reporting",
              "what": "Generate comprehensive reports on overall assessment program performance and effectiveness",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-105",
              "component": "Real-Time Compliance Dashboard with Drill-Down",
              "what": "View real-time compliance status across organisation with ability to drill down from summary to individual employee detail",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-106",
              "component": "Performance Analytics by Multiple Dimensions",
              "what": "Analyse assessment performance across multiple dimensions including pass rates, attempt patterns, and time-to-competency",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-107",
              "component": "Compliance Heatmap visualisation with Geographic and organisational Drill-Down",
              "what": "Generate interactive heatmap visualisations showing compliance status with ability to drill down and up through organisational and geographic hierarchies",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-108",
              "component": "Audit and Governance Reporting for CAA Compliance",
              "what": "Generate comprehensive audit reports in CAA-compliant format with historical data retrieval and evidence compilation",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-109",
              "component": "Non-Compliance Risk Register and Forecasting",
              "what": "Maintain forward-looking risk register showing projected non-compliance based on expiry schedules and assessment booking patterns",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "AS-110",
              "component": "7-Year Historical Assessment Retrieval for Regulatory Compliance",
              "what": "Retrieve and report on assessment records spanning 7+ years for CAA audit and regulatory compliance",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "Integration Orchestration & Exceptions",
          "stage": "Back office",
          "intro": "Configuring the automated triggers and cross-system update workflows that connect assessment outcomes to CMS, HARRI and other systems, plus emergency waiver handling and data-reconciliation monitoring.",
          "components": [
            {
              "storyId": "AS-93",
              "component": "Assessment Trigger Logic Configuration",
              "what": "Configure automated assessment triggers based on training completion, role changes, or competency expiry events",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-94",
              "component": "Cross-System Update Workflows",
              "what": "Configure automated data updates flowing from assessment results to CMS, HARRI, and other integrated systems",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-95",
              "component": "Automated Notification Cascades",
              "what": "Configure cascading notifications that automatically inform relevant stakeholders when assessment events occur",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "AS-96",
              "component": "Data Reconciliation and Error Handling",
              "what": "Monitor and resolve data synchronization issues between assessment system and integrated systems with reconciliation reporting",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-97",
              "component": "Emergency Competency Waivers with Risk Acceptance",
              "what": "Process emergency competency waivers allowing temporary deployment of non-compliant employees with documented risk acceptance",
              "moscow": "Should \u00b7 Now"
            }
          ]
        }
      ]
    },
    {
      "name": "Competency Administrator",
      "intro": "36 stories. This is the persona that builds and governs the scheme itself, distinct from the Manager (who operates within it) and the Assessment Administrator (who runs the Assessment System's back office). Divisional Lead and Auditor variants of this role appear in a handful of stories and should inherit the same screens with scoped visibility.",
      "screens": [
        {
          "name": "Competency Framework Builder",
          "stage": "Back office",
          "intro": "The core scheme-design workbench: levels, requirements (time, course, evidence, assessment-type), validity rules, review/publish workflow, versioning, cloning, merge/equivalency, and mirrored requirements.",
          "components": [
            {
              "storyId": "CMS-1",
              "component": "Framework Administration",
              "what": "Create and manage competency frameworks with custom level structures and templated options",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-2",
              "component": "Framework Level Definition",
              "what": "Define custom competency levels (Training, Provisional, Authorised, Expert) with specific criteria and thresholds",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-3",
              "component": "Integration Configuration",
              "what": "Configure which competency levels qualify as \"deployment ready\" for HARRI (via Theo) rostering purposes",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-4",
              "component": "Requirement Configuration",
              "what": "Add, configure, and manage requirement line items for each competency level",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-5",
              "component": "Time Requirement Setup",
              "what": "Configure time-based requirements such as minimum time in grade or tenure requirements",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-6",
              "component": "Assessment Type Attachment",
              "what": "Attach multiple assessment types to each competency level (observation checklist, verbal validation, MCQ test, evidence upload)",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-7",
              "component": "Course Requirement Setup",
              "what": "Configure course requirements with learning content links, completion criteria, and prerequisites",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-8",
              "component": "Evidence Requirement Setup",
              "what": "Define acceptable evidence types and validation workflows for evidence-based requirements",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-9",
              "component": "Validity Rules Setup",
              "what": "Configure comprehensive validity, expiry, renewal, and failure threshold rules for each competency level",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-10",
              "component": "Manager/Supervisor Validation Management",
              "what": "Configure manager/supervisor validation requirements for high-risk competencies",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-11",
              "component": "Review and Publish",
              "what": "Review complete competency configuration, validate for errors, test functionality, and publish to make available for user assignment",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-12",
              "component": "Documentation Export",
              "what": "Export complete competency shell, structure, requirements, and logic to PDF format",
              "moscow": "Could \u00b7 Now"
            },
            {
              "storyId": "CMS-13",
              "component": "Version Control & Relationships",
              "what": "Manage competency relationships including equivalencies, replacements, and version control",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-14",
              "component": "Clone Competency",
              "what": "Clone an existing competency to create a new similar competency with all configuration copied",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-112",
              "component": "Version Control \u2014 Dedicated Stories",
              "what": "Manage explicit version control at every level of the competency hierarchy (competency, requirement, activity, observation form, exam, question bank) with active-from/to dates and supersession logic",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-118",
              "component": "Competency Merge & Equivalency Tools",
              "what": "Merge duplicate competencies and map equivalencies between different competencies or requirements",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-119",
              "component": "Mirrored Requirements \u2014 Clone vs. Mirror at Stage/Level Level",
              "what": "Create a \"mirrored\" relationship between a competency stage/level and other competency tracks, such that the stage and all its requirements are synchronised from a single source \u2014 with edits propagating automatically \u2014 whilst retaining the option to detach",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-125",
              "component": "Equipment / Machinery Tagging on Competencies",
              "what": "Tag a competency as relating to a named piece of machinery or equipment of a given type, so the system can answer \"who is competent on this equipment\" and reuse the tag across areas",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-126",
              "component": "Cross-competency Profile Prerequisite Gate",
              "what": "Configure a prerequisite relationship between separate competency profiles \u2014 either as a one-time assignment gate, or as an ongoing maintenance dependency \u2014 such that a dependent profile cannot be assigned to, or continue to be held by, an individual unless the prerequisite profile is held at a specified level",
              "moscow": "Should \u00b7 Now"
            }
          ]
        },
        {
          "name": "Competency Management Operations",
          "stage": "Back office",
          "intro": "Day-to-day scheme administration once frameworks are live: authorised persons, exceptions, medical and psychometric records, regulatory jurisdictions, SSOW appointment letters.",
          "components": [
            {
              "storyId": "CMS-15",
              "component": "Authorised Persons Management",
              "what": "Manage authorised Persons (APs) with competency checking, incident response, and status control",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-16",
              "component": "Budget Management",
              "what": "Track financial implications of competency requirements and renewals",
              "moscow": "Could \u00b7 Next"
            },
            {
              "storyId": "CMS-17",
              "component": "CBTA Implementation",
              "what": "Implement Competency-Based Training and Assessment (CBTA) methodologies aligned with ICAO standards",
              "moscow": "Could \u00b7 Now"
            },
            {
              "storyId": "CMS-18",
              "component": "Certification Management",
              "what": "record and manage licenses gained through 3rd party/external certifications and qualifications",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-19",
              "component": "Equipment & Location Management",
              "what": "Track equipment assignments and identify patterns in equipment management",
              "moscow": "Won't \u00b7 N/A"
            },
            {
              "storyId": "CMS-20",
              "component": "Exception Management",
              "what": "Manage competency exemptions and special circumstances",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-21",
              "component": "Medical Competency Management",
              "what": "Manage comprehensive medical records including pre-placement, periodical, and review medicals with ORR compliance",
              "moscow": "Won't \u00b7 N/A"
            },
            {
              "storyId": "CMS-22",
              "component": "Psychometric Testing Management",
              "what": "Record and track psychometric testing outcomes for career progression with 3-year validity",
              "moscow": "Won't \u00b7 N/A"
            },
            {
              "storyId": "CMS-23",
              "component": "Regulatory Compliance",
              "what": "Manage competency requirements across multiple regulatory jurisdictions (FAA, EASA, local authorities)",
              "moscow": "Won't \u00b7 N/A"
            },
            {
              "storyId": "CMS-24",
              "component": "SSOW Digital Appointment Letters",
              "what": "Generate digitally signed SSOW appointment letters with AP status and certificate numbers",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-25",
              "component": "Medical Competency Management",
              "what": "Integrate medical database information with competency requirements",
              "moscow": "Could \u00b7 Now"
            }
          ]
        },
        {
          "name": "Scheme Governance & Export",
          "stage": "Back office",
          "intro": "The in-system representation of the division's T&C scheme as a governed, versioned, ownable object \u2014 directly relevant to the maturity work this programme is driving.",
          "components": [
            {
              "storyId": "CMS-123",
              "component": "Training & Competence Scheme Governance",
              "what": "Create and maintain an in-system representation of the division's training-and-competence scheme as a governed, versioned object with named owners and review status",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-124",
              "component": "Training & Competence Scheme Export",
              "what": "Export the training-and-competence scheme or framework as a document at any level of the hierarchy \u2014 whole division, business unit, role, or single competency down to its requirements and evidence",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "Reporting",
          "stage": "Back office",
          "intro": "Forward-looking impact simulation and predictive compliance reporting.",
          "components": [
            {
              "storyId": "CMS-26",
              "component": "Impact Simulation",
              "what": "Simulate the impact of upcoming competency expiries to identify coverage gaps",
              "moscow": "Could \u00b7 Now"
            },
            {
              "storyId": "CMS-27",
              "component": "Predictive Compliance",
              "what": "Generate predictive compliance reports that identify potential regulatory issues before they occur",
              "moscow": "Should \u00b7 Next"
            }
          ]
        },
        {
          "name": "Workflow & Automation Builder",
          "stage": "Back office",
          "intro": "Configuring outcome-triggered activity chains \u2014 the mechanism behind \"a failed observation automatically creates a coaching-conversation task\" discussed repeatedly across workshops.",
          "components": [
            {
              "storyId": "CMS-28",
              "component": "Create Workflow",
              "what": "Create automated workflows based on competency status changes",
              "moscow": "Should \u00b7 Later"
            },
            {
              "storyId": "CMS-120",
              "component": "Outcome-Triggered Activity Automation",
              "what": "Define automated activity chains triggered by the outcome of a requirement \u2014 including threshold-based triggers, tiered consequence escalation, and linkage of every restriction or suspension to a specific activity record",
              "moscow": "Must \u00b7 Now"
            }
          ]
        }
      ]
    },
    {
      "name": "System Administrator",
      "intro": "Merges Global Administrator, System Administrator and Security Administrator tags (63 stories). Largely back-office and configuration-heavy; included here for completeness and because several screens overlap with the system-wide shell described in the next section.",
      "screens": [
        {
          "name": "User & Role Management",
          "stage": "Back office",
          "intro": "Creating, editing and deactivating users; bulk import/export; role and audience management across the whole ecosystem.",
          "components": [
            {
              "storyId": "SYS-11",
              "component": "Global Role Overview",
              "what": "Access a centralised system role management interface where I can view all existing role types in a clear list format",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-12",
              "component": "Role Creation",
              "what": "Create new role types by defining role names and configuring specific system permissions and access levels",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-13",
              "component": "Role Parameter Configuration",
              "what": "Set detailed parameters and restrictions for each role including content access levels, user management permissions, reporting capabilities, and system feature availability",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-14",
              "component": "Role Assignment",
              "what": "Ensure that assignment and removal of system role permissions is automated as much as possible",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-15",
              "component": "Global Audience Overview",
              "what": "See a list of all audiences that have been created across the ecosystem",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-16",
              "component": "Audience Creation",
              "what": "Create new audiences to ensure that users see the correct content inside the ecosystem",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-17",
              "component": "Audience Assignment",
              "what": "Ensure that  assignment and removal of audiences is automated as much as possible",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-18",
              "component": "Hierarchical Audiences",
              "what": "Create parent-child audience hierarchies to manage complex organisational structures",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-24",
              "component": "Create User",
              "what": "Manually create new user accounts",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-25",
              "component": "Edit User",
              "what": "Edit user profile information and assignments",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-26",
              "component": "Deactivate User",
              "what": "Deactivate users who leave the organisation or no longer need access",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-27",
              "component": "Bulk User Import",
              "what": "Import multiple users via CSV/Excel file",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "SYS-28",
              "component": "User Export",
              "what": "Export user data for reporting or external systems",
              "moscow": "Could \u00b7 Next"
            },
            {
              "storyId": "SYS-29",
              "component": "User Activity Tracking",
              "what": "View detailed activity logs for any user",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-30",
              "component": "Impersonate User",
              "what": "Log in as another user to troubleshoot issues from their perspective",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "SYS-61",
              "component": "User Profile View",
              "what": "View complete user profile with all learning and activity data",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-102",
              "component": "User Directory",
              "what": "View a comprehensive list of all users in the system",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-87",
              "component": "Role Management",
              "what": "Create and configure custom roles with specific competency management permission sets",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-91",
              "component": "User Management",
              "what": "Create, modify, and deactivate user accounts in the CMS and manage their roles and permissions",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-121",
              "component": "Role Management",
              "what": "Create and configure custom roles with specific assessment permission sets",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-123",
              "component": "User Management",
              "what": "Create, modify, and deactivate user accounts in the assessment system and manage their roles and permissions",
              "moscow": "Must \u00b7 Now"
            }
          ]
        },
        {
          "name": "System Configuration & Health",
          "stage": "Back office",
          "intro": "Global configuration, health monitoring, audit trail access, and integration status (Maximo, etc.).",
          "components": [
            {
              "storyId": "SYS-1",
              "component": "System Login",
              "what": "Access a secure login platform with authentication",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-20",
              "component": "Audit Trail Access",
              "what": "Access a centralised system audit interface that displays a comprehensive log of all changes made across every block in the ecosystem",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-21",
              "component": "Readiness Scoring Configuration",
              "what": "Configure and manage the composite readiness scoring system that determines employee deployment eligibility",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "SYS-23",
              "component": "Audit Trail & Compliance",
              "what": "Maintain comprehensive audit trails for all system activities",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-76",
              "component": "System Health Dashboard",
              "what": "Monitor health and availability of all integrated systems",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-88",
              "component": "System Configuration",
              "what": "Configure CMS settings and parameters to align with Heathrow's competency management requirements",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-89",
              "component": "System Health Monitoring",
              "what": "Monitor CMS performance, uptime, and health metrics in real-time",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-90",
              "component": "User Activity Logs",
              "what": "View comprehensive logs of user activity in the CMS for audit and security purposes",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-120",
              "component": "System Health Monitoring",
              "what": "Monitor assessment system performance, uptime, and health metrics in real-time",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-122",
              "component": "User Activity Logs",
              "what": "View comprehensive logs of user activity in the assessment system for audit and security purposes",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "AS-124",
              "component": "System Configuration",
              "what": "Configure assessment system settings and parameters to align with Heathrow's testing requirements and CAA regulations",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-95",
              "component": "Maximo Work Order Integration",
              "what": "View employee competency status directly in the work order system (Maximo) when assigning work",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-96",
              "component": "Maximo Competency Lockout",
              "what": "Implement skill lockouts in Maximo based on CMS competency status",
              "moscow": "Should \u00b7 Next"
            }
          ]
        },
        {
          "name": "Communications Admin",
          "stage": "Back office",
          "intro": "Broadcast announcements and bulletin management at the system level, plus resilience-plan distribution.",
          "components": [
            {
              "storyId": "SYS-10",
              "component": "Bulletin Management",
              "what": "Create and publish bulletins to specific audiences",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-98",
              "component": "Broadcast Announcements",
              "what": "Send system-wide announcements to all users or specific groups",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-99",
              "component": "Communication Analytics",
              "what": "Track effectiveness of communications across all channels",
              "moscow": "Should \u00b7 Next"
            },
            {
              "storyId": "CMS-109",
              "component": "Resilience Plan Distribution",
              "what": "Distribute resilience plans and emergency procedures to all relevant operational staff and track acknowledgment",
              "moscow": "Could \u00b7 Later"
            }
          ]
        },
        {
          "name": "Reporting Builder",
          "stage": "Back office",
          "intro": "Cross-system, scheduled and ad-hoc reporting infrastructure.",
          "components": [
            {
              "storyId": "SYS-70",
              "component": "Cross-System Report Builder",
              "what": "Build custom reports that pull data from all integrated systems",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-73",
              "component": "Scheduled Reporting",
              "what": "Schedule reports to run automatically and distribute to stakeholders",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "SYS-106",
              "component": "Search Analytics",
              "what": "See what users are searching for and whether they find relevant results",
              "moscow": "Should \u00b7 Next"
            }
          ]
        },
        {
          "name": "Integration & Third-Party Records",
          "stage": "Back office",
          "intro": "TIP outcome feed, SSOW third-party record management, contractor access, and ID/pass creation.",
          "components": [
            {
              "storyId": "CMS-127",
              "component": "TIP Outcome Feed & Import",
              "what": "Import TIP (Threat Image Projection) evaluation outcomes into the CMS as an outcome-driven activity feed, covering both the initial historical load and recurring monthly deltas",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "CMS-113",
              "component": "SSOW / Third-Party Record Management",
              "what": "Create and manage competency records for third-party contractors within a restricted interface, generating QR code cards without giving third parties system access",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-92",
              "component": "Contractor Management",
              "what": "Provide secure system access for contractors while managing licensing costs and security risks",
              "moscow": "Won't \u00b7 N/A"
            },
            {
              "storyId": "CMS-75",
              "component": "ID & Pass Creation",
              "what": "Create and manage ID cards and travel passes for employees",
              "moscow": "Won't \u00b7 N/A"
            }
          ]
        },
        {
          "name": "Admin Bulk Tools",
          "stage": "Back office",
          "intro": "Bulk operations, multi-system content publishing workflow, and general-purpose automated workflow creation.",
          "components": [
            {
              "storyId": "SYS-100",
              "component": "Bulk Operations",
              "what": "Perform bulk operations across all systems from Block 1",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "SYS-101",
              "component": "Content Publishing Workflow",
              "what": "Publish content across multiple systems with single workflow",
              "moscow": "Could \u00b7 Next"
            },
            {
              "storyId": "SYS-22",
              "component": "Automated Workflow Creation",
              "what": "Create and configure automated workflows using if-this-then-that logic for  management processes",
              "moscow": "Could \u00b7 Later"
            }
          ]
        }
      ]
    },
    {
      "name": "Leadership & Workforce Planning",
      "intro": "Only 5 stories directly tagged \u2014 thin by design at this stage, but should not be read as low-importance: AS-50 (Senior Leadership Dashboard, under Manager/Supervisor) and the second-line-of-supervision visibility discussed on 27 Aug both feed this persona.",
      "screens": [
        {
          "name": "Executive & Compliance Dashboards",
          "stage": "Cross-stage",
          "intro": "Org-wide compliance and KPI dashboards, and competency-based workforce forecasting.",
          "components": [
            {
              "storyId": "SYS-71",
              "component": "Compliance Dashboard",
              "what": "See organisation-wide compliance status aggregated from all systems",
              "moscow": "Must \u00b7 Now"
            },
            {
              "storyId": "SYS-72",
              "component": "Executive Dashboard",
              "what": "View high-level KPIs across all learning and development systems",
              "moscow": "Should \u00b7 Now"
            },
            {
              "storyId": "CMS-93",
              "component": "Workforce Planning",
              "what": "Access competency forecasting that predicts competency gaps 2+ years in advance",
              "moscow": "Could \u00b7 Next"
            },
            {
              "storyId": "CMS-94",
              "component": "Workforce Planning",
              "what": "Model organisstional structure based on competencies rather than traditional job hierarchies",
              "moscow": "Could \u00b7 Later"
            },
            {
              "storyId": "CMS-107",
              "component": "Workforce Progression Planning",
              "what": "analyse career progression appetite data to forecast training needs and identify skills pipeline gaps",
              "moscow": "Must \u00b7 Now"
            }
          ]
        }
      ]
    }
  ]
};
