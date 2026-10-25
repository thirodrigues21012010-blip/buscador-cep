// Testes de comportamento com um DOM mínimo e respostas controladas.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const elementos = {};
const document = { getElementById(id) {
  return elementos[id] ||= { textContent: '', hidden: true, disabled: false,
    setAttribute() {}, removeAttribute() {}, focus() {}, addEventListener() {} };
} };
let chamadas = 0;
let resposta;
const contexto = vm.createContext({ document, AbortController, setTimeout, clearTimeout,
  fetch: async () => { chamadas++; if (resposta instanceof Error) throw resposta; return resposta; }
});
vm.runInContext(fs.readFileSync(__dirname + '/script.js', 'utf8'), contexto);
async function buscar(cep) { await contexto.buscarCEP(cep); }
async function testar() {
  resposta = { ok: true, json: async () => ({ cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP', ddd: '11' }) };
  await buscar('01001-000');
  assert.equal(elementos.rua.textContent, 'Praça da Sé');
  assert.equal(elementos.cidade.textContent, 'São Paulo');
  assert.equal(elementos.resultado.hidden, false);
  assert.equal(elementos.complemento.textContent, 'Não informado');
  console.log('OK: CEP válido e atualização do DOM');
  const antes = chamadas;
  await buscar('123');
  assert.equal(chamadas, antes);
  assert.match(elementos.mensagem.textContent, /8 números/);
  assert.equal(elementos.resultado.hidden, true);
  console.log('OK: entrada inválida sem requisição');
  resposta = { ok: true, json: async () => ({ erro: true }) };
  await buscar('99999999');
  assert.match(elementos.mensagem.textContent, /não encontrado/);
  assert.equal(elementos.resultado.hidden, true);
  assert.equal(elementos.buscar.disabled, false);
  console.log('OK: CEP inexistente');
  for (const falha of [new Error('offline'), { ok: false }, { ok: true, json: async () => { throw new Error('JSON inválido'); } }]) {
    resposta = falha;
    await buscar('01001000');
    assert.match(elementos.mensagem.textContent, /Não foi possível/);
    assert.equal(elementos.buscar.disabled, false);
  }
  console.log('OK: falhas de rede, HTTP e JSON');
  resposta = Object.assign(new Error('timeout'), { name: 'AbortError' });
  await buscar('01001000');
  assert.match(elementos.mensagem.textContent, /demorou/);
  assert.equal(elementos.cep.disabled, false);
  console.log('OK: tempo esgotado e formulário liberado');
}
testar().catch(erro => { console.error(erro); process.exitCode = 1; });
