This will be document to track our work.

1: Component entry page
  1A: GET to show all components with current stock.
  1B: POST to add new component
  1C: PUT to update component also to update stock details.
  1D: DELETE to remove a component from the list.

Expect 1A all commands should track who did it in a separate table(in our case a new .db file).

2: Valve Maintenance
  2A: GET to show all valve names, with all component names and quantity
  2B: POST to add new valve to our database.
  2C: PUT to update a valve details.
  2D: DELETE to remove a valve from our database.

Expect 2A all commands should track who did it in a separate table.
