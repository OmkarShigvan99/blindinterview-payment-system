export function generateSoftColor(): string {
    const hue = Math.floor(Math.random() * 360); // Full hue spectrum
    const saturation = 40 + Math.random() * 20; // 40–60% saturation (soft, not neon)
    const lightness = 70 + Math.random() * 10; // 70–80% lightness (pastel)

    return hslToHex(hue, saturation, lightness);
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const k = (n: number): number => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number): number =>
        Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

    return `${f(0).toString(16).padStart(2, '0')}${f(8).toString(16).padStart(2, '0')}${f(4).toString(16).padStart(2, '0')}`;
}

export function initials(name: string): string {
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0).toUpperCase());
    return initials.join('');
}
