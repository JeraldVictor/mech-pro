var express = require("express");
var router = express.Router();
var db = require("./db");

/* GET home page. */

//to get all component name, measurement and quantity
router.get("/component", (req, res) => {
  // res.render("index", { title: "Inventory" });
  db.getComponent((data, err) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(data);
    }
  });
});

router.get("/scomponent", (req, res) => {
  // res.render("index", { title: "Inventory" });
  db.getSpecificComponent(req.query.name, (data, err) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(data);
    }
  });
});

//to add component in db.
router.post("/component", (req, res) => {
  db.addComponent(req.body, (data, err) => {
    if (!err) {
      res.send(data);
    } else {
      res.status(409).send(err);
    }
  });
});

//to update quantity for the component
router.put("/component", (req, res) => {
  db.updateComponent(req.body, (data, err) => {
    if (!err) {
      res.send(data);
    } else {
      res.status(409).send(err);
    }
  });
});

//to delete a component from inventory
router.delete("/component", (req, res) => {
  db.deleteComponent(req.body, (data, err) => {
    if (!err) {
      res.send(data);
    } else {
      res.status(409).send(err);
    }
  });
});

module.exports = router;
