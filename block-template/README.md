# Block Template

This is a template for creating new blocks. To use this template:

1. Copy this directory to `src/your-block-name/`
2. Update all files with your block's specific information
3. Replace `your-block-name` with your actual block name (use kebab-case)
4. Replace `Your Block Name` with the display name
5. Update the namespace from `lavender-counselling/your-block-name`

## Files to Update:

### block.json
- Change the `name` to match your block
- Update `title`, `description`, and `icon`
- Define your block's `attributes`
- Configure block `supports` as needed

### index.js
- Update import paths if needed
- Modify block registration if required

### edit.js
- Build your editor interface
- Add controls to InspectorControls
- Create the editor preview

### save.js
- Define the frontend HTML output
- Ensure it matches the edit.js structure

### style.scss
- Add your block's frontend styles
- Remember to use the correct class name

### editor.scss
- Add editor-specific styles
- Enhance the editing experience

### view.js (optional)
- Add frontend JavaScript if needed
- Remove if not required