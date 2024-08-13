"""
INSTRUCTIONS FOR FUTURE DEVELOPMENT:
-------------------------------------
This script (`server.py`) is the server-side component of the Geometric Pattern Drawer application. 
It is built using Flask, a lightweight web framework for Python. This file is responsible for serving 
the HTML, CSS, JavaScript, and data files to the client, as well as handling requests from the web application.

The comments within this file provide a detailed explanation of the structure and functionality of the 
code, enabling future developers to understand how the server operates and how to extend or modify its capabilities.
"""

# Import the Flask module and required functions.
from flask import Flask, render_template, send_from_directory

# Initialize a Flask application instance.
app = Flask(__name__)

# Route for the main page of the web application.
# This route serves the index.html file, which is the entry point of the web interface.
@app.route('/')
def index():
    return render_template('index.html')

# Route to serve static files, such as CSS, JavaScript, and image files.
# The static files are located in the 'static' directory, and this route makes them accessible.
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# Route to serve the data.json file.
# This file contains the pattern, monomer, and preset data in JSON format, which the client-side 
# application fetches and uses to populate the UI and manage the drawing logic.
@app.route('/data.json')
def get_data():
    return send_from_directory('.', 'data.json')

# Main entry point of the script.
# When the script is executed directly (not imported as a module), it will start the Flask server 
# in debug mode. Debug mode provides detailed error messages and automatically reloads the server 
# when changes are made to the code.
if __name__ == '__main__':
    app.run(debug=True)
