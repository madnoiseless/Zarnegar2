const express = require("express");
const mssql = require("mssql");
const bodyParser = require("body-parser"); // Added for parsing request body
const ejs = require("ejs");
const _ = require("lodash");
require("dotenv").config();

const aboutContent =
  "Ligula ullamcorper malesuada proin libero nunc consequat interdum. Elit duis tristique sollicitudin nibh sit. Sem integer vitae justo eget magna. Purus gravida quis blandit turpis. Sagittis id consectetur purus ut faucibus pulvinar elementum integer enim. Eget mi proin sed libero enim sed faucibus turpis. Ut morbi tincidunt augue interdum. Massa vitae tortor condimentum lacinia quis vel eros donec. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Mauris a diam maecenas sed enim ut sem. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. Malesuada fames ac turpis egestas integer eget aliquet nibh. Lorem ipsum dolor sit amet consectetur. Ut porttitor leo a diam sollicitudin tempor id eu. Risus in hendrerit gravida rutrum quisque. Risus quis varius quam quisque id. Non nisi est sit amet facilisis magna etiam. Vitae purus faucibus ornare suspendisse sed nisi.";
const contactContent =
  "Auctor neque vitae tempus quam pellentesque nec nam. Id donec ultrices tincidunt arcu. Nunc sed blandit libero volutpat sed cras. Malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit. Ut tortor pretium viverra suspendisse. Tempor commodo ullamcorper a lacus vestibulum sed arcu non odio. A pellentesque sit amet porttitor eget dolor morbi non arcu. Proin nibh nisl condimentum id venenatis a condimentum vitae. Aliquam etiam erat velit scelerisque in dictum non consectetur a. Et molestie ac feugiat sed lectus vestibulum mattis ullamcorper. Aliquam purus sit amet luctus venenatis lectus magna fringilla. Duis convallis convallis tellus id. Magna fringilla urna porttitor rhoncus dolor purus. Tristique senectus et netus et malesuada fames. Aenean pharetra magna ac placerat vestibulum. Nibh tortor id aliquet lectus proin.";

const app = express();
const port = Number(process.env.PORT1);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configure SQL Server connection details
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.PORT2),
  options: {
    encrypt: process.env.ENCRYPT === "true",
  },
};

const tableName01 = process.env.TABLE_NAME01;

// Connect to SQL Server
mssql
  .connect(config)
  .then((pool) => {
    console.log("Connected to SQL Server");

    // Middleware to parse request body for POST requests
    app.use(bodyParser.json()); // Parse JSON data

    app.get("/", async (req, res) => {
      res.render("home", {});
    });

    app.get("/allitems", async (req, res) => {
      try {
        // Connect to the database
        await pool.connect();

        // Define your SQL query
        const query = `SELECT * FROM ${tableName01}`;

        // Execute the query
        const result = await pool.request().query(query);

        res.render("allitems", {
          Commodities: result.recordset,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving commodities");
      }
    });

    app.get("/about", (req, res) => {
      res.render("about", { aboutContent: aboutContent });
    });

    app.get("/contact", (req, res) => {
      res.render("contact", { contactContent: contactContent });
    });

    app.get("/new", (req, res) => {
      res.render("new", {});
    });

    app.get("/find-item", async function (req, res) {
      const searchId = req.query.itemId;

      if (!searchId) {
        return res.render("find-item", {
          err: "Please provide an item ID to search.",
        });
      }

      try {
        // Connect to the database
        await pool.connect();

        // Define your SQL query with parameter placeholder
        const query = `SELECT * FROM ${tableName01} WHERE Commodity_ID01 = @searchId`;

        // Execute the query with parameters
        const result = await pool
          .request()
          .input("searchId", searchId)
          .query(query);

        // Close the connection pool (optional for small requests)
        // await pool.close();

        const foundItem = result.recordset[0] || null; // Assuming single item by ID

        res.render("find-item", {
          item: foundItem,
          err: null,
          searchId: searchId,
        });
      } catch (err) {
        console.error(err);
        // Handle errors including data conversion issues
        res.render("find-item", { err: "Error finding item." });
      } finally {
        // Close connection pool (optional but good practice)
        pool?.close();
      }
    });

    app.post("/delete-item", async function (req, res) {
      const itemId = req.body.itemId;

      if (!itemId) {
        return res.render("error", { err: "Missing item ID for deletion." });
      }
      try {
        // Connect to the database
        await pool.connect();

        // Define your SQL query with parameter placeholder
        const query = `DELETE FROM ${tableName01} WHERE Commodity_ID01 = @itemId`;

        // Execute the query with parameters
        const result = await pool
          .request()
          .input("itemId", itemId)
          .query(query);

        res.redirect("/find-item"); // Redirect on successful deletion
      } catch (err) {
        console.error(err);
        res.render("error", { err: "Error deleting item." });
      } finally {
        // Close connection pool (optional but good practice)
        pool?.close();
      }
    });

    app.post("/new", async function (req, res) {
      const commodityId = req.body.commodityId.substring(0, 50); // Truncate for safety
      const commodityName01 = req.body.commodityName01.substring(0, 100); // Truncate for safety
      const commodityWeight = req.body.commodityWeight.substring(0, 20); // Truncate for safety
      const commodityFineness = req.body.commodityfineness.substring(0, 10); // Truncate for safety
      const commodityPrice = req.body.commodityprice.substring(0, 20); // Truncate for safety

      try {
        // Connect to the database
        await pool.connect();

        // Check for existing ID
        const checkQuery = `SELECT * FROM ${tableName01} WHERE Commodity_ID01 = @commodityId`;
        const checkResult = await pool
          .request()
          .input("commodityId", commodityId)
          .query(checkQuery);

        if (checkResult.recordset.length > 0) {
          // Duplicate ID found, return error
          return res
            .status(409)
            .render("error", { err: "An item with this ID already exists!" });
        }

        // Insert new commodity
        const insertQuery = `INSERT INTO ${tableName01} (Commodity_ID01, Commodity_Name01, Commodity_Weight, Commodity_Fineness, Commodity_Price) VALUES (@commodityId, @commodityName01, @commodityWeight, @commodityFineness, @commodityPrice)`;
        const insertResult = await pool
          .request()
          .input("commodityId", commodityId)
          .input("commodityName01", commodityName01)
          .input("commodityWeight", commodityWeight)
          .input("commodityFineness", commodityFineness)
          .input("commodityPrice", commodityPrice)
          .query(insertQuery);

        // Close the connection pool (optional for small requests)
        // await pool.close();

        res.redirect("/"); // Redirect on successful creation
      } catch (err) {
        console.error(err);
        res.render("error", { err: "Error creating new item." });
      } finally {
        // Close connection pool (optional but good practice)
        pool?.close();
      }
    });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err);
  });
