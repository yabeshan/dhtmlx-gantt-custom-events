gantt.attachEvent("onTaskClick", function(id, event) {
    hideContextMenu(event);
    editItemDisabled();
    selectItem(event);
    return true;
});

gantt.attachEvent("onTaskDblClick", function(id, e) {
    editItem(event);
    return false;
});

gantt.attachEvent("onContextMenu", function(taskId, linkId, event){
    showContextMenu(event);
    return false;
});


/************ UTILS ***********/
var init = true;

function editItemDisabled() {
    var item = document.getElementById("edit-item");
    item.style.display = "none";
}

function changeEditInput() {
    var inp = document.getElementById("edit-item-input");
    inp.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === "Escape") {
            editItemDisabled();
            event.preventDefault();
        }
    });
}

function editItem(event) {
    if (!selectItemValid(event)) {
        return true;
    }
    if (init) {
        init = false;
        changeEditInput();
    }

    var item = document.getElementById("edit-item");
    selectItemPosition(event, item, 15);
    selectItemSize(event, item);
    item.style.display = "block";
    
    var inp = document.getElementById("edit-item-input");
    inp.value = event.srcElement.innerText;
    inp.focus();
}

function selectItem(event) {
    if (!selectItemValid(event)) {
        return true;
    }
    var item = document.getElementById("select-item");
    selectItemPosition(event, item, 0);
    selectItemSize(event, item);
}

function selectItemValid(event) {
    var cl = event.srcElement.className;
    if (cl.indexOf('gantt_add')>=0 || cl.indexOf('gantt_last_cell')>=0) {
        return false;
    }
    return true;
}

function selectItemPosition(event, item, padding) {
    item.style.top = event.clientY - event.layerY - padding + "px";
    item.style.left = event.clientX - event.layerX - padding + "px";
}

function selectItemSize(event, item) {
    var w = (event.srcElement.className == "gantt_cell") 
        ? event.srcElement.clientWidth : event.srcElement.parentElement.clientWidth ;
    var h = event.srcElement.clientHeight;
    item.style.width = w + "px";
    item.style.height = h + "px";
}

function showContextMenu(event) {
    var item = document.getElementById("context-menu");
    item.style.top = event.clientY + "px";
    item.style.left = event.clientX + "px";
    item.style.display = "block";
}

function hideContextMenu(event) {
    var item = document.getElementById("context-menu");
    item.style.display = "none";
}
