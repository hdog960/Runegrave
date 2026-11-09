import { ROADMAP_VERSION, APP_VERSION } from './core/version.js';
import { PLANNED_REALMS } from './content/realmCatalog.js';
import { rngStream } from './core/rng.js';

const versionLabel = document.querySelector<HTMLElement>('[data-release]');
if (versionLabel) versionLabel.textContent = `${ROADMAP_VERSION} · FOUNDATION`;
const realmCount = document.querySelector<HTMLElement>('[data-realms]');
if (realmCount) realmCount.textContent = `${PLANNED_REALMS.length} realms in the design bible`;
const trace = document.querySelector<HTMLElement>('[data-build-trace]');
if (trace) trace.textContent = `ENGINE SEED CHECK ${rngStream(APP_VERSION, 'foundation').nextUint32().toString(16).padStart(8,'0')}`;
document.documentElement.dataset.version = APP_VERSION;
