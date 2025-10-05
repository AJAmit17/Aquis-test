/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Minimal mock for @arcjet/node used in tests

const arcjet = (opts: any) => ({
    withRule: (rule: any) => ({
        protect: async (req: any) => ({
            isDenied: () => false,
            reason: {
                isBot: () => false,
                isShield: () => false,
                isRateLimit: () => false,
            },
        }),
    }),
});

const shield = (opts: any) => ({ type: 'shield', ...opts });
const detectBot = (opts: any) => ({ type: 'detectBot', ...opts });
const slidingWindow = (opts: any) => ({ type: 'slidingWindow', ...opts });

export default arcjet;
export { shield, detectBot, slidingWindow };
