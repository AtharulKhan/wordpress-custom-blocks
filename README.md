# Custom Blocks

A collection of custom Gutenberg blocks for the Lavender Counselling website.

## Available Blocks

### Information Hub Block
A customizable information hub with up to 6 cards, different list types, and color options.

**Features:**
- Add up to 6 information cards
- Customizable card colors (background and border)
- Three list types: Links, Checkmarks, Bullet points
- Section title and description
- Fully responsive design
- Smooth hover animations
- Accessibility-friendly

## Installation

1. Upload the `custom-blocks` folder to your `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. All blocks will be available in the Gutenberg editor

## Development

### Setup
```bash
# Install dependencies
npm install
```

### Development Build
```bash
# Start development build with hot reload
npm start
```

### Production Build
```bash
# Build for production
npm run build
```

### Adding a New Block

1. Create a new directory in `src/` with your block name
2. Add the following files:
   - `block.json` - Block metadata
   - `index.js` - Block registration
   - `edit.js` - Editor component
   - `save.js` - Save component
   - `style.scss` - Frontend styles
   - `editor.scss` - Editor-only styles
   - `view.js` - Frontend JavaScript (optional)

3. Run `npm run build` to compile the new block

The build process will automatically detect and compile all blocks in the `src/` directory.

## Project Structure

```
custom-blocks/
├── custom-blocks.php     # Main plugin file
├── package.json          # NPM configuration
├── webpack.config.js     # Webpack configuration for multi-block support
├── src/                  # Source files
│   ├── information-hub/  # Information Hub block
│   │   ├── block.json
│   │   ├── index.js
│   │   ├── edit.js
│   │   ├── save.js
│   │   ├── style.scss
│   │   ├── editor.scss
│   │   └── view.js
│   └── [new-block]/      # Future blocks go here
└── build/                # Compiled files (generated)
    ├── information-hub/
    └── [new-block]/
```

## License

GPL-2.0-or-later