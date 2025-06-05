# StudyTrack

> Este projeto foi desenvolvido para avaliação da disciplina de Código de Alta Performance

Plataforma de organização de estudos com acompanhamento de progresso, autenticação segura e administração de tópicos/passos.

## Funcionalidades

- Cadastro de usuário com verificação de e-mail
- Login seguro (JWT, cookies httpOnly, bcrypt)
- Recuperação de senha por e-mail
- Dashboard com tópicos seguidos, progresso e tópicos disponíveis
- Marcação de passos como concluído/não concluído
- Seguir e deixar de seguir tópicos
- Administração de tópicos/passos (painel admin)

## Tecnologias

- Node.js + Express
- Prisma ORM (SQLite)
- EJS (views)
- Nodemailer (envio de e-mails)
- TypeScript

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/siyFred/studytrack.git
   cd studytrack
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure o ambiente:**
   - Crie um arquivo `.env` com as variáveis:
     ```env
     DATABASE_URL="file:./prisma/dev.db"
     PORT=3000

     JWT_SECRET="sua_chave_secreta"
     ADMIN_SECRET="admin"

     EMAIL_HOST=smtp.gmail.com
     EMAIL_PORT=587
     EMAIL_USER="seu_email@gmail.com"
     EMAIL_PASS="sua_senha"
     EMAIL_FROM=App <seu_email@gmail.com>
     ```
4. **Rode as migrations:**
   ```bash
   npx prisma migrate dev
   ```
5. **Inicie o servidor em modo dev:**
   ```bash
   npm run dev
   ```
   O servidor reinicia automaticamente ao salvar arquivos.

## Scripts

- `npm run dev` — Inicia o servidor com hot-reload
- `npm start` — Inicia o servidor

## Estrutura

- `src/` — Código-fonte (controllers, rotas, middlewares, views)
- `prisma/` — Banco de dados e migrations
- `public/` — Arquivos estáticos (CSS, imagens)

## Admin

- Acesse `/admin/login` com a senha definida em `ADMIN_SECRET` para criar tópicos/passos.

## Tasks

### Backend

- [x] Criar setup inicial
- [x] Criar conexão com banco de dados
- [x] Criar modelos do banco de dados
- [x] Criar rotas (crud)
- [x] Adicionar autenticação nas rotas
- [x] Implementar cache com Cookie parser para sessão de usuário

### Frontend
- [x] Criar tela Home
- [x] Criar tela Login
- [x] Criar tela Register
- [x] Criar tela de recuperação de senha
- [x] Criar tela Dashboard
- [x] Criar tela para Topics
