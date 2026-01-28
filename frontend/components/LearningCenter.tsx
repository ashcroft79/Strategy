'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronRight, BookOpen, Target, Layers, Play, CheckCircle, AlertTriangle, Lightbulb, Users, ArrowRight } from 'lucide-react';

interface LearningCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

type SectionId = 'overview' | 'step1' | 'step2';
type TopicId = string;

interface Topic {
  id: TopicId;
  title: string;
  content: React.ReactNode;
}

interface Section {
  id: SectionId;
  title: string;
  icon: React.ReactNode;
  description: string;
  topics: Topic[];
}

const SECTIONS: Section[] = [
  {
    id: 'overview',
    title: 'Framework Overview',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Understand why strategies fail and how this framework helps',
    topics: [
      {
        id: 'why-fail',
        title: 'Why Strategies Fail',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700">Based on extensive research and practical experience, strategies fail because of six key patterns:</p>

            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">1. Disconnection from reality</h4>
                  <p className="text-sm text-red-700">Strategy created in isolation from context</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">2. No forced choices</h4>
                  <p className="text-sm text-red-700">Everything is "strategic" so nothing is prioritized</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">3. Missing red thread</h4>
                  <p className="text-sm text-red-700">No clear line from vision to individual action</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">4. Static documents</h4>
                  <p className="text-sm text-red-700">No mechanism for learning and adaptation</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">5. Poor transparency</h4>
                  <p className="text-sm text-red-700">Different people see different pictures</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">6. Execution void</h4>
                  <p className="text-sm text-red-700">Gap between "what we'll do" and "who does what"</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">The Traditional Failure Pattern</h4>
              <div className="text-sm text-blue-800 space-y-1 font-mono">
                <p>Week 1-4: Leadership offsite → Beautiful strategy deck created</p>
                <p>Week 5-12: Strategy "communicated" → Slide decks distributed</p>
                <p>Month 3-6: Teams confused → "What does this mean for us?"</p>
                <p>Month 6+: Strategy forgotten → Deck in drawer, business as usual</p>
                <p>Year end: Repeat cycle → "Let's refresh our strategy"</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'success',
        title: 'What Success Looks Like',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700">A successful strategy achieves six key outcomes:</p>

            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Everyone understands WHY</h4>
                  <p className="text-sm text-green-700">Purpose and direction are clear to all</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Leadership has made HARD CHOICES</h4>
                  <p className="text-sm text-green-700">Focus areas are prioritized, not everything is "strategic"</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Clear RED THREAD</h4>
                  <p className="text-sm text-green-700">From purpose to individual contributions</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Regular LEARNING LOOPS</h4>
                  <p className="text-sm text-green-700">Inform adjustments based on reality</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">TRANSPARENT to all</h4>
                  <p className="text-sm text-green-700">Stakeholders see the same picture</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">LIVING DOCUMENT</h4>
                  <p className="text-sm text-green-700">Evolves with reality, not stuck in a drawer</p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'philosophy',
        title: 'Core Philosophy',
        content: (
          <div className="space-y-6">
            <p className="text-gray-700">Four foundational principles guide this framework:</p>

            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-semibold text-blue-900">1. Context Before Commitment</h4>
                <p className="text-sm text-blue-800 mt-1 italic">"Strategy without context is hope, not strategy."</p>
                <p className="text-sm text-blue-700 mt-2">Every strategy must start with explicit understanding of internal reality, external reality, stakeholder landscape, and strategic tensions.</p>
              </div>

              <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                <h4 className="font-semibold text-purple-900">2. Coherence Through Connection</h4>
                <p className="text-sm text-purple-800 mt-1 italic">"Every element must trace to vision and forward to action."</p>
                <p className="text-sm text-purple-700 mt-2">The "red thread" principle creates vertical alignment and prevents orphaned initiatives.</p>
              </div>

              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <h4 className="font-semibold text-orange-900">3. Choices Over Wishes</h4>
                <p className="text-sm text-orange-800 mt-1 italic">"Strategy is as much about what we DON'T do as what we do."</p>
                <p className="text-sm text-orange-700 mt-2">Real strategy requires limiting drivers to 3-5, assigning primary ownership, explicit trade-offs, and horizon planning.</p>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50">
                <h4 className="font-semibold text-green-900">4. Living Over Static</h4>
                <p className="text-sm text-green-800 mt-1 italic">"Strategy is not a document, it's a practice."</p>
                <p className="text-sm text-green-700 mt-2">Strategy must adapt based on learning, respond to context shifts, evolve as we execute, and incorporate feedback continuously.</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'three-steps',
        title: 'The Three-Step Framework',
        content: (
          <div className="space-y-6">
            <p className="text-gray-700">The Strategic Pyramid Framework follows three interconnected steps:</p>

            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <h4 className="font-semibold text-teal-900">UNDERSTAND: Context & Discovery</h4>
                </div>
                <p className="text-sm text-teal-700 mb-2">Ground strategy in reality. Build shared understanding. Surface tensions and opportunities.</p>
                <p className="text-xs text-teal-600"><strong>Duration:</strong> 1-2 weeks (lightweight) to 4-6 weeks (comprehensive)</p>
                <p className="text-xs text-teal-600"><strong>Output:</strong> Context document + Prioritized opportunities</p>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <h4 className="font-semibold text-indigo-900">DEFINE: Strategy & Plan</h4>
                </div>
                <p className="text-sm text-indigo-700 mb-2">Make clear choices. Build coherent pyramid (9 tiers). Create red thread traceability.</p>
                <p className="text-xs text-indigo-600"><strong>Duration:</strong> 2-4 weeks (lightweight) to 8-12 weeks (comprehensive)</p>
                <p className="text-xs text-indigo-600"><strong>Output:</strong> Complete strategy with execution plan</p>
              </div>

              <div className="flex justify-center">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <h4 className="font-semibold text-amber-900">ADAPT: Living Execution</h4>
                </div>
                <p className="text-sm text-amber-700 mb-2">Monitor progress and context shifts. Learn from execution. Adjust based on evidence.</p>
                <p className="text-xs text-amber-600"><strong>Duration:</strong> Ongoing, continuous</p>
                <p className="text-xs text-amber-600"><strong>Output:</strong> Evolving strategy + Learning journal</p>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 'step1',
    title: 'Step 1: Context & Discovery',
    icon: <Target className="w-5 h-5" />,
    description: 'Understanding reality before building strategy',
    topics: [
      {
        id: 'why-context',
        title: 'Why Context Matters',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">Strategy without context is hope, not strategy.</p>
            <p className="text-gray-600">Before you can decide where to go, you must understand where you are. Before you can choose what to do, you must understand what's true.</p>

            <h4 className="font-semibold text-gray-800 mt-4">What Happens When You Skip Context</h4>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-800">Pattern 1: "The Vision Without Market"</h5>
                <p className="text-sm text-gray-600">Leadership created an inspiring vision based on belief, but there was no market demand or customer need identified. Result: Beautiful strategy, zero traction, wasted resources.</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-800">Pattern 2: "The Strategy Ignoring Constraints"</h5>
                <p className="text-sm text-gray-600">Ambitious 12-month commitments were defined, but the team was at 80% capacity with no budget for new hires. Result: Burnout, missed deadlines, loss of credibility.</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-800">Pattern 3: "The Opportunity We Can't Deliver"</h5>
                <p className="text-sm text-gray-600">An exciting market opportunity was identified, but there was no technical capability and 2+ years to build it. Result: Competitor seized opportunity while we arrived too late.</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">The Power of Starting with Context</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Grounded Vision:</strong> Vision connects to real needs/opportunities</li>
                <li>• <strong>Realistic Planning:</strong> Constraints inform what's actually possible</li>
                <li>• <strong>Faster Execution:</strong> Fewer surprises, less rework</li>
                <li>• <strong>Better Decisions:</strong> Trade-offs based on reality, not opinions</li>
                <li>• <strong>Team Alignment:</strong> Shared understanding prevents misalignment</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'socc',
        title: 'The SOCC Framework',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700"><strong>SOCC</strong> = Strengths, Opportunities, Considerations, Constraints</p>
            <p className="text-gray-600">This is our innovation on traditional SWOT analysis, designed to be more actionable and interconnected.</p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800">STRENGTHS</h4>
                <p className="text-xs text-green-600 mb-2">Internal, Positive → AMPLIFIERS</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• What we're good at</li>
                  <li>• What assets we have</li>
                  <li>• What's working</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800">OPPORTUNITIES</h4>
                <p className="text-xs text-blue-600 mb-2">External, Positive → FOCUS AREAS</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• What needs exist</li>
                  <li>• What's changing</li>
                  <li>• Where is white space</li>
                </ul>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800">CONSIDERATIONS</h4>
                <p className="text-xs text-orange-600 mb-2">Mixed, Threats → TURBULENCE</p>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• What's working against us</li>
                  <li>• External threats</li>
                  <li>• Weakening areas</li>
                </ul>
              </div>

              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800">CONSTRAINTS</h4>
                <p className="text-xs text-red-600 mb-2">Internal, Blockers → CIRCUMVENTION</p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• What's stopping us</li>
                  <li>• Resource limitations</li>
                  <li>• "Yes, but..." factors</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">How the Quadrants Interact</h4>
              <div className="text-sm text-purple-700 font-mono space-y-1">
                <p>OPPORTUNITY: "Enter adjacent market"</p>
                <p className="pl-4">↑ amplified by STRENGTH: "Strong brand"</p>
                <p className="pl-4">↓ complicated by CONSIDERATION: "Competitors"</p>
                <p className="pl-4">↓ blocked by CONSTRAINT: "Limited sales capacity"</p>
                <p className="mt-2 font-sans">→ <strong>INSIGHT:</strong> High potential but requires sales expansion</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'opportunity-scoring',
        title: 'Opportunity Scoring',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700">Not all opportunities are equal. Use this scoring formula to prioritize:</p>

            <div className="p-4 bg-gray-100 rounded-lg font-mono text-sm">
              <p className="font-bold text-gray-800">SCORE = (Strength Match × 2) - Consideration Risk - Constraint Impact</p>
              <p className="text-gray-600 mt-2">Where each factor is rated 1-5</p>
              <p className="text-gray-600">Score Range: -8 to +8</p>
            </div>

            <h4 className="font-semibold text-gray-800 mt-4">Score Interpretation</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-green-100 rounded">
                <span className="font-bold text-green-700 w-12">7-10</span>
                <span className="text-green-800">High-confidence opportunity → Prioritize, pursue soon</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-blue-100 rounded">
                <span className="font-bold text-blue-700 w-12">4-6</span>
                <span className="text-blue-800">Moderate opportunity → Pursue with risk mitigation</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-orange-100 rounded">
                <span className="font-bold text-orange-700 w-12">1-3</span>
                <span className="text-orange-800">Marginal opportunity → Requires changes first</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-red-100 rounded">
                <span className="font-bold text-red-700 w-12">≤0</span>
                <span className="text-red-800">Low-viability opportunity → Defer or decline</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'tensions',
        title: 'Strategic Tensions',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700"><strong>Strategic tensions</strong> are competing goods or conflicting priorities that require deliberate choices. They're not problems to solve - they're <strong>tensions to manage</strong>.</p>

            <h4 className="font-semibold text-gray-800 mt-4">Common Strategic Tensions</h4>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Growth</span>
                  <span className="text-gray-400">vs.</span>
                  <span className="font-medium">Profitability</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Invest in growth or optimize for profit?</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Innovation</span>
                  <span className="text-gray-400">vs.</span>
                  <span className="font-medium">Execution</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Explore new ideas or deliver on commitments?</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Speed</span>
                  <span className="text-gray-400">vs.</span>
                  <span className="font-medium">Quality</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Ship fast and iterate or perfect before launch?</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Breadth</span>
                  <span className="text-gray-400">vs.</span>
                  <span className="font-medium">Depth</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Serve many customer types or specialize?</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Centralization</span>
                  <span className="text-gray-400">vs.</span>
                  <span className="font-medium">Autonomy</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Central control or local empowerment?</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Why Name Tensions Explicitly</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Normalizes difficulty:</strong> "This is supposed to be hard"</li>
                <li>• <strong>Prevents false consensus:</strong> Different people have different defaults</li>
                <li>• <strong>Enables smart trade-offs:</strong> Conscious choices, not accidents</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'stakeholders',
        title: 'Stakeholder Landscape',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700">Strategy doesn't exist in a vacuum - it affects and is affected by stakeholders.</p>

            <h4 className="font-semibold text-gray-800 mt-4">Stakeholder Mapping</h4>
            <p className="text-sm text-gray-600 mb-3">Map stakeholders by their interest and influence:</p>

            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div className="p-3 bg-orange-100 rounded-lg border-2 border-orange-300">
                <p className="font-semibold text-orange-800">Keep Satisfied</p>
                <p className="text-xs text-orange-600">Low Interest, High Influence</p>
                <p className="text-xs text-orange-700 mt-1">Don't alienate</p>
              </div>

              <div className="p-3 bg-green-100 rounded-lg border-2 border-green-400">
                <p className="font-semibold text-green-800">Key Players</p>
                <p className="text-xs text-green-600">High Interest, High Influence</p>
                <p className="text-xs text-green-700 mt-1">Engage closely</p>
              </div>

              <div className="p-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                <p className="font-semibold text-gray-700">Monitor</p>
                <p className="text-xs text-gray-500">Low Interest, Low Influence</p>
                <p className="text-xs text-gray-600 mt-1">Minimal effort</p>
              </div>

              <div className="p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
                <p className="font-semibold text-blue-800">Keep Informed</p>
                <p className="text-xs text-blue-600">High Interest, Low Influence</p>
                <p className="text-xs text-blue-700 mt-1">Communicate regularly</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">For Each Key Stakeholder, Understand:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• What do they need from us?</li>
                <li>• What do they value most?</li>
                <li>• What are their concerns?</li>
                <li>• How aligned are they currently?</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'context-pitfalls',
        title: 'Common Pitfalls',
        content: (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800">Analysis Paralysis</h4>
              <p className="text-sm text-red-700 mt-1">Wanting more data before deciding. Endless debate about details.</p>
              <p className="text-sm text-red-600 mt-2"><strong>Solution:</strong> Timebox it. "We have 2 weeks, then we move forward." 80% confidence is sufficient.</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800">Toxic Positivity</h4>
              <p className="text-sm text-orange-700 mt-1">Everything is a strength. No real constraints acknowledged.</p>
              <p className="text-sm text-orange-600 mt-2"><strong>Solution:</strong> Frame it as "obstacles to remove." Great organizations acknowledge constraints.</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800">Learned Helplessness</h4>
              <p className="text-sm text-yellow-700 mt-1">Everything is a constraint. No opportunities visible.</p>
              <p className="text-sm text-yellow-600 mt-2"><strong>Solution:</strong> Start with strengths: "What IS working?" Focus on small wins.</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800">The Usual Suspects</h4>
              <p className="text-sm text-purple-700 mt-1">Same context from last year. No new insights.</p>
              <p className="text-sm text-purple-600 mt-2"><strong>Solution:</strong> Fresh voices. Customer input. What does data show that surprises us?</p>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
              <h4 className="font-semibold text-gray-800">Context as Checkbox</h4>
              <p className="text-sm text-gray-700 mt-1">Rushing through context to get to "real work."</p>
              <p className="text-sm text-gray-600 mt-2"><strong>Solution:</strong> Show value: "This saved us 3 months of wasted effort last time."</p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 'step2',
    title: 'Step 2: Strategy & Plan',
    icon: <Layers className="w-5 h-5" />,
    description: 'Building coherent strategy from vision to action',
    topics: [
      {
        id: '9-tier',
        title: 'The 9-Tier Architecture',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700">The Strategic Pyramid consists of 9 tiers organized into three sections:</p>

            <div className="space-y-4 mt-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Section 1: PURPOSE (The Why)</h4>
                <p className="text-xs text-blue-600 mb-2">Changes rarely (years) • Led by leadership</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li><strong>Tier 1:</strong> Vision / Mission / Belief / Passion</li>
                  <li><strong>Tier 2:</strong> Values</li>
                  <li><strong>Tier 3:</strong> Behaviours</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Section 2: STRATEGIC CORE (How We Win)</h4>
                <p className="text-xs text-purple-600 mb-2">Changes periodically (annually) • Leadership with input</p>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li><strong>Tier 4:</strong> Strategic Drivers (3-5 maximum)</li>
                  <li><strong>Tier 5:</strong> Strategic Intents (2-3 per driver)</li>
                  <li><strong>Tier 6:</strong> Enablers</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Section 3: EXECUTION (What We Do)</h4>
                <p className="text-xs text-green-600 mb-2">Changes regularly (quarterly) • Everyone participates</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li><strong>Tier 7:</strong> Iconic Commitments (H1/H2/H3)</li>
                  <li><strong>Tier 8:</strong> Team/Collective Objectives</li>
                  <li><strong>Tier 9:</strong> Individual Objectives/Contributions</li>
                </ul>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'purpose-tiers',
        title: 'Purpose Tiers (1-3)',
        content: (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Tier 1: Vision / Mission / Belief</h4>

            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-800">VISION</h5>
                <p className="text-sm text-blue-700">Aspirational future state. External focus.</p>
                <p className="text-xs text-green-600 mt-1">✓ "Healthcare accessible to all, regardless of location"</p>
                <p className="text-xs text-red-600">✗ "Be the leading provider of innovative solutions"</p>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <h5 className="font-medium text-purple-800">MISSION</h5>
                <p className="text-sm text-purple-700">What you do and for whom. Concrete and actionable.</p>
                <p className="text-xs text-green-600 mt-1">✓ "We deliver telemedicine platforms that connect rural patients with specialists"</p>
                <p className="text-xs text-red-600">✗ "We provide innovative solutions to customers"</p>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg">
                <h5 className="font-medium text-orange-800">BELIEF</h5>
                <p className="text-sm text-orange-700">Core conviction that's debatable. Not universal truth.</p>
                <p className="text-xs text-green-600 mt-1">✓ "Healthcare is a human right, not a privilege"</p>
                <p className="text-xs text-red-600">✗ "We believe in excellence and innovation"</p>
              </div>
            </div>

            <h4 className="font-semibold text-gray-800 mt-6">Tier 2: Values</h4>
            <p className="text-sm text-gray-600">Principles you'll defend even when inconvenient. 4-6 maximum.</p>
            <div className="p-3 bg-gray-50 rounded-lg mt-2">
              <p className="text-sm font-medium">"Speed Over Perfection"</p>
              <p className="text-xs text-gray-600">We ship fast, learn fast, and iterate. A working prototype beats a perfect plan.</p>
              <p className="text-xs text-gray-500 italic">Trade-off: First versions may be rough and need refinement.</p>
            </div>

            <h4 className="font-semibold text-gray-800 mt-6">Tier 3: Behaviours</h4>
            <p className="text-sm text-gray-600">Observable actions that demonstrate values. 8-12 total.</p>
            <div className="p-3 bg-gray-50 rounded-lg mt-2">
              <p className="text-xs text-green-600">✓ "We share work-in-progress early, inviting feedback before perfecting"</p>
              <p className="text-xs text-red-600">✗ "We value collaboration" (that's a value, not a behavior)</p>
            </div>
          </div>
        ),
      },
      {
        id: 'strategic-core',
        title: 'Strategic Core Tiers (4-6)',
        content: (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Tier 4: Strategic Drivers</h4>
            <p className="text-sm text-gray-600">3-5 major focus areas that organize strategic efforts. <strong>Not negotiable - forces hard prioritization.</strong></p>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">"Customer Intimacy"</p>
              <p className="text-xs text-green-700">We compete on deep understanding of customer needs and personalized service, not on price.</p>
              <p className="text-xs text-green-600 mt-1">Context: Capitalizes on strong relationships (strength) + competitors focus on product (opportunity)</p>
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200 mt-2">
              <p className="text-sm text-red-700"><strong>If you have 7-10 "drivers":</strong> You don't have a strategy, you have a to-do list.</p>
            </div>

            <h4 className="font-semibold text-gray-800 mt-6">Tier 5: Strategic Intents</h4>
            <p className="text-sm text-gray-600">Bold, aspirational statements of what success looks like. 2-3 per driver.</p>

            <div className="p-3 bg-blue-50 rounded-lg mt-2">
              <p className="text-sm font-medium text-blue-800">"Customers describe us as 'anticipating what I need before I ask'"</p>
              <p className="text-xs text-blue-700">Bold, timeless, outcome-focused, outside-in perspective</p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 mt-2">
              <p className="text-sm text-yellow-800"><strong>Intent vs. Commitment:</strong></p>
              <p className="text-xs text-yellow-700">Intent: "Customers describe us as anticipating needs" (timeless aspiration)</p>
              <p className="text-xs text-yellow-700">Commitment: "Launch predictive recommendations engine Q2" (time-bound)</p>
            </div>

            <h4 className="font-semibold text-gray-800 mt-6">Tier 6: Enablers</h4>
            <p className="text-sm text-gray-600">Foundational capabilities that must exist. 4-8 total. Cross-cutting and non-negotiable.</p>

            <div className="p-3 bg-purple-50 rounded-lg mt-2">
              <p className="text-sm font-medium text-purple-800">"Real-Time Data Platform"</p>
              <p className="text-xs text-purple-700">Unified data warehouse with real-time analytics, powering customer insights and operational dashboards.</p>
              <p className="text-xs text-purple-600 mt-1">Supports: Customer Intimacy, Operational Resilience, Geographic Expansion</p>
            </div>
          </div>
        ),
      },
      {
        id: 'execution-tiers',
        title: 'Execution Tiers (7-9)',
        content: (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Tier 7: Iconic Commitments</h4>
            <p className="text-sm text-gray-600">Concrete, time-bound deliverables with clear ownership. Big visible moves.</p>

            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">"Launch Mobile App 2.0 with Offline-First Architecture"</p>
              <p className="text-xs text-green-700">Horizon: H2 | Owner: Sarah Chen | Target: Q3 2026</p>
              <p className="text-xs text-green-600 mt-1">Primary Driver: Customer Intimacy | Secondary: Operational Resilience</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4">
              <h5 className="font-medium text-blue-800">Horizon Framework</h5>
              <div className="space-y-2 mt-2 text-sm">
                <p><strong className="text-blue-700">H1 (0-12 months):</strong> <span className="text-blue-600">Optimize & Deliver - Near-term wins</span></p>
                <p><strong className="text-blue-700">H2 (1-2 years):</strong> <span className="text-blue-600">Build & Scale - Mid-term transformations</span></p>
                <p><strong className="text-blue-700">H3 (2-3 years):</strong> <span className="text-blue-600">Explore & Create - Long-term strategic bets</span></p>
              </div>
              <p className="text-xs text-blue-600 mt-2">Typical balance: 50% H1, 30% H2, 20% H3</p>
            </div>

            <h4 className="font-semibold text-gray-800 mt-6">Tier 8: Team Objectives</h4>
            <p className="text-sm text-gray-600">Goals that functional teams commit to in support of iconic commitments.</p>

            <div className="p-3 bg-gray-50 rounded-lg mt-2 text-sm">
              <p>Commitment: "Launch Mobile App 2.0"</p>
              <p className="pl-4">↳ Team Objective (Backend): "Complete Offline Sync API"</p>
            </div>

            <h4 className="font-semibold text-gray-800 mt-6">Tier 9: Individual Objectives</h4>
            <p className="text-sm text-gray-600">Personal goals connecting individual work to team objectives and strategy.</p>

            <div className="p-3 bg-gray-50 rounded-lg mt-2 text-sm">
              <p>Team Objective: "Complete Offline Sync API"</p>
              <p className="pl-4">↳ Individual (Jamie): "Implement Conflict Resolution Algorithm"</p>
            </div>
          </div>
        ),
      },
      {
        id: 'red-thread',
        title: 'Red Thread Methodology',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700">The <strong>red thread</strong> is the causal connection from vision all the way to individual actions. It answers: "Why am I doing this work?"</p>

            <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm space-y-1 border border-gray-200">
              <p><strong>Vision:</strong> "Healthcare accessible to all"</p>
              <p className="pl-4 text-gray-500">↓ why?</p>
              <p className="pl-4"><strong>Driver:</strong> "Geographic Expansion"</p>
              <p className="pl-8 text-gray-500">↓ what does success look like?</p>
              <p className="pl-8"><strong>Intent:</strong> "Rural communities have same access as urban"</p>
              <p className="pl-12 text-gray-500">↓ what will we deliver?</p>
              <p className="pl-12"><strong>Commitment:</strong> "Launch telemedicine platform"</p>
              <p className="pl-16 text-gray-500">↓ what must the team do?</p>
              <p className="pl-16"><strong>Team:</strong> "Build HIPAA-compliant video infrastructure"</p>
              <p className="pl-20 text-gray-500">↓ what's my part?</p>
              <p className="pl-20"><strong>Individual:</strong> "Implement end-to-end encryption"</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-4">
              <h4 className="font-medium text-green-800 mb-2">Red Thread Validation Questions</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Can I draw a line from any individual objective to vision?</li>
                <li>• Are there orphaned items (no parent)?</li>
                <li>• Are there gaps (nothing delivering on an intent)?</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'horizon-planning',
        title: 'Horizon Planning',
        content: (
          <div className="space-y-4">
            <p className="text-gray-700">Strategic commitments are organized by time horizon to ensure balanced investment:</p>

            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800">H1 (0-12 months): Optimize & Deliver</h4>
                <p className="text-sm text-green-700 mt-1">Focus: Execute on known opportunities</p>
                <p className="text-sm text-green-600">Risk: Low to moderate | Investment: Maintain and improve</p>
                <p className="text-xs text-green-600 mt-2">Examples: Iterative improvements, proven features, operational excellence</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800">H2 (1-2 years): Build & Scale</h4>
                <p className="text-sm text-blue-700 mt-1">Focus: Build new capabilities and scale</p>
                <p className="text-sm text-blue-600">Risk: Moderate | Investment: Build for future</p>
                <p className="text-xs text-blue-600 mt-2">Examples: New products, market expansion, capability building</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800">H3 (2-3 years): Explore & Create</h4>
                <p className="text-sm text-purple-700 mt-1">Focus: Explore and experiment</p>
                <p className="text-sm text-purple-600">Risk: High | Investment: Strategic bets</p>
                <p className="text-xs text-purple-600 mt-2">Examples: Moonshots, unproven concepts, future positioning</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 mt-4">
              <h4 className="font-medium text-orange-800 mb-2">Warning Signs</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• <strong>80%+ H1:</strong> Short-term focus, no future building</li>
                <li>• <strong>0% H1:</strong> No near-term momentum</li>
                <li>• <strong>70%+ H3:</strong> Unrealistic, not grounded</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        id: 'challenges',
        title: 'Common Challenges',
        content: (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800">"We Have 8 Strategic Drivers"</h4>
              <p className="text-sm text-red-700 mt-1">Can't narrow to 3-5 drivers. Avoiding hard choices.</p>
              <p className="text-sm text-red-600 mt-2"><strong>Solution:</strong> Force ranking: "Which 3 matter MOST?" Resource constraint: "You only have budget for 3."</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800">"Everything Links to Every Driver"</h4>
              <p className="text-sm text-orange-700 mt-1">Commitments have 4-5 secondary drivers. Avoiding ownership.</p>
              <p className="text-sm text-orange-600 mt-2"><strong>Solution:</strong> Ask: "Who loses MOST if this fails?" That's your primary driver.</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800">"All Our Commitments Are H1"</h4>
              <p className="text-sm text-yellow-700 mt-1">80%+ commitments in near term. Short-term pressure.</p>
              <p className="text-sm text-yellow-600 mt-2"><strong>Solution:</strong> Show imbalance visually. Ask: "What happens in 18 months?"</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800">"Our Intents Sound Like Commitments"</h4>
              <p className="text-sm text-purple-700 mt-1">Intents have dates, are too concrete.</p>
              <p className="text-sm text-purple-600 mt-2"><strong>Solution:</strong> Remove dates from intents. Ask: "What's the picture of success?" (not "what will we do")</p>
            </div>
          </div>
        ),
      },
    ],
  },
];

export default function LearningCenter({ isOpen, onClose }: LearningCenterProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [activeTopic, setActiveTopic] = useState<TopicId>('why-fail');
  const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(new Set(['overview']));

  const toggleSection = (sectionId: SectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const selectTopic = (sectionId: SectionId, topicId: TopicId) => {
    setActiveSection(sectionId);
    setActiveTopic(topicId);
    if (!expandedSections.has(sectionId)) {
      setExpandedSections(new Set([...expandedSections, sectionId]));
    }
  };

  const currentSection = SECTIONS.find(s => s.id === activeSection);
  const currentTopic = currentSection?.topics.find(t => t.id === activeTopic);

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
        {/* Sidebar Navigation */}
        <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Learning Center</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Strategic Pyramid Methodology</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-3">
            {SECTIONS.map((section) => (
              <div key={section.id} className="mb-2">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className={`transition-transform ${expandedSections.has(section.id) ? 'rotate-90' : ''}`}>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </span>
                  <span className="text-gray-600">{section.icon}</span>
                  <span className="font-medium text-gray-800 text-sm">{section.title}</span>
                </button>

                {expandedSections.has(section.id) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {section.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => selectTopic(section.id, topic.id)}
                        className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                          activeSection === section.id && activeTopic === topic.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {topic.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {currentSection?.icon}
                <span>{currentSection?.title}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-1">{currentTopic?.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentTopic?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
