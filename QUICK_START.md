# ⚡ Quick Start - 5 Minutos para Rodar Localmente

## 1. Instale as dependências
```bash
npm install
```

## 2. Configure o arquivo .env

Abra o arquivo `.env` e preencha:

```env
PORT=3000
MONGODB_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster.mongodb.net/memedb?retryWrites=true&w=majority
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NODE_ENV=development
```

### Onde conseguir as chaves?

**MongoDB**:
- Grátis em [mongodb.com/atlas](https://mongodb.com/cloud/atlas)
- Crie um cluster M0 (free)
- Copie a connection string

**OpenAI**:
- Paga em [platform.openai.com](https://platform.openai.com)
- Crie uma API key
- Adicione créditos ($5-10 para começar)
- ⚠️ Custa ~$0.05 por meme gerado

## 3. Execute o servidor

```bash
# Desenvolvimento (reinicia automaticamente)
npm run dev

# Ou em modo produção
npm start
```

## 4. Acesse no navegador

```
http://localhost:3000
```

## 5. Teste!

1. Digite uma ideia de meme (ex: "cat wearing sunglasses")
2. Clique em "Generate Meme"
3. Aguarde 10-30 segundos
4. Veja seu meme aparecer no feed!

---

## Problemas Comuns

### Erro ao conectar MongoDB
- Verifique se a string de conexão está correta
- Certifique-se de ter substituído usuário e senha
- Libere o IP 0.0.0.0/0 no MongoDB Atlas

### Erro OpenAI
- Verifique se a chave está correta
- Certifique-se de ter créditos
- A chave deve começar com `sk-proj-`

### Porta em uso
- Mude a `PORT` no .env para 3001, 3002, etc.

---

## 🚀 Deploy no Render?

Veja o guia completo: [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)

**Resumo**:
1. Faça push para GitHub
2. Conecte no Render
3. Configure variáveis de ambiente
4. Deploy automático!

---

Divirta-se criando memes!
