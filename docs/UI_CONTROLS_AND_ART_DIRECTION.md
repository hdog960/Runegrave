# RUNEGRAVE: THE NINEFOLD DESCENT
## Locked Mobile UI, Control Layout, and Visual Direction Specification

**Quick visual companion:** `HANDHELD_CONTROLLER_LAYOUT.md`  
**Status:** Mandatory, locked project requirement  
**Applies to:** Every release, beginning with v0.02  
**Priority:** Non-negotiable acceptance criterion; takes precedence over convenient touch-control overlays

## 1. Primary Rule: Zero Gameplay Occlusion

**Virtual controls, persistent HUD panels, and decorative interface elements must NEVER cover the active gameplay playfield.** The player must see the entire active gameplay camera viewport while moving, aiming, attacking, and fighting a boss. There is no acceptable percentage of joystick or attack-button overlap. This prohibition includes translucent controls, decorative borders that protrude into the playfield, minimaps, health displays, item cards, and tooltips during active combat.

This is not a request to make controls a little more transparent. Controls must live in physically separate screen regions outside the combat-rendering rectangle. The gameplay camera and HUD must adapt to the remaining space; do not render a full-screen game and then place controls on top.

The central viewport is a dedicated, uninterrupted playfield. Only *world objects* and contextual in-world visuals (character, enemies, projectiles, attack telegraphs, damage feedback, pickups, and interactable markers anchored to objects) may appear inside it. Gameplay notification text should appear in external UI areas whenever possible.

### Mandatory three-region landscape layout

```
+------------------------------------------------------------------------+
|  LEFT RUNE RAIL    |       CENTRAL GAMEPLAY / HUD COLUMN       | RIGHT |
|  (non-gameplay)    |--------------------------------------------| RUNE  |
|                   |    slim dedicated status strip (not canvas) | RAIL  |
|  movement rune    |--------------------------------------------|       |
|  touch pad         |                                            | aiming|
|                   |          VISIBLE GAMEPLAY CANVAS           | /fire |
|  bomb, utility    |    no controls, floating HUD, or buttons    |  pad  |
|                   |                                            |       |
|  health / map     |--------------------------------------------| active|
|  slots optional   |   slim dedicated run info / action strip    | item  |
+------------------------------------------------------------------------+
```

The diagram is a concept, not a pixel-perfect layout. On reference landscape iPhones, prefer a center playfield that gets roughly **56–66% of usable width**, with the rest allocated to left and right rails and safe areas. The exact proportions must be calculated from *actual touch target, camera visibility, safe area, and device measurements*, not hardcoded for one phone model. Preserve sufficient space for at least two independent, comfortable thumb inputs. A camera-aware design must retain useful combat readability in the central stage.

Never shrink the game to an unreadable miniature simply to keep a decorative border. When space is scarce, simplify or collapse secondary UI **inside the rails**, reduce decoration, and optimize world camera framing before compromising touch comfort or readability. Do not move controls over the playfield as a fallback.

### Input zoning

- **Left side rail:** Thumb movement pad, optionally a bomb and one secondary action. It must not cover any combat pixels.
- **Right side rail:** Aim/fire pad with uninterrupted multi-touch tracking, active relic button, and relevant contextual interaction button.
- **Dedicated non-canvas status strip / rail segments:** Health, silver, bombs, keys, active relic charge, talisman and held consumable, compact map, run time, floor identification, and pause control.
- **Center:** Gameplay and only gameplay. No permanent virtual buttons, health bars, item pop-ups, minimap, or opaque UI over the action.
- **Paused state:** A full menu may replace or cover the playfield *only after the simulation is paused*. Returning to gameplay must clear it entirely.

The HUD can be distributed into side rails and thin dedicated header/footer areas that are excluded from the renderer's combat viewport. The HUD must not be drawn on top of the combat canvas.

## 1A. Locked Handheld-Controller Composition (Nintendo Switch-Style Ergonomics)

**Player-approved direction, 2026-11-09:** In landscape, RUNEGRAVE should *feel like holding a beautifully crafted handheld game console*: a dedicated left controller integrated with the left edge of the display, a dedicated right controller integrated with the right edge, and a wide uninterrupted game screen between them. The Nintendo Switch is an **ergonomic/layout reference**, not an asset or trade-dress template. Do **not** copy Joy-Con appearance, Nintendo symbols, button labeling, trademark branding, or its exact distinctive industrial design. Create original Norse visual language.

