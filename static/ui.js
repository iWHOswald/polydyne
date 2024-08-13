/*
INSTRUCTIONS FOR FUTURE DEVELOPMENT:
-------------------------------------
1. Populating Dropdowns:
   - The `populateSelect` function is responsible for dynamically populating dropdown menus (select elements) based on data loaded from the JSON.
   - The function creates option elements and appends them to the select element, using the item's key as the value and the item's name as the displayed text.
   - When adding new patterns or monomers, ensure that the `name` property is correctly defined in the JSON structure to be used in the dropdowns.

2. Generating Input Fields:
   - The `generateInputFields` function creates input fields dynamically based on the variables provided in the JSON.
   - The function handles different data types (boolean, number, text) and creates appropriate input elements for each type.
   - Ensure that any new variables added to the JSON are supported by this function. If new data types are introduced, extend this function to handle them appropriately.

3. Error Handling:
   - Basic error handling is in place to catch situations where variables might be undefined. This prevents the function from executing if required data is missing.
   - Expand error handling as needed, especially if more complex variable types or structures are introduced.

4. Extendability:
   - The script is designed to be extendable. New patterns, monomers, or additional input types can be integrated by ensuring the `populateSelect` and `generateInputFields` functions accommodate the new data.
   - Avoid hardcoding values or assumptions about the data structure. Rely on the JSON data to drive the UI generation dynamically.

5. Documentation:
   - Maintain clear documentation within the code. Any new additions or changes to how UI elements are generated should be thoroughly documented to ensure future developers can easily understand and extend the code.

-------------------------------------
END OF INSTRUCTIONS
*/

const populateSelect = (selectElement, items) => {
    // Clear any existing options in the select element
    selectElement.innerHTML = '';
    // Iterate through the items (patterns or monomers) to create option elements
    for (const key in items) {
        const option = document.createElement('option');
        option.value = key; // Set the value of the option to the item's key
        option.textContent = items[key].name; // Display the item's name in the dropdown
        selectElement.appendChild(option); // Append the option to the select element
    }
};

const generateInputFields = (container, variables) => {
    console.log("Generating input fields for variables:", variables); // Log the variables being processed
    container.innerHTML = ''; // Clear any existing input fields in the container

    // If variables are undefined, log an error and exit the function
    if (!variables) {
        console.error("Variables are undefined.");
        return;
    }

    // Iterate through the variables to create corresponding input fields
    for (const key in variables) {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group'; // Add Bootstrap class for styling

        const label = document.createElement('label');
        label.for = key; // Associate the label with the input field
        label.textContent = key; // Set the label's text to the variable's key

        let input; // Declare the input element
        // Determine the type of input to create based on the variable's data type
        if (typeof variables[key] === 'boolean') {
            input = document.createElement('input');
            input.type = 'checkbox'; // Create a checkbox for boolean values
            input.checked = variables[key]; // Set the checkbox state
        } else if (typeof variables[key] === 'number') {
            input = document.createElement('input');
            input.type = 'number'; // Create a number input for numerical values
            input.value = variables[key]; // Set the input value
            input.className = 'form-control'; // Add Bootstrap class for styling
        } else {
            input = document.createElement('input');
            input.type = 'text'; // Create a text input for other values (including complex numbers)
            input.value = variables[key]; // Set the input value
            input.className = 'form-control'; // Add Bootstrap class for styling
        }

        input.id = key; // Set the input's ID to the variable's key

        // Append the label and input to the form group, then add the form group to the container
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        container.appendChild(formGroup);
    }
};
