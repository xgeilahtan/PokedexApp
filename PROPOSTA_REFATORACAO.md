# Proposta de Refatoração: Arquitetura MVVM (Model-View-ViewModel)

## 1. Padrão Escolhido
O padrão escolhido para a refatoração é o **MVVM (Model-View-ViewModel)**.

**Justificativa:** No ecossistema React e React Native, a interface do usuário (UI) é essencialmente uma representação reativa do estado da aplicação. O MVVM casa perfeitamente com essa filosofia, especialmente com o uso de *Custom Hooks*. Ao extrair a lógica de negócios e o gerenciamento de estado para um ViewModel (o Hook), a View se torna muito mais leve, declarativa e fácil de testar. Isso elimina o acoplamento excessivo que tínhamos na abordagem anterior, onde a View conhecia detalhes de implementação da API.

## 2. Nova Estrutura de Arquivos
A estrutura passará a adotar um agrupamento orientado a feature (domínio) para a tela da Pokédex, isolando o ViewModel da UI e criando contratos claros através de interfaces.

```text
PokedexApp/
├─ src/
│  ├─ features/
│  │  └─ Pokedex/
│  │     ├─ PokedexScreen.tsx         (View: UI e interação)
│  │     ├─ usePokedexViewModel.ts    (ViewModel: Estado e regras de negócio)
│  │     └─ components/               (Componentes visuais específicos desta feature)
│  │        ├─ PokemonList.tsx
│  │        └─ SearchBar.tsx
│  ├─ services/
│  │  └─ api.ts                       (Camada de Dados/Serviço)
│  └─ types/
│     └─ Pokemon.ts                   (Model: Contratos e Entidades)
```


## 3. Divisão de Responsabilidades (PokedexScreen)

A separação de conceitos ficará bem delimitada:

*   **O que fica na View (`PokedexScreen.tsx`):**
    *   **Responsabilidade:** Exclusivamente apresentação (UI) e captura de eventos do usuário. Trata-se de um componente "burro" (Dumb Component).
    *   **Implementação:** O arquivo não conterá `useEffect` para chamadas de rede ou lógicas complexas de filtragem. Ele apenas invocará o hook `const viewModel = usePokedexViewModel()` logo no início.
    *   **Consumo:** A View consumirá propriedades como `viewModel.pokemons`, `viewModel.isLoading` e repassará funções como `viewModel.handleSearchText` para os componentes filhos (ex: `SearchBar`).

*   **O que fica no ViewModel (`usePokedexViewModel.ts`):**
    *   **Responsabilidade:** É o "cérebro" da tela. Ele orquestra a comunicação entre a View e a camada de serviços (API), além de gerenciar o estado efêmero da tela.
    *   **Estados Expostos:**
        *   `pokemons` (A lista final de pokémons a ser renderizada, já processada/filtrada).
        *   `isLoading` (Booleano para controlar spinners e esqueletos de carregamento na View).
        *   `error` (Mensagem de erro amigável caso a requisição falhe).
    *   **Funções Expostas:**
        *   `fetchPokemons`: Função para buscar os dados iniciais.
        *   `handleSearchText`: Função que recebe a string de busca e atualiza a lista exibida.
    *   **Lógica Interna:** Aqui residem os `useStates` e `useEffects`. É o ViewModel que decide, por exemplo, se a busca deve ser feita localmente (filtrando um array em memória) ou se deve disparar uma nova requisição para a API caso o usuário digite algo.

## 4. Fluxo de Dados

O fluxo interativo, seguindo a reatividade do MVVM, é unidirecional e totalmente isolado. Abaixo está a descrição passo a passo do que acontece quando o usuário tenta buscar um Pokémon:

**Diagrama de Sequência Lógico:**
`Usuário (Input)` ➔ `View (Evento)` ➔ `ViewModel (Estado/Regra)` ➔ `Model/API (Dados)` ➔ `ViewModel (Atualiza Estado)` ➔ `View (Re-renderiza)`

**Passo a passo detalhado (Exemplo: Busca de Pokémon):**

1.  **Interação:** O usuário digita "Charizard" no componente `TextInput` presente na `PokedexScreen` (View).
2.  **Captura do Evento:** O evento `onChangeText` da View é acionado. A View não sabe o que fazer com esse texto, ela apenas o repassa chamando `viewModel.handleSearchText("Charizard")`.
3.  **Processamento (ViewModel):** O hook `usePokedexViewModel` recebe a string. Ele atualiza seu estado interno de busca (`setSearchQuery`).
4.  **Ação de Negócio:** Ao detectar a mudança no texto de busca, o ViewModel aplica a lógica de negócio. Se for uma busca local, ele aplica um `.filter()` na lista completa de pokémons que já estava armazenada em um estado interno e atualiza o estado público `pokemons`.
5.  **Reatividade:** Como o estado `pokemons` exportado pelo Hook foi alterado, o React sinaliza à `PokedexScreen` (View) que ela precisa ser re-renderizada.
6.  **Nova Renderização:** A View é redesenhada na tela do usuário, agora exibindo apenas os resultados filtrados (o card do Charizard), completando o ciclo sem nunca ter tocado em regras de negócios diretamente.
