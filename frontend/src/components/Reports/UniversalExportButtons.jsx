import React from 'react';
import { FileText, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const UniversalExportButtons = ({
    data,
    filename = 'report',
    title = 'Report',
    columns,
    excelTransform,
    pdfTransform
}) => {
    const exportToExcel = () => {
        // Use custom transform if provided, otherwise use data as-is
        const transformedData = excelTransform ? excelTransform(data) : data;

        const worksheet = XLSX.utils.json_to_sheet(transformedData);

        // Style the header row
        const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
        for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "4F46E5" } },
                    alignment: { horizontal: "center" }
                };
            }
        }

        // Set column widths based on columns config or default
        if (columns && columns.widths) {
            worksheet['!cols'] = columns.widths.map(width => ({ width }));
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, title);
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.setTextColor(79, 70, 229);
        doc.text(title, 20, 20);

        // Add timestamp
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

        // Use custom transform if provided, otherwise use data as-is
        const transformedData = pdfTransform ? pdfTransform(data) : data;

        // Convert data to table format
        const tableData = transformedData.map(item =>
            columns.headers.map(header => {
                const key = columns.keys[columns.headers.indexOf(header)];
                return String(item[key] || '');
            })
        );

        // Add table
        autoTable(doc, {
            head: [columns.headers],
            body: tableData,
            startY: 40,
            theme: 'striped',
            headStyles: {
                fillColor: [79, 70, 229],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 12
            },
            bodyStyles: {
                fontSize: 10
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: columns.styles || {},
            margin: { top: 40, left: 20, right: 20 }
        });

        doc.save(`${filename}.pdf`);
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={exportToExcel}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel
            </button>
            <button
                onClick={exportToPDF}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
            >
                <FileText className="w-4 h-4" />
                Export PDF
            </button>
        </div>
    );
};

export default UniversalExportButtons;