var db = require("diskdb");

db.connect(
  "../db",
  ["inventory", "valve"]
);

var valveList = db.valve.find({ _id: "2452d289c1c44cffa5bcd405d647ccf0" })[0];
// valveList = valveList[0];

// console.log(valveList.componentList);
var Check = 0;
var ValveCheck = []; //variable to hold all components for a valve
valveList.componentList.forEach(i => {
  // console.log(valveList.qty);
  compLength = 0;
  if (i.opt) {
    compLength = Number(i.optComponentList.length);
  }
  ValveCheck.push({
    name: i.componentName,
    totalreqqty: Number(i.quantity) * Number(valveList.qty),
    possible: false,
    opt: i.opt === undefined ? false : i.opt,
    optCL: Number(compLength),
    invqty: 0,
    reqqty: i.quantity,
    result: null
  });
});

//check against inventory
ValveCheck.forEach(i => {
  i.invqty = Number(db.inventory.find({ name: i.name })[0].quantity);
  if (i.totalreqqty <= i.invqty) {
    i.result = valveList.qty;
    i.possible = true;
  } else if (i.totalreqqty > i.invqty) {
    if (i.invqty >= i.reqqty) {
      i.result = Number(i.invqty) / Number(i.reqqty);
    } else if (i.invqty < i.reqqty) {
      i.result = false;
    }
  }
});

var stockChecker = list => {
  list.forEach(i => {
    if (db.inventory.find({ name: i.componentName })[0].quantity > i.quantity) {
      i.possible = true; //check if the inventory is adequate for the component
    }
  });
};

console.log(ValveCheck);

console.log("All with opt");
console.log(ValveCheck.filter(i => i.opt && !i.possible));

//optMain lists all the optcomponents, from the initial failed ones
var optMain = [];
ValveCheck.filter(i => i.opt && !i.possible).forEach((k, i) => {
  optCompName: valveList.componentList
    .find(o => o.componentName == k.name)
    .optComponentList.forEach(i => {
      optMain.push({
        optCompName: i.componentName,
        optqty: i.quantity,
        parentCompName: k.name
      });
    });
});

console.log("Optional Components");
console.log(optMain);
// console.log(ValveCheck);
//
// //filter out all failed ones
// var shortStock = ValveCheck.filter(d => !d.possible);
//
// //check if any with opt
// var optionalExists = shortStock.filter(f => f.opt);
//
// console.log("Required Valve");
// console.log(ValveCheck);
//
// console.log("Components have less quantity and have options:");
// console.log(optionalExists);
//
// // console.log(ValveCheck);
// console.log("Components have less quantity");
// console.log(shortStock);
//
// //find the optCompname to fetch optComponents from main valvelist
// var optMain = valveList.componentList.find(
//   o => o.componentName == optionalExists[0].name
// ).optComponentList;
//
// //optMain1 lists all the optcomponents, from the initial failed ones
// // var optMain1 = [];
// // optionalExists.forEach((k, i) => {
// //   optMain1 = valveList.componentList.find(o => o.componentName == k.name)
// //     .optComponentList;
// // });
//
// // var optMain1 = [];
// // optionalExists.forEach(k => {
// //   optMain1.push(
// //     valveList.componentList.find(o => o.componentName == k.name)
// //       .optComponentList
// //   );
// // });
//
// var optMain1 = [];
// optionalExists.forEach(k => {
//   valveList.componentList
//     .find(o => o.componentName == k.name)
//     .optComponentList.forEach(o => {
//       optMain1.push({
//         componentName: o.componentName,
//         quantity: o.quantity,
//         parentName: k.name
//       });
//     });
// });
//
// console.log("Optional Componets");
// console.log(optMain1);
//
// console.log("Check optional component details");
// stockChecker(optMain1);
// console.log(optMain1);
// /*
// console.log("--------------------------------");
// console.log("Valve List");
// console.log(ValveCheck);
//
// console.log("Optional List");
// console.log(optMain1);
// */
// /*
//  * ValveCheck contains the complete list of valve required Components
//  * If any component from the list doesnt meet the requirement and it it contains optional components, then those are checked and stored in optMain1
//  * If two optional components satisfy the rule, remove one from the list
//  * Prepare a list of final lookup which should contain
//     {
//       Component name,
//       Inventory qty post reduction
//     }
//   if any one of the component doesnt meet the requirement list that component with inventory, if it contain optional show all.
//  */
//
// console.log("Complete List");
// var final = [];
// ValveCheck.forEach(p => {
//   if (!p.possible) {
//     final.push(
//       optMain1.find(o => o.parentName == p.name && o.possible == true)
//     );
//   } else {
//     final.push(p);
//   }
// });
// console.log(final);
// console.log("Component short without options");
// console.log(shortStock.find(l => l.possible == false && l.opt == false));
// // if (optMain.length == optionalExists[0].optCL) {
// //   console.log("Matching");
// // }
//
// //if any qty is not available for a component then, check if that component has opt.
//
// //if any qty is not available for a component and no opt then report the valve can't be manufactured due to that component qty low.
//
// //if any component has opt, replace the ValveCheck component to optcomponent
//
// // if (check === valveList.componentList.length) {
// //   console.log("Valve can be done with current stock");
// // } else {
// //   console.log("Sorry valve can't be done with current stock");
// // }
//
// /*
// console.log(i.componentName);
// console.log(db.inventory.find({ name: i.componentName })[0].quantity);
// if (db.inventory.find({ name: i.componentName })[0].quantity == 0) {
//   if (i.opt) {
//     console.log(i.optComponentName1);
//     console.log(db.inventory.find({ name: i.optComponentName1 })[0].quantity);
//   }
// }
// */
