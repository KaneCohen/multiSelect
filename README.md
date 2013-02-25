# MultiSelectable

## Simple jQuery plugin allowing selection/unselection of items

-----

## Usage

````javascript
$('ul').multiSelect();
````

-----

## Options

`multiple: true` (default) bool. Allow for selection of multiple elements in the list
If set to false, you'll be able to select only one element.

`selected: 'selected'` (default) string. Class that'll be assigned to selected item(s).

`filter: '> *'` (default) string - selector. Selector that represents selectable items in the list.

`unselectOn: false` (default) bool/selector/DOM element. Selector or DOM element which will trigger
deselection of all selected items. 

`keepSelection: true` (default) bool. That's a tricky option. Example: list with multiple items we selected holding `CTRL`.
Now, if this option is set to false, then click on any of the elements without holding of CTRL will result in deselection of all other items.

----

## Callbacks

Available callbacks:

* `select`   - called before selection of the item. If returns `false`, then nothing will be selected
* `unselect` - called when we click on the elements set in `unselectOn` option
* `stop`     - called after selection and unselection of any item. First argument contains list of selected items
Second argument is an item we selected right now

How to use:

````javascript
$('ul').multiSelect().on('select', function(e, obj) {
	// e - event
	// obj - multiSelect object 
}).on('stop', function(items, item) {
	// callback fired after selection/unselection of the item	
});
````

----

## Destruction

````javascript
$('ul').multiSelect('destroy');
````
