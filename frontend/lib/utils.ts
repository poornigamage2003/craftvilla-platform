export function formatLKR(amount: number): string {
  return "LKR " + Math.round(amount).toLocaleString("en-US");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
