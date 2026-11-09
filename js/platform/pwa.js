/** Home Screen / offline registration. Updates require an explicit button press. */
export async function preparePwa() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    document.documentElement.dataset.displayMode = isStandalone ? 'standalone' : 'browser';
    if (!('serviceWorker' in navigator))
        return;
    const banner = document.getElementById('pwa-update');
    const apply = document.getElementById('apply-update');
    let refreshRequested = false;
    const offerUpdate = (worker) => {
        if (!worker || !banner || !apply)
            return;
        banner.hidden = false;
        apply.onclick = () => { refreshRequested = true; worker.postMessage({ type: 'ACTIVATE_UPDATE' }); };
    };
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (refreshRequested)
        window.location.reload(); });
    try {
        const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        if (registration.waiting && navigator.serviceWorker.controller)
            offerUpdate(registration.waiting);
        registration.addEventListener('updatefound', () => {
            const installing = registration.installing;
            installing?.addEventListener('statechange', () => {
                if (installing.state === 'installed' && navigator.serviceWorker.controller)
                    offerUpdate(registration.waiting);
            });
        });
        // Check for updates on launch, never interrupt a running game.
        void registration.update().catch(() => { });
    }
    catch (error) {
        console.warn('Runegrave offline installation unavailable:', error);
    }
}
