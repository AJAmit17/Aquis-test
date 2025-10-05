import express from 'express';

import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';
import {
    deleteUserById,
    fetchAllUsers,
    fetchUserById,
    updateUserById,
} from '#src/controllers/user.controller.js';

const router = express.Router();

// GET /users - Get all users (admin only)
router.get('/', authenticateToken, fetchAllUsers);

// GET /users/:id - Get user by ID (authenticated users only)
router.get(
    '/:id',
    authenticateToken,
    fetchUserById as unknown as express.RequestHandler
);

// PUT /users/:id - Update user by ID (authenticated users can update own profile, admin can update any)
router.put(
    '/:id',
    authenticateToken,
    updateUserById as unknown as express.RequestHandler
);

// DELETE /users/:id - Delete user by ID (admin only)
router.delete(
    '/:id',
    authenticateToken,
    requireRole(['admin']) as unknown as express.RequestHandler,
    deleteUserById as unknown as express.RequestHandler
);

export default router;
