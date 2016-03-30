# SortableTree
A very simple implementation of a sortable, nested tree in JavaScript.

I needed a way to create sortable lists in JavaScript, with the following properties:

- Compatible with touch-screen devices
- Easy to use
- Small
- No dependencies (currently requires jQuery, but I'm working on removing that dependency...)

...and this is the result. Note that it is does NOT use drag-ang-drop. Instead, moving a list item is requires three clicks:

1) Select the item to be moved
2) Select the item that you want to move it next to
3) Choose whether to insert the moved item before, after or below (i.e. as a child of) the selected item

While it's not quite as natural a process as drag-and-drop, it's still quite simple and intuitive. As well as being far more suitable for touch-screen devices, it's also (I think) far easier to use when working with lists that are longer than a single page. 

The code emits events to notify when the tree is updated, and methods to retrieve the resultant structure in a useful format. 