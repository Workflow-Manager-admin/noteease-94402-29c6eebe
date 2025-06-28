const express = require('express');
const healthController = require('../controllers/health');
const authController = require('../controllers/auth');
const notesController = require('../controllers/notes');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: auth
 *     description: Authentication & user management
 *   - name: notes
 *     description: Notes management
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: mypassword
 *     responses:
 *       201:
 *         description: User registered
 */
router.post('/auth/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token returned
 */
router.post('/auth/login', authController.login);

/**
 * @swagger
 * /auth/user:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the current user's profile
 *     tags: [auth]
 *     responses:
 *       200:
 *         description: Current user profile
 */
router.get('/auth/user', requireAuth, authController.getProfile);

/**
 * @swagger
 * /notes:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: List notes (optionally search)
 *     tags: [notes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter notes by title/content.
 *     responses:
 *       200:
 *         description: List of notes
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new note
 *     tags: [notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Shopping list
 *               content:
 *                 type: string
 *                 example: Buy eggs, milk, bread.
 *     responses:
 *       201:
 *         description: Note created
 */
router.get('/notes', requireAuth, notesController.list);
router.post('/notes', requireAuth, notesController.create);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get one note by ID
 *     tags: [notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note detail
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a note by ID
 *     tags: [notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated note
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a note by ID
 *     tags: [notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note deleted
 */
router.get('/notes/:id', requireAuth, notesController.get);
router.put('/notes/:id', requireAuth, notesController.update);
router.delete('/notes/:id', requireAuth, notesController.remove);

module.exports = router;
