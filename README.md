## Zarnegar2

**Project Overview**

This Node.js Express application manages a database of commodities using SQL Server. It provides a user interface for adding, viewing, deleting, and searching for commodities. The application utilizes EJS templating for rendering HTML pages and Sequelize for database interaction.

**Key Features**

* Connects to a SQL Server database to store and retrieve commodity data
* Provides routes for various functionalities:
    * Displays a list of all commodities
    * Displays details of a specific commodity based on its ID
    * Provides a form for adding new commodities
    * Handles the deletion of commodities
    * Presents an about page with static content
    * Presents a contact page with static content
* Utilizes EJS templating for dynamic HTML generation
* Employs Sequelize for efficient database interaction

**Prerequisites**

* Node.js installed
* SQL Server database with a table named as `tableName01` containing the following columns:
    * `Commodity_ID01` (string)
    * `Commodity_Name01` (string)
    * `Commodity_Weight` (string)
    * `Commodity_Fineness` (string)
    * `Commodity_Price` (string)
* Environment variables set for database connection details:
    * `DB_USER`
    * `DB_PASSWORD`
    * `DB_SERVER`
    * `DB_DATABASE`
    * `PORT1` (for the Express app)
    * `PORT2` (for the SQL Server connection)
    * `ENCRYPT` (optional, set to "true" if SSL encryption is required)

**Installation**

1. Clone the repository or download the project files
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Set the environment variables for database connection details
4. Run the application:
    ```bash
    node server.js
    ```

**Usage**

1. Start the application using the above command
2. Access the application in your web browser using the URL: `http://localhost:<port1>` (replace `<port1>` with the value of the `PORT1` environment variable)
3. Use the provided routes to perform various actions:
    * `/`: Displays a list of all commodities
    * `/allitems`: Same as `/`
    * `/about`: Displays the about page
    * `/contact`: Displays the contact page
    * `/new`: Provides a form for adding new commodities
    * `/find-item?itemId=<id>`: Displays details of a specific commodity based on its ID (replace `<id>` with the actual ID)
    * Submitting the form on `/new` adds a new commodity
    * Deleting a commodity from the list of all commodities redirects to `/find-item`

**Testing**

1. Start the application as described in the Installation section
2. Use your web browser to access the application and interact with the various routes
3. Manually add, edit, and delete commodities from the database to verify the application's functionality

**Deployment**

1. Create a production-ready environment with the necessary Node.js and SQL Server setup
2. Copy the project files to the deployment environment
3. Set the environment variables for database connection details on the deployment environment
4. Start the application using the `node server.js` command

**Additional Notes**

* For security purposes, input sanitization should be implemented to prevent malicious data injection when handling user input.
* Error handling should be enhanced to provide more informative error messages and improve overall application robustness.
* Consider implementing additional features such as user authentication, data validation, and more comprehensive search functionality.

**Contributing**

Feel free to contribute to this project by reporting issues, suggesting improvements, or submitting pull requests with code enhancements.
