export const sanitizeString =(val) =>
    typeof val === 'string' ? val.trim() :'';

export const sanitizeInt = (val) => parseInt(val);

export const isValidInt = (val) =>
    !isNaN(val) && Number. isInteger(val) && val>0;
