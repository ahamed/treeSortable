# Tree Sortable
A drag and drop list item sorting and level changing library. 

![treeSortableBanner](https://user-images.githubusercontent.com/5783354/163663867-9a404565-1550-4eac-afb7-a1f50fddd7c8.gif)

## Motivation
The `jQuery-ui's` sortable plugin allows us to sort items vertically or horizontally. But sometimes we need some items to make a child of another item and also need to sort a parent with all of the children items.
This is the reason why I've created this library for managing the parent-children relationship of list items and fully by drag and drop.

## Installation
Download the required files from the [Github](https://github.com/ahamed/treeSortable/archive/refs/heads/master.zip). Use the `treeSortable.js` and `treeSortable.css` files to your project.
You also need to use `jQuery` and `jQuery-ui` libraries.

In the `<head>` tag use the css files.
```html
<link href="https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" />
<link href="/path/to/treeSortable.css" rel="stylesheet" />
```

Before the `</body>` tag
```html
<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<script src="/path/to/treeSortable.js"></script>
```

---

## Usage
Create a `ul` element with some ID attribute.

```html
<ul id="tree"></ul>
```

Then generate an array of object with the exact structure defined below.
In the data structure the ordering is important, the tree will be rendered according to this order.

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

Now we are gonna create an instance of the tree sortable. And we can pass an options object as the constructor of the `TreeSortable`.


```js
const sortable = new TreeSortable({
	treeSelector: '#tree'
});
```

Now create the HTML content of the tree from the `data` we've declared earlier, and append the `$content` to the `<ul>` element.
```js
const $content = data.map(sortable.createBranch);
$('#tree').html($content);
```

Finally, run the sortable for making it interactive.

```js
sortable.run();
```

## Change sortable options
You can pass customized options to the sortable while instantiating the function. All the options has the default values.

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
const sortable = new TreeSortable({
	treeSelector: '#someUlId',
	branchSelector: '.some-branch-class-name',
	depth: 20,
	...
})
```

>Note: If you change the class selectors like `branchSelector`, `branchPathSelector` etc then you have to take care of the CSS design accordingly.


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
There are some functions provided to the library for adding child branch, sibling branch or delete branches recursively.
The `sortable` instance provides you an event listener that gives you the ability to attach any event listener for a specific instance.
This is basically a wrapper function of the original jQuery's event listener but this is more `TreeSortable` instance specific.



```js
sortable.addListener('click', '.add-child', function (event, instance) {
	event.preventDefault();
	instance.addChildBranch($(event.target));
});
```

For adding sibling-

```js
sortable.addListener('click', '.add-child', function (event, instance) {
	event.preventDefault();
	instance.addSiblingBranch($(event.target));
});
```

For deleting branch-

```js
sortable.addListener('click', '.remove-branch', function (event, instance) {
	event.preventDefault();

	const confirm = window.confirm('Are you sure you want to delete this branch?');
	if (!confirm) {
			return;
	}
	instance.removeBranch($(this));
});
```

## Contribution
If you find any issues please raise issue on github. Also if you want to contribute the plugin then create a PR.
This library is fully functional if your data structure satisfied the described situation. But this may not be perfect for some other situation.
If you need any customization then ping me on `sajeeb07ahamed@gmail.com`.


