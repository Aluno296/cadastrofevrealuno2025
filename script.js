// script.js - Versão ideal

document.addEventListener('DOMContentLoaded', () => {
  const SHEET_URL_INTEREST = 'https://script.google.com/macros/s/AKfycbyjwwhl6SF0iMD606UD6DjIjCk4BOjfgyVPP-FcSuECWXR6xnp9PhawdChous6zJCuiPA/exec';
  const SHEET_URL_CONTACT  = 'https://script.google.com/macros/s/198gL-w5Yk1vT4lV0M9Jv9WHs1xdeOR2GWV3LOrBLlPkjHCoCa6urMtdo/exec';
  const WHATSAPP_NUMBER    = '5524981490144';

  const interestForm = document.getElementById('interest-form');
  const contactForm  = document.getElementById('meuForm');

  // Função genérica para enviar dados ao Google Sheets
  async function sendToSheet(data, url) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
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
        await sendToSheet(payload, SHEET_URL_INTEREST);
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
      event.preventDefault();
      const payload = {
        nome:    contactForm.querySelector('input[name="nome"]').value.trim(),
        email:   contactForm.querySelector('input[name="email"]').value.trim(),
        mensagem: contactForm.querySelector('textarea[name="mensagem"]').value.trim()
      };

      try {
        await sendToSheet(payload, SHEET_URL_CONTACT);
        alert('Mensagem de contato enviada com sucesso! 🚀');
        contactForm.reset();
      } catch (err) {
        console.error(err);
        alert('Erro ao enviar mensagem de contato: ' + err.message);
      }
    });
  }
});
