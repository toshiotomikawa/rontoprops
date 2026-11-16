---
version: alpha
name: Ronto Props
description: Old-school tattoo flash meets a prop workshop. Warm browns, one mustard accent, heavy all-caps type.
colors:
  primary: "#d9a441"
  ink: "#241408"
  cream: "#f2e2c4"
  tan: "#e8cfa0"
  muted: "#c4b096"
  brown-deep: "#3a2418"
  brown-mid: "#5c3a24"
  brown-hero: "#1e1109"
  brown-nav: "#1a0f07"
  border: "#46301d"
  red-dark: "#8a2a1f"
  green-open: "#8fe0a8"
typography:
  display:
    fontFamily: Montserrat
    fontWeight: 900
    fontSize: 132px
    lineHeight: 0.9
    letterSpacing: 0.02em
  title:
    fontFamily: Montserrat
    fontWeight: 900
    fontSize: 2rem
    letterSpacing: 0.06em
  label:
    fontFamily: Montserrat
    fontWeight: 900
    fontSize: 13px
    letterSpacing: 0.2em
  body:
    fontFamily: Montserrat
    fontWeight: 900
    fontSize: 13px
    lineHeight: 1.85
    letterSpacing: 0.16em
rounded:
  none: 0px
spacing:
  sm: 16px
  md: 32px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: 16px 32px
    height: 44px
  button-outline:
    textColor: "{colors.tan}"
    typography: "{typography.label}"
    padding: 16px 32px
  button-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
  page:
    backgroundColor: "{colors.brown-deep}"
    textColor: "{colors.cream}"
  nav:
    backgroundColor: "{colors.brown-nav}"
    textColor: "{colors.cream}"
  hero:
    backgroundColor: "{colors.brown-hero}"
    textColor: "{colors.cream}"
  events-strip:
    backgroundColor: "{colors.red-dark}"
    textColor: "{colors.cream}"
  status-open:
    textColor: "{colors.green-open}"
  caption:
    textColor: "{colors.muted}"
  divider:
    backgroundColor: "{colors.border}"
  card:
    backgroundColor: "{colors.brown-mid}"
    textColor: "{colors.tan}"
---

## Overview

A one-page portfolio for a maker of 3D-printed cosplay props. It should feel like a workshop sign or a tattoo flash sheet: bold, warm, hand-made. Not a tech startup.

## Colors

Mustard is the only accent and marks every call to action. Backgrounds stay in the brown family and never go pure black. Dark red is for the events strip only. Green shows that the order book is open.

## Typography

One face, Montserrat Black, set in capitals everywhere. The display size scales with the viewport, from 3.5rem up to 132px. Letter spacing grows as the size shrinks: tight on big titles, wide on labels. Body text stays at two short lines per paragraph and never below 11px.

## Layout

Sticky nav, hero, events strip, a filterable photo mosaic (4, 3, then 2 columns), orders and about side by side (stacked under 860px), a mustard call to action, footer.

## Shapes

Square corners. Buttons cast a hard offset shadow instead of a blur, like a printed sticker.

## Do's and Don'ts

Do keep every link to Instagram reachable from the nav, the hero and the closing bar. Don't add a second accent colour, rounded cards or cool blue tones.
