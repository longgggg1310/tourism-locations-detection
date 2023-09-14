export function transformEmail({ value }: { value?: string }) {
    if (!value) return value;
    if (typeof value !== 'string') return value;
    return value.trim().toLocaleLowerCase();
}
