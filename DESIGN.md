---
name: Daredevil, a fan tribute
description: A near-black page perceived by echo; the visitor's tap sends a ring that lights what it crosses.
colors:
  ground: "#0b0b0c"
  ground-raised: "#131315"
  warm-ink: "#eeeae3"
  echo-red: "#e0303a"
  signal-red-fill: "#b5121b"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "min(22.5vw, 22rem)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.03em"
    fontVariation: "\"wdth\" 62"
  braille-letter:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "calc(min(9.2vw, 132px) * 1.62)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "\"wdth\" 62"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.375rem, 1rem + 4.6vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  numeral:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2rem, 1rem + 3vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
    fontVariation: "\"wdth\" 62"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.3
  statement:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 0.85vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
rounded:
  none: "0px"
  point: "50%"
spacing:
  margin: "clamp(16px, 4.45vw, 64px)"
  gap: "clamp(16px, 2.2vw, 32px)"
  section: "clamp(112px, 14vw, 216px)"
components:
  button-primary:
    backgroundColor: "{colors.signal-red-fill}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "18px 28px"
  button-primary-hover:
    backgroundColor: "#c8141e"
  toggle:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.warm-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 14px"
  toggle-pressed:
    backgroundColor: "{colors.warm-ink}"
    textColor: "{colors.ground}"
  readout-panel:
    backgroundColor: "{colors.ground-raised}"
    rounded: "{rounded.none}"
    padding: "clamp(24px, 3vw, 40px)"
---

# Design System: Daredevil, a fan tribute

## Overview

**Creative North Star: "Perceived by Echo"**

The page is a dark room that answers sound. Everything rests dim on a near-black ground; a tap or pointer press sends a ring outward at a constant speed, and each element brightens the instant the ring reaches its nearest edge, then settles back. Photographs rest grey and regain colour only when echoed. The world is built from very few materials: one warm off-white ink, one red, one variable typeface, thin rings, and real street photography of Hell's Kitchen.

Density is editorial and generous: big tight-set headlines, a twelve-column grid with wide section breaks, and long passages of plain reading text that never need the echo to be legible. Restraint is the brand: one signature effect, small supporting moments (a heartbeat line, an ECG readout, a red point that marks the selected name). The comic-splash hero, costume imagery and red gradients are refused.

Accessibility is part of the world, not an exception to it. Resting text stays above 4.5:1; the braille headline carries real text for assistive tech; reduced motion, no script, and the "Lights up" toggle all render the page fully lit and static.

**Key Characteristics:**
- Near-black ground, warm ink, one red used sparingly for signal.
- Content rests dim (62% opacity) and is lit by expanding echo rings.
- Archivo variable only; condensed width (wdth 62) for the braille letters, run years and footer name.
- Square rectangles everywhere; the only circles are braille dots, echo rings and the selection point.
- Flat surfaces; depth comes from light (opacity and colour), never shadow.
- Photographs desaturated at rest, colour when echoed.

## Colors

A near-monochrome night with a single red that reads as signal, not decoration.

### Primary
- **Echo Red** (`echo-red`): the lead echo ring, focus outlines, the heartbeat and ECG lines, the selected-name point, the nav action underline, the lit window in the brownstone illustration. Line and point work only.
- **Signal Red Fill** (`signal-red-fill`): the one filled red surface, the primary button, plus text selection. Deeper than Echo Red so white text on it clears contrast.

### Neutral
- **Ground** (`ground`): page background, theme colour, scrollbar track.
- **Raised Ground** (`ground-raised`): the only second surface. Readout panel, toggle button, empty photo frames.
- **Warm Ink** (`warm-ink`): all text, illustration strokes, braille dots, the trailing echo ring. Warm off-white, never pure white at rest.

### Named Rules
**The One Red Rule.** Red is a signal: rings, lines, a point, one button. It never fills a section, a gradient or a background.

**The Resting Light Rule.** Echo-lit content rests at 62% opacity (`--rest: 0.62`), which keeps warm ink on ground above 4.5:1. Anything that must be read rests no dimmer than this. The single exception is the braille letter (`--rest-letter: 0.07`), which can rest near-invisible because its braille dots and the visually hidden heading carry the word at rest.

## Typography

**Display Font:** Archivo variable, self-hosted (wdth 62–125, wght 100–900), with Helvetica Neue, Arial
**Body Font:** Archivo (same family, wdth 100)

**Character:** One grotesque doing everything, with its width axis as the expressive lever: condensed and heavy for the word DAREDEVIL and the years, normal width for reading.

### Hierarchy
- **Display** (800, min(22.5vw, 22rem), 0.82, uppercase, wdth 62): the footer name, set edge to edge.
- **Braille Letter** (750, cell size x 1.62, 1, wdth 62): the letters that resolve above the braille cells in the hero.
- **Headline** (800, clamp(2.375rem to 5rem), 0.98, -0.035em, balanced wrap): section headings.
- **Numeral** (700, clamp(2rem to 3.75rem), 1, tabular, wdth 62): run years.
- **Roster names** (750, clamp(1.75rem to 3rem), 1.05, wdth 80): the selectable character list; the readout name uses 800 at clamp(1.75rem to 2.5rem).
- **Title** (700, 1.375rem, 1.3): run titles; footer titles at 1.0625rem.
- **Statement** (400, clamp(1.25rem to 1.625rem), 1.4): hero statement and section ledes, max 36–40rem.
- **Body** (400, 1.0625rem, 1.55): reading text, max ~34–44rem.
- **Label** (500, 0.9375rem): captions, bpm readouts, notes, toggle.

### Named Rules
**The Width Axis Rule.** Condensed width (wdth 62) belongs to the braille-resolved letters, years and the footer name. Running text stays at wdth 100. Do not introduce a second family.

