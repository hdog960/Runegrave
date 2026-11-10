export const GUIDE_SEEN_KEY = 'runegrave:guided-start:v1';
export function objectiveText(s) {
    if (s.mode === 'complete')
        return 'TRIAL CLEARED · RESTART TO PLAY AGAIN';
    if (s.mode === 'practice')
        return 'GO RIGHT → ENTER THE FIRST ROOM';
    if (s.phase === 'gate') {
        if (s.missingRelic)
            return 'PICK UP THE GOLD RELIC TO OPEN THE EXIT';
        return s.mode === 'warden' ? 'GO RIGHT → FINISH THE TRIAL' : 'GO RIGHT → NEXT ROOM';
    }
    if (s.mode === 'warden')
        return 'BOSS: DODGE WARNINGS · FIRE BACK';
    return `ROOM ${s.roomNumber}/${s.roomTotal} · DEFEAT ${s.alive} ENEM${s.alive === 1 ? 'Y' : 'IES'}`;
}
export function installFirstRunGuide(controls) {
    const guide = document.querySelector('#guide-overlay');
    const pause = document.querySelector('#pause-overlay');
    const start = document.querySelector('#guide-start-btn');
    const replay = document.querySelector('#guide-replay-btn');
    const pauseButton = document.querySelector('#pause-btn');
    if (!guide || !pause || !start || !replay || !pauseButton)
        throw new Error('Missing Gate A guided-start UI');
    let open = false;
    const show = () => {
        controls.setPaused(true); // clear all pointer/keyboard state before changing panels
        pause.hidden = true;
        guide.hidden = false;
        open = true;
        pauseButton.disabled = true;
        pauseButton.textContent = 'ᛟ GUIDE';
        document.documentElement.dataset.guide = 'open';
        start.focus({ preventScroll: true });
    };
    const dismiss = () => {
        if (!open)
            return;
        open = false;
        guide.hidden = true;
        pauseButton.disabled = false;
        document.documentElement.dataset.guide = 'closed';
        try {
            localStorage.setItem(GUIDE_SEEN_KEY, 'seen');
        }
        catch { /* private browsing fallback: show next visit */ }
        controls.setPaused(false);
    };
    replay.addEventListener('click', show);
    start.addEventListener('click', dismiss);
    // Escape/P cannot accidentally start live combat behind the tutorial.
    window.addEventListener('keydown', event => {
        if (open && (event.key === 'Escape' || event.key.toLowerCase() === 'p')) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);
    let hasSeen = false;
    try {
        hasSeen = localStorage.getItem(GUIDE_SEEN_KEY) === 'seen';
    }
    catch { /* show guidance */ }
    if (!hasSeen)
        show();
}
