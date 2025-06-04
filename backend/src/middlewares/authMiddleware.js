// backend/src/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken'); // Biblioteca para trabalhar com JWT

// A função do middleware
function authMiddleware(req, res, next) {
  // 1. Buscar o token no cabeçalho 'Authorization' da requisição.
  // O padrão é o token vir como: "Bearer SEU_TOKEN_AQUI"
  const authHeader = req.headers.authorization;

  // 2. Verificar se o cabeçalho de autorização e o token foram enviados.
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
  }

  // 3. Separar o "Bearer" do token em si.
  // "Bearer SEU_TOKEN_AQUI" -> ["Bearer", "SEU_TOKEN_AQUI"]
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts; // scheme = "Bearer", token = "SEU_TOKEN_AQUI"

  // 4. Verificar se o 'scheme' é realmente "Bearer".
  if (!/^Bearer$/i.test(scheme)) { // Expressão regular para checar "Bearer" (case-insensitive)
    return res.status(401).json({ error: 'Token mal formatado (esperado Bearer token).' });
  }

  // 5. Verificar a validade do token.
  // jwt.verify tenta decodificar o token usando sua chave secreta.
  // Se for bem-sucedido, 'decoded' conterá o payload do token (o que colocamos lá no login: userId, role).
  // Se falhar (token expirado, assinatura inválida), ele vai para o 'err'.
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Erro na verificação do JWT:", err.message); // Bom para depuração no servidor
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    // 6. SUCESSO! O token é válido.
    // Anexamos os dados decodificados do usuário (userId, role) ao objeto 'req'.
    // Assim, a rota que vier DEPOIS deste middleware poderá acessar req.user.
    req.user = decoded;

    // 7. Chama a próxima função na cadeia de middlewares/rotas.
    // É o "Pode passar!" do nosso segurança.
    return next();
  });
}

// Exporta a função para que possamos usá-la em server.js
module.exports = authMiddleware;