# nosso-pet
# Nosso Pet Banho e Tosa

Site público em Next.js 16 com uma fundação Supabase versionada. A home consome a camada pública agregada em `src/data/queries`; conteúdo comercial administrável vem exclusivamente do Supabase.

O fluxo de leitura é `Supabase → repositories → queries → adapters → modelos de domínio → page.tsx → componentes`. A agregação `getPublicSiteDataSafe()` diferencia respostas vazias de falhas, registra recursos indisponíveis e usa estados neutros sem ressuscitar dados comerciais locais. Os modelos remotos usam o UUID do banco em `id` e preservam `slug` como identidade estável de domínio.

A rota `/` usa ISR com revalidação de 60 segundos. Em produção, uma alteração editorial aparece após a primeira visita posterior ao intervalo de revalidação; enquanto a atualização é calculada, o Next pode servir a versão anterior. A leitura pública usa somente a Publishable Key e as policies RLS. O painel invalida a rota imediatamente com `revalidatePath("/")` após uma gravação editorial bem-sucedida.

O painel permite editar os dados da empresa em `/admin/settings`, os principais conteúdos comerciais da Home em `/admin/content` e gerenciar o catálogo por categorias, grupos e opções em `/admin/products`, além de serviços, FAQ e galeria. Todas as mutações usam Server Actions, repetem a autorização de administrador, validam e limitam os campos aceitos, gravam com a sessão SSR sujeita a RLS e retornam apenas feedback seguro. Serviços continuam apresentados pelos ícones de `icon_key` e não oferecem upload de imagem.

Telefone e WhatsApp são editados no formato legível brasileiro com DDD. No servidor, a pontuação é removida; `phone_raw` preserva DDD + número e `whatsapp_raw` usa `55` + DDD + número, aceitando entrada com ou sem `+55` sem duplicá-lo. Horários são editados por dia, como aberto/fechado e intervalo, e persistidos em JSONB como `HH:mm-HH:mm` ou `closed`; JSON cru nunca é aceito pelo formulário.

Se um recurso comercial do Supabase estiver indisponível, sua seção recebe uma coleção vazia e nenhum preço, serviço, FAQ ou item fictício é exibido. A ausência de `business_settings` continua sendo tratada como erro, pois não há identidade comercial segura para renderizar a página.

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

Ao encerrar o ambiente local, execute `supabase stop`.

Preencha em `.env.local` os valores exibidos por `supabase status`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Validações do projeto:

```bash
npm run lint
npm run typecheck
npm test
npm run build
supabase db lint --local
supabase db lint --linked
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

Não use uma chave `service_role` no navegador nem a adicione ao repositório. O bucket público `site-assets` aceita somente imagens JPEG, PNG, WebP ou AVIF de até 5 MiB; escritas ficam limitadas a administradores e aos diretórios `hero/`, `gallery/`, `categories/` e `options/`. O upload da galeria também valida MIME, tamanho, extensão e nomes seguros antes de registrar o arquivo.

Na galeria, imagens JPEG, PNG, WebP e AVIF de até 20 MiB são decodificadas no navegador, sem ampliar, e limitadas a 1920 px no maior lado. Fotos viram WebP com qualidade 0,82; PNG com transparência permanece PNG. O resultado, novamente limitado a 5 MiB, é enviado com UUID em `gallery/`. O servidor valida sessão administrativa, path, MIME e tamanho antes de registrar a metadata. Falha de cadastro remove o arquivo novo; substituição só remove o arquivo antigo depois de atualizar o registro. Na exclusão, o registro é removido primeiro para nunca deixar a home apontando para arquivo ausente, e uma eventual falha de Storage é registrada para limpeza posterior. Sem foto publicada, a home exibe um estado vazio neutro.

As imagens têm vínculos explícitos. Um upload em `/admin/gallery` cria ou substitui `gallery_images.storage_path` e aparece somente em “Clientes de quatro patas”. O Hero usa `business_settings.hero_image_path` e o prefixo `hero/`, administrados em `/admin/settings`; `public/images/hero-pets.png` permanece como fallback. `services.image_path` permanece preparado para evolução futura, enquanto os cards usam `icon_key`. A Galeria não controla Hero ou Serviço e não funciona como CMS genérico.

O usuário criado manualmente deve estar com o e-mail confirmado antes do primeiro login. O painel não oferece cadastro, confirmação de e-mail nem recuperação de senha. A autenticação administrativa usa uma Server Action, cookies gerenciados por `@supabase/ssr` e refresh em `proxy.ts`; a autorização final sempre ocorre no servidor consultando `profiles.role = 'admin'` com a sessão do próprio usuário e respeitando RLS.

No catálogo e nos serviços, mantenha o `slug` como identidade estável de domínio e use o UUID apenas como chave do banco.

## Operação em produção

### Netlify e variáveis de ambiente

- Build command: `npm run build`.
- Publish directory: `.next`.
- Runtime: Node.js 22, definido em `package.json` e `.nvmrc`.
- Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no ambiente de produção e nos previews que precisarem acessar o projeto remoto.
- Não configure `service_role`, secret key, senha de banco ou credenciais de administrador no frontend.
- O deploy usa o runtime Next.js da plataforma e não depende de Docker. Docker é necessário apenas para a pilha Supabase local.
- O adapter OpenNext atual é aplicado automaticamente pelo Netlify. Não fixe nem adicione `@netlify/plugin-nextjs` ao repositório sem uma necessidade comprovada.
- O fluxo recomendado é validar `dev`, fazer merge manual em `main` e deixar o Netlify publicar a produção. Se deploy previews estiverem ativos para `dev`, eles também consomem créditos.

O layout usa atualmente `https://nossopettaboao.com.br` como `metadataBase`, mas a origem definitiva de produção ainda precisa ser confirmada. Quando ela for definida, alinhe a metadata e configure no Supabase Auth:

