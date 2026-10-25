# Buscador de CEP

Atividade individual de Desenvolvimento de Websites — Fetch, JSON e DOM.

Página responsiva que consulta um CEP brasileiro e mostra o endereço sem recarregar a página. Desenvolvida com HTML, CSS e JavaScript puro, sem instalação de dependências.

## Como executar

Extraia a pasta e abra `index.html` em um navegador atualizado. É necessário acesso à internet para consultar o ViaCEP. Também é possível executar `python3 -m http.server 8000` na pasta e abrir `http://localhost:8000`.

## Planejamento da funcionalidade

| O que decidir | Minha escolha | Trecho de código relacionado |
| --- | --- | --- |
| API escolhida | ViaCEP | `fetch("https://viacep.com.br/ws/" + cep + "/json/")` |
| Dados buscados | CEP, logradouro, bairro, cidade, UF, DDD e complemento | `const dados = await resposta.json()` |
| Elementos atualizados | Card de endereço e mensagem de status | `document.getElementById(id).textContent = valor` |
| Mensagem em caso de falha | Não foi possível consultar o CEP. Verifique sua conexão e tente novamente. | `catch (erro) { mostrarMensagem(...) }` |

## Requisitos atendidos

- Função `async buscarCEP()` com `await fetch()`.
- Conversão da resposta para JSON e atualização do DOM com `textContent`.
- Tratamento de erros com `try/catch`, verificação de HTTP e de `dados.erro`.
- Validação de oito dígitos, mensagem de carregamento e limite de dez segundos.
- Layout adaptado para celular, rótulo de entrada e mensagens acessíveis.

## Testes

Execute `node testes.cjs`. Os testes usam respostas simuladas para verificar a lógica e o DOM sem depender da disponibilidade da API. Eles não substituem uma consulta real no navegador.

| Cenário | Resultado esperado |
| --- | --- |
| CEP válido `01001-000` | Exibe Praça da Sé, bairro Sé, São Paulo/SP |
| Formato inválido `123` | Mostra mensagem de validação sem chamar a API |
| CEP inexistente `99999999` | Mostra CEP não encontrado e oculta o resultado anterior |
| Falha de rede ou HTTP | Mostra mensagem amigável e libera uma nova tentativa |
| Tempo esgotado | Mostra mensagem para tentar novamente |

Para verificar manualmente, abra a página e consulte `01001-000`, depois `123` e `99999999`. Para testar uma falha de conexão, ative o modo Offline nas ferramentas de desenvolvimento do navegador e consulte um CEP válido.

## Publicação no GitHub Pages

1. Envie os arquivos desta pasta para a raiz do repositório.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch `main` e a pasta `/ (root)`, depois clique em **Save**.
5. Aguarde a publicação e copie o endereço exibido em Pages.

Repositório da atividade: https://github.com/thirodrigues21012010-blip/buscador-cep

Site publicado: https://thirodrigues21012010-blip.github.io/buscador-cep/

Os testes automatizados foram executados com sucesso. Também foram verificados dois cenários no site publicado: `01001-000` retornou Praça da Sé, Sé, São Paulo/SP; `123` exibiu a mensagem de validação de oito números. O GitHub Pages concluiu a implantação com sucesso.

Documentação da API: https://viacep.com.br/
