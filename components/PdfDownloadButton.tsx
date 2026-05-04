'use client';

import { useState } from 'react';

interface Props {
  targetId: string;
  fileName: string;
}

export default function PdfDownloadButton({ targetId, fileName }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) {
        alert('PDF対象のコンテンツが見つかりません。');
        setBusy(false);
        return;
      }

      // 動的import（バンドルサイズ削減）
      const [{ default: html2canvas }, jsPDFModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const jsPDF = jsPDFModule.default;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#f6f3ed',
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 複数ページ対応
      let position = 0;
      let heightLeft = imgHeight;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // 全ページに免責表記を入れる
      const totalPages = pdf.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(7);
        pdf.setTextColor(150);
        pdf.text(
          'Sanmei Compass / 高尾系算命学 / エンターテインメント・自己理解の参考としてご活用ください',
          pdfWidth / 2,
          pdfHeight - 5,
          { align: 'center' }
        );
      }

      pdf.save(`${fileName}.pdf`);
    } catch (err) {
      console.error(err);
      alert('PDF生成に失敗しました。ブラウザを変えてお試しください。');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={busy}
      className="px-6 py-3 text-sm tracking-wider transition-all duration-300 hover:opacity-80 disabled:opacity-50"
      style={{
        color: 'var(--color-vermilion)',
        backgroundColor: 'transparent',
        border: '1px solid var(--color-vermilion)',
        borderRadius: '2px',
      }}
    >
      {busy ? 'PDF生成中…' : 'PDFでダウンロード'}
    </button>
  );
}
