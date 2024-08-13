# Geometric Pattern Drawer

## Overview

This project is a web application that allows users to create and animate geometric patterns. The application uses mathematical functions to generate paths, along which monomer shapes or images can be plotted. The user can control various aspects of the patterns and monomers through a graphical user interface (GUI), with options to save and load settings, animate patterns, and more.

## Features

- **Pattern Generation**: Uses mathematical formulas (e.g., Julia Set, Sinusoidal) to generate paths for plotting.
- **Monomer Customization**: Supports different shapes (circle, rectangle) and images (e.g., SVG, PNG). Monomers can be customized with colors, sizes, and orientations.
- **Follow Vector Feature**: Allows anisotropic shapes or images to align with the direction of the path's curvature.
- **Animation**: Provides the ability to animate pattern parameters over time, with options to control step size and rate.
- **Preset Management**: Allows users to load predefined settings for patterns, monomers, and animation properties.
- **Background Customization**: Supports background color customization, including transparent backgrounds.

## Structure

- **`index.html`**: The main HTML file that structures the web interface, including the accordion menus for patterns, monomers, and animations.
- **`styles.css`**: (Optional) Contains custom styles for the application.
- **`data.js`**: Contains the JSON data structure for patterns, monomers, color patterns, and presets. This data is loaded and manipulated dynamically by the application.
- **`ui.js`**: Manages the user interface interactions, such as updating pattern and monomer settings based on user input.
- **`draw.js`**: Contains the logic for drawing patterns and monomers on the canvas, including handling the follow vector feature and other drawing specifics.
- **`main.js`**: The main JavaScript file that initializes the application, handles events, and integrates the other modules.

## Important Notes

- **Vector Path Orientation**: The follow vector feature aligns anisotropic shapes or images along the direction of the generated path's curvature. The user can select which axis (long or short edge) should be used for orientation.
- **Animation Presets**: Presets allow users to save and load specific configurations for patterns, monomers, and animation properties. This feature is particularly useful for users who want to experiment with different designs and animations.
- **Dynamic UI Updates**: The application dynamically updates the UI elements (input fields, select boxes) based on the current pattern or monomer selection, providing a responsive user experience.

## How to Use

1. **Load the Web Application**: Open `index.html` in a web browser.
2. **Select a Pattern**: Choose a pattern from the "Pattern" accordion and adjust its parameters.
3. **Customize Monomer**: Choose a monomer from the "Monomer" accordion and customize its properties.
4. **Animation**: Set up animation parameters in the "Animation" accordion and click "Animate" to see the pattern in motion.
5. **Background Settings**: Customize the background color in the "Pattern" accordion.
6. **Saving and Loading Presets**: Use the available options to save your settings and load them later.

## Future Development

If you need to develop further or modify the project, refer to the code comments within each file for detailed explanations of the logic and structure. The `README.md` provides a general overview, but the inline comments will guide you through the specific functionalities and how they interact.

## Contact

For further questions or contributions, please contact the original developer.

---

_Note: This README is meant to be a living document. As you continue developing the project, update this file with new features, instructions, or any other relevant information._
