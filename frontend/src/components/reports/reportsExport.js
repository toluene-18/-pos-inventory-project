/**
 * Utility functions for exporting reports in CSV and formatted PDF printable formats.
 */

export function exportReportToCsv(filename, headers, rows) {
  const sanitize = cell => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [
    headers.map(sanitize).join(','),
    ...rows.map(row => row.map(sanitize).join(',')),
  ];

  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportReportToPdf(title, subtitle, headers, rows, summaryStats = []) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const summaryHtml = summaryStats.length
    ? `<div class="summary-grid">${summaryStats
        .map(
          s =>
            `<div class="stat-card"><div class="stat-lbl">${s.label}</div><div class="stat-val">${s.value}</div></div>`
        )
        .join('')}</div>`
    : '';

  const tableHtml = `
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rows
          .map(
            r =>
              `<tr>${r
                .map(
                  c =>
                    `<td class="${typeof c === 'number' || (typeof c === 'string' && (c.startsWith('₦') || !isNaN(Number(c.replace(/,/g, ''))))) ? 'text-right' : ''}">${c ?? '—'}</td>`
                )
                .join('')}</tr>`
          )
          .join('')}
      </tbody>
    </table>
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — CWG Retail Management</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 24px; color: #1e293b; }
          .header { border-bottom: 2px solid #10b981; padding-bottom: 12px; margin-bottom: 16px; }
          .brand { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #10b981; font-weight: 700; }
          h1 { margin: 4px 0 2px; font-size: 20px; color: #0f172a; }
          p { margin: 0; font-size: 12px; color: #64748b; }
          .summary-grid { display: flex; gap: 12px; margin-bottom: 18px; }
          .stat-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; flex: 1; background: #f8fafc; }
          .stat-lbl { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600; }
          .stat-val { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11.5px; }
          th { background: #f1f5f9; text-align: left; padding: 7px 10px; border-bottom: 1px solid #cbd5e1; font-weight: 600; color: #334155; }
          td { padding: 7px 10px; border-bottom: 1px solid #f1f5f9; color: #334155; }
          tr:nth-child(even) { background: #fafafa; }
          .text-right { text-align: right; }
          .footer { margin-top: 24px; font-size: 10px; color: #94a3b8; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">CWG Retail Management Suite</div>
          <h1>${title}</h1>
          <p>${subtitle} &bull; Generated on ${new Date().toLocaleString('en-GB')}</p>
        </div>
        ${summaryHtml}
        ${tableHtml}
        <div class="footer">Confidential &bull; CWG Retail Systems</div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export function handleTabExport({ activeTab, activeRange, products, staff, kpis }) {
  const filename = `CWG_${activeTab}_Report_${activeRange}`;
  if (activeTab === 'inventory') {
    const headers = ['SKU', 'Product Name', 'Category', 'Stock Qty', 'Cost Price (NGN)', 'Sell Price (NGN)', 'Total Cost (NGN)', 'Retail Value (NGN)', 'Margin %'];
    const rows = products.map(p => {
      const qty = p.inventory?.quantity ?? 0;
      const cost = Number(p.cost_price) || 0;
      const sell = Number(p.sell_price) || 0;
      const margin = sell > 0 ? (((sell - cost) / sell) * 100).toFixed(1) : '0';
      return [p.sku, p.name, p.category, qty, cost, sell, cost * qty, sell * qty, `${margin}%`];
    });
    exportReportToCsv(filename, headers, rows);
  } else if (activeTab === 'stock') {
    const headers = ['Status', 'SKU', 'Product Name', 'Category', 'Current Stock', 'Threshold', 'Deficit'];
    const rows = products.map(p => {
      const qty = p.inventory?.quantity ?? 0;
      const thr = p.inventory?.reorder_threshold ?? 0;
      const status = qty <= 0 ? 'Out of Stock' : qty <= thr ? 'Low Stock' : 'Healthy';
      const deficit = qty <= 0 ? thr + 10 : qty <= thr ? (thr - qty) + 5 : 0;
      return [status, p.sku, p.name, p.category, qty, thr, deficit];
    });
    exportReportToCsv(filename, headers, rows);
  } else if (activeTab === 'products') {
    const headers = ['SKU', 'Product Name', 'Category', 'Sell Price', 'On Hand'];
    const rows = products.map(p => [p.sku, p.name, p.category, p.sell_price, p.inventory?.quantity ?? 0]);
    exportReportToCsv(filename, headers, rows);
  } else if (activeTab === 'users') {
    const headers = ['Staff Name', 'Email', 'Role', 'Status'];
    const rows = staff.map(s => [s.name, s.email, s.role, s.status]);
    exportReportToCsv(filename, headers, rows);
  } else {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Revenue (NGN)', kpis?.revenue || 0],
      ['Gross Profit (NGN)', kpis?.grossProfit || 0],
      ['Total Transactions', kpis?.transactions || 0],
      ['Average Basket (NGN)', kpis?.averageBasket || 0],
      ['Total Units Sold', kpis?.unitsSold || 0],
    ];
    exportReportToCsv(filename, headers, rows);
  }
}
