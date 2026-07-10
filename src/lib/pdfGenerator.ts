import { jsPDF } from 'jspdf';
import { Agendamento } from '../types';

export function generateAppointmentPDF(agendamento: Agendamento): void {
  // Create an A4-sized PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Let's draw some elegant border/background representation of official status (purely white background as requested)
  // Accent orange banner at the top edge (very slim)
  doc.setFillColor(255, 109, 0); // #FF6D00
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Starting coordinate y
  let y = 20;

  // Header Icon/Aesthetic representation of Angola Seal
  // Central golden star and abstract gears
  doc.setDrawColor(255, 109, 0);
  doc.setLineWidth(0.5);
  doc.circle(pageWidth / 2, y + 10, 8, 'S');
  doc.setFillColor(255, 109, 0);
  // star coordinates centered at (pageWidth/2, y+10)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 109, 0);
  doc.text('★', pageWidth / 2, y + 12, { align: 'center' });

  y += 26;

  // Centered Header Title
  // AGENDAMENTO DE CANDIDATURA DE INSCRIÇÃO – CONCURSO PÚBLICO 2026
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 109, 0); // Orange (#FF6D00)
  
  const titleText = 'AGENDAMENTO DE CANDIDATURA DE INSCRIÇÃO';
  const subtitleText = 'CONCURSO PÚBLICO 2026';
  
  doc.text(titleText, pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.text(subtitleText, pageWidth / 2, y, { align: 'center' });

  y += 10;

  // Thin separator line
  doc.setDrawColor(226, 232, 240); // light gray #E2E8F0
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  // Section 1: Dados do Agendamento (Section header in orange, bold)
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 109, 0);
  doc.text('DADOS DO AGENDAMENTO', margin, y);
  
  y += 8;

  // Appointment details in black with nice layout
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const formatLabelValue = (label: string, value: string, currentY: number) => {
    doc.setFont('Helvetica', 'normal');
    doc.text(label, margin, currentY);
    doc.text(value, margin + 55, currentY);
  };

  const formattedDate = new Date(agendamento.dataCriacao).toLocaleString('pt-AO', {
    timeZone: 'Africa/Luanda',
    dateStyle: 'long',
    timeStyle: 'medium',
  });

  // Ensure phone has proper international or local formatting
  let cleanPhone = agendamento.telefone.trim();
  if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('00')) {
    if (cleanPhone.startsWith('9') || cleanPhone.startsWith('2')) {
      cleanPhone = `+244 ${cleanPhone}`;
    }
  }

  formatLabelValue('Nome Completo:', agendamento.nomeCompleto, y);
  y += 7;
  formatLabelValue('Posição de Candidatura:', `Nº ${String(agendamento.numeroOrdem).padStart(3, '0')}`, y);
  y += 7;
  formatLabelValue('Telefone:', cleanPhone, y);
  y += 7;
  formatLabelValue('Valor do Serviço:', '1.250 Kz', y);
  y += 7;
  formatLabelValue('Data de Emissão:', formattedDate, y);
  y += 7;
  formatLabelValue('Data Prevista para a Candidatura:', '16 de Julho de 2026', y);

  y += 10;

  // Multicaixa info section boxed cleanly
  doc.setDrawColor(254, 215, 170); // Warm border
  doc.setFillColor(255, 251, 240); // Warm extremely soft background
  doc.rect(margin, y, contentWidth, 28, 'FD');

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(234, 88, 12); // darker orange
  doc.text('COORDENADAS DE PAGAMENTO (MULTICAIXA)', margin + 5, y + 6);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  
  // Mask the reference to 928*****4 for the generated PDF document
  const cleanRef = agendamento.referenciaMulticaixa.replace(/\s/g, '');
  const maskedRef = cleanRef.length >= 9 
    ? `${cleanRef.slice(0, 3)}*****${cleanRef.slice(-1)}` 
    : '928*****4';
    
  doc.text(`Referência: ${maskedRef}`, margin + 5, y + 14);
  doc.setFont('Helvetica', 'normal');
  doc.text(`Valor total: 1.250,00 Kz`, margin + 5, y + 20);

  y += 38;

  // Section 2: Mensagem ao Candidato
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 109, 0);
  doc.text('MENSAGEM AO CANDIDATO', margin, y);

  y += 8;

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);

  const paragraphs = [
    'Obrigado por confiar nos nossos serviços.',
    'O seu comprovativo de agendamento foi gerado com sucesso.',
    'Para concluir o processo, efetue o pagamento do valor indicado e envie o respetivo comprovativo através do WhatsApp para confirmação.',
    'Após a validação do pagamento, o seu nome será incluído na lista de candidatos agendados e a sua candidatura será realizada dentro do prazo previsto.',
    'O pagamento efetuado refere-se exclusivamente ao serviço de apoio na realização da candidatura e não garante vaga ou aprovação no concurso.',
    'Trabalhamos com máxima segurança, responsabilidade e confidencialidade. Contamos com uma estrutura especializada para prestar este tipo de serviço, utilizando equipamentos adequados e profissionais preparados para efetuar candidaturas online.'
  ];

  paragraphs.forEach((paragraph) => {
    const lines = doc.splitTextToSize(paragraph, contentWidth);
    lines.forEach((line: string) => {
      // Check if text is getting close to bottom margin of A4 (297mm)
      if (y > pageHeight - margin - 15) {
        doc.addPage();
        y = margin + 10;
      }
      doc.text(line, margin, y);
      y += 5.5;
    });
    y += 2.5; // space between paragraphs
  });

  // Footer separator
  y = pageHeight - margin - 12;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);

  // Footer labels
  y += 5;
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Documento gerado automaticamente pelo sistema.', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.text('Conservar este comprovativo até à confirmação da candidatura.', pageWidth / 2, y, { align: 'center' });

  // Save the document with a descriptive custom name
  const safeName = agendamento.nomeCompleto.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`Comprovativo_Agendamento_${safeName}.pdf`);
}
