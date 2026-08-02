# Teste Técnico - Recomendador de Produtos RD Station

> **Solução implementada por Monalisa Menezes.**
> As notas abaixo cobrem execução, a regra de recomendação, as decisões tomadas e o que foi
> deliberadamente deixado como está. O enunciado original segue preservado a partir de
> [Missão](#missão).

---

## 🚀 Como executar

**Node.js 18** é obrigatório. O projeto usa Create React App 5, que não compila em versões
mais recentes do Node (o `openssl` do Node 20+ quebra o build do Webpack 5 usado pelo CRA).
Há um `.nvmrc` na raiz fixando a versão:

```bash
nvm use          # lê o .nvmrc e ativa o Node 18
bash install.sh  # instala raiz, backend e frontend
yarn start       # sobe backend (:3001) e frontend (:3000) juntos
```

Se preferir dois terminais separados:

```bash
# terminal 1
cd backend  && nvm use && yarn start   # json-server em http://localhost:3001

# terminal 2
cd frontend && nvm use && yarn start   # aplicação em http://localhost:3000
```

Testes:

```bash
cd frontend && nvm use && yarn test
```

> ⚠️ O `nvm use` vale por terminal — cada aba nova precisa dele antes do `yarn`.

---

## 🧠 A regra de recomendação

Cada produto recebe uma **pontuação**: o número de preferências selecionadas que ele atende
somado ao número de funcionalidades selecionadas que ele atende. Produtos com pontuação
maior que zero são considerados recomendáveis.

| Tipo de recomendação | Retorno |
| --- | --- |
| `MultipleProducts` | Todos os produtos com pontuação > 0, na ordem original do catálogo |
| `SingleProduct` | Um array com o produto de maior pontuação |
| Nenhum produto pontua | Array vazio, em ambos os tipos |

**Empate no `SingleProduct` devolve o último produto**, conforme o critério de aceite nº 5.
Isso está implementado com `>=` ao percorrer os candidatos guardando o campeão — quem
empata com o líder assume a liderança. Vale registrar que a solução aparentemente natural,
`sort` por pontuação decrescente seguido de `[0]`, **falharia**: o `sort` do JavaScript é
estável e preservaria a ordem original entre empatados, devolvendo o *primeiro*.

### Decisões onde a especificação não define

- **Preferência e funcionalidade têm o mesmo peso.** Os quatro testes fornecidos são todos
  simétricos (mesma quantidade de acertos dos dois lados), então não determinam o peso.
  Assumi 1 ponto para cada e documentei aqui em vez de introduzir uma ponderação que o
  enunciado não pede.
- **Basta pontuar de um lado.** Um produto que atende só preferências, ou só
  funcionalidades, é recomendado. Exigir correspondência nos dois lados descartaria
  produtos legitimamente relevantes e contraria o critério de aceite nº 6.
- **Sem tipo selecionado, o comportamento é o de `MultipleProducts`.** É o retorno menos
  destrutivo: mostra tudo que serve em vez de escolher por conta própria.

---

## ⚡ Complexidade

Sendo `P` o número de preferências selecionadas, `F` o de funcionalidades, `N` o de produtos
e `k` a quantidade de atributos por produto:

| | Construção | Consultas | Total |
| --- | --- | --- | --- |
| Com `Set` | `O(P + F)` | `N · k · O(1)` | **`O(P + F + N)`** |
| Com `Array.includes` | — | `N · k · O(P + F)` | `O(N · (P + F))` |

As duas listas selecionadas são convertidas em `Set` **uma única vez, fora do laço** — elas
são invariantes da iteração, e reconstruí-las por produto anularia o ganho. A pontuação de
cada produto também é calculada uma só vez e carregada adiante, em vez de recalculada no
desempate.

Na escala real deste catálogo (4 produtos, 12 atributos) o ganho de tempo é irrelevante e
seria desonesto vendê-lo como otimização. O motivo de fundo é de legibilidade: `Set`
declara a intenção — *esta coleção existe para responder se um item pertence a ela*.

---

## 🔧 Alterações fora dos três arquivos do enunciado

O enunciado aponta `App.js`, `Form.js` e `recommendation.service.js`. Os ajustes abaixo
saíram desse recorte, e cada um responde a um critério de aceite ou impedia a execução.

| Arquivo | O que mudou | Por quê |
| --- | --- | --- |
| `hooks/useProducts.js` | Passa a listar todas as opções, sem duplicatas | Havia um `sort(() => Math.random() - 0.5).slice(0, 2)` que escondia **um terço do catálogo** a cada carregamento, de forma diferente a cada F5. O critério de aceite nº 1 exige receber as preferências do usuário pelo formulário, e não é possível selecionar uma opção que a tela não exibe — `Integração fácil com ferramentas de e-mail`, usada em dois dos testes fornecidos, podia simplesmente não aparecer. O `sort` ainda **mutava** o array de cada produto, os mesmos objetos pontuados depois. |
| `components/Form/Fields/RecommendationType.js` | Rótulos associados aos rádios, agrupados em `fieldset`/`legend` | Os `<label htmlFor="SingleProduct">` apontavam para `id`s que não existem em lugar nenhum. Na prática: clicar no texto não selecionava a opção, e um leitor de tela anunciava um rádio sem nome. Passou a usar o mesmo componente `Checkbox` de rótulo envolvente dos demais campos. |
| `package.json` (raiz) | `concurrently` declarado; `start` sobe backend e frontend | O script `dev` usava `concurrently` sem declará-lo, e `start` chamava `lerna run start` com `workspaces` apontando para `packages/*`, pasta que não existe no projeto — nenhum dos dois subia a aplicação. |
| `.nvmrc`, `.gitignore` | Node fixado em 18; ignorar `build`, `coverage` e `.env` | Reprodutibilidade do ambiente e higiene do repositório. |

---

## ✅ Testes

```
Test Suites: 2 passed, 2 total
Tests:       18 passed, 18 total
```

Os **quatro testes fornecidos foram mantidos intactos**. Os novos cobrem os casos de uso do
README que não tinham teste:

**`recommendation.service.test.js`** — lista vazia quando nada corresponde (nos dois tipos);
lista vazia quando o usuário não seleciona nada; correspondência apenas por preferência;
correspondência apenas por funcionalidade; escolha pelo **maior** score no `SingleProduct`
(e não simplesmente pelo último); preservação da ordem do catálogo, não a da seleção;
imutabilidade do array de produtos recebido; chamadas sem `formData` e sem produtos.

**`App.test.js`** — teste de integração do fluxo completo, com o serviço de produtos
mockado: estado inicial vazio, catálogo exibido por inteiro, e marcar opções → submeter →
ver a lista renderizada, nos dois tipos de recomendação. Ele cobre a ligação
`Form` → `App` → `RecommendationList`, que os testes de serviço não alcançam.

---

## 🏛️ Onde vive o estado

`Form` e `RecommendationList` são irmãos na árvore, e no React os dados não trafegam
lateralmente. O estado das recomendações vive no `App`, o ancestral comum mais próximo
(*lifting state up*); o `Form` recebe a callback `onRecommendationsChange` e apenas notifica
o resultado, sem saber quem consome.

O hook `useRecommendations` já vinha com um `useState` interno e o expõe. Ele foi
**deliberadamente deixado sem uso**: aquele estado vive dentro do `Form`, enquanto a lista
renderizada lê o estado do `App`. Usá-lo criaria duas fontes de verdade — o clique
atualizaria um estado que a tela não observa, e nada apareceria.

---

## 🔍 Pontos identificados e deliberadamente não alterados

Mantidos como estão por ficarem fora do que o enunciado pede, mas registrados aqui porque
foram vistos:

- **`axios` é uma dependência fantasma.** O `product.service.js` importa `axios`, mas nenhum
  `package.json` o declara. Ele é resolvido por acaso, através de `lerna → nx@17.3.1 →
  axios@1.6.7`, no `node_modules` da raiz. Funciona hoje e não impede nenhum critério de
  aceite, mas quebraria ao instalar apenas o frontend ou quando o lerna mudasse de versão.
  Declará-lo alteraria o `yarn.lock` do frontend, mudança que preferi não fazer às vésperas
  da entrega.
- **Estado duplicado em `Preferences.js` e `Features.js`.** Cada um guarda a seleção em um
  `useState` interno *e* a envia ao `formData` do `Form`. Funciona, mas são duas cópias da
  mesma informação; a versão do componente venceria em caso de divergência.
- **`useForm` sem updater funcional.** `setFormData({ ...formData, [field]: value })` lê
  `formData` da closure. Dois campos atualizados no mesmo ciclo perderiam um dos valores.
  Não acontece no fluxo atual, em que cada interação é um evento isolado.
- **`workspaces: ["packages/*"]` na raiz** aponta para uma pasta inexistente. Corrigir
  reorganizaria o *hoisting* de todos os `node_modules` às vésperas da entrega; contornei
  no script `start`, que não depende mais do lerna.
- **`key={index}` nas listas.** Sem reordenação ou remoção no meio das listas, o índice não
  causa problema aqui.

---

Este projeto é parte do teste técnico para a vaga de desenvolvedor front-end na RD Station. O objetivo principal é implementar a lógica de recomendação de produtos RD Station em uma aplicação web existente.

## Missão

Sua missão é desenvolver a funcionalidade central de recomendação de produtos dentro de uma aplicação React.js pré-existente. Você deverá implementar a lógica que permite aos usuários selecionar suas preferências e funcionalidades desejadas, e então receber recomendações de produtos correspondentes.

## Contexto

Este projeto é parte de uma etapa técnica do processo seletivo para a vaga de desenvolvedor front-end na RD Station. A estrutura básica da aplicação já está construída com React.js para o front-end e utiliza json-server para simular um servidor RESTful com dados de produtos.

Seu foco deve ser na implementação da lógica de recomendação e na integração desta funcionalidade com a interface do usuário existente. A aplicação já possui um layout básico utilizando Tailwind CSS.

## Tecnologias Utilizadas

Este projeto utiliza as seguintes tecnologias principais:

- React.js: Para o desenvolvimento do front-end
- json-server: Para simular um servidor RESTful com dados de produtos
- Tailwind CSS: Para estilização e layout responsivo

## Requisitos Técnicos

### Familiaridade com Tailwind CSS

O layout da aplicação foi desenvolvido utilizando Tailwind CSS. Familiaridade básica com este framework de CSS utilitário será útil para entender e potencialmente modificar o layout existente.

### Versão do Node.js

Este projeto requer Node.js versão 18.3 ou superior. Se você não tem essa versão instalada, siga as instruções abaixo para instalá-la usando `n` ou `nvm`.

#### Usando `n` (Node Version Manager):

1. Instale `n` globalmente (caso ainda não tenha): npm install -g n

2. Instale e use a versão 18.3 do Node.js: n 18.3

#### Usando `nvm` (Node Version Manager):

1. Instale `nvm` (caso ainda não tenha) seguindo as instruções em: https://github.com/nvm-sh/nvm

2. Instale e use a versão 18.3 do Node.js: nvm install 18.3 & nvm use 18.3

Após instalar a versão correta do Node.js, você pode prosseguir com a instalação das dependências do projeto e iniciar o desenvolvimento.

## Foco do Desenvolvimento

Para completar este teste, você deve concentrar-se principalmente em três arquivos específicos:

1. `App.js`: Neste componente, você encontrará o comentário "Dadas atualizações no formulário, necessário atualizar a lista de recomendações". Implemente a lógica necessária para atualizar a lista de recomendações com base nas entradas do usuário.

2. `Form.js`: Este componente contém o comentário "Defina aqui a lógica para atualizar as recomendações e passar para a lista de recomendações". Desenvolva a lógica para processar as entradas do usuário e gerar as recomendações apropriadas.

3. `recommendation.service.js`: Neste arquivo de serviço, você verá o comentário "Crie aqui a lógica para retornar os produtos recomendados." Implemente a lógica de negócios para determinar quais produtos devem ser recomendados com base nos critérios fornecidos.

## Observações Adicionais

- Sinta-se à vontade para implementar melhorias na cobertura de testes e no layout da aplicação, caso tenha tempo adicional.
- O código existente serve como base para sua implementação. Concentre-se em desenvolver a funcionalidade de recomendação de produtos conforme especificado nos requisitos do projeto e nos arquivos mencionados acima.

## Requisitos

- Implementar a lógica de recomendação de produtos com base nas preferências do usuário.
- Utilizar React.js para o desenvolvimento do front-end.
- Consumir a API fornecida pelo json-server para obter os dados dos produtos.
- Seguir as boas práticas de desenvolvimento e organização de código.
- Implementar testes unitários para as funcionalidades desenvolvidas.

## Como Executar

1. Clone o repositório: `git clone <URL_DO_REPOSITORIO>`
2. Instale as dependências: `yarn install`
3. Para instalar o projeto, execute o script `./install.sh` 
4. Inicie a aplicação: `yarn start`

### Scripts Disponíveis

- `start`: Inicia a aplicação React em modo de desenvolvimento.
- `start:frontend`: Inicia apenas a parte frontend da aplicação em modo de desenvolvimento.
- `start:backend`: Inicia apenas a parte backend da aplicação em modo de desenvolvimento.
- `dev`: Inicia simultaneamente a parte frontend e backend da aplicação em modo de desenvolvimento.

## Critérios de Aceite

1. O serviço de recomendação de produtos deve ser capaz de receber as preferências e funcionalidades desejadas do usuário através de um formulário.
2. O serviço deve retornar recomendações de produtos com base nas preferências e funcionalidades selecionadas pelo usuário.
3. Se o tipo de recomendação selecionado for "SingleProduct", o serviço deve retornar apenas um produto que corresponda melhor às preferências e funcionalidades do usuário.
4. Se o tipo de recomendação selecionado for "MultipleProducts", o serviço deve retornar uma lista de produtos que correspondam às preferências e funcionalidades do usuário.
5. Em caso de empate na seleção de produtos com base nas preferências e funcionalidades do usuário, o serviço deve retornar o último produto que atende aos critérios de seleção.
6. O serviço deve ser capaz de lidar com diferentes tipos de preferências e funcionalidades selecionadas pelo usuário.
7. O serviço deve ser modular e facilmente extensível para futuras atualizações e adições de funcionalidades.

Certifique-se de que todos os critérios de aceite são atendidos durante o desenvolvimento do projeto.

## Autor

Desenvolvido por Monalisa Menezes

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
