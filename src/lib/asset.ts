/** Sprite paths in data/sprites.ts are relative to the deployed base URL. */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path}`;
