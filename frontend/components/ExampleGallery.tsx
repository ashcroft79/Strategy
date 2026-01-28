'use client';

import { useState } from 'react';
import { X, ChevronRight, Building2, Stethoscope, GraduationCap, Leaf, Eye, ArrowRight, Lightbulb, Target, Users } from 'lucide-react';

interface ExampleGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExamplePyramid {
  id: string;
  name: string;
  industry: string;
  icon: React.ReactNode;
  description: string;
  context: string;
  vision: {
    statement: string;
    rationale: string;
  };
  values: Array<{
    name: string;
    description: string;
  }>;
  drivers: Array<{
    name: string;
    description: string;
    rationale: string;
  }>;
  intents: Array<{
    statement: string;
    driver: string;
    rationale: string;
  }>;
  commitments: Array<{
    name: string;
    horizon: 'H1' | 'H2' | 'H3';
    primaryDriver: string;
    rationale: string;
  }>;
  keyLearnings: string[];
}

const EXAMPLE_PYRAMIDS: ExamplePyramid[] = [
  {
    id: 'techstart',
    name: 'TechStart Inc.',
    industry: 'SaaS / Technology',
    icon: <Building2 className="w-6 h-6" />,
    description: 'A 150-person B2B SaaS company pursuing customer-centric growth while navigating competitive pressures.',
    context: 'TechStart has strong product-market fit with SMB customers but faces pressure from enterprise competitors moving downmarket. Customer retention is good (85%) but growth has slowed. The team has deep technical expertise but limited sales capacity.',
    vision: {
      statement: 'Every growing business has the tools to compete with enterprises',
      rationale: 'This vision focuses on the outcome (leveling the playing field) rather than our product. It\'s aspirational yet achievable, and connects to our core belief that SMBs deserve enterprise-grade capabilities.',
    },
    values: [
      { name: 'Customer Obsessed', description: 'We start with customer needs, not our solutions. Customer feedback overrides internal opinions.' },
      { name: 'Speed Over Perfection', description: 'We ship fast, learn fast, iterate. A working prototype beats a perfect plan.' },
      { name: 'Transparent by Default', description: 'We share information openly - roadmap, metrics, even mistakes.' },
    ],
    drivers: [
      { name: 'Customer Intimacy', description: 'Compete on deep understanding of customer needs and personalized service', rationale: 'NPS is our #1 predictor of retention. We win by knowing customers better than competitors who treat them as numbers.' },
      { name: 'Product Excellence', description: 'Build the most intuitive, reliable platform in our category', rationale: 'Our technical team is our key differentiator. We can\'t outspend competitors but can out-innovate them.' },
      { name: 'Operational Efficiency', description: 'Do more with less through automation and smart processes', rationale: 'With limited budget, every dollar must work harder. Efficiency funds growth.' },
    ],
    intents: [
      { statement: 'Customers describe us as "anticipating what I need before I ask"', driver: 'Customer Intimacy', rationale: 'This paints a picture of proactive, not reactive service. It\'s bold, measurable through customer feedback, and aspirational.' },
      { statement: 'Our platform becomes the first tool opened every morning', driver: 'Product Excellence', rationale: 'Daily engagement means we\'re essential, not optional. This drives retention and expansion.' },
      { statement: 'We operate at 2x the efficiency of industry benchmarks', driver: 'Operational Efficiency', rationale: 'Specific target, measurable, and bold enough to require real transformation.' },
    ],
    commitments: [
      { name: 'Launch predictive recommendations engine', horizon: 'H1', primaryDriver: 'Customer Intimacy', rationale: 'Delivers on "anticipating needs" intent. Quick win using existing data.' },
      { name: 'Build mobile app with offline-first architecture', horizon: 'H2', primaryDriver: 'Product Excellence', rationale: 'Addresses #1 feature request. Differentiates from competitors.' },
      { name: 'Implement AI-powered support automation', horizon: 'H2', primaryDriver: 'Operational Efficiency', rationale: 'Reduces support costs by 40% while improving response time.' },
      { name: 'Explore voice-based interface prototype', horizon: 'H3', primaryDriver: 'Product Excellence', rationale: 'Future bet on emerging interaction pattern. Low investment, high learning.' },
    ],
    keyLearnings: [
      'Notice how drivers are limited to 3, not 5 or 7. This forces real prioritization.',
      'Intents use customer voice ("Customers describe us as...") rather than internal metrics.',
      'H3 commitment is exploratory, not a promised deliverable - appropriate for strategic bets.',
      'Each commitment links clearly to one primary driver - no ambiguity about ownership.',
    ],
  },
  {
    id: 'regional-health',
    name: 'Regional Health Network',
    industry: 'Healthcare',
    icon: <Stethoscope className="w-6 h-6" />,
    description: 'A 3-hospital regional health system expanding access while managing cost pressures.',
    context: 'Regional Health operates in a rural area where 40% of residents travel 60+ miles for specialist care. Staff retention is a constant challenge. Government funding is flat while demand grows. Recent regulatory changes require digital health adoption.',
    vision: {
      statement: 'Every community member receives the same quality care as major urban centers',
      rationale: 'This addresses the core equity issue in rural healthcare. It\'s about outcomes for patients, not about our organization\'s growth or prestige.',
    },
    values: [
      { name: 'Patient First, Always', description: 'Clinical decisions are made based on patient needs, never administrative convenience.' },
      { name: 'Community Rooted', description: 'We are part of this community, not just serving it. Our staff live here, our decisions consider local impact.' },
      { name: 'Sustainable Excellence', description: 'We pursue quality that we can maintain long-term, not unsustainable perfection.' },
    ],
    drivers: [
      { name: 'Access Expansion', description: 'Bring specialist care to underserved communities through technology and partnerships', rationale: 'Our biggest gap is access, not quality. Closing this gap addresses our core mission.' },
      { name: 'Workforce Stability', description: 'Become the employer of choice for healthcare professionals in our region', rationale: 'Everything depends on our people. Without stable workforce, nothing else works.' },
      { name: 'Financial Resilience', description: 'Build sustainable financial model despite flat government funding', rationale: 'Without financial health, we cannot invest in access or workforce.' },
    ],
    intents: [
      { statement: 'No patient travels more than 30 minutes for routine specialist care', driver: 'Access Expansion', rationale: 'Specific, measurable, and directly addresses the access gap. Bold but achievable with telemedicine.' },
      { statement: 'Staff describe Regional Health as "where I want to build my career"', driver: 'Workforce Stability', rationale: 'Uses staff voice. Focuses on retention and growth, not just recruitment.' },
      { statement: 'We achieve sustainable margins without compromising care quality', driver: 'Financial Resilience', rationale: 'Explicitly balances financial health with mission. No false trade-offs.' },
    ],
    commitments: [
      { name: 'Launch telemedicine platform for 5 specialties', horizon: 'H1', primaryDriver: 'Access Expansion', rationale: 'Immediate impact on access. Technology is proven. Start with highest-demand specialties.' },
      { name: 'Implement staff development and retention program', horizon: 'H1', primaryDriver: 'Workforce Stability', rationale: 'Can\'t wait - turnover is immediate crisis. Quick actions + long-term program.' },
      { name: 'Build rural clinic network (3 locations)', horizon: 'H2', primaryDriver: 'Access Expansion', rationale: 'Physical presence complements telemedicine. Serves patients who need in-person care.' },
      { name: 'Develop value-based care partnerships', horizon: 'H2', primaryDriver: 'Financial Resilience', rationale: 'Shifts from fee-for-service to outcomes. Better for patients and finances.' },
      { name: 'Explore AI-assisted diagnosis support', horizon: 'H3', primaryDriver: 'Access Expansion', rationale: 'Future technology bet. Could help generalists provide specialist-level care.' },
    ],
    keyLearnings: [
      'Vision focuses on patient outcomes, not organizational metrics like "be the leading provider."',
      'Values include trade-offs (Sustainable Excellence acknowledges we can\'t do everything perfectly).',
      'Workforce Stability is a driver, not just an enabler - recognizing its strategic importance.',
      'Commitments span H1-H3 appropriately: immediate actions, capability building, and future bets.',
    ],
  },
  {
    id: 'urban-edu',
    name: 'Urban Education Initiative',
    industry: 'Education / Nonprofit',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'A nonprofit providing after-school STEM programs to underserved urban communities.',
    context: 'The organization has proven program effectiveness (90% of participants improve math scores) but reaches only 500 students annually. Funding is inconsistent, dependent on grants. Staff are passionate but burned out. A recent evaluation shows waitlists of 2,000+ students.',
    vision: {
      statement: 'Every student in our city has access to the STEM education that opens doors',
      rationale: 'Focuses on the outcome (doors opening = opportunities) rather than just "more programs." Scoped to our city, making it achievable.',
    },
    values: [
      { name: 'Student-Centered', description: 'Every decision asks: does this benefit students? Programs adapt to student needs, not the reverse.' },
      { name: 'Evidence-Driven', description: 'We measure what matters and let data guide program design. No vanity metrics.' },
      { name: 'Sustainable Impact', description: 'We build programs that can scale and last, not flash-in-the-pan initiatives.' },
    ],
    drivers: [
      { name: 'Scalable Programs', description: 'Expand reach 10x without proportional cost increase', rationale: 'Waitlist of 2,000 students demands scale. Can\'t hire 4x more staff, need smarter model.' },
      { name: 'Sustainable Funding', description: 'Diversify revenue beyond grants to ensure long-term stability', rationale: 'Grant dependency creates boom-bust cycles. Need predictable, diverse revenue.' },
      { name: 'Staff Wellbeing', description: 'Prevent burnout while growing - sustainable pace for sustainable impact', rationale: 'Burned-out staff can\'t deliver quality. Growth that destroys team is not success.' },
    ],
    intents: [
      { statement: 'We serve 5,000 students annually with maintained or improved outcomes', driver: 'Scalable Programs', rationale: '10x scale with quality maintained. Specific number, measurable quality bar.' },
      { statement: 'No more than 30% of revenue comes from any single source', driver: 'Sustainable Funding', rationale: 'Diversification target. Reduces risk from any funder changes.' },
      { statement: 'Staff engagement scores exceed nonprofit benchmarks by 20%', driver: 'Staff Wellbeing', rationale: 'Measurable target using industry standards. Above average, not just "not burned out."' },
    ],
    commitments: [
      { name: 'Develop train-the-trainer curriculum', horizon: 'H1', primaryDriver: 'Scalable Programs', rationale: 'Enables partners/schools to deliver programs. Multiplier effect without proportional staff.' },
      { name: 'Launch corporate partnership program', horizon: 'H1', primaryDriver: 'Sustainable Funding', rationale: 'Immediate revenue diversification. Companies want STEM pipeline investment.' },
      { name: 'Implement 4-day work week pilot', horizon: 'H1', primaryDriver: 'Staff Wellbeing', rationale: 'Bold action on burnout. Evidence shows productivity maintains. Demonstrates values.' },
      { name: 'Build digital learning platform', horizon: 'H2', primaryDriver: 'Scalable Programs', rationale: 'Enables hybrid model. Reaches students in areas without physical presence.' },
      { name: 'Explore social enterprise revenue stream', horizon: 'H3', primaryDriver: 'Sustainable Funding', rationale: 'Long-term bet on earned revenue. Could provide sustainable unrestricted funds.' },
    ],
    keyLearnings: [
      'Staff Wellbeing as a strategic driver (not just "HR stuff") shows mature nonprofit thinking.',
      'The 4-day work week commitment is bold and demonstrates values-alignment.',
      'Intent uses specific numbers (5,000 students, 30% revenue cap) - measurable without being commitments.',
      'Train-the-trainer model enables scale through leverage, not just adding staff.',
    ],
  },
  {
    id: 'greenfuture',
    name: 'GreenFuture Manufacturing',
    industry: 'Manufacturing / Sustainability',
    icon: <Leaf className="w-6 h-6" />,
    description: 'A mid-size manufacturer transitioning to sustainable practices while maintaining competitiveness.',
    context: 'GreenFuture has strong customer relationships built over 30 years but faces pressure from customers demanding carbon-neutral suppliers. New competitors offer "green" alternatives at lower prices. The workforce has deep expertise in traditional manufacturing but limited sustainability knowledge.',
    vision: {
      statement: 'Sustainable manufacturing is the competitive advantage, not the compromise',
      rationale: 'Reframes sustainability from cost to advantage. Challenges the false trade-off between green and profitable.',
    },
    values: [
      { name: 'Long-Term Thinking', description: 'We make decisions for decades, not quarters. Sustainability is inherently long-term.' },
      { name: 'Innovation Through Constraint', description: 'Environmental limits drive creativity, not restrict it. Constraints breed innovation.' },
      { name: 'Honest Progress', description: 'We report real metrics, not greenwashing. Credibility over marketing.' },
    ],
    drivers: [
      { name: 'Carbon Transformation', description: 'Achieve carbon neutrality across operations and supply chain', rationale: 'Customer requirements are becoming non-negotiable. Early mover advantage over delayed competitors.' },
      { name: 'Circular Innovation', description: 'Design products and processes for circularity - zero waste, full lifecycle', rationale: 'Beyond carbon, circularity is the next frontier. Reduces costs and environmental impact.' },
      { name: 'Workforce Evolution', description: 'Transform existing workforce capabilities for sustainable manufacturing', rationale: 'Can\'t replace 30 years of expertise. Must build sustainability skills on manufacturing foundation.' },
    ],
    intents: [
      { statement: 'Customers choose us because our sustainability credentials are unmatched', driver: 'Carbon Transformation', rationale: 'Sustainability as competitive advantage, not compliance. Uses customer choice as measure.' },
      { statement: 'Our products are designed for complete recyclability or composting', driver: 'Circular Innovation', rationale: 'End-state vision for circular economy. Specific (recyclable/compostable), measurable.' },
      { statement: 'Every employee becomes a sustainability champion', driver: 'Workforce Evolution', rationale: 'Cultural transformation goal. "Champion" implies active contribution, not just compliance.' },
    ],
    commitments: [
      { name: 'Achieve Scope 1 & 2 carbon neutrality', horizon: 'H1', primaryDriver: 'Carbon Transformation', rationale: 'Direct emissions first. Establishes credibility for broader claims.' },
      { name: 'Launch sustainability training program for all staff', horizon: 'H1', primaryDriver: 'Workforce Evolution', rationale: 'Foundation for cultural change. Every employee, not just "sustainability team."' },
      { name: 'Redesign top 5 products for circularity', horizon: 'H2', primaryDriver: 'Circular Innovation', rationale: 'Start with highest-volume products. Learn before broader rollout.' },
      { name: 'Achieve Scope 3 carbon neutrality', horizon: 'H2', primaryDriver: 'Carbon Transformation', rationale: 'Supply chain emissions are harder. Requires supplier partnerships.' },
      { name: 'Develop bio-based material alternatives', horizon: 'H3', primaryDriver: 'Circular Innovation', rationale: 'R&D bet on next-generation materials. Could be industry breakthrough.' },
    ],
    keyLearnings: [
      'Vision reframes sustainability as advantage, not burden - powerful mindset shift.',
      'Scope 1&2 before Scope 3 shows realistic sequencing (direct emissions easier than supply chain).',
      'Workforce Evolution ensures transformation happens with existing people, not despite them.',
      'Circular Innovation goes beyond carbon to address broader environmental impact.',
    ],
  },
];

