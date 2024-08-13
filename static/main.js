/*
INSTRUCTIONS FOR FUTURE DEVELOPMENT:
-------------------------------------
1. JSON Structure:
   - This script relies on JSON data fetched from the server, specifically the 'patterns', 'monomers', 'colorPatterns', and 'presets' objects.
   - Ensure that the JSON structure aligns with the expected format in this script. If new fields are added to the JSON structure, corresponding updates to this script are necessary.
   - The 'patterns' and 'monomers' are dynamically populated in the respective dropdowns, and their variables are rendered as input fields.

2. Pattern Selection:
   - Patterns are selected from a dropdown. The corresponding variables are populated in input fields dynamically.
   - If new patterns are added, ensure that their variables are properly defined in the JSON and handled here.

3. Monomer Selection:
   - Monomers are also selected from a dropdown. The associated variables are similarly populated and updated.
   - New monomers must be defined in the JSON with all necessary attributes to ensure proper rendering.

4. Animation:
   - Animation features allow the modification of pattern variables over time.
   - If additional variables or animation types are introduced, this section should be extended to accommodate them.

5. Event Handling:
   - Various event listeners are used to manage user interactions, such as selecting patterns, updating variables, and controlling animations.
   - When introducing new user interactions or modifying existing ones, ensure that the appropriate event listeners are implemented or updated.

6. Extendability:
   - This script is structured to be extendable. When adding new patterns, monomers, or animation features, ensure they integrate smoothly with the existing code.
   - Avoid hardcoding values; use the JSON structure and dynamic handling to keep the code flexible.

7. Error Handling:
   - Basic error handling is in place for operations like fetching JSON data. Consider expanding this to handle other potential issues, such as invalid user input or unexpected data formats.

8. Testing:
   - After making updates, thoroughly test the application to ensure all patterns, monomers, and animations function as expected.
   - Include tests for new patterns, monomers, or any additional features to maintain stability.

9. Documentation:
   - Maintain and update documentation within the code as necessary, especially when introducing new features or modifying existing ones.
   - Update these instructions if there are significant changes to the structure or functionality of the script.

-------------------------------------
END OF INSTRUCTIONS
*/

