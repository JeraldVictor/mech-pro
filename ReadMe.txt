This will be document to track our work.

1: Component entry page
  1A: GET to show all components with current stock.
    Completed
  1B: POST to add new component
    Completed
  1C: PUT to update component also to update stock details.
    Completed
  1D: DELETE to remove a component from the list.
    Completed

If a component is used against a valve that component should not be able to delete.

Expect 1A all commands should track who did it in a separate table(in our case a new .db file).

2: Valve Maintenance
  2A: GET to show all valve names, with all component names and required quantity
  2B: POST to add new valve to our database.
    {
    name: <valve_name>,
    desc: <desc>,
    componentList: [{
    componentName: <componentName>,
    quantity: <quantity>,
    optional: true,
    optComponentList: [{optCompName1: <componentName>,optQuantity1: <quantity>},{optCompName1: <componentName>,optQuantity1: <quantity>}]
    },{
    componentName: <componentName>,
    quantity: <quantity>
    }]
    }

    Fetch all the componentName & quantity from the componentList, put it in a object, compare against our stock.
    If the matching quantity available then good, else check if the componentName has a optional? If so replace the object.componentName
    to the optComponent name and check for quantity.


  2C: PUT to update a valve details.
  2D: DELETE to remove a valve from our database.

Expect 2A all commands should track who did it in a separate table.


Request can be made from client using below as header.
Content-Type: application/json
