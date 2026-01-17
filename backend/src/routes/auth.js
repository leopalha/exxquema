const express = require('express');
const router = express.Router();

// Import middlewares
const { authenticate } = require('../middlewares/auth.middleware');
const { 
  validateUserRegistration,
  validateSMSCode,
  validateUserLogin
} = require('../middlewares/validation.middleware');

// Import controller
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     description: Cria um novo usuário no sistema e envia código SMS de verificação
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cpf
 *               - email
 *               - celular
 *               - password
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Silva
 *               cpf:
 *                 type: string
 *                 example: 12345678900
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               celular:
 *                 type: string
 *                 example: 11999887766
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: SMS enviado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     celular:
 *                       type: string
 *                       example: 11999887766
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', validateUserRegistration, authController.register);

/**
 * @route   POST /api/auth/register-phone
 * @desc    Cadastrar usuário apenas com telefone (perfil incompleto)
 * @access  Public
 * @body    { celular }
 */
router.post('/register-phone', authController.registerPhone);

/**
 * @route   POST /api/auth/verify-sms
 * @desc    Verificar código SMS e completar cadastro
 * @access  Public
 * @body    { celular, code }
 */
router.post('/verify-sms', validateSMSCode, authController.verifySMS);

/**
 * @route   POST /api/auth/resend-sms
 * @desc    Reenviar código SMS
 * @access  Public
 * @body    { celular }
 */
router.post('/resend-sms', authController.resendSMS);

/**
 * @route   DELETE /api/auth/delete-unverified/:email
 * @desc    Deletar usuário não verificado (apenas para testes)
 * @access  Public (temporário)
 */
router.delete('/delete-unverified/:email', authController.deleteUnverifiedUser);

/**
 * @route   POST /api/auth/login-sms
 * @desc    Iniciar login por SMS (enviar código)
 * @access  Public
 * @body    { celular }
 */
router.post('/login-sms', authController.loginSMS);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login com email e senha
 *     description: Autentica usuário e retorna token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', validateUserLogin, authController.loginPassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter dados do usuário logado
 *     description: Retorna informações do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', authenticate, authController.getMe);

/**
 * @route   PUT /api/auth/profile
 * @desc    Atualizar perfil do usuário
 * @access  Private
 * @body    { nome?, email? }
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @route   POST /api/auth/complete-profile
 * @desc    Completar perfil após cadastro por telefone
 * @access  Private
 * @body    { nome, email, password? }
 */
router.post('/complete-profile', authenticate, authController.completeProfile);

/**
 * @route   POST /api/auth/google
 * @desc    Autenticar/Cadastrar com Google OAuth 2.0
 * @access  Public
 * @body    { credential: string (JWT) }
 */
router.post('/google', authController.googleAuth);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout do usuário
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar recuperação de senha (envia código SMS)
 * @access  Public
 * @body    { email }
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @route   POST /api/auth/verify-reset-code
 * @desc    Verificar código de reset de senha
 * @access  Public
 * @body    { email, code }
 */
router.post('/verify-reset-code', authController.verifyResetCode);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Redefinir senha com token
 * @access  Public
 * @body    { email, resetToken, newPassword }
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @route   GET /api/auth/debug-sms/:celular
 * @desc    DEBUG: Ver código SMS (REMOVER EM PRODUÇÃO)
 * @access  Public (temporário)
 */
router.get('/debug-sms/:celular', authController.debugSMSCode);

/**
 * @route   DELETE /api/auth/account
 * @desc    Deletar conta do usuário (soft delete)
 * @access  Private
 * @body    { confirmPassword? }
 */
router.delete('/account', authenticate, authController.deleteAccount);

module.exports = router;