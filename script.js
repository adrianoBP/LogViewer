let urlParams = new URLSearchParams(window.location.search);
let fileName = urlParams.get('logfile');

let logTable = document.getElementById("logTable");
let dictContent = {};

let SORTING = "DESC";

let buttonSorting = document.getElementById("buttonSorting");
let iconSorting = document.getElementById("iconSorting");

window.setInterval(function(){
    GetLog(fileName);
}, 2000);

// TODO add max items

Init();

function Init(){

    ChangeSortingIcon();
    GetLog(fileName);
}

function GetLog(fileName) {

    let firtsResultOver = false;
    let request = new XMLHttpRequest();
    request.open('GET', `https://watzonservices.ddns.net/Projects/Logging/Logs/${fileName}`);
    request.send(null);
    request.onreadystatechange = function() {

        if (request.readyState == 4 && request.status == 200) {
            if (request.responseURL == "https://watzonservices.ddns.net/LandingSite/pages/404") {
                console.log("FILE NOT FOUND.");
                // TODO: handle
            } else if (request.responseURL == "https://watzonservices.ddns.net/LandingSite/pages/403") {
                console.log("UNABLE TO ACCESS THE FILE.");
            } else {
                DisplayLog(request.responseText);
                BindActions();
            }
        }
    }
}

function DisplayLog(logs) {

    ClearLog();
    let lines = logs.split('\n');
    lines.pop();

    switch(SORTING){
        case "ASC":
            lines.sort((a, b) => new Date(a.substr(1, 19)) - new Date(b.substr(1, 19)));
            break;
        case "DESC":
            lines.sort((a, b) => new Date(b.substr(1, 19)) - new Date(a.substr(1, 19)));
            break;
        default:
            lines.sort((a, b) => new Date(b.substr(1, 19)) - new Date(a.substr(1, 19)));
            break;
    }


    for (let i = 0; i < lines.length; i++) {

        let logItems = lines[i].split('|');
        let logHeadItems = logItems[0].split(']');
        let = fullLog = {
            head: {
                time: logHeadItems[0].slice(1),
                type: logHeadItems[1].slice(1),
                location: logHeadItems[2].slice(1),
                method: logHeadItems[3].slice(1),
                id: logHeadItems[4].slice(1),
            },
            body: logItems[1]
        }

        fullLog.id = GUID_NEW();
        dictContent[fullLog.id] = fullLog.body;

        $(logTable).find('tbody').append(BuilLogItem(fullLog));
    }
}

function BuilLogItem(fullLog) {

    let colorLog = "white";
    switch (fullLog.head.type.toUpperCase()) {
        case "DEBUG":
            colorLog = "blue";
            break;
        case "INFO":
            colorLog = "green";
            break;
        case "WARNING":
            colorLog = "yellow";
            break;
        case "ERROR":
            colorLog = "red";
            break;
    }

    let HTMLRow = `
    <tr id="${fullLog.id}">
        <td>${fullLog.head.time}</td>
        <td class="${colorLog}">${fullLog.head.type}</td>
        <td>${fullLog.head.location}</td>
        <td>${fullLog.head.method}</td>
        <td>${fullLog.head.id}</td>
    </tr>
    `;

    return HTMLRow;
}

function BindActions() {

    $('tr').click(function() {
        let key = $(this).attr("id");
        swal(dictContent[key], {
                buttons: {
                    copy: "Copy",
                    confirm: "Ok"
                }
            })
            .then((value) => {
                switch (value) {
                    case "copy":
                        clipboard.writeText(dictContent[key]);
                        break;
                }
            });
    });
}

function ClearLog() {

    $(logTable).find('tbody').empty();
}

function ChangeSorting(){

    if(SORTING == "ASC"){
        SORTING = "DESC";
    }else{
        SORTING = "ASC";
    }
    ChangeSortingIcon()
    window.scrollTo(0, 0);
    GetLog(fileName);
}

function ChangeSortingIcon(){

    if(SORTING == "ASC" && iconSorting.classList.contains("up")){
        iconSorting.classList.remove("up");
        iconSorting.className += " down";
    }else if(iconSorting.classList.contains("down")){
        iconSorting.classList.remove("down");
        iconSorting.className += " up";
    }
}
