'use client';

import React, { useState } from 'react';
import { X, BookOpen, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

interface TierGuideProps {
  isOpen: boolean;
  onClose: () => void;
  tierKey: string;
}

interface GuideSection {
  title: string;
  content: string;
  examples?: { good: string[]; avoid: string[] };
  pitfalls?: { name: string; description: string; solution: string }[];
  tips?: string[];
}

interface TierContent {
  name: string;
  keyInsight: string;
  description: string;
  sections: GuideSection[];
}

const TIER_GUIDES: Record<string, TierContent> = {
  vision: {
    name: 'Vision, Mission & Belief',
    keyInsight: 'Your purpose should inspire action and guide decisions',
    description: 'Tier 1 defines WHY your organization exists. These foundational statements should be aspirational yet grounded, specific yet inspiring.',
    sections: [
      {
        title: 'Types of Statements',
        content: 'You can have one or more of: Vision (aspirational future state), Mission (what you do and for whom), Belief (core conviction that drives you), or Passion (what energizes you).',
        examples: {
          good: [
            'Vision: "A world where healthcare is accessible to all, regardless of location or income"',
            'Mission: "We deliver telemedicine platforms that connect rural patients with specialist care"',
            'Belief: "Healthcare is a human right, not a privilege for the wealthy"'
          ],
          avoid: [
            '"Be the leading provider of innovative solutions" (vague, internal focus)',
            '"Maximize shareholder value" (uninspiring)',
            '"We exist to make a difference" (generic)'
          ]
        }
      },
      {
        title: 'Crafting Strong Statements',
        content: 'Focus on external outcomes, not internal capabilities. Paint a picture someone can imagine. Be specific about who you serve and how.',
        tips: [
          'If wildly successful in 10 years, what\'s different in the world?',
          'Complete: "We exist to [verb] for [specific people] so that [outcome]"',
          'What stance would explain your strategy to outsiders?'
        ]
      }
    ]
  },
  values: {
    name: 'Values',
    keyInsight: 'Values require trade-offs - what would you defend even when costly?',
    description: 'Values are principles that guide behavior and decisions. They should be specific to your organization, include trade-offs, and guide difficult decisions.',
    sections: [
      {
        title: 'What Makes Strong Values',
        content: 'Good values are specific (not generic platitudes), include what you sacrifice, and help decide between competing options.',
        examples: {
          good: [
            '"Speed Over Perfection" - We ship fast, learn fast. Trade-off: First versions may be rough.',
            '"Transparent by Default" - We share openly, even mistakes. Trade-off: Sometimes uncomfortable.',
            '"Customer Obsessed" - Customer feedback overrides opinions. Trade-off: Sometimes expensive.'
          ],
          avoid: [
            '"Excellence" (everyone values this - no trade-off)',
            '"Integrity" (too vague without specifics)',
            '"Innovation" (what do you give up to innovate?)'
          ]
        }
      },
      {
        title: 'How Many Values?',
        content: 'Aim for 4-6 values maximum. More than 6 becomes meaningless (can\'t remember or apply). Each should have a name, description, and explicit trade-off.',
        tips: [
          'What principles guide us in difficult decisions?',
          'What would we defend even if costly?',
          'When have we made decisions that surprised others?'
        ]
      }
    ]
  },
  behaviours: {
    name: 'Behaviours',
    keyInsight: 'Behaviours are observable actions - what would a fly on the wall see?',
    description: 'Behaviours demonstrate values in practice. They start with "We..." and describe specific, observable actions anyone can recognize.',
    sections: [
      {
        title: 'Observable Actions',
        content: 'Use the formula: "We [specific action that anyone can see]". Behaviours should be concrete enough to evaluate - did we do this or not?',
        examples: {
          good: [
            '"We share work-in-progress early and often, inviting feedback before perfecting"',
            '"We challenge decisions in meetings, not hallways"',
            '"We say \'no\' to good opportunities to say \'yes\' to great ones"'
          ],
          avoid: [
            '"We value collaboration" (that\'s a value, not behavior)',
            '"We strive for excellence" (aspiration, not observable)',
            '"We are innovative" (description, not action)'
          ]
        }
      },
      {
        title: 'Connecting to Values',
        content: 'Each behaviour should link to 1-3 values it demonstrates. Aim for 8-12 behaviours total (2-3 per value).',
        tips: [
          'How do our values show up in daily work?',
          'What do new employees notice about how we operate?',
          'When we\'re at our best, what are we doing?'
        ]
      }
    ]
  },
  drivers: {
    name: 'Strategic Drivers',
    keyInsight: 'Strategy is saying NO - if you have 7+ drivers, you have a to-do list, not strategy',
    description: 'Strategic Drivers are your 3-5 major focus areas that organize strategic efforts. They force hard prioritization and create actual strategy.',
    sections: [
      {
        title: 'The 3-5 Limit',
        content: 'This is deliberate and non-negotiable. More than 5 drivers means you haven\'t made real choices. Fewer creates focus and enables alignment.',
        examples: {
          good: [
            '"Customer Intimacy" - We compete on deep understanding, not price',
            '"Geographic Expansion" - We grow by entering adjacent markets',
            '"Operational Excellence" - We win through reliable, efficient delivery'
          ],
          avoid: [
            '"Improve Customer Satisfaction" (that\'s an intent or metric)',
            '"Sales and Marketing Excellence" (too broad - likely two drivers)',
            '"Digital Transformation" (vague buzzword without specifics)'
          ]
        },
        pitfalls: [
          {
            name: 'We Have 8 Strategic Drivers',
            description: 'Can\'t narrow to 3-5 drivers',
            solution: 'Force ranking: Which 3 matter MOST? "You only have budget for 3"'
          }
        ]
      },
      {
        title: 'Naming Drivers',
        content: 'Ideal structure: Adjective + Noun ("Customer Excellence") or Adverb + Verb ("Compete Differently"). Be specific enough to guide decisions.',
        tips: [
          'For every driver chosen, name what\'s NOT a driver',
          'What are we deliberately not focusing on?',
          'Which opportunities are we choosing not to pursue?'
        ]
      }
    ]
  },
  intents: {
    name: 'Strategic Intents',
    keyInsight: 'Intents are timeless aspirations - paint the picture of success, not the path to it',
    description: 'Strategic Intents are bold, aspirational statements of what success looks like for each driver. They are outcome-focused, not time-bound.',
    sections: [
      {
        title: 'What Makes Great Intents',
        content: 'Intents should be bold (stretching), timeless (no deadline), outcome-focused (not how), outside-in (customer perspective), and imaginable (can picture it).',
        examples: {
          good: [
            '"Our platform becomes the industry standard customers choose first"',
            '"Customers describe us as anticipating what I need before I ask"',
            '"We maintain 99.99% uptime even during peak demand"'
          ],
          avoid: [
            '"Improve customer satisfaction scores" (metric, not intent)',
            '"Build a world-class team" (capability, not outcome)',
            '"Increase NPS to 75 by Q4" (that\'s a commitment, not intent)'
          ]
        },
        pitfalls: [
          {
            name: 'Intents Sound Like Commitments',
            description: 'Intents have specific dates or metrics',
            solution: 'Remove dates from intents. Intents are "what success looks like", commitments are "what we\'ll deliver"'
          }
        ]
      },
      {
        title: 'Intent Count',
        content: 'Aim for 2-3 intents per strategic driver, giving 6-15 total. Each should use customer/market voice and paint a picture someone can imagine.',
        tips: [
          'What would customers say about us if we succeed?',
          'What does the end state look like?',
          'How would an outsider describe our success?'
        ]
      }
    ]
  },
  enablers: {
    name: 'Enablers',
    keyInsight: 'Enablers are load-bearing walls - strategy fails without them',
    description: 'Enablers are foundational capabilities, resources, or infrastructure that must exist for your strategy to work. They are cross-cutting and non-negotiable.',
    sections: [
      {
        title: 'What Makes an Enabler',
        content: 'Enablers are foundational (strategy can\'t work without them), cross-cutting (support multiple drivers), and capability-focused (what we need to have/be).',
        examples: {
          good: [
            '"Real-Time Data Platform" - Unified data warehouse powering insights across all systems',
            '"Customer Success Methodology" - Structured approach with playbooks and escalation paths',
            '"Cloud Infrastructure" - Scalable, reliable foundation for all digital services'
          ],
          avoid: [
            '"New website" (likely a commitment, not foundational)',
            '"Marketing strategy" (that\'s strategy itself)',
            'Every project or initiative (be selective)'
          ]
        }
      },
      {
        title: 'Categories',
        content: 'Enablers typically fall into: Technology/Systems, Process, People/Skills, Culture, or Partnerships. Aim for 4-8 total.',
        tips: [
          'What do multiple drivers depend on?',
          'What must exist before we can execute?',
          'What\'s the shared foundation?'
        ]
      }
    ]
  },
  commitments: {
    name: 'Iconic Commitments',
    keyInsight: 'One primary driver owns each commitment - "who loses most if this fails?"',
    description: 'Iconic Commitments are concrete, time-bound deliverables with clear ownership. They are the big visible moves that deliver on strategic intents.',
    sections: [
      {
        title: 'What Makes Strong Commitments',
        content: 'Commitments must be concrete (clear deliverable), time-bound (has target date and horizon), owned (ONE person/team), visible (big enough to matter), and measurable.',
        examples: {
          good: [
            '"Launch Mobile App 2.0 with Offline Mode" - H2, owned by Product Lead, target Q3',
            '"Establish 24/7 Support Center" - H1, owned by Support Lead, <30min response',
            '"Deploy AI Customer Insights Dashboard" - H1, owned by Data Team'
          ],
          avoid: [
            '"Improve customer satisfaction" (not concrete)',
            '"Digital transformation initiative" (vague)',
            '"Explore AI possibilities" (no deliverable)'
          ]
        },
        pitfalls: [
          {
            name: 'Everything Links to Every Driver',
            description: 'Commitments have 4+ secondary drivers',
            solution: 'Ask: "Who loses MOST if this fails?" That\'s your primary driver.'
          },
          {
            name: 'All Commitments Are H1',
            description: '80%+ commitments in near term',
            solution: 'Ask: "What happens in 18 months?" Force some H2/H3 strategic bets.'
          }
        ]
      },
      {
        title: 'Horizon Balance',
        content: 'Typical healthy distribution: 50% H1 (momentum), 30% H2 (building future), 20% H3 (exploring). Warning signs: 80%+ H1 or 0% H1.',
        tips: [
          'Every commitment needs ONE primary driver',
          'Target dates should be realistic for the horizon',
          'Include clear success criteria'
        ]
      }
    ]
  },
  team: {
    name: 'Team Objectives',
    keyInsight: 'Team objectives translate commitments into collective accountabilities',
    description: 'Team Objectives are goals that teams commit to in support of iconic commitments. They create clear line of sight from strategy to team work.',
    sections: [
      {
        title: 'Connecting to Commitments',
        content: 'Each team objective should link to a specific iconic commitment. They translate "what the organization will deliver" into "what the team will do".',
        examples: {
          good: [
            'Commitment: "Launch Mobile App 2.0" → Team: "Complete Offline Sync API"',
            'Commitment: "24/7 Support Center" → Team: "Hire and train APAC support team"',
            'Commitment: "AI Dashboard" → Team: "Build ML pipeline for customer segmentation"'
          ],
          avoid: [
            'Objectives without commitment linkage',
            'Individual tasks disguised as team objectives',
            'Business-as-usual work'
          ]
        }
      },
      {
        title: 'Team-Level Scope',
        content: 'Objectives should be team-sized (not individual tasks), measurable, and realistic for team capacity.',
        tips: [
          'Can the team deliver this collectively?',
          'Is there a clear metric for success?',
          'Does this advance a specific commitment?'
        ]
      }
    ]
  },
  individual: {
    name: 'Individual Objectives',
    keyInsight: 'Every person can trace their work back to vision',
    description: 'Individual Objectives connect personal work to team objectives and ultimately to strategy. They complete the "red thread" from vision to individual action.',
    sections: [
      {
        title: 'The Red Thread',
        content: 'Individual objectives should link to team objectives, creating traceability: Vision → Driver → Intent → Commitment → Team → Individual.',
        examples: {
          good: [
            'Team: "Complete Offline Sync API" → Individual: "Implement conflict resolution algorithm"',
            'Team: "Train APAC team" → Individual: "Create onboarding curriculum"',
            'Team: "ML pipeline" → Individual: "Build feature extraction module"'
          ],
          avoid: [
            'Objectives disconnected from team goals',
            'Generic job description items',
            'Too many objectives (focus on impact)'
          ]
        }
      },
      {
        title: 'Appropriate Scope',
        content: 'Individual objectives should be achievable by one person, include stretch/development, and have clear success criteria.',
        tips: [
          'Can this person deliver this alone?',
          'Is there growth opportunity here?',
          'Can we measure success?'
        ]
      }
    ]
  }
};

function CollapsibleSection({
  title,
  children,
  defaultOpen = true
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

export default function TierGuide({ isOpen, onClose, tierKey }: TierGuideProps) {
  const guide = TIER_GUIDES[tierKey];

  if (!isOpen || !guide) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
        style={{ animation: 'slideInRight 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">{guide.name} Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Key Insight */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-900">Key Insight</p>
                <p className="text-sm text-amber-800 mt-1">{guide.keyInsight}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm">{guide.description}</p>

          {/* Sections */}
          <div className="space-y-3">
            {guide.sections.map((section, index) => (
              <CollapsibleSection key={index} title={section.title} defaultOpen={index === 0}>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{section.content}</p>

                  {/* Examples */}
                  {section.examples && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Good examples</span>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {section.examples.good.map((example, i) => (
                            <li key={i} className="text-sm text-gray-600 list-disc">{example}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Avoid</span>
                        </div>
                        <ul className="space-y-1 ml-6">
                          {section.examples.avoid.map((example, i) => (
                            <li key={i} className="text-sm text-gray-500 list-disc">{example}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Pitfalls */}
                  {section.pitfalls && section.pitfalls.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">Common Pitfalls</p>
                      {section.pitfalls.map((pitfall, i) => (
                        <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3">
                          <p className="font-medium text-red-900 text-sm">{pitfall.name}</p>
                          <p className="text-xs text-red-700 mt-1">{pitfall.description}</p>
                          <p className="text-xs text-red-800 mt-2">
                            <span className="font-medium">Solution:</span> {pitfall.solution}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tips */}
                  {section.tips && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900 mb-2">Prompts to try</p>
                      <ul className="space-y-1">
                        {section.tips.map((tip, i) => (
                          <li key={i} className="text-xs text-blue-800 flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Content from Strategic Pyramid Framework methodology
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

// Export a button component for use in TierHeader
export function TierGuideButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
      title="Open methodology guide for this tier"
    >
      <BookOpen className="w-4 h-4" />
      <span>Guide</span>
    </button>
  );
}
