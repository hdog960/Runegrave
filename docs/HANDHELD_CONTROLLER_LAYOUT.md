# RUNEGRAVE — Handheld Controller Layout Quick Reference

**Priority:** Mandatory supplement to `UI_CONTROLS_AND_ART_DIRECTION.md` and `ROADMAP.md`.

## The player's desired appearance

When the iPhone is rotated into landscape, it should look and feel like a **complete handheld game console**: a stylish controller grip on the left, an original Norse-themed controller grip on the right, and the actual game screen entirely visible between them. The Nintendo Switch provides an orientation and ergonomic reference only; **do not replicate proprietary branding, exact Joy-Con styling, or Nintendo glyphs**.

### Screen composition

```text
┏━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┓
┃  LEFT RUNE GRIP   ┃           OUTSIDE-CANVAS HUD               ┃  RIGHT RUNE GRIP  ┃
┃                   ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫                   ┃
┃  MOVE RUNE-DISC   ┃                                            ┃  AIM / FIRE DISC  ┃
┃                   ┃         GAMEPLAY RENDERED ONLY HERE         ┃                   ┃
┃  BOMB / CONSUME   ┃                                            ┃  ACTIVE / USE     ┃
┃                   ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫                   ┃
┃  INSET STATUS     ┃            STATUS / RUN INFO                ┃  PAUSE / RUNE     ┃
┗━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━┛
```

This is a **functional concept**. Do not hardcode the artwork or percentages. Fit the actual viewport and safe areas before selecting grip widths. Avoid tiny central gameplay. Prioritize playability and control reach.

## Detailed appearance

The left grip is a shield-like dark ash-wood and iron module. The movement control is a circular inset rune-disc, illuminated subtly around its outer ring when active. Below/near it are distinct engraved bomb and consumable buttons. The right grip is a matching but asymmetrically organized module: a larger aim/fire rune-disc plus active-relic and interaction controls. A pause/inventory glyph sits outside the combat image. Runes glow subtly when pressed; the carved surround deepens visually. A restrained forged-metal bezel separates the central screen from side controls without covering any of its pixels.

HUD information belongs in the grips or true outside-canvas status bands. Health, silver, keys, bombs, consumable, relic charge, map, and floor information must be readable without covering play. During pause, the screen may display a full themed interface because the combat simulation is stopped.

## Required engineering behavior

- CSS grid/flex layout creates **separate DOM rectangles** for left grip, central screen, right grip, and status bands.
- The rendering engine is mounted only inside the gameplay rectangle. Canvas world-space camera fits its measured size.
- Pointer events are accepted on the appropriate controller grip only. Two pointers can move and fire simultaneously.
- Side grip buttons support press, hold, release, disabled, cooldown, and active-charge feedback.
- Adapt notch/safe-area insets and both landscape orientations; no hidden controls behind a rounded corner.
- Provide left-hand mirroring, within-grip thumb-disc customization, pause handling, and physical-controller mode.
- No gameplay-overlapping controls, not even translucent joysticks. Never sacrifice combat readability for decorative bezel width.
- Test Safari and Home Screen-installed mode, multiple landscape CSS viewport sizes, multitouch cancellation, and real combat with dense telegraphs.
- Present a screenshot of this controller composition at **v0.04**; obtain explicit user approval at **v0.09 (Gate A)**.

## Rejection conditions

A simple pair of transparent joysticks floating over fullscreen game art is **incorrect**. Generic flat unstyled button columns are **incorrect**. A tiny pinched central arena that cannot be played fairly is **incorrect**. A beautiful skin that makes the buttons unclear or hard to reach is **incorrect**. A Nintendo-themed copy rather than an original Norse instrument is **incorrect**.

**Target feeling:** a mythic, premium-quality handcrafted handheld console, with the action completely visible between the controls.