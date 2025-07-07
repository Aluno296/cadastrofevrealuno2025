// script.js — Versão completa JSONP
console.log('✅ script.js (JSONP) carregado');

document.addEventListener('DOMContentLoaded', () => {
  // URL do seu Apps Script (Publicação como Web App)
  const SHEET_URL    = 'https://script.google.com/macros/s/AKfycbwflUIjfG_WKRVHzeZsHA0BlUOn_Ayn530pRsjcQdfp9dFvTc-Z_ZrXP_ZWMKsQ-JCKog/exec';
  const WHATSAPP_NUM = '5524981490144';
  const interestForm = document.getElementById('interest-form');

  // 1) Função JSONP para enviar dados sem CORS bloqueado
  function sendToSheetJSONP(data) {
    return new Promise((resolve, reject) => {
      const callbackName = 'cb_' + Date.now();
      // Define callback global
      window[callbackName] = resp => {
        delete window[callbackName];
        document.body.removeChild(scriptTag);
        resp.result === 'success'
          ? resolve(resp)
          : reject(new Error(resp.message));
      };
      // Monta querystring com callback
      const qs = new URLSearchParams({ ...data, callback: callbackName }).toString();
      // Injeta o <script> que dispara o JSONP
      const scriptTag = document.createElement('script');
      scriptTag.src = `${SHEET_URL}?${qs}`;
      document.body.appendChild(scriptTag);
    });
  }

  // 2) Monta a URL do WhatsApp
  function buildWhatsAppUrl(p) {
    const msg = [
      'Olá! 👋 Sou da Rede FEVRE e quero ganhar um curso... Poderiam me passar mais informações?\\n',
      '*ALUNO:*',
      `Nome: ${p.studentName}`,
      `Telefone: ${p.studentPhone}\\n`,
      '*RESPONSÁVEL:*',
      `Nome: ${p.guardianName}`,
      `Telefone: ${p.guardianPhone}\\n`,
      '*ESCOLAR:*',
      `Turno: ${p.shift}`,
      `Ano/Série: ${p.grade}\\n`,
      'Aguardo mais informações!'
    ].join('\\n');
    return `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;
  }

  // 3) Listener de submit
  if (interestForm) {
    interestForm.addEventListener('submit', async e => {
      e.preventDefault();
      console.log('🔔 submit interceptado!');

      // Coleta e valida campos
      const payload = {
        studentName:  document.getElementById('studentName').value.trim(),
        studentPhone: document.getElementById('studentPhone').value.trim(),
        guardianName: document.getElementById('guardianName').value.trim(),
        guardianPhone: document.getElementById('guardianPhone').value.trim(),
        shift:        document.getElementById('shift').value,
        grade:        document.getElementById('grade').value
      };
      console.log('payload:', payload);

      if (Object.values(payload).some(v => !v) || !document.getElementById('interest-check').checked) {
        return alert('Preencha todos os campos e marque o checkbox.');
      }

      try {
        const resp = await sendToSheetJSONP(payload);
        console.log('JSONP response:', resp);
        window.open(buildWhatsAppUrl(payload), '_blank');
        interestForm.reset();
      } catch (err) {
        console.error('Erro JSONP:', err);
        alert('Falha no envio: ' + err.message);
      }
    });
  }
});