The two side modules are **permanent visual side panels while touch controls are in use**, not transparent thumb overlays. Design them as matching dark-metal and carved-ash-wood *rune-grips*, with asymmetry for left-hand movement versus right-hand combat. Their surface may have subtly inlaid gold/knotwork, engraved runes, leather-wrapped side details, worn iron edges, and tiny enchantment glows. Treat the central gameplay viewport as the device's *screen*, edged by a refined non-obscuring bezel. When the game is paused, the central screen may show richly styled menus; while combat is live, nothing from the surrounding controller intrudes.

### Landscape visual arrangement

```text
┌────────────────────┬────────────────────────────────────────┬────────────────────┐
│  LEFT RUNE-GRIP    │     EXTERNAL STATUS STRIP (optional)   │   RIGHT RUNE-GRIP  │
│ ┌───────────────┐  ├────────────────────────────────────────┤  ┌───────────────┐ │
│ │ Move thumbpad │  │                                        │  │ Aim + auto-    │ │
│ │ / rune-stick  │  │          UNOBSTRUCTED WORLD           │  │ fire thumbpad  │ │
│ └───────────────┘  │           GAMEPLAY SCREEN              │  └───────────────┘ │
│ Bomb / consumable  │                                        │ Active / interact  │
│ Compact map / HP   │                                        │ Rune / pause       │
│ (outside canvas)   ├────────────────────────────────────────┤ (outside canvas)   │
│  Left-hand grip    │  EXTERNAL STATUS STRIP (if required)  │  Right-hand grip   │
└────────────────────┴────────────────────────────────────────┴────────────────────┘
```

**Controller-inspired functional assignment** (final button positioning must be ergonomically tested):

- **Left grip:** one large responsive movement thumbstick/rune-disc, bomb and held-consumable triggers positioned for the left thumb, optional compact minimap or health information. Its top/bottom segments may include secondary status or a recessed utility key.
- **Right grip:** one large aim-and-continuous-fire rune-disc, a prominent active-relic trigger, interaction/action trigger, and an accessible pause/inventory trigger. Buttons should resemble *distinctively carved Norse runes*, with clear legible functional glyphs rather than arbitrary symbols.
- **Between them:** the full combat game view. Its camera and room rendering are computed for that rectangle only. If a header/footer status band is needed, it is a separate layout row, not a layer over the game.
- **Optional physical-controller mode:** when a connected controller is reliably in use, the touch rails can collapse or slim down to grant more screen width; provide a clear manual toggle and restore accessible touch controls on disconnection.

### Prioritize a premium handheld aesthetic

- Side modules must **look structurally integrated** with the center screen, as if the phone becomes a two-grip mythical artifact. Avoid three unrelated CSS cards floating on a black page.
- Build depth through carved concentric thumbstick rings, subtle inset shadows, dark forged-metal seams, restrained edge glow, and textured rune buttons. Do not replace visual craftsmanship with saturated generic gradients.
- Controls must convey **pressed, held, charging, disabled, and cooldown** states via small but unmistakable changes in runic illumination and inset depth.
- Art should preserve crisp pixel-art gameplay while allowing a slightly higher-resolution illustrated UI frame when this increases readability.
- Make the layout look intentional in both landscape directions. The side-grip shapes may mirror, but button function and hand reach must remain predictable.
- The central combat display must remain **large enough to read enemies and dodge patterns**. Optimize grip width, spacing, and camera before accepting a tiny world viewport. If a device cannot satisfy touch comfort and gameplay readability simultaneously, provide an explicit supported-device warning rather than covering the action with controls.

### Additional handheld-style acceptance gates

1. Actual screenshots demonstrate a **single coherent handheld-controller silhouette** with a meaningful left and right grip, not floating joystick widgets.
2. Holding the phone landscape with both thumbs resting naturally on side controls never obscures the center playfield.
3. Every critical action is reachable within the side regions without crossing a thumb over active gameplay.
4. A playtester can identify movement, aim/fire, active relic, consumable, bomb, and pause at a glance; runic decoration must not confuse functionality.
5. The decorative bezel and button glow never extend into or shadow a dangerous portion of the center canvas.
6. The device-specific layout still feels premium and playable, not compressed, at the smallest officially supported landscape viewport.

## 2. Responsive and Safe-Area Behavior

