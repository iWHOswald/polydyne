/*
INSTRUCTIONS FOR FUTURE DEVELOPMENT:
-------------------------------------
0. FILE NAME: draw.js

1. Pattern Drawing:
   - The drawing logic is generalized using either a 'formula' or a 'procedure' approach.
   - Patterns should be represented in the JSON file using either a mathematical formula or a procedural code block.
   - Ensure any new pattern types or variations can be represented within these structures, or consider extending this logic to support additional types.

2. Formula-Based Patterns:
   - The `drawFormula` function interprets and evaluates mathematical formulas provided in the JSON.
   - When adding new patterns, ensure that the formulas are correctly formatted and that all necessary variables are provided in the JSON.

3. Procedure-Based Patterns:
   - The `drawProcedure` function allows for more complex drawing logic by executing procedural steps defined in the JSON.
   - New procedural patterns should be carefully structured to ensure that they execute correctly within the context of this function.
   - Consider the implications of using `eval` for security and execution safety.

4. Monomer Drawing:
   - The `drawMonomer` function handles the drawing of shapes and images along the generated pattern paths.
   - If new shapes or image types are introduced, this function should be extended to handle them appropriately.
   - The `followVector` feature aligns the orientation of the monomer with the direction of the curve, which can be extended for other orientations as needed.

5. Color Patterns:
   - Color patterns are used to provide periodic color changes along the pattern. These are stored in the JSON and applied during drawing.
   - If new color schemes or patterns are introduced, update the colorPatterns logic to accommodate them.

6. Extendability:
   - This script is designed to be extendable. When adding new features or pattern types, ensure that they integrate smoothly with the existing structure.
   - Keep the system flexible by avoiding hardcoded logic specific to individual patterns or monomers.

7. Error Handling:
   - Add error handling where necessary, particularly in places where dynamic code execution (e.g., `eval`) is used.
   - Ensure that invalid data or unexpected input does not cause the application to fail silently.

8. Testing:
   - After making updates, test all existing patterns and monomers to ensure they still render correctly.
   - Introduce new tests for any additional patterns or monomer types to ensure comprehensive coverage.

9. Documentation:
   - Maintain thorough documentation within the code, especially for complex or non-obvious logic.
   - Update this instruction block as necessary to reflect changes in the code structure or additional features.

-------------------------------------
END OF INSTRUCTIONS
*/

const drawPolarGraph = (ctx, formula, variables, monomer, colorPatterns) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.beginPath();
    for (let theta = 0; theta < 2 * Math.PI; theta += variables.thetaIncrement) {
        let evaluatedFormula = formula;
        for (const [key, value] of Object.entries(variables)) {
            evaluatedFormula = evaluatedFormula.replace(new RegExp(key, 'g'), value);
        }
        const r = eval(evaluatedFormula);

        // Convert polar to Cartesian coordinates
        const x = centerX + r * Math.cos(theta) * variables.spacing;
        const y = centerY + r * Math.sin(theta) * variables.spacing;

        ctx.lineTo(x, y);
        drawMonomer(ctx, monomer, x, y, colorPatterns);
    }
    ctx.stroke();
};



// Add the drawPolarGraph to your drawPattern function
const drawPattern = (ctx, patterns, monomers, colorPatterns, backgroundColor = '#ffffff') => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    if (backgroundColor === 'transparent') {
        ctx.clearRect(0, 0, width, height);
    } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
    }

    const selectedPatternName = document.getElementById('pattern-select').value;
    const selectedMonomerName = document.getElementById('monomer-select').value;
    const selectedPattern = patterns[selectedPatternName];
    const selectedMonomer = monomers[selectedMonomerName];
    if (!selectedPattern || !selectedMonomer) return;

    if (selectedPattern.type === 'formula' && selectedPattern.name === 'Polar Graph') {
        drawPolarGraph(ctx, selectedPattern.formula, selectedPattern.variables, selectedMonomer, colorPatterns);
    } else if (selectedPattern.type === 'formula') {
        drawFormula(ctx, selectedPattern.formula, selectedPattern.variables, selectedPattern.variables.spacing, selectedMonomer, colorPatterns);
    } else if (selectedPattern.type === 'procedure') {
        drawProcedure(ctx, selectedPattern.procedure, selectedPattern.variables, selectedPattern.variables.spacing, selectedMonomer, colorPatterns);
    } else {
        console.error(`Unknown pattern type: ${selectedPattern.type}`);
    }
};

