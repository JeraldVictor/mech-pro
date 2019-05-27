var db = require("diskdb");

db.connect(
  "../db",
  ["inventory", "valve"]
);

//accept valve ID and return the valve inv list & min projValue

// var projectionValve = (valveid, data, proj, err) => {
var projectionValve = (valveid, qty, callbackData) => {
  var valveList = db.valve.find({ _id: valveid })[0];
  // valveList = valveList[0];
  valveList.qty = qty;

  // console.log(valveList);

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
        i.result = Math.floor(Number(i.invqty) / Number(i.reqqty));
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
            k.result = Math.floor(Number(valveList.qty) - Number(i.result)); //if parent comp is partial, the remaining valve can be made with opt
          } else if (k.totalreqqty > k.invqty) {
            if (k.invqty >= k.reqqty) {
              k.result = Math.floor(Number(k.invqty) / Number(k.reqqty));
            } else if (k.invqty < k.reqqty) {
              k.result = 0;
            }
          }
        });
      }
    }
  });

  // callbackData(ValveCheck);

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

  callbackData(ValveCheck, projValue);
  // ValveCheck.forEach(u => {
  //   console.log(u);
  // });
  // console.log(projValue);

  // console.log(
  //   "Valve: " +
  //     valveList.name +
  //     " requested for " +
  //     valveList.qty +
  //     " but " +
  //     Math.min.apply(null, projValue) +
  //     " Valve can be made"
  // );
};

projectionValve("2452d289c1c44cffa5bcd405d647ccf0", 10, (data, proj) => {
  console.log("From Callback");
  console.log(data);
  console.log(proj);
});

module.exports = {
  projectionValve
};
