/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatValidationError = (errors: { issues: any[] }) => {
    if (!errors || !errors.issues) return 'Validation failed';

    if (Array.isArray(errors.issues))
        return errors.issues.map(i => i.message).join(', ');

    return JSON.stringify(errors);
};
