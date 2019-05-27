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
    componentList = [];
    i.optComponentList.forEach(k => {
      componentList.push({
        name: k.componentName,
        invqty: 0,
        opt: false,
        reqqty: k.quantity,
        totalreqqty: 0,
        result: null,
        possible: false
      });
    });
    ValveCheck.push({
      name: i.componentName,
      opt: i.opt,
      optCL: Number(compLength),
      invqty: 0,
      reqqty: i.quantity,
      totalreqqty: Number(i.quantity) * Number(valveList.qty),
      result: null,
      possible: false,
      optComponents: componentList
    });
  } else {
    ValveCheck.push({
      name: i.componentName,
      invqty: 0,
      opt: false,
      reqqty: i.quantity,
      totalreqqty: Number(i.quantity) * Number(valveList.qty),
      result: null,
      possible: false
    });
  }
});

ValveCheck.forEach(i => {
  //check the inv qty before doing any calculation
  i.invqty = Number(db.inventory.find({ name: i.name })[0].quantity);

  //update total qty, possible and result for all components
  if (i.totalreqqty <= i.invqty) {
    i.possible = true;
    i.result = valveList.qty;
  } else if (i.totalreqqty > i.invqty) {
    if (i.invqty >= i.reqqty) {
      i.result = Number(i.invqty) / Number(i.reqqty);
    } else if (i.invqty < i.reqqty) {
      i.result = 0;
    }
  }

  //check for options
  if (i.opt) {
    // console.log("Option");
    //if parent component is not possible check for opt components
    if (!i.possible) {
      //iterate for every opt components
      i.optComponents.forEach(k => {
        //update the optional components inv qty
        k.invqty = Number(db.inventory.find({ name: k.name })[0].quantity);
        k.totalreqqty =
          Number(i.result) > 0
            ? (Number(valveList.qty) - Number(i.result)) * Number(k.reqqty)
            : 1 * Number(valveList.qty);
        if (k.totalreqqty <= k.invqty) {
          k.possible = true;
          //Check if possible or not, if possible dont check opt, else if result >0 check opt for the remaining(valveList.qty-result)
          k.result = Number(valveList.qty) - Number(i.result); //if parent comp is partial, the remaining valve can be made with opt
        } else if (k.totalreqqty > k.invqty) {
          if (k.invqty >= k.reqqty) {
            k.result = Number(k.invqty) / Number(k.reqqty);
          } else if (k.invqty < k.reqqty) {
            k.result = 0;
          }
        }
      });
    }
  }
});

console.log(ValveCheck);

projValue = [];

ValveCheck.forEach(m => {
  if (m.opt) {
    sumValue = 0;
    sumValue += m.result;
    m.optComponents.forEach(l => {
      sumValue += l.result;
    });
    projValue.push(Number(sumValue));
  } else {
    projValue.push(Number(m.result));
  }
});

shortStock = [];
goodStock = [];
badStock = [];