- **Site URL**: `https://DOMINIO_DE_PRODUCAO`.
- **Redirect URLs**: `https://DOMINIO_DE_PRODUCAO/admin/**` e as URLs exatas de preview autorizadas, se previews administrativos forem necessários.
- Desenvolvimento local: mantenha `http://localhost:3000/admin/**` somente nos ambientes em que o login local for usado.

Administradores são criados manualmente em Authentication, devem ter o e-mail confirmado e precisam de um registro correspondente em `public.profiles` com `role = 'admin'`. Não há cadastro público. Nunca altere automaticamente a senha de um administrador existente.

### Migrations e testes SQL

O fluxo operacional é: criar uma migration, testar com `supabase db reset`, executar lint e testes locais, aplicar com `supabase db push`, confirmar com `supabase migration list` e somente então fazer deploy. Não edite manualmente o histórico remoto para contornar divergências.

Os arquivos em `supabase/tests/` são testes de integração SQL transacionais, não TAP. Por isso, execute-os diretamente contra o banco local; cada arquivo termina com `rollback` e não deixa fixtures:

```bash
psql "$(supabase status -o env | sed -n 's/^DB_URL=//p')" -v ON_ERROR_STOP=1 -f supabase/tests/admin_products_services.sql
psql "$(supabase status -o env | sed -n 's/^DB_URL=//p')" -v ON_ERROR_STOP=1 -f supabase/tests/admin_faq_gallery.sql
```

`supabase test db` não deve ser usado como sinal de sucesso enquanto esses arquivos não forem convertidos para TAP.

Se `psql` não estiver instalado no host, os mesmos arquivos podem ser enviados ao `psql` do contêiner `supabase_db_nosso-pet`; mantenha `ON_ERROR_STOP=1`. Os testes são transacionais e terminam em `rollback`.

### Cache e limitações conhecidas

A home mantém `revalidate = 60`, e as mutações editoriais de Empresa, Categorias, Produtos, Serviços, FAQ e Galeria invalidam `/` após sucesso. Falhas de recursos comerciais são registradas e resultam em estados neutros; `business_settings` indisponível impede a renderização comercial da home.

O admin publica metadata `noindex, nofollow`, e `robots.ts` bloqueia `/admin/`. A home permanece indexável. O sitemap deve ser adicionado somente quando a origem final (URL Netlify ou domínio customizado) estiver confirmada; não use uma origem provisória como canônica.

### Checklist operacional

- [ ] Smoke admin local/remoto concluído e dados restaurados.
- [ ] Envs de produção do Netlify conferidas.
- [ ] Site URL e Redirect URLs do Supabase Auth conferidas.
- [ ] Branch `dev` validada e merge manual `dev` → `main` concluído.
- [ ] Deploy Netlify concluído sem eventos `public_data_unavailable`.
- [ ] Smoke de produção público/admin/mobile concluído.
- [ ] Documentação e acessos operacionais entregues ao cliente.

- [ ] Migrations locais e remotas estão sincronizadas; `supabase db lint --linked` passa.
- [ ] Variáveis públicas do Supabase estão configuradas sem secrets.
- [ ] Site URL e Redirect URLs usam o domínio definitivo.
- [ ] Administrador real existe, tem e-mail confirmado e profile `admin`.
- [ ] `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passam.
- [ ] Smoke público valida Hero, Serviços, Booking, TaxiPet, Produtos, Sacola, Galeria, FAQ, Mapa, Footer e WhatsApp em mobile e desktop.
- [ ] Smoke autenticado valida login, dashboard, todos os CRUDs, upload/substituição/exclusão da galeria, logout e expiração de sessão.
- [ ] Dados temporários do smoke foram removidos e dados comerciais restaurados.

Checklist manual detalhado do painel:

- [ ] Empresa: editar, salvar, conferir a home e restaurar os valores.
- [ ] Categorias: criar, editar, desativar, ativar, bloquear exclusão com produto e excluir uma categoria vazia.
- [ ] Produtos: criar com preço vazio e decimal, editar, destacar, desativar, ativar e excluir.
- [ ] Serviços: validar preço fixo, a partir de e sob consulta; agendável/não agendável; editar, alternar status e excluir.
- [ ] FAQ: criar, editar, publicar, despublicar e excluir.
- [ ] Galeria: otimizar, enviar, editar metadata, substituir, publicar, despublicar e excluir; conferir ausência de arquivo órfão no fluxo normal.
- [ ] Segurança: anon e authenticated sem profile não gravam; toda Server Action exige admin; logout e sessão expirada voltam ao login.
