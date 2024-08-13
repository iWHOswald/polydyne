/*
INSTRUCTIONS FOR FUTURE DEVELOPMENT:
-------------------------------------
0. FILE NAME: animante.js


This file (`animate.js`) handles the animation logic for the Geometric Pattern Drawer web application. 
It includes functionality to animate the variables of a selected pattern over time, with support for 
symmetric and non-symmetric animations. The comments within this file explain the purpose of each function 
and variable, making it easier to understand and extend the animation capabilities of the application.

The animation logic is tied to the UI elements defined in the `index.html` file, such as the step size, 
initial and final values, and whether the animation should be symmetric. Any changes to the animation 
interface in `index.html` should be reflected here.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Get references to the animation-related UI elements
    const startAnimationButton = document.getElementById('start-animation');
    const symmetricAnimationCheckbox = document.getElementById('symmetric-animation');
    const patternSelect = document.getElementById('pattern-select');
    let animationFrameId;

    // Function to perform the animation
    // Takes the variables to animate, the step sizes, and whether the animation should be symmetric
    const animate = (variables, stepSizes, symmetric) => {
        let step = 0; // Initial step value
        const steps = []; // Array to store step values for each variable
        const initialValues = {}; // Object to store initial values of the variables
        const finalValues = {}; // Object to store final values of the variables

        // Initialize initial and final values, and step sizes for each variable
        for (const key in variables) {
            initialValues[key] = parseFloat(document.getElementById(`${key}-initial`).value);
            finalValues[key] = parseFloat(document.getElementById(`${key}-final`).value);
            steps.push(parseFloat(document.getElementById(`${key}-step`).value));
        }

        // Recursive function to animate each frame
        const animateStep = () => {
            for (const key in variables) {
                // Update the variable based on the step size and whether the animation is symmetric
                if (symmetric) {
                    variables[key] = initialValues[key] + (finalValues[key] - initialValues[key]) * Math.abs(Math.sin(step * steps[key]));
                } else {
                    variables[key] = initialValues[key] + (finalValues[key] - initialValues[key]) * (Math.sin(step * steps[key]) + 1) / 2;
                }
            }
            // Redraw the pattern with the updated variables
            drawPattern(ctx, patterns, monomers, colorPatterns);
            step += 1; // Increment the step value
            animationFrameId = requestAnimationFrame(animateStep); // Request the next animation frame
        };

        // Cancel any ongoing animation before starting a new one
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(animateStep);
    };

    // Event listener for the "Start Animation" button
    startAnimationButton.addEventListener('click', () => {
        const selectedPattern = patterns[patternSelect.value]; // Get the selected pattern
        const variables = selectedPattern.variables; // Get the pattern variables
        const stepSizes = {}; // Object to store step sizes for each variable

        // Get the step size for each variable from the UI
        for (const key in variables) {
            stepSizes[key] = parseFloat(document.getElementById(`${key}-step`).value);
        }

        // Determine whether the animation should be symmetric based on the checkbox
        const symmetric = symmetricAnimationCheckbox.checked;

        // Start the animation with the specified variables, step sizes, and symmetry option
        animate(variables, stepSizes, symmetric);
    });
});
