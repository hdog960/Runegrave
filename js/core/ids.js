/** IDs are stable and independent of visual names, localization and unlock order. */
export const CONTENT_KINDS = ['character', 'realm', 'room', 'enemy', 'boss', 'relic', 'talisman', 'consumable', 'challenge', 'ending'];
const SLUG = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
export function contentId(kind, slug) {
    if (!SLUG.test(slug))
        throw new Error(`Invalid content slug: ${slug}`);
    return `${kind}:${slug}`;
}
export function isContentId(value) {
    if (typeof value !== 'string')
        return false;
    const index = value.indexOf(':');
    if (index <= 0)
        return false;
    return CONTENT_KINDS.includes(value.slice(0, index)) && SLUG.test(value.slice(index + 1));
}
export function assertUniqueIds(ids) {
    if (new Set(ids).size !== ids.length)
        throw new Error('Duplicate content ID');
}
