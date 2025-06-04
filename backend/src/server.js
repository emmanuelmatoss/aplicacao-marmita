// 1. Importando os pacotes necessários
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const authMiddleware = require('./middlewares/authMiddleware');

// 2. Inicializando a aplicação Express e o Prisma
const app = express();
const prisma = new PrismaClient(); // Cria uma instância do Prisma Client

const PORT = process.env.PORT || 3000; // Define a porta do servidor

// 3. Configurando os Middlewares
app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json()); // Habilita o Express para entender requisições com corpo em JSON

// 4. Rotas

// 4.1 Rota de Teste
app.get('/', (req, res) => {
  res.send('API de Marmitas no ar!');
});

// 4.2 Rota de Autenticação
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, companyId } = req.body;
    const saltRounds = 10;

    // Criptografa a senha antes de salvar
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Cria o usuário no banco de dados usando o Prisma
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash, // Salva a senha criptografada
        companyId,    // Associa o usuário a uma empresa
      },
    });

    // Retorna o novo usuário criado (sem a senha)
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });

  } catch (error) {
    // Tratamento de erro (ex: email duplicado)
    if (error.code === 'P2002') { // Código de erro do Prisma para violação de constraint única
      return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Não foi possível registrar o usuário.' });
  }
});

//4.3 Rota de Login
app.post('/login', async (req,res) => {
  try {
    const { email, password } = req.body;

    // Encontra o usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Se o usuário não for encontrado, retorna o erro
    if (!user) {
      console.log('Usuário não encontrado no banco de dados para o email:', email);
      return res.status(404).json({ error: 'Usuário não encontrado.'});
    }

    // Compara a senha enviada com a senha criptografada no banco
    const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

    // Se a senha for inválida, retorna erro
    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Senha inválida.' });
    }

    // Se a senha for válida, gera um token JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Retorna o token e os dados do usuário
    res.status(200).json({
      message: 'Login bem-sucedido!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível fazer o login.'});
  }
});

// 4.4 Rota Middleware
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userFromDb = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true,
      }
    });

    if (!userFromDb) {
      return res.status(404).json({ error: 'Usuário do token não encontrado no banco.'});
    }

    res.status(200).json({
      message: 'Você está acessando uma rota protegida!',
      userFromToken: req.user,
      userDetails: userFromDb
    });

  } catch (error) {
    console.error("Erro ao buscar usuário do perfil:", error);
    res.status(500).json({ error: 'Erro ao buscar informações do perfil.' });
  }
});

// 5. Iniciando o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});