const express = require('express');
const sequelize = require('./config/connection'); // Adjust the path as necessary
const routes = require('./routes'); // This imports the routes you defined

const app = express();
const PORT = process.env.PORT || 3001; // Use the environment variable or default to port 3001

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes); // Use the routes defined in your routes folder

// Connect to the database, then start the server
sequelize.sync({ force: false }).then(() => { // `force: false` to avoid dropping database on restart
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
