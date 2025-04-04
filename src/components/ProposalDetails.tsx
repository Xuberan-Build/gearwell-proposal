import React from 'react';
import { Proposal } from '../types/Proposal';

interface ProposalDetailsProps {
  proposal: Proposal;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal }) => {
  return (
    <div className="proposal-details">
      <div className="proposal-section">
        <h2>Project Description</h2>
        <p>{proposal.description}</p>
      </div>
      
      {proposal.scope && proposal.scope.length > 0 && (
        <div className="proposal-section">
          <h2>Scope of Work</h2>
          <ul>
            {proposal.scope.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      
      {proposal.timeline && (
        <div className="proposal-section">
          <h2>Timeline</h2>
          <p>{proposal.timeline}</p>
        </div>
      )}
      
      {proposal.cost !== undefined && (
        <div className="proposal-section">
          <h2>Investment</h2>
          <p>${proposal.cost.toLocaleString()}</p>
        </div>
      )}
      
      {proposal.terms && proposal.terms.length > 0 && (
        <div className="proposal-section">
          <h2>Terms & Conditions</h2>
          <ul>
            {proposal.terms.map((term: string, index: number) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProposalDetails;