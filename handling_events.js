var ganttEditTaskId;
var ganttEditTaskItemId;
var ganttEditTaskItemValue;

function initCSS() {
    var css = '#context-menu{position: absolute;z-index: 9999;top: 0px;left: 0px;display: none;width: 120px;}#context-menu button{width: 120px;height: 35px;}#select-item {position: absolute;z-index: 9999;background: rgba(250,0,250,.2);pointer-events: none;width: 0px;height: 0px;top: 0px;left: 0px;}#edit-item {position: absolute;z-index: 9999;background: #FFFFFF;width: 0px;height: 0px;top: 0px;left: 0px;border: 15px solid  rgba(0,0,0,.2);-webkit-background-clip: padding-box;background-clip: padding-box;display: none;}#edit-item-input {width: 100%;height: 100%;}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css; 
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}
initCSS();

function initHolders() {
    var selectItem = document.createElement('div');
    selectItem.id = 'select-item';
    document.getElementsByTagName("body")[0].appendChild(selectItem);    

    var editItem = document.createElement('div');
    editItem.id = 'edit-item';
    var editItemInput = document.createElement('input');
    editItemInput.id = 'edit-item-input';
    editItem.appendChild(editItemInput);  
    document.getElementsByTagName("body")[0].appendChild(editItem);    
    
    var contextMenu = document.createElement('div');
    contextMenu.id = 'context-menu';
    contextMenu.onclick = hideContextMenu;
    var contextMenuItem1 = document.createElement('button');
    var contextMenuItem2 = document.createElement('button');
    var contextMenuItem3 = document.createElement('button');
    contextMenuItem1.innerHTML = "Context menu";
    contextMenuItem2.innerHTML = "Context menu";
    contextMenuItem3   .innerHTML = "Context menu";
    contextMenu.appendChild(contextMenuItem1);
    contextMenu.appendChild(contextMenuItem2);
    contextMenu.appendChild(contextMenuItem3);
    document.getElementsByTagName("body")[0].appendChild(contextMenu);
}
document.addEventListener("DOMContentLoaded", initHolders);

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
