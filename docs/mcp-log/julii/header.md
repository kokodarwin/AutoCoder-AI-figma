# Julii Header Component - Design Context MCP Log

**Date**: 2026-02-25
**Component**: Header
**Figma File**: Julii Design System

---

## Overview

This document contains extracted design context values for the Julii header component across different breakpoints and states. The header includes logo placement, navigation, contact buttons, and CTA elements.

---

## PC Default Header

**Figma Node**: 80:4219

### Container
- **Background**: White (#FFFFFF)
- **Height**: 100px
- **Width**: 1920px

### Logo ("Jurlii")
- **Font**: Pacifico Regular
- **Font Size**: 72.414px
- **Color**: #F5BC42 (Gold)
- **Line Height**: 1.7
- **Position**:
  - Left: 102px
  - Top: 78px
- **Note**: Extends below the header bar

### Navigation Menu
- **Position**:
  - Left: 852px
  - Top: 26px
- **Layout**: Horizontal with gap of 30px between items
- **Font**: Zen Maru Gothic Bold
- **Font Size**: 14px
- **Color**: #4A3A12 (Dark Brown)
- **Active State**: "ホーム" (Home) item has underline indicator
- **Gap to Contact Button**: 38px

### Contact Button
- **Dimensions**: 180px × 48px
- **Background**: #3C91B5 (Blue)
- **Border Radius**: 9999px (Pill shape)
- **Padding**: 14px 32px
- **Content**:
  - **Icon**: Mail icon (18px × 18px, white)
  - **Text**: Zen Maru Gothic Bold, 14px, white

### Right CTA (Blue Masked Shape)
- **Dimensions**: 183px × 189px
- **Position**: Top-right corner
- **Shape**: Masked blue element
- **Content**:
  - **Book Icon**: 54px × 54px
    - Position: Top: 28px
  - **Text**: Zen Maru Gothic Bold, 14px, white
    - Line Height: 1.5
    - Position: Top: 78px

---

## PC Scrolled Header

**Figma Node**: 0:3819

### Container Changes
- **Height**: 80px (Shrinks from 100px)

### Logo Changes
- **Font Size**: 40px (Shrinks from 72.414px)
- **Position**:
  - Top: 6px
  - Left: 113px

### Navigation Changes
- **Position**:
  - Left: 859px
  - Top: 16px

### CTA
- **Remains unchanged** from PC Default Header

---

## SP (Mobile) Header

**Figma Node**: 80:7943

### Logo
- **Font**: Pacifico
- **Font Size**: 16.84px
- **Color**: #F5BC42 (Gold)
- **Position**:
  - Left: 17px
  - Top: 24px

### Hamburger Menu Button
- **Position**: Right side
- **Background**: #3C91B5 (Blue)
- **Dimensions**: 86px × 98px
- **Icon Content** (3 horizontal lines):
  - **Line Dimensions**: 30px × 3px (each)
  - **Color**: White
  - **Border Radius**: 1.348px
  - **Gap Between Lines**: 8px

---

## SP (Mobile) Navigation Menu

**Figma Node**: 0:7716

### Overlay Container
- **Background**: #F9F8F5 (Light Beige)
- **Dimensions**: 375px × 685px
- **Padding**: 94px 54px

### Logo in Menu
- **Font**: Pacifico
- **Font Size**: 16.84px
- **Alignment**: Centered

### Navigation Items
- **Gap Between Items**: 20px
- **Padding Top**: 32px
- **Font**: Zen Maru Gothic Bold
- **Font Size**: 14px

### Action Buttons
- **Padding Top**: 48px
- **Gap Between Buttons**: 16px

#### Blue Pill Button (Contact)
- **Dimensions**: 180px × 48px
- **Background**: #3C91B5 (Blue)
- **Border Radius**: 9999px (Pill shape)

#### Dark Blue Button
- **Width**: 180px
- **Background**: #317491 (Dark Blue)
- **Border Radius**: 20px

---

## Design Tokens Summary

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Primary Gold | #F5BC42 | Logo |
| Primary Blue | #3C91B5 | Buttons, Mobile hamburger |
| Dark Blue | #317491 | Secondary button (mobile) |
| Dark Brown | #4A3A12 | Navigation text |
| Light Beige | #F9F8F5 | Mobile menu background |
| White | #FFFFFF | Header background |

### Typography
| Font | Weight | Size | Usage |
|------|--------|------|-------|
| Pacifico | Regular | 72.414px / 40px / 16.84px | Logo (various sizes) |
| Zen Maru Gothic | Bold | 14px | Navigation, buttons, CTA text |

### Spacing
| Element | Value |
|---------|-------|
| Navigation item gap | 30px |
| Nav to button gap | 38px |
| Mobile nav items gap | 20px |
| Mobile buttons gap | 16px |
| Hamburger lines gap | 8px |

### Border Radius
| Style | Value |
|-------|-------|
| Pill buttons | 9999px |
| Hamburger lines | 1.348px |
| Mobile dark button | 20px |

---

## Responsive Breakpoints

- **PC Default**: 1920px width
- **PC Scrolled**: Triggered on scroll, height reduces from 100px to 80px
- **Mobile (SP)**: 375px width, hamburger menu activated

---

## Notes

- The PC Default header logo extends below the 100px container height
- The scrolled state maintains all elements but with reduced spacing and smaller typography
- Mobile navigation is an overlay that appears over the main content
- All buttons use consistent 14px font size across breakpoints
- Gold accent color (#F5BC42) is reserved for the logo
- Blue (#3C91B5) is the primary interactive color across all breakpoints
