import { Proposal } from '../types/Proposal';

export const marketingProposal: Proposal = {
  id: '2025-GW-001',
  title: 'Digital Marketing Transformation Project',
  clientName: 'Gearwell',
  description: "Comprehensive digital marketing transformation project including discovery, strategy development, branding, marketing planning, asset creation, and campaign implementation - all designed to maximize your business growth and market positioning.",
  
  phases: [
    {
      name: 'Discovery',
      components: ['Client Scope Assessment', 'Client Intake Process'],
      duration: '1 week',
      completionDate: 'April 10, 2025',
      description: 'The foundation of our process, where we gather critical information about your business, goals, and challenges.',
      deliverables: [
        'Discovery Summary Report',
        'Project Objectives Document',
        'Current State Analysis'
      ]
    },
    {
      name: 'Strategy Development',
      components: ['Business Case Development', 'Technology Roadmap Planning'],
      duration: '2 weeks',
      completionDate: 'April 29, 2025',
      description: 'Translating discovery insights into actionable business and technology approaches.',
      deliverables: [
        'Comprehensive Business Strategy Document',
        'Technology Implementation Plan',
        'Investment Justification Analysis'
      ]
    },
    {
      name: 'Brand Strategy',
      components: ['Branding Workshop (3-hour collaborative session)', 'Brand Guidelines Creation', 'Brand Kit Development'],
      duration: '2 weeks',
      completionDate: 'May 13, 2025',
      description: 'Defining and articulating your unique market position and visual identity.',
      deliverables: [
        'Complete Brand Guidelines Document',
        'Visual Identity Package (logos, colors, typography)',
        'Brand Voice & Messaging Framework',
        'Implementation Guide'
      ]
    },
    {
      name: 'Marketing Strategy',
      components: [
        'Marketing Workshop (3-hour collaborative session)',
        'Target Audience Workshop (2-hour collaborative session)',
        'Customer Journey Workshop (2-hour collaborative session)'
      ],
      duration: '2 weeks',
      completionDate: 'May 27, 2025',
      description: 'Creating targeted approaches to reach and engage your ideal customers.',
      deliverables: [
        'Comprehensive Marketing Plan',
        'Audience Personas Document',
        'Customer Journey Maps',
        'Channel Strategy Recommendations',
        'Content Calendar Framework'
      ]
    },
    {
      name: 'Asset Development',
      components: ['Website Home + Landing Page Development', 'Print Media Materials Creation'],
      duration: '3 weeks',
      completionDate: 'June 17, 2025',
      description: 'Creating the essential digital and print materials to execute your strategy.',
      deliverables: [
        'Responsive Website Homepage',
        'Conversion-Optimized Landing Page',
        'Print Collateral Suite (brochures, business cards, etc.)',
        'Digital Asset Library'
      ]
    },
    {
      name: 'Campaign Development',
      components: ['Email Campaign Setup', 'SEO Implementation', 'PPC Campaign Setup', 'CRO (Conversion Rate Optimization)'],
      duration: '4 weeks',
      completionDate: 'July 15, 2025',
      description: 'Implementing targeted campaigns to drive awareness, engagement, and conversions.',
      deliverables: [
        'Email Templates & Automation Sequences',
        'SEO Optimization Report & Implementation',
        'Google Ads Campaign Structure',
        'Conversion Funnel Optimization'
      ]
    }
  ],
  
  pricing: {
    completePackage: {
      name: 'Complete Business Package',
      description: 'All services from Discovery through Campaign Development',
      price: 8900,
      benefits: [
        'Comprehensive Solution: Addresses all aspects of your digital marketing needs',
        'Integrated Approach: Each phase builds upon the previous, creating a cohesive strategy',
        'Simplified Management: Single point of contact for your entire project',
        'Consistent Vision: Maintains brand and strategic alignment across all deliverables',
        'Guaranteed Timeline: Committed completion by July 15, 2025',
        'Extended Support: 30 days of post-project support included'
      ]
    }
  },
  
  nextSteps: [
    'Review this proposal',
    'Schedule a Q&A call to address any questions',
    'Sign agreement and submit initial payment',
    'Kick off with Discovery Phase beginning April 7, 2025'
  ]
};