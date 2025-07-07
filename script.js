// script.js — JSONP edition
console.log('✅ script.js (JSONP) carregado');

document.addEventListener('DOMContentLoaded', () => {
  const interestForm = document.getElementById('interest-form');
  console.log('interestForm encontrado?', interestForm);

  if (interestForm) {
    interestForm.addEventListener('submit', async e => {
      e.preventDefault();
      console.log('🔔 submit interceptado!');

      // coleta os dados
      const payload = {
        studentName:  document.getElementById('studentName').value.trim(),
        studentPhone: document.getElementById('studentPhone').value.trim(),
        guardianName: document.getElementById('guardianName').value.trim(),
        guardianPhone: document.getElementById('guardianPhone').value.trim(),
        shift:        document.getElementById('shift').value,
        grade:        document.getElementById('grade').value,
      };
      console.log('payload:', payload);

      try {
        const resp = await sendToSheetJSONP(payload);
        console.log('JSONP response:', resp);
        window.open(buildWhatsAppUrl(payload), '_blank');
      } catch (err) {
        console.error('Erro JSONP:', err);
        alert('Falha no envio: ' + err.message);
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const SHEET_URL     = 'https://script.google.com/macros/s/AKfycbx0AemrwMZLMgACX0JcqX6xTZf84ow8T-x0Fb5hTNNkh9Sn6ky3IrwJYwz2uaoazAl5JQ/exec';
  const interestForm  = document.getElementById('interest-form');
  const WHATSAPP_NUM  = '5524981490144';

  function sendToSheetJSONP(data) {
    return new Promise((resolve, reject) => {
      const cbName = 'cb_' + Date.now();
      window[cbName] = resp => {
        delete window[cbName];
        document.body.removeChild(script);
        resp.result === 'success'
          ? resolve(resp)
          : reject(new Error(resp.message));
      };
      const qs     = new URLSearchParams({ ...data, callback: cbName });
      const script = document.createElement('script');
      script.src   = `${SHEET_URL}?${qs}`;
      document.body.appendChild(script);
    });
  }

  function buildWhatsAppUrl(p) {
    const msg = [
      'Olá! 👋 Sou da Rede FEVRE e quero ganhar um curso?\\n',
      '*ALUNO:*', `Nome: ${p.studentName}`, `Telefone: ${p.studentPhone}\\n`,
      '*RESPONSÁVEL:*', `Nome: ${p.guardianName}`, `Telefone: ${p.guardianPhone}\\n`,
      '*ESCOLAR:*', `Turno: ${p.shift}`, `Ano/Série: ${p.grade}\\n`,
      'Aguardo mais informações!'
    ].join('\\n');
    return `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;
  }

  if (interestForm) {
    interestForm.addEventListener('submit', async e => {
      e.preventDefault();
      const p = {
        studentName: document.getElementById('studentName').value.trim(),
        studentPhone: document.getElementById('studentPhone').value.trim(),
        guardianName: document.getElementById('guardianName').value.trim(),
        guardianPhone: document.getElementById('guardianPhone').value.trim(),
        shift: document.getElementById('shift').value,
        grade: document.getElementById('grade').value
      };
      if (Object.values(p).some(v=>!v) || !document.getElementById('interest-check').checked) {
        return alert('Preencha tudo e marque o checkbox.');
      }
      try {
        await sendToSheetJSONP(p);
        window.open(buildWhatsAppUrl(p), '_blank');
        interestForm.reset();
      } catch(err) {
        alert('Erro no envio: ' + err.message);
      }
    });
  }
});