import React from 'react';
import Invoice from './Invoice';

const App = () => {
  const invoiceDetails = {
    projectCode: 'PRJ5678',
    projectName: 'Company Website Revamp',
    invoiceNumber: 'INV-2023-4Q-PRJ5678',
    invoiceDate: 'November 9, 2023',
    dueDate: 'November 23, 2023',
    billedTo: {
      company: 'XYZ Solutions',
      address: '123 Business St., Suite 100, New York, NY 10001, USA'
    },
    billedFrom: {
      company: 'ABC Corp.',
      address: '456 Corporate Blvd., Suite 201, San Francisco, CA 94105, USA'
    },
    items: [
      { description: 'Website Revamp (Design Phase)', quantity: '50 hours', unitPrice: '$150/hr', total: '$7,500.00' },
      { description: 'Content Creation and SEO Optimization', quantity: '30 hours', unitPrice: '$125/hr', total: '$3,750.00' },
      { description: 'Backend Development', quantity: '60 hours', unitPrice: '$180/hr', total: '$10,800.00' },
      { description: 'User Testing and QA', quantity: '40 hours', unitPrice: '$140/hr', total: '$5,600.00' },
      { description: 'Ongoing Maintenance (Quarterly)', quantity: '1 quarter', unitPrice: '$2,000', total: '$2,000.00' }
    ],
    total: '$29,650.00',
    paymentInstructions: {
      bankName: 'Bank of America',
      accountName: 'ABC Corp.',
      accountNumber: '123456789',
      routingNumber: '987654321',
      swiftCode: 'BOFAUS3N'
    },
    contactEmail: 'accounts@abccorp.com'
  };

  return (
    <div>
      <Invoice {...invoiceDetails} />
    </div>
  );
};

export default App;
