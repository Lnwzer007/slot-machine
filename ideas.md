# Cyberpunk Slot Machine - Design Philosophy

## Design Movement: Cyberpunk Arcade Futurism

This design draws from arcade cabinet aesthetics of the 1980s-90s fused with contemporary cyberpunk visual language. The interface is a neon-soaked, high-contrast environment that evokes the thrill of a Vegas slot machine reimagined for the digital age.

## Core Principles

1. **Neon Luminescence** - Glowing accents (cyan, magenta, electric lime) against deep blacks create visual excitement and guide attention to interactive elements
2. **Arcade Physicality** - Chunky typography, bold borders, and mechanical motion convey the tangible feel of a physical slot machine
3. **Controlled Chaos** - Particle effects, motion blur, and sound design create sensory intensity without overwhelming the core gameplay
4. **Dark Immersion** - Deep blacks and dark grays dominate, making neon elements pop and creating a casino-like atmosphere

## Color Philosophy

**Primary Palette:**
- **Background:** Deep black (`#0a0e27`) - creates the void, maximizes neon contrast
- **Primary Neon:** Cyan (`#00f0ff`) - primary interactive elements, reel borders, active states
- **Secondary Neon:** Magenta/Hot Pink (`#ff006e`) - accent highlights, jackpot indicators, danger states
- **Tertiary Neon:** Electric Lime (`#39ff14`) - success states, win indicators, positive feedback
- **Neutral:** Dark slate (`#1a1f3a`) - cards, panels, secondary surfaces

**Emotional Intent:** The neon colors evoke excitement, energy, and risk. The dark background creates focus and prevents eye fatigue during extended play sessions.

## Layout Paradigm

**Asymmetric Arcade Cabinet Layout:**
- Reel display dominates the center-right (the "cabinet screen")
- Control panel sits left-aligned below the reels (buttons, bet controls)
- Stats/player info floats in a side panel (right edge)
- Minimal navigation—focus is on the game, not chrome

Avoid centered, grid-based layouts. Instead, create the visual impression of a physical arcade machine with distinct zones for display, controls, and information.

## Signature Elements

1. **Glowing Reel Borders** - Cyan/magenta neon glow around the 3x3 reel grid, pulsing slightly during spins
2. **Scanline Effect** - Subtle horizontal lines across the reel display, evoking old CRT monitors
3. **Particle Burst** - Confetti/coin particles explode from the reels on big wins
4. **Neon Text Glow** - Key text (jackpot amounts, win notifications) has a subtle text-shadow glow effect

## Interaction Philosophy

- **Immediate Feedback** - Every button press triggers instant visual/audio response (no dead zones)
- **Tactile Feel** - Buttons have active/pressed states with scale transforms to simulate physical depression
- **Progressive Intensity** - Small wins are subtle; big wins trigger full sensory experience (particles, sound, glow)
- **Anticipation** - Reel spin animations build tension; result reveal is satisfying and clear

## Animation Guidelines

- **Reel Spin:** 2-3 second smooth spin with motion blur, easing out as it stops
- **Elastic Bounce:** Reels bounce slightly when they stop (elastic easing)
- **Particle Effects:** Coins/confetti burst from center outward on jackpot (300ms duration)
- **Glow Pulse:** Neon borders pulse gently (2s cycle) during idle state, intensify during spin
- **Button Press:** 100ms scale(0.95) on active, 150ms ease-out return
- **Text Glow:** Win amounts fade in with text-shadow glow (200ms)

All animations respect `prefers-reduced-motion` media query.

## Typography System

- **Display Font:** "Orbitron" (Google Fonts) - bold, geometric, futuristic. Used for: game title, jackpot amounts, big win notifications
- **Heading Font:** "Space Mono" (Google Fonts) - monospace, technical. Used for: player name, bet amounts, stats labels
- **Body Font:** "Inter" (Google Fonts) - clean, readable. Used for: descriptions, small text, UI labels

**Hierarchy:**
- H1 (Orbitron 48px bold): Game title, jackpot display
- H2 (Space Mono 24px bold): Section titles (Player Stats, Spin History)
- H3 (Space Mono 18px): Labels (Bet Amount, Current Credits)
- Body (Inter 14px): Descriptions, history entries

## Brand Essence

**One-liner:** A high-octane, neon-soaked arcade slot machine that brings the thrill of Vegas to your screen.

**Personality Adjectives:** Electric, Thrilling, Retro-Futuristic

## Brand Voice

Headlines and CTAs sound like an arcade barker—exciting, energetic, and slightly over-the-top. Avoid corporate language; lean into arcade/casino vernacular.

**Example Headlines:**
- "SPIN TO WIN!" (instead of "Click to Play")
- "JACKPOT INCOMING!" (instead of "You won!")
- "CREDITS DEPLETED — GAME OVER" (instead of "Insufficient funds")

**Microcopy Style:** Short, punchy, action-oriented. Use all-caps for emphasis on key moments.

## Wordmark & Logo

**Logo Concept:** A bold, geometric slot machine symbol—a stylized reel with three glowing circles arranged vertically, surrounded by a hexagonal frame. The reel has a neon cyan glow. No text in the mark itself; the wordmark "CYBER SLOTS" sits below in Orbitron bold.

## Signature Brand Color

**Neon Cyan (`#00f0ff`)** - This is the unmistakable primary color. It appears on all interactive elements, reel borders, and key UI components. It's the color of the arcade, the color of the future.

---

## Implementation Notes

- All neon colors use `text-shadow` or `box-shadow` for glow effects
- Dark backgrounds use `#0a0e27` or `#1a1f3a` exclusively
- Transitions use `cubic-bezier(0.23, 1, 0.32, 1)` for snappy feel
- Sound effects are essential—spinning, landing, win chimes
- Particle effects use CSS animations or Canvas for performance