**The Sentence Case Rule.** Headings and labels are sentence case; the only uppercase is the footer name.

## Layout

A twelve-column grid (`gap` between columns) inside a fluid side margin (`margin`), with very wide vertical breaks between sections (`section`). Section heads put the headline on columns 1–7 and a short supporting paragraph on 9–12, aligned to the headline's baseline or top. Content rows (runs, people, photographs) reuse the same twelve columns with asymmetric spans (8+4 mosaic, 3+4+5 strip, 3+5+4 run rows).

The hero fills the small viewport height, tucks under an in-flow nav by the nav's measured height, and stacks: braille word, statement and button at left, heartbeat line bottom-left.

Breakpoints: at 1080px secondary nav links drop and section-head paragraphs widen under full-width headlines; at 720px everything goes single column, the braille word breaks to DARE / DEVIL across five-column rows, the primary button spans full width, and the roster becomes a wrapping grid with 48px touch targets; at 360px the toggle label shortens to "Lights".

## Elevation & Depth

Completely flat. There are no shadows anywhere. Depth is light: elements step from resting opacity to full when the echo reaches them, photographs move from grey (grayscale, 62% brightness) to colour, and the hero photograph sits at 13% behind the type with a soft circle of fuller light at the echo origin. The one tonal step is Raised Ground for a panel or control.

### Named Rules
**The Light Not Shadow Rule.** Hierarchy and focus are carried by opacity and colour. No box-shadow, no glow, no blur.

**The Mask-Only Gradient Rule.** A radial gradient appears only as an alpha mask defining where the echo's light falls on the hero photograph; never as a visible colour fill.

## Shapes

Hard right angles for every rectangle: buttons, the toggle, the readout panel, photo frames (radius 0). Circles are reserved for things that are literally points or sound: braille dots, echo rings (1.5px ink, 2px red for the lead ring), and the 12px red point beside the selected roster name. Strokes are thin and even: 1.5px in the illustration, 2px for the heartbeat and ECG lines.

## Components

### Buttons
Blunt and red; the only filled call to action.
- **Shape:** square corners (0).
- **Primary:** Signal Red Fill, white text, 600 weight at 1.125rem, 18px 28px padding, trailing 20px arrow drawn as an inline SVG stroke.
- **Hover / Focus:** hover (fine pointers only) deepens the fill and slides the arrow 4px right; press scales to 0.97 in 120ms; focus is a 2px Echo Red outline offset 4px.
- **Toggle ("Lights up"):** Raised Ground, label type, 8px 14px; pressed state inverts to Warm Ink on Ground. Hidden under reduced motion, where the page is already fully lit.

### Navigation
Plain text row: wordmark at left (600), section links at 70% opacity rising to full on hover, and the destination link at full opacity with a 2px Echo Red underline. Secondary links drop below 1080px; the destination link and toggle always remain.

### Cards / Containers
- **Readout panel:** Raised Ground, square, padding clamp(24px to 40px), sticky on desktop. Holds a red ECG line drawn left to right at the selected person's pace, then name, meta and description.
- **Photo figure:** square frame on Raised Ground, a greyscale image with a colour copy stacked above at 0 opacity; caption below in label type.

### Roster (signature)
Large condensed-ish names (wdth 80) as borderless text buttons; the selected one shows a 12px red point that scales in. Hover selects on fine pointers; click selects everywhere. The readout text swap is interruptible.

### Braille Headline (signature)
Nine cells spell DAREDEVIL in braille: raised dots in Warm Ink, a large condensed letter resting at 7%. When the echo reaches a cell the letter lights and the raised dots shrink away; fully lit states show the letter with the dot layer hidden. The heading text exists separately for assistive tech.

### Echo (signature motion)
- Two rings per echo from the press point: a red lead ring, then an ink ring 110ms later, expanding linearly at 1150px/s and fading out. At most about eight rings live at once.
- Each element lights when the ring reaches its nearest edge: a per-element opacity animation that snaps up on the expo-out curve (`cubic-bezier(0.23, 1, 0.32, 1)`), holds, then eases back to rest. A new echo starts from the opacity currently on screen, so repeated taps never flash.
- Pointer press sends a full echo; mouse hover sends small pings (260px radius) no more often than every 600ms and 260px of travel. Each echo raises the hero heartbeat, which settles back to 72 bpm.
- The page echoes once on arrival from the braille word, and once from the lead photograph when the visitor arrives at Hell's Kitchen.
- Section entrances move only (24px rise, 700ms, staggered 70ms); content is never hidden by opacity before script runs.
- Reduced motion, no script, or Lights up: no rings, no entrances, everything fully lit.

## Do's and Don'ts

### Do:
- **Do** rest echo-lit reading content at 62% opacity and light it to full only through the echo.
- **Do** keep red to lines, points and the single primary button.
- **Do** use Archivo's width axis (wdth 62) for big letterforms and numerals, and wdth 100 for reading.
- **Do** keep every rectangle square and reserve circles for dots, rings and the selection point.
- **Do** rest photographs in greyscale and return their colour on echo.
- **Do** make every motion interruptible from its on-screen value and provide a fully lit static state for reduced motion.
- **Do** gate hover effects behind fine-pointer hover media queries and give presses a small scale-down (0.96–0.98).

### Don't:
- **Don't** add shadows, glows, blur or visible gradients; depth is light.
- **Don't** fill large areas or backgrounds with red.
- **Don't** hide content behind opacity that only script can lift; entrances use transform only.
- **Don't** let reading text rest dimmer than 62%; the near-invisible resting state is for the braille letters alone.
- **Don't** introduce a second typeface or round the corners of buttons and panels.
- **Don't** use Marvel art, logos, costume imagery or comic-splash composition.
