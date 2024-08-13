/*
INSTRUCTIONS FOR FUTURE DEVELOPMENT:
-------------------------------------
0. FILE NAME: data.js


1. JSON Structure:
   - The JSON file fetched by this script should include 'patterns', 'monomers', 'colorPatterns', and 'presets'.
   - Each of these top-level objects is critical to the application's dynamic functionality.
   - Make sure that the JSON structure aligns with the format expected by this script. If new fields are added to the JSON structure, ensure corresponding updates in this script to handle those fields correctly.

2. Patterns:
   - Patterns are loaded from the JSON into an object, indexed by their name.
   - The 'patterns' object should be organized such that each pattern can be easily referenced by its name.
   - Any additional logic or fields related to patterns should be included in this script's processing.

3. Monomers:
   - Similar to patterns, monomers are indexed by their name.
   - If additional properties or logic related to monomers are introduced, ensure this script processes them properly.

4. Color Patterns:
   - Color patterns are stored directly as an object. This structure should be a simple key-value pair where the key is the color pattern's name and the value is an array of colors.
   - If new color patterns or formats are added, update the script accordingly to handle them.

5. Presets:
   - Presets are essential for setting default values and configurations in the application.
   - If new preset categories are added, extend the 'presets' processing in this script to accommodate them.

6. Error Handling:
   - Currently, this script assumes that the JSON structure will always be valid and properly formatted. 
   - In future development, consider adding error handling to manage potential issues like network failures or malformed JSON.

7. Extendability:
   - When adding new features, ensure they are backward-compatible with existing JSON structures.
   - Consider how new patterns, monomers, or configuration options might be loaded dynamically and ensure that any new data types or structures introduced in the JSON are processed effectively by this script.

8. Testing:
   - After making updates to this script or the associated JSON file, thoroughly test the application to ensure that all patterns, monomers, and configurations load as expected.
   - Automated tests could be considered for future iterations to verify that the data loading process works correctly under various conditions.

9. Documentation:
   - Keep this section and the rest of the script well-documented, particularly if there are complex transformations or assumptions being made about the data structure.
   - Ensure that future developers can quickly understand how the JSON data is being processed and what changes would need to be made if the structure evolves.

-------------------------------------
END OF INSTRUCTIONS
*/

// Initialize objects to store patterns, monomers, color patterns, and presets
let patterns = {};
let monomers = {};
let colorPatterns = {};
let presets = {};

// Function to load JSON data from the server
const loadJsonData = async () => {
    // Fetch the JSON file located at '/static/data.json'
    const response = await fetch('/static/data.json');
    
    // Parse the JSON data into a JavaScript object
    const data = await response.json();

    // Reduce the patterns array into an object with pattern names as keys
    patterns = data.patterns.reduce((acc, pattern) => {
        acc[pattern.name] = pattern; // Assign each pattern to the accumulator object with its name as the key
        return acc;
    }, {});

    // Reduce the monomers array into an object with monomer names as keys
    monomers = data.monomers.reduce((acc, monomer) => {
        acc[monomer.name] = monomer; // Assign each monomer to the accumulator object with its name as the key
        return acc;
    }, {});

    // Directly assign colorPatterns and presets from the JSON data
    colorPatterns = data.colorPatterns; // Store color patterns as an object
    presets = data.presets; // Store presets as an object

    // Return the loaded patterns, monomers, color patterns, and presets
    return { patterns, monomers, colorPatterns, presets };
};