- Design for iPhone landscape first, with dynamically measured layout and `env(safe-area-inset-*)` support.
- Account for notches, Dynamic Island, rounded corners, browser controls, and Home Screen standalone mode.
- Do not rely on a browser orientation lock API always succeeding. In portrait, show an attractive and functional rotate-device screen, not broken sideways controls.
- Define a real DOM/CSS layout grid for controls and gameplay before initializing the camera viewport.
- Monitor resize, viewport changes, orientation, full-screen or standalone state, and resume-from-background transitions.
- Prevent page scrolling, rubber-band scrolling, accidental browser zoom, long-press text selection, and gestures that accidentally navigate away while playing, to the extent Safari permits.
- CSS touch input regions use appropriate `touch-action` settings, pointer capture, cancellation handling, and multi-pointer identification.
- Track movements only within the correct input rail. Do not allow a pointer in the central combat canvas to trigger an invisible virtual button.
- The player may customize pad positions and sizes **within their respective side rails only**; the no-overlap rule remains absolute.
- Provide left-handed layout options that swap or mirror rail control assignments without ever overlaying the stage.
- Support external controller and keyboard: when virtual controls are not needed, collapse the side rails and enlarge the stage. Do not remove controls just because a controller once connected; react correctly to disconnection.
- Record tested layout profiles by concrete device CSS viewport dimensions, not by guessed iPhone models.

## 3. Gameplay Camera and Visibility

The camera's visible combat rectangle must exactly match the center canvas. Compute the world view from the actual canvas dimensions, and scale/render rooms appropriately. Never hide an enemy, telegraph, doorway, chest, or projectile behind a UI rail.

Design encounter rooms and boss attack patterns for the center playfield's actual aspect ratio. Ensure that the playfield shows enough information to dodge effectively. When the available center width makes a wide arena unsuitable, use a camera design and room scale that preserve movement/attack visibility. Test that vertical and horizontal telegraphs remain legible.

**Camera validation:** every visible, damage-capable projectile and every collision hazard that affects the player must be rendered within the actual active gameplay rectangle when relevant to the encounter. No unfair damage from concealed off-camera attacks at boundaries. Make enemy AI and projectile despawn behavior camera-aware without compromising combat depth.

## 4. Combat Input Quality

- Simultaneous movement and independent aiming with two thumbs.
- Movement must be smooth, precise, and low-latency.
- Aim pad supports continuous directional attack and reliable release on finger lift/cancel.
- Optional fixed and floating joystick behavior is permitted only *within the rail*.
- Favor large, forgiving hit regions and configurable dead zones; decorative rune artwork cannot reduce input usability.
- Active-item, bomb, and consumable buttons must be accessible without crossing into the gameplay viewport.
- Contextual interactions should avoid accidental activation during combat.
- Optional haptic feedback only where permitted; never require it.
- No automatic dodge roll added to the core system unless provided by a character or relic.

## 5. Norse UI Art Direction

The interface should look like a crafted artifact from the Nine Realms, not a modern mobile-game skin pasted onto a dungeon.

### Visual materials

- Charcoal-black carved stone, dark ash wood, worn iron, aged silver, subtle bronze trim.
- Engraved knotwork and elegant runic line art.
- Sparing enchanted cyan, icy teal, ember orange, gold, and violet highlights tied to gameplay meaning.
- Thin layered borders resembling rune-inscribed armor fittings, with carefully controlled ornament density.
- Each side rail may resemble a half-shield or standing rune slab, visually framing the action.
- Button press states should animate through subtle engraved-glow and tactile recess, not flashy mobile gradients.
- A rune-based minimap frame, etched heart containers, silver coin markers, and polished artifact icons.

### Readability and clarity

- Decorative fonts only for title-like text; gameplay statistics and descriptions need a clean, readable typeface.
- Use consistent icon shapes, spacing, visual hierarchy, and accessible contrast.
- Item information is legible at ordinary iPhone viewing distances; never depend on very tiny decorative text.
- Theme and immersion may not obscure control meaning or numerical values.
- Critical danger indicators should have shape/animation redundancy instead of color alone.
- Use restrained animation on HUD panels to reduce distraction.

### Character, relic, and status presentation

- Health types have clearly differentiated motifs and reliable empty/full states.
- Active item charge is a segmented rune ring outside the canvas.
- Collected relics appear in an optional side-rail mini-history; the full list belongs in pause/inventory screens.
- Status effects are shown in small rail icons with timers or clear progress indicators.
- Important lore notifications can appear between rooms or in non-combat interface space; avoid full-screen popups in the middle of danger.
- A mythical Norse atmosphere is mandatory, but gameplay readability outranks decoration.

## 6. Menu Aesthetic and Navigation

- **Main menu:** monumental carved Yggdrasil slab, glowing runic paths, subtle embers and falling leaves.
- **Character selection:** etched saga stones or shield-panels, each with an animated distinct character, readable statistics, and unique mechanics.
- **Run statistics / Codex:** illustrated parchment-and-stone manuscripts, tabbed rune plates, consistent scroll behavior.
- **Relic descriptions:** compact, readable rune tablets with icon, rarity/quality, actual effect, and synergy flags where unlocked.
- **Pause screen:** coherent carved-wood or rune-stone panel, no browser-like list of plain buttons.
- **Death / victory:** strong restrained illustration and illuminated runic completion records.
- **Loading:** brief world-tree branch or rune seal motif, with accurate progress when shown.
- **Accessibility:** reduced animation/effects, text scaling, controller options, high-contrast icon option, and suitable touch target adjustments.

