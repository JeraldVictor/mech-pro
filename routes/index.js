var express = require("express");
var router = express.Router();
var db = require("./db");

/* GET home page. */
router.get("/", (req, res) => {
  var data = [];
  db.getComponent((d, e) => {
    data.push(d);
  });

  res.render("index", { title: "Express", compo: data[0] });
});

router.post("/sample", (req, res) => {
  console.log(req.body.components);
});

module.exports = router;
