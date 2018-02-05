var ganttEditTaskId;
var ganttEditTaskItemId;
var ganttEditTaskItemValue;

gantt.attachEvent("onTaskClick", function(id, event) {
    hideContextMenu(event);
    editItemDisabled();
    // selectItem(event);
    return true;
});

gantt.attachEvent("onTaskDblClick", function(idTask, event) {
    ganttEditTaskId = idTask;
    ganttEditTaskItemId = getItemId(idTask, event);
    ganttEditTaskItemValue = getElement(event).innerText;

    hideContextMenu(event);
    editItem(event);
    return false;
});

gantt.attachEvent("onContextMenu", function(taskId, linkId, event){
    editItemDisabled();
    showContextMenu(event);
    return false;
});


/************ UTILS ***********/
var init = true;

function getItemId(idTask, event) {
    var el = getElement(event);
    var parent = (el.className == "gantt_cell") ? event.target.parentElement : event.target.parentElement.parentElement;
    var child = (el.className == "gantt_cell") ? event.target : event.target.parentElement;
    var arr = parent.childNodes;
    var selectId = 0;
    for (var k=0; k<arr.length; k++) {
        if (arr[k] == child) {
            selectId = k;
            break;
        }
    }

    return selectId;
}

function getElement(event) {
    if (event.target) {
        return event.target;
    }
    return event.srcElement;
}

function editItemDisabled() {
    var item = document.getElementById("edit-item");
    item.style.display = "none";
}

function changeEditInput() {
    var inp = document.getElementById("edit-item-input");
    inp.addEventListener("keydown", function(event) {
        if (event.which === 13 ) {//"Enter"
            saveEditInput();
            event.preventDefault();
        }

        if (event.which === 27 ) {//"Escape"
            editItemDisabled();
            event.preventDefault();
        }
    });
}

function saveEditInput() {
    var task = gantt.getTask(ganttEditTaskId);
    var inp = document.getElementById("edit-item-input");
    var type = ["text", "start_date", "duration", "end_date", "priority", "option", "option"];
    if (ganttEditTaskItemId==1 || ganttEditTaskItemId==3) {
        task[ type[ganttEditTaskItemId] ] = new Date(inp.value);
    } else {
        task[ type[ganttEditTaskItemId] ] = inp.value;
    }
    gantt.updateTask(ganttEditTaskId); 
    gantt.refreshData();
    
    editItemDisabled();
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
    inp.value = ganttEditTaskItemValue;
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
    var cl = getElement(event).className;
    if (cl.indexOf('gantt_add')>=0 || cl.indexOf('gantt_last_cell')>=0) {
        return false;
    }
    return true;
}

function selectItemPosition(event, item, padding) {
    var offY = event.offsetY; //event.layerY;
    var offX = event.offsetX; //event.layerX;
    item.style.top = event.clientY - offY - padding + "px";
    item.style.left = event.clientX - offX - padding + "px";
}

function selectItemSize(event, item) {
    var el = getElement(event);
    var w = (el.className == "gantt_cell") 
        ? el.clientWidth : el.parentElement.clientWidth ;
    var h = el.clientHeight;
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
