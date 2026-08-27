// Real competency-scheme content, transcribed from the Security instance of the
// HAL Training & Competence Scheme Manual (DBLX, draft v0.1, June 2026).
// Provenance note: the manual's scheme-wide prose in Parts 1–2 is carried over
// from a shared template originally written for Engineering's Airside
// Technician business unit (it still refers to "Airside Technician" and "14
// business units" in places) — the Role Profile Register, Competency Register
// and the X-Ray Screening specification below are Security's own populated
// content and are transcribed as drafted, including its "XX" placeholder pass
// marks and open questions. Treated here at face value, consistent with the
// source document's own "Draft — for Security to extend" status.
window.COMPETENCY_SCHEME = {
  meta: {
    title: "Security — Training & Competence Scheme Manual",
    status: "Draft — for Security to extend",
    version: "v0.1, June 2026",
    author: "Rob Ashcroft, DBLX",
    provenanceNote: "Parts 1–2 of the source manual are carried over from a shared template originally drafted for Engineering's Airside Technician business unit — the registers and specification below are Security's own populated content, transcribed as drafted."
  },
  governance: [
    { role: "Scheme owner", responsibility: "Overall accountability for the Security T&C scheme and its regulatory standing", heldBy: "Security leadership (to confirm)" },
    { role: "Competency Administrator", responsibility: "Maintains the competency framework in the CMS; gatekeeps changes; manages this manual", heldBy: "To confirm" },
    { role: "Engineering learning lead", responsibility: "Owns the competencies within Engineering; ratifies specifications", heldBy: "Security L&C (to confirm)" },
    { role: "Business-unit profile owners", responsibility: "Own the role profiles and competency content for their business unit", heldBy: "Per business unit — see below" },
    { role: "Subject matter experts (SMEs)", responsibility: "Author and validate individual competency specifications", heldBy: "Per competency" },
    { role: "Assessment Administrator", responsibility: "Owns assessment design, question banks and assessor calibration", heldBy: "To confirm" },
  ],
  roleRegister: [
    { role: "Security Officer", businessUnit: "Security", competencyCount: 19, status: "Draft", owner: "Stephane De-Matos" },
    { role: "Security Manager", businessUnit: "Security", competencyCount: 7, status: "Draft", owner: "Stephane De-Matos" },
    { role: "Security Patroller", businessUnit: "Security", competencyCount: null, status: "Draft", owner: "Stephane De-Matos" },
    { role: "Aviation Security Manager", businessUnit: "Security", competencyCount: null, status: "Draft", owner: "Stephane De-Matos" },
    { role: "Instructor/Trainer", businessUnit: "Security", competencyCount: null, status: "Draft", owner: "Stephane De-Matos" },
  ],
  securityOfficerProfile: {
    role: "Security Officer",
    theoJobCode: "(to assign)",
    division: "Security",
    businessUnit: "Security",
    profileOwner: "Stephane De-Matos",
    status: "Worked example",
    lastReviewed: "June 2026",
    nextReview: "June 2027",
    competencies: [
      "Access Control", "Prepare People for Security", "X-Ray Screening", "ETD",
      "Liquids Testing", "WTMD/HHMD", "Security Scanner", "SED (Shoe Explosive Detection Equipment)",
      "Search People", "Search Baggage", "Vehicle Search", "Patrolling",
      "Airport Supplies", "HBS", "In-Flight Supplies", "Resolution Conversation",
    ],
  },
  // Register — every competency required by the Security Officer profile. All Regulatory/Standard,
  // 3-stage (Training -> Provisional -> Authorised). Only X-Ray Screening is specified in full below;
  // the rest are genuinely un-populated in the source manual ("further competencies populated as defined").
  competencyRegister: [
    { name: "Access Control", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "Prepare People for Security", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "X-Ray Screening", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: true },
    { name: "ETD", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "Liquids Testing", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "WTMD/HHMD", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "Security Scanner", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "SED (Shoe Explosive Detection Equipment)", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "Search People", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "Search Baggage", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "Vehicle Search", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "Patrolling", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "Airport Supplies", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "HBS", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "In-Flight Supplies", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
    { name: "Resolution Conversation", category: "Regulatory", type: "Standard", stages: 3, status: "Draft", owner: "Security L&C", review: "Jun 2027", specified: false },
  ],
  // The one competency worked in full in the source manual.
  specifications: {
    "X-Ray Screening": {
      name: "X-Ray Screening",
      reference: "(system-assigned)",
      category: "Regulatory",
      type: "Standard",
      owningDepartment: "Security — Learning & Competence",
      status: "Draft",
      validity: "13 months from achievement of Authorised stage",
      deploymentThreshold: "Stage 3 — Authorised",
      purpose: "Ensure that Security Officers can effectively and consistently operate X-ray Screening equipment to detect prohibited items, explosives, and other security threats within passenger baggages and personal belongings.",
      stages: [
        { n: 1, name: "Training", meaning: "In formal training; not deployable at this point", deployable: false },
        { n: 2, name: "Provisional", meaning: "Performing duty under direct supervision; building observed operational experience (OTJT)", deployable: false },
        { n: 3, name: "Authorised", meaning: "Independently certified for unsupervised duties", deployable: true },
      ],
      requirementsByStage: [
        { stage: "Stage 1: Training", rows: [
          { ref: "R01", requirement: "GSOI Training", type: "Learning", mandatory: true, standard: "Pass", expiry: "13 months?" },
        ]},
        { stage: "Stage 2: Provisional", rows: [
          { ref: "R02", requirement: "DNXCT", type: "Assessment", mandatory: true, standard: "XX pass mark", expiry: "13 months" },
          { ref: "R03", requirement: "Access Training", type: "Assessment", mandatory: true, standard: "XX pass mark", expiry: "13 months?" },
        ]},
        { stage: "Stage 3: Authorised (deployment threshold)", rows: [
          { ref: "R04", requirement: "GSOR - Modules 1", type: "Course", mandatory: true, standard: "XX pass mark", expiry: "13 months" },
          { ref: "R05", requirement: "GSOR - Modules 4", type: "Course", mandatory: true, standard: "XX pass mark", expiry: "13 months" },
          { ref: "R06", requirement: "GSOR - Modules 5", type: "Course", mandatory: true, standard: "XX pass mark", expiry: "13 months" },
          { ref: "R07", requirement: "GSOR - Modules 5A/B", type: "Course", mandatory: true, standard: "XX pass mark", expiry: "13 months" },
          { ref: "R08", requirement: "GSOR - Modules 6", type: "Course", mandatory: true, standard: "XX pass mark", expiry: "13 months" },
          { ref: "R09", requirement: "DNXCT Recurrent", type: "Assessment", mandatory: true, standard: "XX pass mark", expiry: "13 months" },
          { ref: "R10", requirement: "Threat Image Projection (TIP)", type: "Assessment", mandatory: true, standard: "80% pass mark", expiry: "13 months" },
          { ref: "—", requirement: "Unannounced Observations (C&D)", type: "Observation", mandatory: true, standard: "Minimum X per year", expiry: "—" },
        ]},
      ],
      maintaining: [
        { requirement: "GSOR - Modules 1", standard: "Pass", frequency: "Annually on authorised achieved" },
        { requirement: "GSOR - Modules 4", standard: "Pass", frequency: "Annually on authorised achieved" },
        { requirement: "GSOR - Modules 5", standard: "Pass", frequency: "Annually on authorised achieved" },
        { requirement: "GSOR - Modules 5A/B", standard: "Pass", frequency: "Annually on authorised achieved" },
        { requirement: "GSOR - Modules 6", standard: "Pass", frequency: "Annually on authorised achieved" },
        { requirement: "DNXCT", standard: "Pass", frequency: "Annually on authorised achieved" },
        { requirement: "Threat Image Projection (TIP)", standard: "80% pass mark", frequency: "Annually on authorised achieved" },
        { requirement: "Unannounced Observations (C&D)", standard: "Pass; no safety-critical failure", frequency: "Minimum X per year" },
      ],
      failureConsequence: [
        { event: "GSOI Training Failed", consequence: "Up to 3 attempts, X days between. Third failure: Book Special Paid Leave & Digital ID removed" },
        { event: "DNXCT Failed", consequence: "Up to 2 attempts. Second fail: Special Paid Leave issued and booked in with Learning Delivery Specialist for review" },
        { event: "Access Training Failed", consequence: "Conduct Employee Review" },
        { event: "GSOR - Modules 1/4/5/5A/B/6 Failed", consequence: "Up to 3 attempts. Third fail: Employee review discussion" },
        { event: "DNXCT Recurrent Failed", consequence: "Up to 2 attempts. Second fail: Employee review discussion" },
        { event: "TIP 80% threshold not met — monthly review, results over 6 months", consequence: "Tiered: 75–79.9% LM monitors performance · 70–74.9% 1 hr 1:1 coaching + resit DNXCT (3 attempts) then employee review · 25–69.9% restricted duties on screen & bag searching · <25% full screen-reading retraining" },
        { event: "Unannounced Observations (C&D) — compliant, improvement desired", consequence: "Green Card Entry (App), independent incident, apply restriction and re-train" },
        { event: "Unannounced Observations (C&D) — serious deficiency", consequence: "Green Card Entry (App), coded incident, apply restriction and re-train" },
      ],
      overlays: [
        { name: "Medical fitness (Amber)", applicability: "An Amber medical status restricts deployment pending occupational health review. Set at profile level; links here.", underReview: false },
        { name: "Restriction", applicability: "May be applied manually (e.g., pending investigation of an incident).", underReview: true },
        { name: "Exemption", applicability: "Not typically applicable directly; related duties may support seasonal exemption.", underReview: true },
        { name: "Suspension", applicability: "Applied during remediation after a failed spot check or incident.", underReview: true },
      ],
    },
  },
};
