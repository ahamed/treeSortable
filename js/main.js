/**
 * Tree sortable jQuery library using jQuery UI sortable.
 *
 * @package TreeSortable
 * @license MIT
 * @author Sajeeb Ahamed
 */

var $ = jQuery;

const treeSortable = {
	options: {
		depth: 30,
		treeSelector: '#tree',
		maxLevel: 10,
	},
	run() {
		this.jQuerySupplements();
		this.initSorting();
	},
	getTreeEdge() {
		return $(treeSortable.options.treeSelector).offset().left;
	},
	pxToNumber(str) {
		return new RegExp('px$', 'i').test(str) ? str.slice(0, -2) * 1 : 0;
	},
	numberToPx(num) {
		return `${num}px`;
	},
	jQuerySupplements() {
		const { options } = treeSortable;
		$.fn.extend({
			getBranchLevel() {
				if ($(this).length === 0) return 0;

				const { depth } = options;
				const margin = $(this).css('margin-left');

				return /(px)|(em)|(rem)$/i.test(margin)
					? Math.floor(margin.slice(0, -2) / depth) + 1
					: Math.floor(margin / depth) + 1;
			},
			updateBranchLevel(current, prev = null) {
				return this.each(function () {
					prev = prev || $(this).getBranchLevel() || 1;
					$(this)
						.removeClass('branch-level-' + prev)
						.addClass('branch-level-' + current);
				});
			},
			shiftBranchLevel(dx) {
				return this.each(function () {
					let level = $(this).getBranchLevel() || 1,
						newLevel = level + dx;
					$(this)
						.removeClass('branch-level-' + level)
						.addClass('branch-level-' + newLevel);
				});
			},
			getParent() {
				const level = $(this).getBranchLevel() || 1;
				let $prev = $(this).prev('.tree-branch');

				while ($prev.length && $prev.getBranchLevel() >= level) {
					$prev = $prev.prev('.tree-branch');
				}

				return $prev;
			},
			getChildren() {
				let $children = $();

				this.each(function () {
					let level = $(this).getBranchLevel() || 1,
						$next = $(this).next('.tree-branch');

					while ($next.length && $next.getBranchLevel() > level) {
						$children = $children.add($next);
						$next = $next.next('.tree-branch');
					}
				});

				return $children;
			},
			nextBranch() {
				return $(this).next();
			},
			prevBranch() {
				return $(this).prev();
			},
			nextSibling() {
				let level = $(this).getBranchLevel() || 1,
					$next = $(this).next('.tree-branch'),
					nextLevel = $next.getBranchLevel();

				while ($next.length && nextLevel > level) {
					$next = $next.next('.tree-branch');
					nextLevel = $next.getBranchLevel();
				}

				return nextLevel === level ? $next : $();
			},
			prevSibling() {
				let level = $(this).getBranchLevel() || 1,
					$prev = $(this).prev('.tree-branch'),
					prevLevel = $prev.getBranchLevel();

				while ($prev.length && prevLevel > level) {
					$prev = $prev.prev('.tree-branch');
					prevLevel = $prev.getBranchLevel();
				}

				return prevLevel === level ? $prev : $();
			},
		});
	},
	initSorting() {
		const { options, pxToNumber, numberToPx } = treeSortable;
		const { treeSelector } = options;

		/** Store the current level, for sorting the item after stop dragging. */
		let currentLevel = 1,
			originalLevel = 1,
			childrenBus = null,
			helperHeight = 0,
			changed = false;

		/** Update the placeholder branch level by new level. */
		const updatePlaceholder = (placeholder, level) => {
			placeholder.updateBranchLevel(level);
			currentLevel = level;
		};

		/** Check if we can swap items vertically for branch with children */
		const canSwapItems = ui => {
			let offset = ui.helper.offset(),
				height = offset.top + helperHeight,
				nextBranch = ui.placeholder.nextBranch(),
				nextBranchOffset = nextBranch.offset() || 0,
				nextBranchHeight = nextBranch.outerHeight();

			return height > nextBranchOffset.top + nextBranchHeight / 3;
		};

		$(treeSelector).sortable({
			handle: '.branch-drag-handler',
			placeholder: 'sortable-placeholder',
			items: '> *',
			start(_, ui) {
				/**
				 * Synchronize the placeholder level with the item's level.
				 *
				 */
				const level = ui.item.getBranchLevel();
				ui.placeholder.updateBranchLevel(level);

				/**  Store the original level. */
				originalLevel = level;

				/** Fill the children bus with the children. */
				childrenBus = ui.item.find('.children-bus');
				childrenBus.append(ui.item.next().getChildren());

				/**
				 * Calculate the placeholder width & height according to the
				 * helper's width & height respectively.
				 */
				let height = childrenBus.outerHeight();
				let placeholderMarginTop = ui.placeholder.css('margin-top');

				height += height > 0 ? pxToNumber(placeholderMarginTop) : 0;
				height += ui.helper.outerHeight();
				helperHeight = height;
				height -= 2;

				let width =
					ui.helper.find('.branch-drag-handler').outerWidth() - 2;
				ui.placeholder.css({ height, width });

				const tmp = ui.placeholder.nextBranch();
				tmp.css('margin-top', numberToPx(helperHeight));
				ui.placeholder.detach();
				$(this).sortable('refresh');
				ui.item.after(ui.placeholder);
				tmp.css('margin-top', 0);

				// Set the current level by the initial item's level.
				currentLevel = level;
			},
			sort(_, ui) {
				const { options, getTreeEdge } = treeSortable;
				const { depth, maxLevel } = options;
				let treeEdge = getTreeEdge(),
					offset = ui.helper.offset(),
					currentBranchEdge = offset.left,
					lowerBound = 1,
					upperBound = maxLevel;

				/**
				 * Calculate the upper bound. The upper bound would be,
				 * the minimum value between the
				 * (previous branch level + 1) and the maxLevel.
				 */
				let prevBranch = ui.placeholder.prevBranch();
				prevBranch =
					prevBranch[0] === ui.item[0]
						? prevBranch.prevBranch()
						: prevBranch;

				let prevBranchLevel = prevBranch.getBranchLevel();
				upperBound = Math.min(prevBranchLevel + 1, maxLevel);

				/**
				 * Calculate the lower bound. The lower bound would be,
				 * the maximum value between the
				 * Next Sibling Level and 1
				 */
				let nextSibling = ui.placeholder.nextSibling();

				if (nextSibling.length) {
					let placeholderLevel = ui.placeholder.getBranchLevel() || 1;
					lowerBound = Math.max(1, placeholderLevel);
				}

				/**
				 * Calculate the position which is the current helper offset left
				 * minus the tree parent's offset left.
				 * Find the changed level by dividing the position by depth value.
				 *
				 * The final valid changed level would be a value
				 * between upper and lower bound inclusive.
				 */
				let position = Math.max(0, currentBranchEdge - treeEdge);
				let newLevel = Math.floor(position / depth) + 1;
				newLevel = Math.max(lowerBound, Math.min(newLevel, upperBound));

				/** Update the placeholder position by the changed level. */
				updatePlaceholder(ui.placeholder, newLevel);

				if (canSwapItems(ui)) {
					ui.placeholder.nextBranch().after(ui.placeholder);
					$(this).sortable('refreshPositions');
				}
			},
			change(_, ui) {
				let prevBranch = ui.placeholder.prevBranch();

				prevBranch =
					prevBranch[0] === ui.item[0]
						? prevBranch.prevBranch()
						: prevBranch;

				/**
				 * After changing branches bound the placeholder to the
				 * changed boundary.
				 */
				let prevBranchLevel = prevBranch.getBranchLevel() || 1;
				ui.placeholder.detach();
				let children = prevBranch.getChildren();
				if (children && children.length) prevBranchLevel += 1;
				prevBranch.after(ui.placeholder);

				ui.placeholder.updateBranchLevel(prevBranchLevel);
			},
			stop(_, ui) {
				/**
				 * Place the children after the sorted item,
				 * and clear the children bus.
				 */
				const children = childrenBus.children().insertAfter(ui.item);
				childrenBus.empty();

				/** Update the item by currently changed level. */
				ui.item.updateBranchLevel(currentLevel);
				children.shiftBranchLevel(currentLevel - originalLevel);
			},
		});
	},
};

$(document).ready(treeSortable.run());
