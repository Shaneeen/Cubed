# Styles Guide

This folder documents the visual system for Cubed. The actual global styles currently live in `src/app/globals.css`, but this folder is the right place to keep design rules and styling guidance for the team.

## Theme Direction

Cubed uses a soft retail-dashboard style with blue-based colors that work in both light and dark mode.

## Core Color Tokens

Light mode:

- `--bg`: `#f4fbff`
- `--bg-elevated`: `rgba(255, 255, 255, 0.88)`
- `--bg-accent`: `#dff5ff`
- `--surface`: `#ffffff`
- `--surface-soft`: `#edf7ff`
- `--text`: `#1c2950`
- `--text-muted`: `#57698f`
- `--primary`: `#4e7abf`
- `--primary-strong`: `#3e59a1`
- `--secondary`: `#5493cb`
- `--accent`: `#99f6ff`
- `--accent-soft`: `#b4c1ff`

Dark mode:

- `--bg`: `#0e1630`
- `--bg-elevated`: `rgba(18, 29, 59, 0.9)`
- `--bg-accent`: `#132247`
- `--surface`: `#162347`
- `--surface-soft`: `#1b2c57`
- `--text`: `#eef4ff`
- `--text-muted`: `#b7c8ef`
- `--primary`: `#99f6ff`
- `--primary-strong`: `#9bd9f0`
- `--secondary`: `#4e7abf`
- `--accent`: `#b4c1ff`
- `--accent-soft`: `#3e59a1`

## Typography

- Base font stack: `Avenir Next`, `Segoe UI`, `Helvetica Neue`, `Arial`, `sans-serif`
- Use strong headings for dashboards and section titles
- Keep body text readable and compact
- Do not introduce random fonts without checking the theme first

## Layout Rules

- Use rounded cards for major sections
- Keep generous spacing between blocks
- Use 2 to 3 columns on desktop and one column on mobile
- Keep customer, merchant, and admin areas visually distinct

## Component Rules

- Primary buttons should feel prominent
- Secondary buttons should stay lightweight
- Cards should use soft borders and elevation
- Navigation should make the current section obvious

## Dark Mode Rules

- Do not hardcode black or white for surfaces
- Use the CSS variables instead of fixed values
- Check contrast for text, borders, and buttons in both themes

## Developer Notes

- Add new design tokens to `src/app/globals.css`
- Put reusable UI in `src/components`
- Put feature-specific UI in `src/features`
- Keep route-specific notes in this folder
