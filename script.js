const formulario = document.getElementById('formulario');
const campoCEP = document.getElementById('cep');
const botao = document.getElementById('buscar');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultado');

function mostrarMensagem(texto, tipo = '') {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

async function buscarCEP(entrada) {
  // Valida antes da requisição, permitindo o CEP com ou sem hífen.
  resultado.hidden = true;
  const valor = entrada.trim();
  if (!/^\d{5}-?\d{3}$/.test(valor)) {
    mostrarMensagem('Digite um CEP válido com 8 números. Exemplo: 01001-000.', 'erro');
    campoCEP.setAttribute('aria-invalid', 'true');
    campoCEP.focus();
    return;
  }
  campoCEP.removeAttribute('aria-invalid');
  const cep = valor.replace('-', '');
  const controle = new AbortController();
  const tempoLimite = setTimeout(() => controle.abort(), 10000);
  botao.disabled = true;
  campoCEP.disabled = true;
  botao.textContent = 'Buscando…';
  formulario.setAttribute('aria-busy', 'true');
  mostrarMensagem('Consultando o endereço…');

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: controle.signal
    });
    if (!resposta.ok) throw new Error('Falha no serviço');
    const dados = await resposta.json();
    // O ViaCEP pode retornar HTTP 200 mesmo quando o CEP não existe.
    if (dados.erro) {
      mostrarMensagem('CEP não encontrado. Confira os números e tente novamente.', 'erro');
      return;
    }
    if (!dados.cep || !dados.localidade || !dados.uf) throw new Error('Resposta incompleta');

    const campos = {
      'cep-encontrado': dados.cep,
      rua: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
      ddd: dados.ddd,
      complemento: dados.complemento
    };
    // textContent atualiza o DOM sem interpretar os dados como HTML.
    for (const [id, valor] of Object.entries(campos)) {
      document.getElementById(id).textContent = valor || 'Não informado';
    }
    resultado.hidden = false;
    mostrarMensagem('Consulta concluída com sucesso.', 'sucesso');
  } catch (erro) {
    mostrarMensagem(erro.name === 'AbortError'
      ? 'A consulta demorou mais que o esperado. Tente novamente.'
      : 'Não foi possível consultar o CEP. Verifique sua conexão e tente novamente.', 'erro');
  } finally {
    clearTimeout(tempoLimite);
    botao.disabled = false;
    campoCEP.disabled = false;
    botao.textContent = 'Buscar CEP';
    formulario.removeAttribute('aria-busy');
  }
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  buscarCEP(campoCEP.value);
});
