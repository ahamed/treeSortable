# Tree Sortable
A drag and drop list item sorting and level changing library. 

![treeSortableBanner](https://user-images.githubusercontent.com/5783354/163663867-9a404565-1550-4eac-afb7-a1f50fddd7c8.gif)

## Motivation
The `jQuery-ui's` sortable plugin allows us to sort items vertically or horizontally. But sometimes we need some items to make a child of another item and also need to sort a parent with all of the children items.
This is the reason why I've created this library for managing the parent-children relationship of list items and fully by drag and drop.

## Installation
Download the `treeSortable.js` and `treeSortable.css` files and add the `treeSortable.js` file before the `</body>` tag.
Note that include the `treeSortable.js` file after `jquery` and the `jquery-ui` scripts. Include the `treeSortable.css` stylesheet in the head section. For reference see the `index.html` file.


## Usage
Create a `ul` element with the ID `tree`. If you want to use other ID instead of `tree` then you have to update the design of `treeSortable.css` file or need to write your own stylesheet.
Add a `<script>` tag after `treeSortable.js` script. You could add the HTML content for the branches inside the `ul` element, but I prefer to create an array of branches.

```js
const data = [
	{
		id: 1,
		level: 1,
		parent_id: 0,
		title: 'Branch 1'
	},
	{
		id: 2,
		level: 2,
		parent_id: 1,
		title: 'Branch 2'
	},
	.
	.
	.
]
```

Make sure the data is in a perfect parent-child relationship. And level must be accurate.

After create an instance of the `TreeSortable` object and create the **Tree Branch**.


```js
const sortable = new TreeSortable();

// Creating the branch contents.
const $content = data.map(sortable.createBranch);

// Append the content as children of the `#tree` ul element
$('#tree').html($content);

// Finally run the sortable functionalities.
sortable.run();
```

That's all. Your sortable tree is interactive. Now you can change the order of the tree branch and can change the level of the branch as well.

## Change sortable options
You can change sortable options for farther customizations. For changing the options you need to update the `sortable.options` object before calling the `sortable.run()` function.


branchSelector: ".tree-branch",
branchPathSelector: ".branch-path",
dragHandlerSelector: ".branch-drag-handler",
placeholderName: "sortable-placeholder",
childrenBusSelector: ".children-bus",
levelPrefix: "branch-level",
maxLevel: 10,

## Options
| Option | Default | Description |
|--------| --------| ------------|
| treeSortable | #tree | The tree root ID selector. If you change the root selector then you have to update the CSS as per requirements.|
| branchSelector | .tree-branch | The tree branch class selector. This need to be applied at the `li` element of the tree.|
|branchPathSelector| .branch-path | The left side path indication element's class selector. |
|dragHandlerSelector| .branch-drag-handler| The drag element. This element is responsible for enabling the dragging features of the branch.|
|placeholderName| sortable-placeholder | The placeholder name. This is for jquery-ui sortable. Note that there is no dot(.) or hash(#). See the jquery-ui sortable library.|
|childrenBusSelector| .children-bus| The children bus selector. This element is responsible for carrying the children on sorting a parent element.|
|levelPrefix| branch-level| This prefix is added to the `li` element and create a level class. For example, for the level 1 branch the class would be `.branch-level-1`|
|maxLevel| 10 | The maximum level the tree could go. For example, if you set the `maxLevel` to `2` then the branch could have maximum `.branch-level-2`.|
|depth| 30 | The Depth of a child branch. If you change the depth then you have to update the CSS of the `.branch-level-X` classes. See the `treeSortable.css` for more references.|


For updating the options you could do-
```js
sortable.options = {
	...sortable.options,
	branchSelector: '#otherTree',
	branchPathSelector: '.other-path',
	maxLevel: 2,
	depth: 40
}

// Then run the sortable
sortable.run();
```


## Event
After each reorder or level change an event is fired for further operations.
```js
sortable.onSortCompleted(function(event, ui) {
	// here the `event` is the sortable event.
	// The `ui` is the jquery-ui's ui object.
	// You can use the `ui.item`, `ui.helper` and so on.
	// See https://api.jqueryui.com/sortable/
});
```

You can perform async operations here as well. make the callback function asynchronous in that case.

```js
sortable.onSortCompleted(async function(event, ui) {
	await updateDatabaseAsync();
});
```

## Add child, Add sibling, delete branch.
You can add child branch or a sibling branch. Also you can delete a branch recursively. There are some functions attached to the branch element.
The `sortable.createBranch(data)` function come with few action buttons with the branch at the right hand side. The first one is for creating a new child branch,
the next one for creating a new sibling branch and last one is for deleting a branch recursively.

You could attach click event to the respective buttons for adding child/sibling and/or deleting branch. Note that the events must need to be attached on the `document` and 
implement the event delegation.

```js
$(document).on('click', '.add-child', function(event) {
	event.preventDefault();
	$(this).addChildBranch();
});
```

For adding sibling-

```js
$(document).on('click', '.add-sibling', function(event) {
	event.preventDefault();
	$(this).addSiblingBranch();
});
```

For deleting branch-

```js
$(document).on('click', '.add-sibling', function(event) {
	event.preventDefault();

	// You could check the user consent before deleting branch.
	const confirm = window.confirm('Are you sure to delete the branch?');
	
	if (!confirm) {
		return;
	}

	$(this).removeBranch();
});
```

## Contribution
If you find any issues please raise issue on github. Also if you want to contribute the plugin then create a PR.
You can also contact with me at `sajeeb07ahamed@gmail.com`.


