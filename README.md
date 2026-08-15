# nosso-pet
# Nosso Pet Banho e Tosa

Site público em Next.js 16 com uma fundação Supabase versionada. A camada pública de leitura está preparada em `src/data/queries`, mas a home continua usando os dados locais em `src/config` e `src/data`; a migração da interface fica para a Etapa 4.

O fluxo de leitura é `Supabase → repositories → queries → adapters → modelos de domínio`. A agregação `getPublicSiteDataWithFallback()` aplica fallback local por recurso, diferencia respostas vazias de falhas e informa a origem de cada conjunto de dados. Os modelos remotos usam o UUID do banco em `id` e preservam `slug` como identidade estável de domínio. Durante a transição, os produtos de fallback mantêm seus IDs locais; a sacola só será adaptada quando a home for migrada.

## Desenvolvimento local

Pré-requisitos: Node.js 22 LTS, npm, Supabase CLI e um runtime Docker compatível.

```bash
nvm use
npm install
cp .env.example .env.local
supabase start
supabase db reset
npm run dev
```

Preencha em `.env.local` os valores exibidos por `supabase status`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Validações do projeto:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Após alterar migrations, recrie o banco e atualize o snapshot de tipos:

```bash
supabase db reset
npm run db:types
```

## Primeiro administrador

O cadastro público está desativado. Crie o usuário pelo Dashboard em **Authentication > Users** (ou por uma ferramenta administrativa segura) e então associe o UUID criado, usando o SQL Editor autenticado como administrador do projeto:

```sql
insert into public.profiles (id, display_name, role)
values ('UUID_DO_AUTH_USER', 'Nome do administrador', 'admin');
```

Não use uma chave `service_role` no navegador nem a adicione ao repositório. O bucket público `site-assets` aceita somente imagens JPEG, PNG, WebP ou AVIF de até 5 MiB; escritas ficam limitadas a administradores e aos diretórios `products/`, `services/` e `gallery/`. O futuro painel também deverá validar MIME, extensão e nomes seguros antes do upload.

Na migração futura da home, mantenha o `slug` como identidade estável de domínio (os slugs de produtos preservam os IDs locais atuais) e use o UUID apenas como chave do banco.
