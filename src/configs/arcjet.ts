import arcjet, { shield, detectBot, slidingWindow } from '@arcjet/node';

const key = process.env.ARCJET_KEY;
if (!key) {
    throw new Error('Missing required environment variable ARCJET_KEY');
}

const aj = arcjet({
    key,
    rules: [
        shield({ mode: 'LIVE' }),
        detectBot({
            mode: 'LIVE',
            allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW', 'POSTMAN'],
        }),
        slidingWindow({
            mode: 'LIVE',
            interval: '2s',
            max: 5,
        }),
    ],
});

export default aj;
