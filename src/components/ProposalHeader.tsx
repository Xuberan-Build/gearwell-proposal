import React from 'react';

interface ProposalHeaderProps {
  title: string;
  clientName: string;
  id: string;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ title, clientName, id }) => {
  return (
    <div className="proposal-header">
      <h1>{title}</h1>
      <div className="proposal-info">
        <p><strong>Client:</strong> {clientName}</p>
        <p><strong>Proposal ID:</strong> {id}</p>
        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ProposalHeader;