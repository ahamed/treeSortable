$(document).ready(function () {
    const data = [
        {
            id: 1,
            parent_id: 0,
            title: "Branch 1",
            level: 1,
        },
        {
            id: 2,
            parent_id: 1,
            title: "Branch 1",
            level: 2,
        },
        {
            id: 3,
            parent_id: 1,
            title: "Branch 3",
            level: 2,
        },
        {
            id: 4,
            parent_id: 3,
            title: "Branch 4",
            level: 3,
        },
        {
            id: 5,
            parent_id: 3,
            title: "Branch 5",
            level: 3,
        },
        {
            id: 6,
            parent_id: 1,
            title: "Branch 6",
            level: 2,
        },
        {
            id: 7,
            parent_id: 0,
            title: "Branch 7",
            level: 1,
        },
        {
            id: 8,
            parent_id: 1,
            title: "Branch 8",
            level: 2,
        },
        {
            id: 9,
            parent_id: 1,
            title: "Branch 9",
            level: 2,
        },
        {
            id: 10,
            parent_id: 9,
            title: "Branch 10",
            level: 3,
        },
    ];

    const sortable = new TreeSortable();

    const $tree = $("#tree");
    const $content = data.map(sortable.createBranch);

    $tree.html($content);
    sortable.run();

    const delay = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    };

    sortable.onSortCompleted(async (event, ui) => {
        await delay();
        console.log(ui.item);
    });

    $(document).on("click", ".add-child", function (e) {
        e.preventDefault();
        $(this).addChildBranch();
    });

    $(document).on("click", ".add-sibling", function (e) {
        e.preventDefault();
        $(this).addSiblingBranch();
    });

    $(document).on("click", ".remove-branch", function (e) {
        e.preventDefault();

        const confirm = window.confirm("Are you sure you want to delete this branch?");
        if (!confirm) {
            return;
        }

        $(this).removeBranch();
    });
});