## 7. Quantified Acceptance Tests

These must be performed at v0.03, v0.04, v0.09, v0.19, at each major UI or camera change, and again at v0.90–v0.99.

1. **Zero-overlap test:** `gameplayCanvas.getBoundingClientRect()` has no intersection with the bounding rectangles of all interactive persistent control and HUD elements. Include decorative protrusions/shadows in visual screenshot inspection. Any overlap is a blocking bug.
2. **Landscape test:** both landscape directions display correctly, including safe-area cutouts and Home Screen standalone mode.
3. **Multi-touch test:** sustain movement + aiming + active item actions without lost/crossed pointers.
4. **Touch comfort test:** a normal two-thumb grip can move, aim, fire, use a bomb, use an active relic, and pause without reaching across the central playfield.
5. **Visibility test:** room exits, enemies, projectile telegraphs, and hazards remain readable in the unobstructed center canvas; verify during large boss encounters.
6. **Readable UI test:** health, consumables, charges, and map are visible without covering combat; there is no clipping, cramped typography, or overlapping runic ornamentation.
7. **Camera test:** changing aspect ratio does not make the game unfair by hiding relevant attacks.
8. **Input lifecycle test:** pausing, tab switching, interrupting a touch, locking/unlocking the device, and backgrounding do not leave movement or firing stuck on.
9. **Device matrix test:** inspect representative small, medium, and large landscape iPhone viewports, in Safari and installed PWA modes where available.
10. **Visual standard test:** screenshots pass a manual review for coherent Norse style, polish, and legibility. Do not infer a pass solely from automated tests.
11. **Controller mode test:** virtual rails collapse and restore correctly when needed, without leaving inaccessible actions.
12. **Regression test:** no version reintroduces gameplay-covering controls or floating HUD panels.

### Explicit rejection criteria

Any of the following makes a milestone incomplete:

- A transparent joystick or touch pad is drawn on the game world.
- A pause/settings control floats over live combat.
- Buttons cover doorways, projectiles, enemies, or boss telegraphs.
- UI art makes the playable stage too small to fight effectively.
- The UI is a generic set of flat mobile buttons inconsistent with Norse art direction.
- Text or buttons clip into the notch, home indicator, or rounded corners.
- A supposed fix simply lowers joystick opacity.

## 8. Roadmap Integration

**v0.02:** Implement the handheld-inspired split controller shell and actual segmented mobile layout and safe areas *before* adding the gameplay renderer.  
**v0.03:** Put Nintendo Switch-style side-grip ergonomic input systems (with original Norse designs) entirely inside dedicated touch rails; validate multi-touch and zero overlap.  
**v0.04:** Make an artistically coherent, premium handheld-controller frame and readable runic UI prototype; validate camera scaling within center-only canvas.  
**v0.09 / Gate A:** Require explicit player approval of the left/right handheld-controller grip aesthetic, control layout, combat visibility, and two-thumb comfort.  
**v0.19:** Verify UI and control layout throughout full-run transitions and save/continue.  
**v0.39 / Gate B:** Check aesthetic consistency across every realm and screen.  
**v0.59:** Recheck special-character HUDs and unusual health systems.  
**v0.69:** Recheck wave-mode countdowns, shops, and reward presentation without in-gameplay overlays.  
**v0.75:** Define a supported-screen and controller strategy for local co-op without clutter.  
**v0.79 / Gate C:** Mature UI and art review with complex builds and every character class.  
**v0.90:** Complete full-screen UI polish while strictly preserving non-overlay gameplay.  
**v0.91:** Final touch target, accessibility, and left-handed controls review.  
**v0.93:** Performance testing with independently rendered HUD and camera.  
**v0.98–v0.99 / Gate D:** Final screenshots and real-device checks, with zero gameplay overlap required.  
**v1.0:** No exceptions to the unobstructed-playfield rule.

## 9. Future Development Instructions

When improving controls or presentation, never solve an aesthetic issue by putting controls on the playfield. When improving combat visibility, never solve a space issue by hiding a HUD function that the player needs. Instead, redesign the rails, collapse nonessential decorations, and adjust the camera or room composition while preserving meaningful enemy visibility.

**Final standard: the landscape phone resembles an original premium Norse-mythology handheld console. Each thumb stays on its own beautifully crafted controller grip, and the entire game is visible, unobstructed, on the center screen.**