// utils/enum-values.ts
export function enumToValues<T extends Record<string, string>>(e: T): string[] {
    return Object.values(e);
}
