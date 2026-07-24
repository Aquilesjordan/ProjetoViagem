# Viagens Frontend

Aplicação frontend em React + TypeScript para o módulo de Viagens.

## Como executar

1. Copie `.env.example` para `.env` e configure a URL da API:

   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Gere a versão de produção:

   ```bash
   npm run build
   ```

## Estrutura

- `src/components/` - componentes reusáveis e layout
- `src/pages/` - páginas da aplicação
- `src/routes/` - rotas e proteção de navegação
- `src/contexts/` - contexto de autenticação e notificações
- `src/services/` - camada de API com Axios
- `src/hooks/` - hooks customizados com React Query
- `src/types/` - tipagens do cliente
- `src/utils/` - utilitários de formatação e armazenamento
