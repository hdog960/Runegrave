import { assertUniqueIds, contentId } from '../core/ids.js';
/** Design metadata only: NONE of these realms is implemented as a playable floor at v0.01. */
export const PLANNED_REALMS = [
  { id: contentId('realm','midgard'), name: 'Midgard' },
  { id: contentId('realm','niflheim'), name: 'Niflheim' },
  { id: contentId('realm','svartalfheim'), name: 'Svartalfheim' },
  { id: contentId('realm','alfheim'), name: 'Alfheim' },
  { id: contentId('realm','vanaheim'), name: 'Vanaheim' },
  { id: contentId('realm','jotunheim'), name: 'Jötunheim' },
  { id: contentId('realm','muspelheim'), name: 'Muspelheim' },
  { id: contentId('realm','helheim'), name: 'Helheim' },
  { id: contentId('realm','asgard'), name: 'Asgard' }
] as const;
assertUniqueIds(PLANNED_REALMS.map(realm => realm.id));
