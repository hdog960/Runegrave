export function installRelicDiscovery(controls) {
    const panel = document.querySelector('#relic-reveal-overlay');
    const name = document.querySelector('#relic-reveal-name');
    const effect = document.querySelector('#relic-reveal-effect');
    const change = document.querySelector('#relic-reveal-change');
    const confirm = document.querySelector('#relic-reveal-continue');
    const pauseButton = document.querySelector('#pause-btn');
    const pausePanel = document.querySelector('#pause-overlay');
    if (!panel || !name || !effect || !change || !confirm || !pauseButton || !pausePanel)
        throw new Error('Missing paused relic discovery panel');
    let open = false;
    window.addEventListener('runegrave:relic-acquired', event => {
        const info = event.detail;
        if (!info?.name || !info.effect)
            return;
        controls.setPaused(true);
        pausePanel.hidden = true;
        panel.hidden = false;
        open = true;
        name.textContent = `${info.rune} ${info.name}`;
        effect.textContent = info.effect;
        change.textContent = info.change || 'BONUS NOW ACTIVE';
        pauseButton.disabled = true;
        pauseButton.textContent = 'ᛟ RELIC';
        document.documentElement.dataset.relicReveal = 'open';
        confirm.focus({ preventScroll: true });
    });
    confirm.addEventListener('click', () => {
        if (!open)
            return;
        open = false;
        panel.hidden = true;
        pauseButton.disabled = false;
        document.documentElement.dataset.relicReveal = 'closed';
        controls.setPaused(false);
    });
    window.addEventListener('keydown', event => {
        if (open && (event.key === 'Escape' || event.key.toLowerCase() === 'p')) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }, true);
}
