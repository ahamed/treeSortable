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
		return /px$/i.test(str) ? str.slice(0, -2) * 1 : 0;
	},
	numberToPx(num) {
		return num + 'px';
	},
	jQuerySupplements() {
		const { options } = treeSortable;
		$.fn.extend({
			getBranchLevel() {
				if ($(this).length === 0) return false;

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
			getChildren() {
				let $children = $();
				$(this).each(function () {
					let level = $(this).getBranchLevel() || 1,
						$next = $(this).next('.tree-branch');

					while ($next.length && $next.getBranchLevel() > level) {
						$children = $children.add($next);
						$next = $next.next('.tree-branch');
					}
				});

				return $children;
			},
			getUpperBranch() {
				return $(this).prev();
			},
			getLowerBranch() {
				return $(this).next().next();
			},
		});
	},
	initSorting() {
		const { options, pxToNumber, numberToPx } = treeSortable;
		const { treeSelector } = options;

		/** Store the current level, for sorting the item after stop dragging. */
		let currentLevel = 1,
			originalLevel = 1,
			childrenBus = null;

		const updatePlaceholder = (placeholder, level) => {
			placeholder.updateBranchLevel(level);
			currentLevel = level;
		};

		$(treeSelector).sortable({
			handle: '.branch-drag-handler',
			placeholder: 'sortable-placeholder',
			items: '> *',
			start(e, ui) {
				/**
				 * Synchronize the placeholder level with the item's level.
				 *
				 */
				const level = ui.item.getBranchLevel();
				ui.placeholder.updateBranchLevel(level);

				// Store the original level
				originalLevel = level;

				/**
				 * Fill the children bus with the children
				 */
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

				height -= 2;

				let width =
					ui.helper.find('.branch-drag-handler').outerWidth() - 2;
				ui.placeholder.css({ height, width });

				// Set the current level by the initial item's level.
				currentLevel = level;
			},
			change(e, ui) {
				console.log('change');
			},
			sort(e, ui) {
				const { options, getTreeEdge } = treeSortable;
				const { depth, maxLevel } = options;
				let treeEdge = getTreeEdge(),
					offset = ui.helper.offset(),
					currentBranchEdge = offset.left;

				/** Get the upper branch level. */
				let upperBranchLevel = ui.helper
					.getUpperBranch()
					.getBranchLevel();
				upperBranchLevel += 1;

				/** Get the lower branch level. */
				let lowerBranchLevel = ui.helper
					.getLowerBranch()
					.getBranchLevel();
				lowerBranchLevel -= 1;

				/**
				 * Calculate the position which is the current helper offset left
				 * minus the tree parent's offset left.
				 * Find the changed level by dividing the position by depth value.
				 * The level would be ranged in [1, min(upperBranchLevel, maxLevel)]
				 */
				let position = Math.max(0, currentBranchEdge - treeEdge);
				let newLevel = Math.floor(position / depth) + 1;
				let lowerBound = Math.max(1, lowerBranchLevel),
					upperBound = Math.min(upperBranchLevel, maxLevel);

				newLevel = Math.min(upperBound, Math.max(lowerBound, newLevel));

				/** Update the placeholder position by the changed level. */
				updatePlaceholder(ui.placeholder, newLevel);
			},
			stop(e, ui) {
				const children = childrenBus.children().insertAfter(ui.item);
				childrenBus.empty();

				/** Update the item by currently changed level. */
				ui.item.updateBranchLevel(currentLevel);
				children.shiftBranchLevel(currentLevel - originalLevel);
				console.log(ui.item.getChildren());
			},
		});
	},
};

$(document).ready(treeSortable.run());
