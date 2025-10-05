/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import logger from '#configs/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'aqui-test-secret';
const JWT_EXPIRES_IN = '1d';

export const jwttoken = {
    sign: (payload: any) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (e) {
            logger.error('Failed to authenticate token', e);
            throw new Error('Failed to authenticate token');
        }
    },
    verify: (token: string) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            logger.error('Failed to authenticate token', e);
            throw new Error('Failed to authenticate token');
        }
    },
};
