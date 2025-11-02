# 🎭 Anon Meme Generator

Uma rede social completa para gerar memes usando Inteligência Artificial (OpenAI). Inspirada no estilo do 4chan, com interface moderna e funcionalidades completas.

## ✨ Funcionalidades

- 🎨 **Geração de Memes com IA**: Crie memes únicos usando DALL-E 3 e GPT-4
- 📱 **Feed de Memes**: Visualize todos os memes criados pela comunidade
- 🏆 **Hall of Fame**: Confira os memes mais populares
- ❤️ **Sistema de Likes**: Curta seus memes favoritos
- 👁️ **Contadores**: Visualizações e estatísticas em tempo real
- 📊 **Estatísticas**: Acompanhe o total de visitantes e memes criados
- 🎯 **Interface Responsiva**: Funciona perfeitamente em desktop e mobile

## 🚀 Tecnologias

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- OpenAI API (DALL-E 3 + GPT-4)

### Frontend
- HTML5
- CSS3 (Design moderno com gradientes e animações)
- JavaScript (Vanilla)

## 📦 Instalação Local

### Pré-requisitos
- Node.js (v14 ou superior)
- MongoDB (local ou MongoDB Atlas)
- Chave da API OpenAI

### Passos

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd memegenerate
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha com suas credenciais:

```env
PORT=3000
MONGODB_URI=sua_connection_string_do_mongodb
OPENAI_API_KEY=sua_chave_da_openai
NODE_ENV=development
```

4. Inicie o servidor:
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

5. Acesse no navegador:
```
http://localhost:3000
```

## 🌐 Deploy no Render

### Opção 1: Deploy Automático com render.yaml

1. Crie uma conta no [Render](https://render.com)

2. Crie um banco de dados MongoDB:
   - **Opção A**: Use MongoDB Atlas (recomendado para free tier)
     - Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     - Crie um cluster gratuito
     - Obtenha a connection string

   - **Opção B**: Use outro provedor de MongoDB

3. Configure o repositório Git:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <seu-repositorio-github>
git push -u origin main
```

4. No Render Dashboard:
   - Clique em "New +"
   - Selecione "Blueprint"
   - Conecte seu repositório GitHub
   - O Render detectará automaticamente o `render.yaml`

5. Configure as variáveis de ambiente no Render:
   - `MONGODB_URI`: Sua connection string do MongoDB
   - `OPENAI_API_KEY`: Sua chave da OpenAI
   - As outras variáveis já estão configuradas no render.yaml

6. Clique em "Apply" e aguarde o deploy!

### Opção 2: Deploy Manual

1. No Render Dashboard, clique em "New +" → "Web Service"
2. Conecte seu repositório
3. Configure:
   - **Name**: meme-generator (ou nome de sua escolha)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Adicione as variáveis de ambiente
5. Clique em "Create Web Service"

## 🔑 Obtendo as Chaves

### OpenAI API Key
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Faça login ou crie uma conta
3. Vá em "API Keys"
4. Clique em "Create new secret key"
5. Copie e guarde a chave (você só verá uma vez!)

**Importante**: A API da OpenAI é paga. Verifique os preços:
- DALL-E 3: ~$0.04 por imagem (1024x1024)
- GPT-4: ~$0.03 por 1K tokens

### MongoDB Atlas
1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um cluster (escolha o tier gratuito)
4. Configure acesso de rede (0.0.0.0/0 para aceitar de qualquer IP)
5. Crie um usuário de banco de dados
6. Obtenha a connection string em "Connect" → "Connect your application"
7. Substitua `<password>` pela senha do seu usuário

## 📁 Estrutura do Projeto

```
memegenerate/
├── server/
│   ├── config/
│   │   └── database.js          # Configuração MongoDB
│   ├── controllers/
│   │   └── memeController.js    # Lógica de negócio
│   ├── models/
│   │   ├── Meme.js             # Schema de Meme
│   │   └── Stats.js            # Schema de Estatísticas
│   └── routes/
│       └── memeRoutes.js       # Rotas da API
├── public/
│   ├── css/
│   │   └── style.css           # Estilos
│   ├── js/
│   │   └── app.js              # JavaScript frontend
│   └── index.html              # HTML principal
├── server.js                   # Servidor Express
├── package.json
├── render.yaml                 # Configuração Render
├── .env.example
├── .gitignore
└── README.md
```

## 🎯 Endpoints da API

### Memes
- `POST /api/memes/generate` - Gerar novo meme
- `GET /api/memes` - Listar memes (com paginação)
- `GET /api/memes/hall-of-fame` - Top 10 memes
- `POST /api/memes/:id/like` - Dar like em um meme
- `POST /api/memes/:id/view` - Registrar visualização

### Estatísticas
- `GET /api/memes/stats/info` - Obter estatísticas gerais

## 🎨 Exemplo de Uso

### Gerar um Meme via API

```javascript
const response = await fetch('/api/memes/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'cat wearing sunglasses saying deal with it',
    author: 'YourName'
  })
});

const data = await response.json();
console.log(data.meme);
```

## 🔒 Segurança

- Variáveis de ambiente para credenciais sensíveis
- CORS configurado
- Validação de inputs
- Rate limiting recomendado para produção
- Sanitização de HTML no frontend

## 📝 Melhorias Futuras

- [ ] Sistema de autenticação de usuários
- [ ] Comentários em memes
- [ ] Compartilhamento em redes sociais
- [ ] Upload de imagens customizadas
- [ ] Rate limiting
- [ ] Cache com Redis
- [ ] Compressão de imagens
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro/claro

## 🐛 Troubleshooting

### Erro: "Cannot connect to MongoDB"
- Verifique se a MONGODB_URI está correta
- Confira se seu IP está liberado no MongoDB Atlas
- Teste a connection string diretamente

### Erro: "OpenAI API key invalid"
- Verifique se a chave está correta no .env
- Certifique-se que tem créditos na conta OpenAI
- Verifique se a chave tem permissões para DALL-E e GPT-4

### Deploy no Render não funciona
- Verifique os logs no Render Dashboard
- Confirme que todas as variáveis de ambiente estão configuradas
- Certifique-se que o render.yaml está na raiz do projeto

## 📄 Licença

MIT License - sinta-se livre para usar este projeto!

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando Claude Code

---

**Nota**: Este projeto usa a API paga da OpenAI. Monitore seu uso para evitar custos inesperados!