export default function ExampleGallery({ isOpen, onClose }: ExampleGalleryProps) {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'pyramid' | 'learnings'>('overview');

  const currentExample = selectedExample
    ? EXAMPLE_PYRAMIDS.find(e => e.id === selectedExample)
    : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-4 md:inset-8 lg:inset-12 bg-white rounded-xl shadow-2xl flex overflow-hidden">
        {/* Sidebar - Example List */}
        <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Example Gallery</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Learn from complete examples</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            {EXAMPLE_PYRAMIDS.map((example) => (
              <button
                key={example.id}
                onClick={() => {
                  setSelectedExample(example.id);
                  setActiveTab('overview');
                }}
                className={`w-full flex items-start gap-3 p-3 text-left rounded-lg mb-2 transition-colors ${
                  selectedExample === example.id
                    ? 'bg-purple-100 border border-purple-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className={`mt-0.5 ${selectedExample === example.id ? 'text-purple-600' : 'text-gray-400'}`}>
                  {example.icon}
                </span>
                <div>
                  <p className={`font-medium text-sm ${selectedExample === example.id ? 'text-purple-900' : 'text-gray-800'}`}>
                    {example.name}
                  </p>
                  <p className={`text-xs ${selectedExample === example.id ? 'text-purple-600' : 'text-gray-500'}`}>
                    {example.industry}
                  </p>
                </div>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 bg-purple-50">
            <p className="text-xs text-purple-700">
              <Lightbulb className="w-4 h-4 inline mr-1" />
              Click any example to explore its full strategy pyramid with rationale.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              {currentExample ? (
                <>
                  <div className="flex items-center gap-2">
                    {currentExample.icon}
                    <span className="font-semibold text-gray-900">{currentExample.name}</span>
                    <span className="text-sm text-gray-500">• {currentExample.industry}</span>
                  </div>
                </>
              ) : (
                <span className="text-gray-500">Select an example to explore</span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {currentExample ? (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview & Context
                </button>
                <button
                  onClick={() => setActiveTab('pyramid')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'pyramid'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Full Pyramid
                </button>
                <button
                  onClick={() => setActiveTab('learnings')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'learnings'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Key Learnings
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6 max-w-3xl">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Organization</h3>
                      <p className="text-gray-700">{currentExample.description}</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Strategic Context</h4>
                      <p className="text-sm text-blue-800">{currentExample.context}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Vision Statement</h3>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-lg font-medium text-purple-900 mb-3">"{currentExample.vision.statement}"</p>
                        <div className="flex gap-2">
                          <Lightbulb className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-purple-700">{currentExample.vision.rationale}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Values</h3>
                      <div className="grid gap-3">
                        {currentExample.values.map((value, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium text-gray-800">{value.name}</p>
                            <p className="text-sm text-gray-600 mt-1">{value.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'pyramid' && (
                  <div className="space-y-8 max-w-4xl">
                    {/* Strategic Drivers */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Strategic Drivers (3-5 focus areas)
                      </h3>
                      <div className="space-y-3">
                        {currentExample.drivers.map((driver, idx) => (
                          <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-semibold text-blue-900">{driver.name}</p>
                            <p className="text-sm text-blue-800 mt-1">{driver.description}</p>
                            <div className="flex gap-2 mt-2 pt-2 border-t border-blue-200">
                              <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-blue-700"><strong>Rationale:</strong> {driver.rationale}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strategic Intents */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-purple-600" />
                        Strategic Intents (bold aspirations)
                      </h3>
                      <div className="space-y-3">
                        {currentExample.intents.map((intent, idx) => (
                          <div key={idx} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="font-medium text-purple-900">"{intent.statement}"</p>
                            <p className="text-xs text-purple-600 mt-1">Supports: {intent.driver}</p>
                            <div className="flex gap-2 mt-2 pt-2 border-t border-purple-200">
                              <Lightbulb className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-purple-700"><strong>Rationale:</strong> {intent.rationale}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Iconic Commitments */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Iconic Commitments (concrete deliverables)
                      </h3>
                      <div className="space-y-3">
                        {currentExample.commitments.map((commitment, idx) => (
                          <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-start justify-between">
                              <p className="font-medium text-green-900">{commitment.name}</p>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                commitment.horizon === 'H1' ? 'bg-green-200 text-green-800' :
                                commitment.horizon === 'H2' ? 'bg-blue-200 text-blue-800' :
                                'bg-purple-200 text-purple-800'
                              }`}>
                                {commitment.horizon}
                              </span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">Primary Driver: {commitment.primaryDriver}</p>
                            <div className="flex gap-2 mt-2 pt-2 border-t border-green-200">
                              <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-green-700"><strong>Rationale:</strong> {commitment.rationale}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'learnings' && (
                  <div className="space-y-6 max-w-3xl">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Learnings from This Example</h3>
                      <p className="text-gray-600 mb-4">What makes this strategy effective? Here are the key patterns to notice:</p>
                    </div>

                    <div className="space-y-3">
                      {currentExample.keyLearnings.map((learning, idx) => (
                        <div key={idx} className="flex gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-800">{learning}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-gray-100 rounded-lg mt-6">
                      <h4 className="font-semibold text-gray-800 mb-2">Apply These Patterns</h4>
                      <p className="text-sm text-gray-600">
                        As you build your own pyramid, look for opportunities to apply these patterns:
                        limiting drivers to 3-5, using customer voice in intents, sequencing commitments
                        across horizons appropriately, and ensuring clear primary driver ownership.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select an example from the left to explore</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