document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const patternSelect = document.getElementById('pattern-select');
    const patternVariables = document.getElementById('pattern-variables');
    const updatePatternButton = document.getElementById('update-pattern');
    const monomerSelect = document.getElementById('monomer-select');
    const monomerVariables = document.getElementById('monomer-variables');
    const colorPatternSelect = document.getElementById('color-pattern-select');
    const followVectorCheckbox = document.getElementById('follow-vector');
    const vectorAxisSelect = document.getElementById('vector-axis');
    const updateMonomerButton = document.getElementById('update-monomer');
    const canvas = document.getElementById('pattern-canvas');
    const ctx = canvas.getContext('2d');
    const stepSizeInput = document.getElementById('step-size');
    const rateInput = document.getElementById('rate');
    const animateButton = document.getElementById('animate-button');
    const pauseAnimationButton = document.getElementById('pause-animation');
    const animateVariableSelect = document.getElementById('animate-variable');
    const loadAnimationPresetButton = document.getElementById('load-animation-preset');
    const backgroundColorInput = document.getElementById('background-color');
    const backgroundTransparentCheckbox = document.getElementById('background-transparent');
    const presetSelect = document.getElementById('preset-select');
    const loadPresetButton = document.getElementById('load-preset');

    // New DOM elements for symmetry analysis
    const symmetryCanvas = document.getElementById('symmetry-canvas');
    const symmetryCtx = symmetryCanvas.getContext('2d');
    const startSymmetryButton = document.getElementById('start-symmetry-analysis');
    const stopSymmetryButton = document.getElementById('stop-symmetry-analysis');
    const currentSymmetryInput = document.getElementById('current-symmetry'); // Display box for current symmetry


    let animationInterval;  // Interval ID for animation
    let symmetryInterval;   // Interval ID for symmetry analysis
    let animationStep = 0;  // Track the current step in the animation
    let startTime = null;   // Start time for the symmetry analysis
    let timeData = [];      // Array to store time data
    let symmetryData = [];  // Array to store symmetry scores

    console.log('presetSelect:', presetSelect);
    console.log('loadPresetButton:', loadPresetButton);

    // Function to calculate vertical symmetry
    const calculateVerticalSymmetry = (imageData) => {
        const { width, height, data } = imageData;
        let symmetryScore = 0;
        let count = 0;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width / 2; x++) {
                const indexLeft = (y * width + x) * 4;
                const indexRight = (y * width + (width - x - 1)) * 4;

                // Compare pixel values (R, G, B) for left and right sides
                const diff = Math.abs(data[indexLeft] - data[indexRight]) +
                             Math.abs(data[indexLeft + 1] - data[indexRight + 1]) +
                             Math.abs(data[indexLeft + 2] - data[indexRight + 2]);

                symmetryScore += diff;
                count++;
            }
        }

        // Normalize the symmetry score
        return 1 - (symmetryScore / (count * 255 * 3));
    };

    // Function to update the symmetry plot over time
    const updateSymmetryPlot = () => {
        // Clear the canvas
        symmetryCtx.clearRect(0, 0, symmetryCanvas.width, symmetryCanvas.height);

        // Set up the plot properties
        symmetryCtx.beginPath();
        symmetryCtx.strokeStyle = '#00f';
        symmetryCtx.lineWidth = 2;

        // Plot symmetry data as a function of time
        symmetryCtx.moveTo(0, symmetryCanvas.height - symmetryData[0] * symmetryCanvas.height);
        for (let i = 1; i < symmetryData.length; i++) {
            const x = (timeData[i] - timeData[0]) / (timeData[timeData.length - 1] - timeData[0]) * symmetryCanvas.width;
            const y = symmetryCanvas.height - symmetryData[i] * symmetryCanvas.height;
            symmetryCtx.lineTo(x, y);
        }
        symmetryCtx.stroke();

        // Update the current symmetry score display
        const currentScore = symmetryData[symmetryData.length - 1];
        currentSymmetryInput.value = currentScore.toFixed(3);
    };

    // Function to start symmetry analysis
    const startSymmetryAnalysis = () => {
        startTime = Date.now();
        timeData = [];
        symmetryData = [];

        symmetryInterval = setInterval(() => {
            const currentTime = Date.now() - startTime;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const symmetryScore = calculateVerticalSymmetry(imageData);

            timeData.push(currentTime);
            symmetryData.push(symmetryScore);

            updateSymmetryPlot();
        }, 5); // Default interval set to 5ms
    };

    // Event listener to start symmetry analysis
    startSymmetryButton.addEventListener('click', () => {
        if (!symmetryInterval) {
            startSymmetryAnalysis();
        }
    });

    // Event listener to stop symmetry analysis
    stopSymmetryButton.addEventListener('click', () => {
        clearInterval(symmetryInterval);
        symmetryInterval = null;
    });

    

    // Check if the preset elements exist before adding event listeners
    if (presetSelect && loadPresetButton) {
        // Load the selected preset when the button is clicked
        loadPresetButton.addEventListener('click', () => {
            const selectedPreset = presets[presetSelect.value];
            if (selectedPreset) {
                applyPresets(selectedPreset);
            }
        });
    } else {
        console.error('Preset elements not found in the DOM.');
    }


    // Function to apply presets from the JSON configuration
    const applyPresets = (preset) => {
        const defaultPattern = preset.pattern;
        const defaultMonomer = preset.monomer;
        const animation = preset.animation;

        if (defaultPattern) {
            patternSelect.value = defaultPattern.name;
            generateInputFields(patternVariables, defaultPattern.variables); // Generate input fields for pattern variables
        }

        if (defaultMonomer) {
            monomerSelect.value = defaultMonomer.name;
            generateInputFields(monomerVariables, defaultMonomer.variables); // Generate input fields for monomer variables
            colorPatternSelect.value = defaultMonomer.variables.colorPattern || 'rainbow';
            followVectorCheckbox.checked = defaultMonomer.variables.followVector || false;
            vectorAxisSelect.value = defaultMonomer.variables.vectorAxis || 'long';
        }

        if (animation) {
            stepSizeInput.value = animation.stepSize;
            rateInput.value = animation.rate;
        }

        drawPattern(ctx, patterns, monomers, colorPatterns); // Draw the pattern with the presets
    };
    
    const fetchJsonData = async () => {
        const data = await loadJsonData(); // Assuming loadJsonData() fetches and returns the parsed JSON data
        patterns = data.patterns;
        monomers = data.monomers;
        colorPatterns = data.colorPatterns;
        presets = data.presets;
    
        populateSelect(patternSelect, patterns); // Populate pattern dropdown
        populateSelect(monomerSelect, monomers); // Populate monomer dropdown
        populateSelect(presetSelect, presets);   // Populate preset dropdown
    
        // Apply the first preset automatically when the page loads
        if (presets.length > 0) {
            applyPresets(presets[0]); // Load and apply the first preset
            presetSelect.value = presets[0].name; // Set the preset dropdown to the first preset
        }
    };
    
    // Load the selected preset when the button is clicked
    loadPresetButton.addEventListener('click', () => {
        const selectedPreset = presets[presetSelect.value];
        if (selectedPreset) {
            applyPresets(selectedPreset);
        }
    });

    const populateAnimateVariableDropdown = (variables) => {
        animateVariableSelect.innerHTML = '';  // Clear current options
        for (const key in variables) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            animateVariableSelect.appendChild(option);
        }
    };

    // Determine the background color (solid or transparent)
    const getBackgroundColor = () => {
        return backgroundTransparentCheckbox.checked ? 'transparent' : backgroundColorInput.value;
    };

    // Event listener: Update pattern variables and animation dropdown when a new pattern is selected
    patternSelect.addEventListener('change', (event) => {
        const selectedPattern = patterns[event.target.value];
        generateInputFields(patternVariables, selectedPattern.variables); // Generate input fields for the selected pattern's variables
        populateAnimateVariableDropdown(selectedPattern.variables); // Populate the animation dropdown
    });

    // Event listener: Update monomer variables when a new monomer is selected
    monomerSelect.addEventListener('change', (event) => {
        const selectedMonomer = monomers[event.target.value];
        generateInputFields(monomerVariables, selectedMonomer.variables); // Generate input fields for the selected monomer's variables
        colorPatternSelect.value = selectedMonomer.colorPattern || 'rainbow';
        followVectorCheckbox.checked = selectedMonomer.followVector || false;
        vectorAxisSelect.value = selectedMonomer.vectorAxis || 'long';
    });

    // Event listener: Apply updated pattern variables and redraw the pattern
    updatePatternButton.addEventListener('click', () => {
        const patternName = patternSelect.value;
        const updatedPattern = patterns[patternName];
        updatedPattern.variables = {};  // Ensure the variables object exists
        patternVariables.querySelectorAll('input').forEach(input => {
            updatedPattern.variables[input.id] = input.type === 'checkbox' ? input.checked : input.value;
        });
        drawPattern(ctx, patterns, monomers, colorPatterns, getBackgroundColor()); // Redraw with updated pattern
    });

    // Event listener: Apply updated monomer variables and redraw the pattern
    updateMonomerButton.addEventListener('click', () => {
        const monomerName = monomerSelect.value;
        const updatedMonomer = monomers[monomerName];
        monomerVariables.querySelectorAll('input').forEach(input => {
            const inputId = input.id;
            if (inputId in updatedMonomer) {
                updatedMonomer[inputId] = input.type === 'checkbox' ? input.checked : input.value;
            } else if (updatedMonomer.variables && inputId in updatedMonomer.variables) {
                updatedMonomer.variables[inputId] = input.type === 'checkbox' ? input.checked : input.value;
            }
        });
        updatedMonomer.colorPattern = colorPatternSelect.value;
        updatedMonomer.followVector = followVectorCheckbox.checked;
        updatedMonomer.vectorAxis = vectorAxisSelect.value;
        drawPattern(ctx, patterns, monomers, colorPatterns, getBackgroundColor()); // Redraw with updated monomer
    });

    // Event listener: Start animating the selected variable
    animateButton.addEventListener('click', () => {
        const stepSize = parseFloat(stepSizeInput.value) || 0.05;
        const rate = parseInt(rateInput.value) || 5;
        const variableToAnimate = animateVariableSelect.value;

        if (animationInterval) {
            clearInterval(animationInterval); // Clear any existing animation interval
        }

        animationStep = 0;

        // Start the animation interval
        animationInterval = setInterval(() => {
            const selectedPatternName = patternSelect.value;
            const selectedPattern = patterns[selectedPatternName];
            const variables = selectedPattern.variables;

            // Modify the variable to animate
            variables[variableToAnimate] = parseFloat(variables[variableToAnimate]) + stepSize;

            drawPattern(ctx, patterns, monomers, colorPatterns, getBackgroundColor()); // Redraw with updated variables

            animationStep += stepSize;
        }, rate);
    });

    // Event listener: Pause the animation
    pauseAnimationButton.addEventListener('click', () => {
        if (animationInterval) {
            clearInterval(animationInterval); // Clear the animation interval to pause it
            animationInterval = null;
        }
    });

    // Event listener: Load animation preset and apply it
    loadAnimationPresetButton.addEventListener('click', () => {
        const currentAnimation = presets.currentAnimation;

        if (currentAnimation) {
            patternSelect.value = currentAnimation.pattern;
            generateInputFields(patternVariables, currentAnimation.variables);

            monomerSelect.value = currentAnimation.monomer;
            generateInputFields(monomerVariables, currentAnimation.variables);

            stepSizeInput.value = currentAnimation.stepSize;
            rateInput.value = currentAnimation.rate;

            colorPatternSelect.value = currentAnimation.variables.colorPattern || 'rainbow';
            followVectorCheckbox.checked = currentAnimation.variables.followVector || false;
            vectorAxisSelect.value = currentAnimation.variables.vectorAxis || 'long';
        }

        drawPattern(ctx, patterns, monomers, colorPatterns, getBackgroundColor()); // Redraw with the preset
    });

    // Fetch JSON data and initialize the application
    fetchJsonData();
});
