var db = require("diskdb");

db.connect(
  "db",
  ["inventory"]
);

var addComponent = (data, callback) => {
  var componentN = db.inventory.find({ name: data.componentName });
  if (componentN.length <= 0) {
    var record = {
      name: data.componentName,
      measurement: data.measurement,
      quantity: data.quantity
    };
    db.inventory.save(record);
    var confirm = db.inventory.find({ name: data.componentName });
    if (confirm.length > 0) {
      callback("Component Added", "");
    } else {
      callback("", "Error while saving");
    }
  } else {
    callback("", "Component Already exists");
  }
};

module.exports = {
  addComponent
};
