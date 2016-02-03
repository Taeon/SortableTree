# SortableTree
A very simple implementation of a sortable, nested tree in JavaScript.

I needed a way to create sortable lists in JavaScript, with the following properties:

- Compatible with touch-screen devices
- Easy to use
- Small
- No dependencies

...and this is the result. Note that it is does NOT use drag-ang-drop. Instead, moving a list item is requires three click:

1) Select the item to be moved
2) Select the item that you want to move it next to
3) Choose whether to insert the moved item before, after or below (i.e. as a child of) the selected item

