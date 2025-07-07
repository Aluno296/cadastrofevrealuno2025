// script.js - Versão ideal
console.log('✅ script.js carregado e executando');

document.addEventListener('DOMContentLoaded', () => {
  // URL única do Apps Script Web App (mesma para ambos os formulários)
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbx0AemrwMZLMgACX0JcqX6xTZf84ow8T-x0Fb5hTNNkh9Sn6ky3IrwJYwz2uaoazAl5JQ/exec';
  const WHATSAPP_NUMBER = '5524981490144';

  const interestForm = document.getElementById('interest-form');
  const contactForm = document.getElementById('meuForm');

  // Função genérica para enviar dados ao Google Sheets via GET para evitar CORS
  async function sendToSheet(data) {
    const qs = new URLSearchParams(data).toString();
    const response = await fetch(`${SHEET_URL}?${qs}`);
    const json = await response.json();
    if (json.result !== 'success') throw new Error(json.message || 'Falha desconhecida');
    return json;
  }

  // Monta URL do WhatsApp com base nos dados
  function buildWhatsAppUrl(payload) {
    const message = [
      'Olá! 👋 Sou da Rede FEVRE e quero ganhar um curso... Poderiam me passar mais informações?\n',
      '*DADOS DO ALUNO(A):*',
      `Nome: ${payload.studentName}`,
      `Telefone: ${payload.studentPhone}\n`,
      '*DADOS DO RESPONSÁVEL:*',
      `Nome: ${payload.guardianName}`,
      `Telefone: ${payload.guardianPhone}\n`,
      '*INFORMAÇÕES ESCOLARES:*',
      `Turno: ${payload.shift}`,
      `Ano/Série: ${payload.grade}\n`,
      'Aguardo mais informações!'
    ].join('\n');

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  // Handler para o form de interesse
  if (interestForm) {
    interestForm.addEventListener('submit', async event => {
      event.preventDefault();
      const errorDiv = document.getElementById('error-message');

      // Coleta e valida campos
      const payload = {
        studentName: document.getElementById('studentName').value.trim(),
        studentPhone: document.getElementById('studentPhone').value.trim(),
        guardianName: document.getElementById('guardianName').value.trim(),
        guardianPhone: document.getElementById('guardianPhone').value.trim(),
        shift: document.getElementById('shift').value,
        grade: document.getElementById('grade').value
      };
      const isChecked = document.getElementById('interest-check').checked;

      // Validação básica
      if (Object.values(payload).some(v => !v) || !isChecked) {
        if (errorDiv) errorDiv.style.display = 'block';
        return;
      }
      if (errorDiv) errorDiv.style.display = 'none';

      try {
        await sendToSheet(payload);
        // Envia WhatsApp somente após gravar na planilha
        window.open(buildWhatsAppUrl(payload), '_blank');
        interestForm.reset();
      } catch (err) {
        console.error(err);
        alert('Erro ao enviar formulário de interesse: ' + err.message);
      }
    });
  }

  // Handler para o form de contato
  if (contactForm) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      console.log('🔔 Handler de submit foi disparado!', event);

      const payload = {
        nome: contactForm.querySelector('input[name="nome"]').value.trim(),
        email: contactForm.querySelector('input[name="email"]').value.trim(),
        mensagem: contactForm.querySelector('textarea[name="mensagem"]').value.trim()
      };

      try {
        await sendToSheet(payload);
        alert('Mensagem de contato enviada com sucesso! 🚀');
        contactForm.reset();
      } catch (err) {
        console.error(err);
        alert('Erro ao enviar mensagem de contato: ' + err.message);
      }
    });
  }
});
