# centerize
A jquery plugin for centering and sizing elements.

All methods allow specifying the parent as the last (or only) parameter:

$(".myelem).centerize();

* centerize(): center an object horizontal and vertical within the parent elem.
* horizontal(): center an object horizontal only within the parent elem.
* vertical(): center an object vertical only within the parent elem.
* heightPercent(percent): height a percentage of the parent elem size.
* heightAspect(percent): height a percentage of the parent elem size, width resized preserving aspect ratio.
* widthPercent(percent): width a percentage of the parent elem size.
* widthAspect(percent): width a percentage of the parent elem size, height resized preserving aspect ratio.
* takeup(): take up all the space in the parent not taken up by sibling elements.
* takeupHeight(): take up all the height in the parent not taken up by sibling elements (assumes that items that wrap are inside containers).
* takeupWidth(): take up all the width of the parent not taken up by sibling elements (assumes that items that wrap are inside containers).
* takeupWidthAspect(): take up all the width in the parent not taken up by sibling elements, height resized preserving aspect ratio (assumes that items that wrap are inside containers).
* takeupHeightAspect(): take up all the height in the parent not taken up by sibling elements, width resized preserving aspect ratio (assumes that items that wrap are inside containers).
* borderedHeight(): fid the inner height of the element including border/border radius
* borderedWidth(): find the inner width of the element including border/border radius.
