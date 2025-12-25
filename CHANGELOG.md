# Changelog

## [Unreleased] - 2025-12-24

### Fixed
- Left-aligned phone number in the footer on mobile view
- Consolidated mobile before/after module CSS rules
- Fixed aspect ratio consistency in before/after modules
- Resolved conflicting background rules in mobile view
- Fixed booking wizard modal appearing during page navigation on all pages
- Fixed mobile menu disappearing on residential, commercial, and industrial pages
- Fixed bento-glass-panel positioning on mobile (bottom-center alignment)

### Changed
- Improved mobile layout for better readability and usability
- Updated card styling in before/after modules

### Added
- **Navigation Guard**: Added prevention for booking wizard modal during page transitions
- **Mobile Header Visibility**: Force header visibility on mobile to prevent CSS loading issues
- **Commercial Page Mobile Optimizations**:
  - Simplified timber section layout with block display
  - Added mobile-only log home video under "PRESERVING THE GRAIN"
  - Set timber section padding to 0px top/bottom
  - Made service cards 90% width on mobile
  - Added 20px padding to various text elements
  - Centered "Request Demo" button text
  - Adjusted hud-showcase section spacing
  - Set CTA banner margin-bottom to 0px

- **Industrial Page Mobile Optimizations**:
  - Reduced sector-media min-height to 350px
  - Removed margin-bottom from kr8-menu-header elements
  - Added black-to-transparent gradient overlay on hero
  - Removed gap and adjusted padding on sector-text

- **Style.css Mobile Updates**:
  - Changed kr8-opt1-headline text-align to left
  - Changed comm-hero-content padding to 0px 20px 20px
  - Removed hero backgrounds and added gradient overlays
  - Hid header fade elements on index page
  - Disabled sticky CTA bar on mobile
  - Aligned kr8-opt1-subhead text to left

- **Residential Page Mobile Optimizations**:
  - Changed diagnostic section padding to 20px 0
  - Centered bento-glass-panel at bottom of cards
  - Centered bento-header, kr8-opt1-headline, and kr8-main-subtext text
  - Added 20px padding above bento-grid
  - Hidden bento-anchor "SCROLL TO EXPLORE OUR PROCESS" element
  - Removed background and backdrop-filter from neighborhood-glass-card
  - Added 1% padding to elements-section and elements-glass-container
  - Centered all content within elements-layout section
  - Added 20px padding-top to kr8-opt1-headline
  - Set zig-content padding to 10px
  - Added 5px left/right padding to gearhead-grid
  - Centered kr8-btn primary button
  - Stacked automotive frames images vertically (one per row)

### Technical Changes
- Added comprehensive mobile-specific CSS rules with !important overrides
- Implemented mobile-only video elements for better performance
- Enhanced flexbox layouts for better mobile responsiveness
- Added navigation event listeners to prevent modal conflicts
