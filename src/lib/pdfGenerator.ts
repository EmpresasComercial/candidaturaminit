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
  formatLabelValue('Naturalidade:', agendamento.provinciaNaturalidade, y);
  y += 7;
  formatLabelValue('Candidatura:', agendamento.provinciaCandidatura, y);
  y += 7;
  formatLabelValue('Órgão:', agendamento.orgao, y);
  y += 7;
  formatLabelValue('Idade:', `${agendamento.idade} anos`, y);
  y += 7;
  formatLabelValue('Gênero:', agendamento.genero, y);
  y += 7;
  formatLabelValue('Altura:', `${agendamento.altura.toFixed(2)} m`, y);
  y += 7;
  if (agendamento.comentario) {
    formatLabelValue('Comentário:', agendamento.comentario, y);
    y += 7;
  }
  formatLabelValue('Valor:', '1.250 Kz', y);
  y += 7;
  formatLabelValue('Emitido em:', formattedDate, y);

  y += 12;

  if (agendamento.modalidadePagamento === 'multicaixa') {
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
    doc.text('Valor total: 1.250,00 Kz', margin + 5, y + 20);

    y += 38;
  } else {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 109, 0);
    doc.text('PAGAMENTO PRESENCIAL', margin, y);
    y += 8;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('O pagamento presencial refere-se ao serviço de apoio na realização da inscrição da candidatura.', margin, y);
    y += 18;
  }

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 109, 0);
  doc.text('INSTRUÇÕES', margin, y);

  y += 8;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const lines = doc.splitTextToSize(
    'Guarde este comprovativo e envie o comprovativo de pagamento pelo WhatsApp para confirmação. O serviço pago refere-se apenas ao apoio na inscrição, e não garante vaga ou aprovação no concurso.',
    contentWidth
  );

  lines.forEach((line) => {
    doc.text(line, margin, y);
    y += 5.5;
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