ValveCheck.forEach(o => {
  if (o.possible) {
    //good stock on component
    goodStock.push({
      name: o.name,
      postInv:
        o.invqty > o.totalreqqty
          ? o.invqty - o.totalreqqty
          : o.totalreqqty - o.invqty,
      result: o.result,
      reqValve: valveList.qty
    });
  } else if (!o.possible) {
    //check further
    if (o.result > 0) {
      //short stock on component
      shortStock.push({
        name: o.name,
        postInv:
          o.invqty > o.totalreqqty
            ? o.invqty - o.totalreqqty
            : o.totalreqqty - o.invqty,
        result: o.result,
        reqValve: valveList.qty
      });
      if (o.opt) {
        //check if options available for the component

        o.optComponents.forEach(l => {
          if (!l.possible) {
            //check if result having some numbers
            if (l.result > 0) {
              //short stock on opt component
              shortStock.push({
                name: l.name,
                postInv:
                  l.invqty > l.totalreqqty
                    ? l.invqty - l.totalreqqty
                    : l.totalreqqty - l.invqty,
                result: l.result,
                reqValve: valveList.qty,
                parent: o.name
              });
            } else {
              //bad stock on opt component
              badStock.push({
                name: l.name,
                postInv:
                  l.invqty > l.totalreqqty
                    ? l.invqty - l.totalreqqty
                    : l.totalreqqty - l.invqty,
                result: l.result,
                reqValve: valveList.qty,
                parent: o.name
              });
            }
          } else {
            //good stock on opt component
            goodStock.push({
              name: l.name,
              postInv:
                l.invqty > l.totalreqqty
                  ? l.invqty - l.totalreqqty
                  : l.totalreqqty - l.invqty,
              result: l.result,
              reqValve: valveList.qty,
              parent: o.name
            });
          }
        });
        // } else {
        //   //short on stock
        //   shortStock.push({
        //     name: o.name,
        //     postInv:
        //       o.invqty > o.totalreqqty
        //         ? o.invqty - o.totalreqqty
        //         : o.totalreqqty - o.invqty,
        //     result: o.result,
        //     reqValve: valveList.qty
        //   });
        //   projValue.push(o.result);
      }
    } else if (o.result == 0) {
      if (o.opt) {
        //short stock on component
        badStock.push({
          name: o.name,
          postInv:
            o.invqty > o.totalreqqty
              ? o.invqty - o.totalreqqty
              : o.totalreqqty - o.invqty,
          result: o.result,
          reqValve: valveList.qty
        });
        o.optComponents.forEach(l => {
          if (!l.possible) {
            //check if result having some numbers
            if (l.result > 0) {
              //short stock on opt component
              shortStock.push({
                name: l.name,
                postInv:
                  l.invqty > l.totalreqqty
                    ? l.invqty - l.totalreqqty
                    : l.totalreqqty - l.invqty,
                result: l.result,
                reqValve: valveList.qty,
                parent: o.name
              });
            } else {
              //bad stock on opt component
              badStock.push({
                name: l.name,
                postInv:
                  l.invqty > l.totalreqqty
                    ? l.invqty - l.totalreqqty
                    : l.totalreqqty - l.invqty,
                result: l.result,
                reqValve: valveList.qty,
                parent: o.name
              });
            }
          } else {
            //good stock on opt component
            goodStock.push({
              name: l.name,
              postInv:
                l.invqty > l.totalreqqty
                  ? l.invqty - l.totalreqqty
                  : l.totalreqqty - l.invqty,
              result: l.result,
              reqValve: valveList.qty,
              parent: o.name
            });
          }
        });
      } else {
        //bad stock on component
        badStock.push({
          name: o.name,
          postInv:
            o.invqty > o.totalreqqty
              ? o.invqty - o.totalreqqty
              : o.totalreqqty - o.invqty,
          result: o.result,
          reqValve: valveList.qty
        });
      }
    }
  }

  // if (o.possible) {
  //   //good
  // goodStock.push({
  //   name: o.name,
  //   postInv:
  //     o.invqty > o.totalreqqty
  //       ? o.invqty - o.totalreqqty
  //       : o.totalreqqty - o.invqty,
  //   result: o.result,
  //   reqValve: valveList.qty
  // });
  // projValue.push(o.result);
  // } else if (!o.possible && o.result > 0 && !o.opt) {
  //   //short
  // shortStock.push({
  //   name: o.name,
  //   postInv:
  //     o.invqty > o.totalreqqty
  //       ? o.invqty - o.totalreqqty
  //       : o.totalreqqty - o.invqty,
  //   result: o.result,
  //   reqValve: valveList.qty
  // });
  // projValue.push(o.result);
  // } else if (!o.possible && o.result > 0 && o.opt) {
  //   sumValve = 0;
  //   sumValve += o.result;
  //   //for opt 3
  //   shortStock.push({
  //     name: o.name,
  //     postInv:
  //       o.invqty > o.totalreqqty
  //         ? o.invqty - o.totalreqqty
  //         : o.totalreqqty - o.invqty,
  //     result: o.result,
  //     reqValve: valveList.qty
  //   });
  //   // projValue.push(sumValve);
  //
  //   o.optComponents.forEach(l => {
  //     sumValve += l.result;
  //     if (l.possible) {
  //       //good on opt component
  // goodStock.push({
  //   name: l.name,
  //   postInv:
  //     l.invqty > l.totalreqqty
  //       ? l.invqty - l.totalreqqty
  //       : l.totalreqqty - l.invqty,
  //   result: l.result,
  //   reqValve: valveList.qty,
  //   parent: o.name
  // });
  // projValue.push(sumValve);
  //     } else if (!l.possible && l.result > 0) {
  //       //short on opt component
  // shortStock.push({
  //   name: l.name,
  //   postInv:
  //     l.invqty > l.totalreqqty
  //       ? l.invqty - l.totalreqqty
  //       : l.totalreqqty - l.invqty,
  //   result: l.result,
  //   reqValve: valveList.qty,
  //   parent: o.name
  // });
  // projValue.push(sumValve);
  //     }
  //   });
  // } else {
  //   //bad
  //   badStock.push({
  //     name: o.name,
  //     postInv:
  //       o.invqty > o.totalreqqty
  //         ? o.invqty - o.totalreqqty
  //         : o.totalreqqty - o.invqty,
  //     result: o.result,
  //     reqValve: valveList.qty
  //   });
  //   projValue.push(o.result);
  // }
});

console.log("Valve Name: " + valveList.name);
console.log("Requested qty: " + valveList.qty);
//
// console.log("Good stocks");
// console.log(goodStock);
//
// console.log("Short on Stocks");
// console.log(shortStock);
//
// console.log("Bad stocks");
// console.log(badStock);
//
// console.log("Proj");
// console.log(projValue);

ValveCheck.forEach(u => {
  console.log(u);
});
//
// // console.log(projValue.find(k => k == 0));
// console.log(projValue);
console.log(Math.min.apply(null, projValue) + " Valve can be made");
