/* eslint-disable @typescript-eslint/no-explicit-any */
export const cookies = {
    getOptions: () => ({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
    }),

    set: (
        res: {
            cookie: (
                arg0: any,
                arg1: any,
                arg2: {
                    httpOnly: boolean;
                    secure: boolean;
                    sameSite: string;
                    maxAge: number;
                }
            ) => void;
        },
        name: any,
        value: any,
        options = {}
    ) => {
        res.cookie(name, value, { ...cookies.getOptions(), ...options });
    },

    clear: (
        res: {
            clearCookie: (
                arg0: any,
                arg1: {
                    httpOnly: boolean;
                    secure: boolean;
                    sameSite: string;
                    maxAge: number;
                }
            ) => void;
        },
        name: any,
        options = {}
    ) => {
        res.clearCookie(name, { ...cookies.getOptions(), ...options });
    },

    get: (req: { cookies: { [key: string]: any } }, name: any) => {
        return req.cookies[name];
    },
};
