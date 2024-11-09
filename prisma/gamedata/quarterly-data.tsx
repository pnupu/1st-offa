import React from 'react';

const QuarterlyFinancialReport: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>Quarterly Financial Report</h1>
      <h2>For the Quarter Ending September 30, 2024</h2>

      <h3>1. Revenue</h3>
      <div>
        <strong>Product Sales</strong>
        <p>$1,250,000</p>
        <strong>Service Revenue</strong>
        <p>$550,000</p>
        <strong>Other Income</strong>
        <p>$80,000</p>
        <strong>Total Revenue</strong>
        <p><strong>$1,880,000</strong></p>
      </div>

      <h3>2. Expenses</h3>
      <div>
        <strong>Cost of Goods Sold</strong>
        <p>$780,000</p>
        <strong>Employee Salaries and Benefits</strong>
        <p>$450,000</p>
        <strong>Rent and Utilities</strong>
        <p>$120,000</p>
        <strong>Marketing and Advertising</strong>
        <p>$75,000</p>
        <strong>Research and Development</strong>
        <p>$90,000</p>
        <strong>Administrative Expenses</strong>
        <p>$60,000</p>
        <strong>Total Expenses</strong>
        <p><strong>$1,575,000</strong></p>
      </div>

      <h3>3. Net Income</h3>
      <div>
        <strong>Total Revenue</strong>
        <p>$1,880,000</p>
        <strong>Minus: Total Expenses</strong>
        <p>-$1,575,000</p>
        <strong>Net Income</strong>
        <p><strong>$305,000</strong></p>
      </div>

      <h3>4. Key Financial Ratios</h3>
      <div>
        <strong>Gross Profit Margin</strong>
        <p>58.5%</p>
        <strong>Net Profit Margin</strong>
        <p>16.2%</p>
        <strong>Operating Expense Ratio</strong>
        <p>21.4%</p>
        <strong>Current Ratio</strong>
        <p>1.5</p>
      </div>

      <p><i>Prepared by the Finance Team, Company Name, November 2024</i></p>
    </div>
  );
};

export default QuarterlyFinancialReport;
