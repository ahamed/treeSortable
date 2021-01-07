<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" contents="width=device-width, initial-scale=1.0">
    <title>Sortable</title>
    <link href="https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css" rel="stylesheet" type="text/css" />
    <link href="./css/all.css" rel="stylesheet"></link>
    <link href="./css/style.css" rel="stylesheet"></link>
    

</head>
<body>
    <ul id="tree">
        <li class="tree-branch branch-level-1">
            <div class="contents">
                <div class="branch-drag-handler">
                    <span class="branch-title">Branch 1</span>
                </div>
            </div>
            <div class="children-bus"></div>
        </li>
        <li class="tree-branch branch-level-1">
            <div class="contents">
                <div class="branch-drag-handler">
                    <span class="branch-title">Branch 2</span>
                </div>
            </div>
            <div class="children-bus"></div>
        </li>
        <li class="tree-branch branch-level-2">
            <div class="contents">
                <div class="branch-drag-handler">
                    <span class="branch-title">Branch 3</span>
                </div>
            </div>
            <div class="children-bus"></div>
        </li>
        <li class="tree-branch branch-level-2">
            <div class="contents">
                <div class="branch-drag-handler">
                    <span class="branch-title">Branch 4</span>
                </div>
            </div>
            <div class="children-bus"></div>
        </li>
        <li class="tree-branch branch-level-3">
            <div class="contents">
                <div class="branch-drag-handler">
                    <span class="branch-title">Branch 5</span>
                </div>
            </div>
            <div class="children-bus"></div>
        </li>
        <li class="tree-branch branch-level-1">
            <div class="contents">
                <div class="branch-drag-handler">
                    <span class="branch-title">Branch 6</span>
                </div>
            </div>
            <div class="children-bus"></div>
        </li>
    </ul>

    <script src="https://code.jquery.com/jquery-3.1.0.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="./js/main.js"></script>
</body>
</html>