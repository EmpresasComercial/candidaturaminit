import { jsPDF } from 'jspdf';
import { Agendamento } from '../types';

export function generateAppointmentPDF(agendamento: Agendamento): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  doc.setFillColor(255, 109, 0);
  doc.rect(0, 0, pageWidth, 4, 'F');

  let y = 20;

  doc.setDrawColor(255, 109, 0);
  doc.setLineWidth(0.5);
  doc.circle(pageWidth / 2, y + 10, 8, 'S');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 109, 0);
  doc.text('★', pageWidth / 2, y + 12, { align: 'center' });

  y += 26;
  doc.text('TALÃO DE AGENDAMENTO', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.setFontSize(12);
  doc.text('CONCURSO PÚBLICO - MINISTÉRIO DO INTERIOR', pageWidth / 2, y, { align: 'center' });

  y += 12;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 109, 0);
  doc.text('DADOS DO AGENDAMENTO', margin, y);

  y += 8;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const formatLabelValue = (label: string, value: string, currentY: number) => {
    doc.text(label, margin, currentY);
    doc.text(value, margin + 55, currentY);
  };

  const formattedDate = new Date(agendamento.dataCriacao).toLocaleString('pt-AO', {
    timeZone: 'Africa/Luanda',
    dateStyle: 'long',
    timeStyle: 'medium',
  });

  formatLabelValue('Nome:', agendamento.nomeCompleto, y);
  y += 7;
  formatLabelValue('Nome do Pai:', agendamento.nomeCompletoPai, y);
  y += 7;
  formatLabelValue('Nome da Mãe:', agendamento.nomeCompletoMae, y);
  y += 7;
  formatLabelValue('Data de Nascimento:', agendamento.dataNascimento, y);
  y += 7;
  formatLabelValue('Emissão do Bilhete:', agendamento.dataEmissaoBilhete, y);
  y += 7;
  formatLabelValue('Expiração do Bilhete:', agendamento.dataExpiracaoBilhete, y);
  y += 7;
  formatLabelValue('Fatura:', agendamento.numeroFatura || '-', y);
  y += 7;
  formatLabelValue('Email:', agendamento.email || '-', y);
  y += 7;
  formatLabelValue('Naturalidade:', agendamento.provinciaNaturalidade, y);
  y += 7;
  formatLabelValue('Órgão:', agendamento.orgao, y);
  y += 7;
  if (agendamento.comentario) {
    formatLabelValue('Comentário:', agendamento.comentario, y);
    y += 7;
  }
  formatLabelValue('Valor:', '1.000 Kz', y);
  y += 7;
  formatLabelValue('Emitido em:', formattedDate, y);

  y += 12;

  doc.setDrawColor(254, 215, 170);
  doc.setFillColor(255, 251, 240);
  doc.rect(margin, y, contentWidth, 28, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(234, 88, 12);
  doc.text('PAGAMENTO MULTICAIXA', margin + 5, y + 6);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const cleanRef = agendamento.referenciaMulticaixa.replace(/\s/g, '');
  const maskedRef = cleanRef.length >= 9 ? `${cleanRef.slice(0, 3)}*****${cleanRef.slice(-1)}` : '928*****4';
  doc.text(`Referência: ${maskedRef}`, margin + 5, y + 14);
  doc.text('Valor total: 1.000,00 Kz', margin + 5, y + 20);

  y += 38;

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 109, 0);
  doc.text('INSTRUÇÕES', margin, y);

  y += 8;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const instructionLines = [
        'Pagamento Multicaixa Express.',
        'O comprovativo de Talão de Agendamento da inscrição online ao concurso do Ministério do Interior foi gerado com sucesso.',
        '',
        'Procedimento:',
        '1. Acesse o seu Multicaixa Express',
        '2. Insira a referência ou número de entidade gerado pela plataforma',
        '3. Efetue o pagamento no valor de 1.000,00 KZ',
        '4. Faça a captura do talão de pagamento emitido pelo Multicaixa Express',
        '5. Envie o comprovativo de pagamento para este WhatsApp: 928 80 90 34',
        '',
        'Após a confirmação do pagamento, deverá nos fornecer: Bilhete de Identidade em PDF e Certificado em PDF.',
        'No dia 16 faremos a sua inscrição.',
        '',
        'Obrigado por ter concluído o agendamento.'
      ];

  instructionLines.forEach((line) => {
    const isBoldLine = line === 'Procedimento:' || /^\d+\./.test(line);
    doc.setFont('Helvetica', isBoldLine ? 'bold' : 'normal');

    if (!line) {
      y += 2;
      return;
    }

    const wrappedLines = doc.splitTextToSize(line, contentWidth);
    wrappedLines.forEach((wrappedLine) => {
      doc.text(wrappedLine, margin, y);
      y += 5.5;
    });
  });

  y = pageHeight - margin - 22;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Documento gerado pelo sistema.', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('Conserve até à confirmação da candidatura.', pageWidth / 2, y, { align: 'center' });

  const safeName = agendamento.nomeCompleto.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`Comprovativo_Agendamento_${safeName}.pdf`);
}
