# nosso-pet
# Nosso Pet Banho e Tosa

Site público em Next.js 16 com uma fundação Supabase versionada. A home consome a camada pública agregada em `src/data/queries`; os dados locais em `src/config` e `src/data` permanecem apenas como fallback técnico e apresentação temporária da galeria vazia.

O fluxo de leitura é `Supabase → repositories → queries → adapters → modelos de domínio → page.tsx → componentes`. A agregação `getPublicSiteDataWithFallback()` aplica fallback local por recurso, diferencia respostas vazias de falhas e informa a origem de cada conjunto de dados. Os modelos remotos usam o UUID do banco em `id` e preservam `slug` como identidade estável de domínio; a sacola aceita tanto UUIDs remotos quanto IDs locais estáveis.

A rota `/` usa ISR com revalidação de 60 segundos. Em produção, uma alteração editorial aparece após a primeira visita posterior ao intervalo de revalidação; enquanto a atualização é calculada, o Next pode servir a versão anterior. A leitura pública usa somente a Publishable Key e as policies RLS. O painel invalida a rota imediatamente com `revalidatePath("/")` após uma gravação editorial bem-sucedida.

O painel permite editar o registro único de empresa em `/admin/settings` e gerenciar categorias, produtos, serviços, FAQ e galeria em `/admin/categories`, `/admin/products`, `/admin/services`, `/admin/faqs` e `/admin/gallery`. Todas as mutações usam Server Actions, repetem a autorização de administrador, validam e limitam os campos aceitos, gravam com a sessão SSR sujeita a RLS e retornam apenas feedback seguro. Imagens existentes de produtos e serviços são preservadas; o upload desta etapa é exclusivo da galeria.

Telefone e WhatsApp são editados no formato legível brasileiro com DDD. No servidor, a pontuação é removida; `phone_raw` preserva DDD + número e `whatsapp_raw` usa `55` + DDD + número, aceitando entrada com ou sem `+55` sem duplicá-lo. Horários são editados por dia, como aberto/fechado e intervalo, e persistidos em JSONB como `HH:mm-HH:mm` ou `closed`; JSON cru nunca é aceito pelo formulário.

Os arquivos locais continuam sendo fallback técnico e não são alterados pelo painel. Se o Supabase estiver indisponível, o site público poderá exibir conteúdo local anterior às alterações administrativas.

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

Na galeria, imagens JPEG, PNG, WebP e AVIF de até 20 MiB são decodificadas no navegador, sem ampliar, e limitadas a 1920 px no maior lado. Fotos viram WebP com qualidade 0,82; PNG com transparência permanece PNG. O resultado, novamente limitado a 5 MiB, é enviado com UUID em `gallery/`. O servidor valida sessão administrativa, path, MIME e tamanho antes de registrar a metadata. Falha de cadastro remove o arquivo novo; substituição só remove o arquivo antigo depois de atualizar o registro. Na exclusão, o registro é removido primeiro para nunca deixar a home apontando para arquivo ausente, e uma eventual falha de Storage é registrada para limpeza posterior. Sem foto publicada, a home mantém temporariamente a galeria ilustrativa local.

O usuário criado manualmente deve estar com o e-mail confirmado antes do primeiro login. O painel não oferece cadastro, confirmação de e-mail nem recuperação de senha. A autenticação administrativa usa uma Server Action, cookies gerenciados por `@supabase/ssr` e refresh em `proxy.ts`; a autorização final sempre ocorre no servidor consultando `profiles.role = 'admin'` com a sessão do próprio usuário e respeitando RLS.

Na migração futura da home, mantenha o `slug` como identidade estável de domínio (os slugs de produtos preservam os IDs locais atuais) e use o UUID apenas como chave do banco.
