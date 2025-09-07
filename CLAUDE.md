# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` - Runs the app at http://localhost:3000 with hot reload
- **Run tests**: `npm test` - Launches Jest test runner in interactive watch mode  
- **Build for production**: `npm run build` - Creates optimized production build in `build/` folder
- **Start production build**: `npm run start-prod` - Builds and serves the production version locally

## Project Architecture

WyrmSearch is a React-based card search application for dragon and cave cards. The project follows a component-based architecture:

### Core Structure
- **App.js**: Main application component that manages global state using useReducer for search functionality and useState for infinite scroll pagination (displays 30 cards at a time)
- **src/search/**: Contains search functionality with FlexSearch full-text indexing and Material-UI accordion interface for filtering by card type and dragon personality
- **src/card/**: Card rendering components with DragonCard and CaveCard variants, plus a Card router component
- **src/assets/**: Contains cards.json data file and SVG icons for personalities (Shy, Playful, Helpful, Aggressive) and card types

### Key Technologies
- **FlexSearch**: Full-text search engine for card indexing by name, ability, and number
- **Material-UI (@mui/material)**: UI components including Accordion, TextField, and ThemeProvider with custom "Acumin Pro Condensed" font
- **react-infinite-scroll-component**: Handles paginated card display
- **Custom text rendering**: Supports markdown-like syntax in card text ([icons], *bold*, VP tokens)

### Data Model
Cards are loaded from `src/assets/cards.json` with fields including:
- Basic: id, name, number, type (Dragon/Cave)
- Dragon-specific: personality (Shy/Playful/Helpful/Aggressive), size, abilityType
- Cave-specific: location attributes (Crimson Cavern, Golden Grotto, Amethyst Abyss)

### Search Implementation
The `handleSearch` reducer in Search.jsx:
1. Uses FlexSearch for text queries across name/ability/number fields
2. Filters results by card type and personality toggles
3. Returns sorted card IDs for efficient rendering

### Component Architecture
- Cards are rendered based on type using polymorphic pattern in Card.jsx
- Text rendering supports icon replacement and personality highlighting
- Infinite scroll manages display performance for large card sets