const drawFormula = (ctx, formula, variables, spacing, monomer, colorPatterns) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    let t = 0;  // Initialize t for Lissajous curve
    let theta = 0;  // Initialize theta for Rose curve

    const tIncrement = parseFloat(variables.tIncrement) || 0.01;  // Default increment for t
    const thetaIncrement = parseFloat(variables.thetaIncrement) || 0.01;  // Default increment for theta

    ctx.beginPath();
    for (let x = 0; x < width; x += spacing) {
        let evaluatedFormula = formula;

        // Replace variable placeholders in the formula with actual values
        for (const [key, value] of Object.entries(variables)) {
            evaluatedFormula = evaluatedFormula.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
        }

        // Replace t and theta in the formula
        evaluatedFormula = evaluatedFormula.replace(/\bt\b/g, t);
        evaluatedFormula = evaluatedFormula.replace(/\btheta\b/g, theta);

        const y = eval(evaluatedFormula);  // Evaluate the formula to get the y-coordinate
        ctx.lineTo(x, y);  // Draw a line to the calculated point
        drawMonomer(ctx, monomer, x, y, colorPatterns);  // Draw the monomer at the calculated point

        t += tIncrement;  // Increment t
        theta += thetaIncrement;  // Increment theta
    }
    ctx.stroke();  // Render the line on the canvas
};

// Generalized procedure drawing function
const drawProcedure = (ctx, procedure, variables, spacing, monomer, colorPatterns) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Handle complex number for Julia Set
    let cReal, cImag;
    if (variables.c) {
        const complexParts = variables.c.split('+');
        cReal = parseFloat(complexParts[0].trim());
        cImag = parseFloat(complexParts[1].replace('i', '').trim());
    }

    // Iterate over the canvas with the specified spacing
    for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
            let code = procedure.join("\n");

            // Replace variable placeholders in the procedure with actual values
            code = code.replace(/cx/g, cReal);
            code = code.replace(/cy/g, cImag);
            for (const [key, value] of Object.entries(variables)) {
                code = code.replace(new RegExp(key, 'g'), value);
            }

            try {
                let result = null; // Initialize result variable
                eval(code); // Execute the procedure code, setting 'result'

                // If result is not null, draw the monomer
                if (result !== null && result !== undefined && result !== 0) {
                    drawMonomer(ctx, monomer, x, y, colorPatterns);
                }
            } catch (e) {
                console.error(`Error evaluating procedure: ${e.message}`);
            }
        }
    }
};

// Function to draw a monomer at a specific position
const drawMonomer = (ctx, monomer, x, y, colorPatterns) => {
    const { shape, size, color, periodicColor, colorPattern, followVector, vectorAxis } = monomer;
    let currentColor = color;

    // Handle periodic color changes
    if (periodicColor) {
        const pattern = colorPatterns[colorPattern] || colorPatterns["rainbow"];
        const index = Math.floor((x + y) / 10) % pattern.length;
        currentColor = pattern[index];
    }

    ctx.fillStyle = currentColor;
    ctx.save();

    // Adjust orientation if followVector is enabled
    if (followVector) {
        const angle = calculateAngle(ctx, x, y, vectorAxis);
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.translate(-x, -y);
    }

    // Draw shapes or images based on the monomer's configuration
    if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
        ctx.fill();
    } else if (shape === 'rectangle') {
        const halfSize = size / Math.sqrt(2); // Convert diagonal length to half side length
        ctx.fillRect(x - halfSize / 2, y - halfSize / 2, halfSize, halfSize / 2);
    } else if (shape === 'image') {
        const img = new Image();
        img.src = monomer.image;
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            const imgWidth = size * aspectRatio;
            const imgHeight = size;
            ctx.drawImage(img, x - imgWidth / 2, y - imgHeight / 2, imgWidth, imgHeight);
        };
    }

    ctx.restore();
};

// Function to calculate the angle of rotation for vector-following monomers
const calculateAngle = (ctx, x, y, vectorAxis) => {
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const dx = pixelData[0] - x;
    const dy = pixelData[1] - y;

    if (vectorAxis === 'long') {
        return Math.atan2(dy, dx);
    } else {
        return Math.atan2(dx, dy);
    }
};
