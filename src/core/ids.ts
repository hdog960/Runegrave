/** IDs are stable and independent of visual names, localization and unlock order. */
export const CONTENT_KINDS = ['character','realm','room','enemy','boss','relic','talisman','consumable','challenge','ending'] as const;
export type ContentKind = typeof CONTENT_KINDS[number];
export type ContentId<K extends ContentKind = ContentKind> = `${K}:${string}`;
const SLUG = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
export function contentId<K extends ContentKind>(kind: K, slug: string): ContentId<K> {
  if (!SLUG.test(slug)) throw new Error(`Invalid content slug: ${slug}`);
  return `${kind}:${slug}`;
}
export function isContentId(value: unknown): value is ContentId {
  if (typeof value !== 'string') return false;
  const index = value.indexOf(':');
  if (index <= 0) return false;
  return CONTENT_KINDS.includes(value.slice(0,index) as ContentKind) && SLUG.test(value.slice(index+1));
}
export function assertUniqueIds(ids: readonly ContentId[]): void {
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate content ID');
}
