// script.js - Versão final com GET e CORS não bloqueado
console.log('✅ script.js carregado e executando');

document.addEventListener('DOMContentLoaded', () => {
  // URL do seu Apps Script (Web App) com doGet/doPost ajustados
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbx0AemrwMZLMgACX0JcqX6xTZf84ow8T-x0Fb5hTNNkh9Sn6ky3IrwJYwz2uaoazAl5JQ/exec';
  const WHATSAPP_NUMBER = '5524981490144';

  const interestForm = document.getElementById('interest-form');

  // Função genérica para enviar dados via GET (evita CORS pré-voo)
  async function sendToSheet(data) {
    const qs = new URLSearchParams(data).toString();
    const response = await fetch(`${SHEET_URL}?${qs}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    if (json.result !== 'success') throw new Error(json.message || 'Falha desconhecida');
    return json;
  }

  // Monta URL do WhatsApp
  function buildWhatsAppUrl(p) {
    const msg = [
      'Olá! 👋 Sou da Rede FEVRE e quero ganhar um curso... Poderiam me passar mais informações?\n',
      '*DADOS DO ALUNO(A):*',
      `Nome: ${p.studentName}`,
      `Telefone: ${p.studentPhone}\n`,
      '*DADOS DO RESPONSÁVEL:*',
      `Nome: ${p.guardianName}`,
      `Telefone: ${p.guardianPhone}\n`,
      '*INFORMAÇÕES ESCOLARES:*',
      `Turno: ${p.shift}`,
      `Ano/Série: ${p.grade}\n`,
      'Aguardo mais informações!'
    ].join('\n');
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  if (interestForm) {
    interestForm.addEventListener('submit', async e => {
      e.preventDefault();
      const err = document.getElementById('error-message');
      const p = {
        studentName: document.getElementById('studentName').value.trim(),
        studentPhone: document.getElementById('studentPhone').value.trim(),
        guardianName: document.getElementById('guardianName').value.trim(),
        guardianPhone: document.getElementById('guardianPhone').value.trim(),
        shift: document.getElementById('shift').value,
        grade: document.getElementById('grade').value
      };
      const checked = document.getElementById('interest-check').checked;
      if (Object.values(p).some(v => !v) || !checked) {
        err.style.display = 'block';
        return;
      }
      err.style.display = 'none';
      try {
        await sendToSheet(p);
        window.open(buildWhatsAppUrl(p), '_blank');
        interestForm.reset();
      } catch (ex) {
        alert('Erro ao enviar: ' + ex.message);
      }
    });
  }
});
