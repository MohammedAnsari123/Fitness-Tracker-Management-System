import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';

const ExportButton = ({ data, columns, title = 'Report', filename = 'report' }) => {

    const handleExport = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = columns.map(col => col.header);
        const tableRows = [];

        data.forEach(item => {
            const rowData = columns.map(col => {
                const keys = col.key.split('.');
                let value = item;
                keys.forEach(k => {
                    value = value ? value[k] : '';
                });
                return value;
            });
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [22, 163, 74] }
        });

        doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-slate-700"
        >
            <Download size={16} />
            Export PDF
        </button>
    );
};

export default ExportButton;
