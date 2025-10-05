/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '#configs/logger';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '#configs/database';
import { users } from '#models/user.model.js';

export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface AuthenticateUserInput {
    email: string;
    password: string;
}

export interface UserRecord {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: Date;
}

export interface UserPublic {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: Date;
}

export const hashPassword = async (password: string): Promise<string> => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        logger.error(`Error hashing the password: ${e}`);
        throw new Error('Error hashing');
    }
};

export const comparePassword = async (password: any, hashedPassword: string) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (e) {
        logger.error(`Error comparing password: ${e}`);
        throw new Error('Error comparing password');
    }
};

export const createUser = async ({ name, email, password, role = 'user' }: CreateUserInput) => {
    try {
        let existingUser;
        try {
            existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);
        } catch (dbErr) {
            logger.error('Database select error in createUser', dbErr);
            throw new Error('DB_SELECT_FAILED');
        }

        if (existingUser.length > 0)
            throw new Error('User with this email already exists');

        const password_hash = await hashPassword(password);

        let newUser;
        try {
            const res = await db
                .insert(users)
                .values({ name, email, password: password_hash, role })
                .returning({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    role: users.role,
                    created_at: users.created_at,
                });
            newUser = Array.isArray(res) ? res[0] : res;
        } catch (dbErr) {
            logger.error('Database insert error in createUser', dbErr);
            // If it's a unique constraint error coming from the DB, map to a user-friendly message
            throw new Error('DB_INSERT_FAILED');
        }

        logger.info(`User ${newUser.email} created successfully`);
        return newUser;
    } catch (e) {
        logger.error(`Error creating the user: ${e}`);
        throw e;
    }
};

export const authenticateUser = async ({ email, password }: AuthenticateUserInput) => {
    try {
        let existingUser;
        try {
            const rows = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);
            existingUser = Array.isArray(rows) ? rows[0] : rows;
        } catch (dbErr) {
            logger.error('Database select error in authenticateUser', dbErr);
            throw new Error('DB_SELECT_FAILED');
        }

        if (!existingUser) {
            throw new Error('User not found');
        }

        const isPasswordValid = await comparePassword(
            password,
            existingUser.password
        );

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        logger.info(`User ${existingUser.email} authenticated successfully`);
        return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            created_at: existingUser.created_at,
        };
    } catch (e) {
        logger.error(`Error authenticating user: ${e}`);
        throw e;
    }
};