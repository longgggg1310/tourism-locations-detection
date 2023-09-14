export const parseImageURL = (path: string) => {
    const APP_URL = process.env.APP_URL;
    const downloadUrl = `${APP_URL}/api/storage/download?cid=${path}`;
    return downloadUrl;
};

export const cdnUrl = (path: string) => {
    const APP_URL = process.env.APP_URL;
    const downloadUrl = `${APP_URL}/api/storage/download?cid=${path}`;
    return downloadUrl;
};

export const upperCase = (s: string) => {
    return s.toUpperCase();
};

export const formatPrice = (num: number) => {
    return (num / 100).toFixed(2);
};

export function join(array, sep, options) {
    return array
        .map(function (item) {
            return options.fn(item);
        })
        .join(sep);
}
