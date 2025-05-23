const express = require("express");
const bodyParser = require("body-parser");
const client = require("./client");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  client.getAllCustomers(null, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving customers");
    }
    res.send(data.customers);
  });
});

app.post("/create", (req, res) => {
  // Handle customer creation
  let newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  client.InsertCustomer(newCustomer, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error creating customer");
    }
    console.log("Customer created successfully:", data);
    res.send(data);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
