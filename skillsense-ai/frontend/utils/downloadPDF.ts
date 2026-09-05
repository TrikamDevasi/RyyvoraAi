export function downloadPageAsPDF(title: string = 'Ryyvora-AI-Report') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('Please allow popups to download PDF'); return; }

    const content = document.querySelector('main')?.innerHTML || document.body.innerHTML;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Inter', Arial, sans-serif; background: #fff; color: #1a1a1a; padding: 40px; font-size: 13px; line-height: 1.6; }
                h1, h2, h3 { color: #0f172a; margin-bottom: 12px; }
                table { width: 100%; border-collapse: collapse; margin: 16px 0; }
                th, td { padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left; font-size: 12px; }
                th { background: #f8fafc; font-weight: 600; color: #64748b; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4A843; padding-bottom: 16px; margin-bottom: 24px; }
                .header h1 { font-size: 22px; color: #D4A843; }
                .header p { font-size: 12px; color: #64748b; }
                button, svg, canvas { display: none !important; }
                @media print { body { padding: 20px; } }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>Ryyvora AI</h1>
                    <p>Workforce Outcome Intelligence</p>
                </div>
                <div>
                    <p>${title}</p>
                    <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>
            ${content}
        </body>
        </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}
