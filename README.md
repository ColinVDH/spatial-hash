# spatial-hash
spatial hash package for node.js. Forked from https://www.npmjs.com/package/spatialhash-2d


### item requirements
Example of an item:

```js
var item = {
    range: {
        x: 0,
        y: 0,
        width: 100,
        height: 150
    },
    __b: undefined
};
```

- item must contain a `.range` object. The `.range` object also must have `x`, `y`, `width` and `height` variables/properties.
- item must not have a `.__b` object defined.

### Constructor

```js
const SpatialHash = require('spatial-hash');
var hash = new SpatialHash(range, cellSize);
```

#### `range` object

An item containing `x`, `y`, `width` and `height` variables/properties. The same functionality as `item.range` object.
```js
{
    x: /* X (top-left) */
    y: /* Y (top-left) */,
    width: /* width */,
    height: /* height */
}
```

#### `cellSize`

A number that represents the width and height of a cell in the spatial hash.

## Variables

#### `.cellSize`

The second argument passed in the constructor. 

#### `.itemCount`

The amount of items currently in the map.

The maximum item count is 900 000 000 000 000.

#### `.hash`

The map. See remarks for more info.

#### `._horizontalCells`

Amount of horizontal Cells in the map. See remarks for more info.

#### `._verticalCells`

Amount of vertical Cells in the map. See remarks for more info.

#### `.cellCount`

Amount of cells in the map. 

### Functions

#### `.insert(item)`

Inserts an item.

See item requirements that need to be met. 

The maximum item count is 900 000 000 000 000.

The `.insert(item)` function creates a `.__b` item in the `item`.

#### `.remove(item)`

Removes an item.

The `.remove(item)` function will not remove items that do not have a `.__b` item inside them.


#### `.removeAll()`

remove all items.

#### `.update(item)`

Removes then inserts the item.

items that are moving need to be updated.

#### `.query(rangeObj, [selector])`

Searches the map for items in a specified `rangeObj` then returns an array of found items.

If any item is found to be intersecting the `rangeObj`, the class will call `selector(item)` if `selector` is provided.

If `selector(item)` returns `false` the array will not include the item.

#### `.any(rangeObj)`

Searches the map for items in a specified `rangeObj`.

Returns a boolean whether an item was found or not.

If any item is found to be intersecting the `rangeObj`, it will immediately return `true`. Otherwise returns `false`.

#### `.find(rangeObj, [callback])`

Searches the map for items in a specified `rangeObj`.

If any item is found to be intersecting the `rangeObj`, the class will call `callback(item)` if `callback` is provided.



## Remarks


**item.__b.id number may overlap with some other id**.

This is due to the class just adding 1 to the next number. However, 1 800 000 000 000 000 item's must be added before a collision is possible.
