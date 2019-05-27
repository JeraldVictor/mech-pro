var db = require("diskdb");

db.connect(
  "../db",
  ["inventory", "valve"]
);

var qty = 2;
var valve = db.valve.find();
valve.push({ quantity: qty });

var valveCheck = [];
valve[0].componentList.forEach(p => {
  console.log("componentName:" + p.componentName);
  //get this component inventory
  if (p.opt) {
    p.optComponentList.forEach(k => {
      console.log("{");
      console.log("  " + k.componentName);
      console.log("}");
      //get this component inventory
    });
  }
});
