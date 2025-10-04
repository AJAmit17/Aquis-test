/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '#configs/logger';
import { jwttoken } from '#utils/jwt.js';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedUser {
    email: string;
    role: string;
    [key: string]: any;
}

interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                error: 'Authentication required',
                message: 'No access token provided',
            });
        }

        const decoded = jwttoken.verify(token) as AuthenticatedUser;
        req.user = decoded;

        logger.info(`User authenticated: ${decoded.email} (${decoded.role})`);
        next();
    } catch (e) {
        logger.error('Authentication error:', e);

        if ((e as Error).message === 'Failed to authenticate token') {
            return res.status(401).json({
                error: 'Authentication failed',
                message: 'Invalid or expired token',
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Error during authentication',
        });
    }
};

export const requireRole = (allowedRoles: any[]) => {
    return (req: { user: { role: any; email: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; message: string; }): any; new(): any; }; }; }, next: () => void) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Authentication required',
                    message: 'User not authenticated',
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                logger.warn(
                    `Access denied for user ${req.user.email} with role ${req.user.role}. Required: ${allowedRoles.join(', ')}`
                );
                return res.status(403).json({
                    error: 'Access denied',
                    message: 'Insufficient permissions',
                });
            }

            next();
        } catch (e) {
            logger.error('Role verification error:', e);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Error during role verification',
            });
        }
    };
};