export interface Phase {
    name: string;
    components: string[];
    duration: string;
    completionDate: string;
    description: string;
    deliverables: string[];
  }
  
  export interface CompletePackage {
    name: string;
    description: string;
    price: number;
    benefits: string[];
  }
  
  export interface Pricing {
    completePackage: CompletePackage;
  }
  
  export interface Proposal {
    id: string;
    title: string;
    clientName: string;
    description: string;
    phases: Phase[];
    pricing: Pricing;
    nextSteps: string[];
  }