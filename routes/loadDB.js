var db = require("diskdb");

db.connect(
  "../db",
  ["inventory", "valve"]
);

/*

*/

var compo = {
  name: "MOS2 SEAT",
  measurement: "MM",
  quantity: "1"
};

var valve = {
  name: "CAST IRON FULL PORT THREE PIECE FLANGED",
  desc: "This is a test valve for Sriram",
  qty: 1,
  componentList: [
    {
      componentName: "25 CAST IRON FULL PORT BODY",
      quantity: 1
    },
    {
      componentName: "25 CAST IRON FULL PORT END PIECE MW11",
      quantity: 2
    },
    {
      componentName: "42X25X5 PTFE SEAT",
      quantity: 2,
      opt: true,
      optComponentList: [
        {
          componentName: "MOS2 SEAT",
          quantity: 3
        }
      ]
    },
    {
      componentName: "32X22X3 PTFE SEAT",
      quantity: 4
    },
    {
      componentName: "52X48X1.5 PTFE BODY SEAL",
      quantity: 2
    },
    {
      componentName: "304 S.S HOLLOW BALL",
      quantity: 1,
      opt: true,
      optComponentList: [
        {
          componentName: "316 S.S HOLLOW BALL",
          quantity: 1
        }
      ]
    },
    {
      componentName: "202 SPINDLE DIA 18",
      quantity: 45,
      opt: true,
      optComponentList: [
        {
          componentName: "304 S.S SPINDLE",
          quantity: 30
        }
      ]
    },
    {
      componentName: "202 S.S METAL WASHER DIA 18",
      quantity: 10
    },
    {
      componentName: "M.S SPRING WASHER 10",
      quantity: 1
    },
    {
      componentName: "M.S PLATE WASHER 1/2 INCH",
      quantity: 2
    },
    {
      componentName: "M.S STOPPER PLATE 9 SQ",
      quantity: 1
    },
    {
      componentName: "M.S HAND LEVER 170 MM",
      quantity: 1
    },
    {
      componentName: "M8*48 MS STUD",
      quantity: 4
    },
    {
      componentName: "M8 MS NUT",
      quantity: 8
    },
    {
      componentName: "M10 MS NUT",
      quantity: 1
    }
  ]
};

db.valve.save(valve);
//db.inventory.save(compo);
