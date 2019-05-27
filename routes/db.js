var db = require("diskdb");

db.connect(
  "db",
  ["inventory"]
);

//adding component
var addComponent = (data, callback) => {
  var componentN = db.inventory.find({ name: data.componentName });
  if (componentN.length <= 0) {
    var record = {
      name: data.componentName,
      measurement: data.measurement,
      quantity: data.quantity
    };
    //get the user detail and save it in a separate table along with time and modifications
    /*
      For example:
      If user name: Ganesh
      {
        updatedBy: "Ganesh",
        updatedAt: Date and Time,
        Details: [
          {
            record
          }
        ]
      }
      */

    if (data.componentName) {
      db.inventory.save(record);
      var confirm = db.inventory.find({ name: data.componentName });
      if (confirm.length > 0) {
        callback("Component Added", "");
      } else {
        callback("", "Error while saving");
      }
    } else {
      callback("", "Component can't be added");
    }
  } else {
    callback("", "Component Already exists");
  }
};

//list all components
var getComponent = callback => {
  var componentList = db.inventory.find();
  if (componentList.length > 0) {
    callback(componentList, "");
  } else {
    callback("", "No component to list out");
  }
};

//list specific component
var getSpecificComponent = (data, callback) => {
  var componentList = db.inventory.find({ name: data });
  if (componentList.length > 0) {
    callback(componentList, "");
  } else {
    callback("", "No such component exists");
  }
};

//update quantity for a specific component
var updateComponent = (data, callback) => {
  //get the user detail and save it in a separate table along with time and modifications
  /*
    For example:
    If user name: Ganesh
    {
      updatedBy: "Ganesh",
      updatedAt: Date and Time,
      Details: [
        {
          data
        }
      ]
    }
    */
  var options = {
    multi: false,
    upsert: false
  };

  var updateDetail = db.inventory.update(
    { _id: data._id },
    { quantity: data.uquantity },
    options
  );
  if (updateDetail.updated == 1) {
    callback("Success", "");
  } else {
    callback("", "Failed to update component");
  }
};

//remove a component from database
var deleteComponent = (data, callback) => {
  //get the user detail and save it in a separate table along with time and modifications
  /*
    For example:
    If user name: Ganesh
    {
      updatedBy: "Ganesh",
      updatedAt: Date and Time,
      Details: [
        {
          data
        }
      ]
    }
    */
  /*
    before deleting a component, have to check if the component has been listed for any valve
    if listed: Warn user not to delete component
    else delete

    var drecord = db.valve.find({componentName: data.name})
    if(drecord>0){
    can't delete
  }
  else {
    delete from inventory db
  }
    */
  db.inventory.remove({ _id: data._id });
  var record = db.inventory.find({ _id: data._id });
  // callback(detail, "");
  if (record.length <= 0) {
    callback("Component Deleted successfully", "");
  } else {
    callback("", "Component failed to delete");
  }
};

module.exports = {
  addComponent,
  getComponent,
  getSpecificComponent,
  updateComponent,
  deleteComponent
};
