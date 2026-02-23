

## Problem

The install banner falls back to a "How to Install" link that takes users to a separate page with vague instructions like "look for the install icon in your browser's address bar." This is confusing because most users don't know what that icon looks like or where to find it.

## Solution

Make the install experience more direct and useful:

1. **Improve the InstallBanner itself** — Instead of linking to `/install`, show platform-specific one-line instructions right in the banner (e.g., "Tap Share then Add to Home Screen" for iOS, "Tap menu then Install app" for Android).

2. **Add an Install link to the header nav** — Add a Download icon to the header navigation in `OracleScreen.tsx` so users can always find install instructions even after dismissing the banner.

3. **Improve the /install page** — Add visual step-by-step instructions with icons instead of plain text, and auto-detect the user's platform to highlight the relevant instructions.

## Technical Details

### File: `src/components/oracle/InstallBanner.tsx`
- Add platform detection (iOS, Android, Desktop) using `navigator.userAgent`
- Replace the "How to Install" link with inline, platform-specific instructions:
  - **iOS**: "Tap Share (icon) then 'Add to Home Screen'"
  - **Android**: "Tap menu (icon) then 'Install app'"
  - **Desktop**: "Press Ctrl+D or use browser menu to install"
- Keep the native "Install Now" button when `beforeinstallprompt` is available

### File: `src/components/oracle/OracleScreen.tsx`
- Add a `Download` icon link to `/install` in the header nav bar alongside the existing icons (Gallery, Patterns, Lunar Calendar, etc.)

### File: `src/pages/Install.tsx`
- Add platform auto-detection to highlight the user's platform section
- Replace the generic "look for the install icon" text with clearer, more visual instructions
- Keep the native install button when `beforeinstallprompt` is available
