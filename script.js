let urlParams = new URLSearchParams(window.location.search);
let fileName = urlParams.get('logfile');

let logTable = document.getElementById("logTable");
let dictContent = {};

let SORTING_TIME = "DESC";
let ACTIVE = false;

let buttonSorting = document.getElementById("buttonSorting");
let iconSorting = document.getElementById("iconSorting");
let dropdownTypes = document.getElementById("dropdownTypes");

window.setInterval(function() {
    // GetLog(fileName);

}, 2000);

// TODO add max items

Init();

function ResizeEvent() {

    if (ACTIVE) {

        if (window.innerWidth < 768) {
            $('#headContainer').css("display", "none");
            $('#bodyContainer').css("margin-top", "0px");
        } else {
            $('#headContainer').css("display", "inline");
            $('#bodyContainer').css("margin-top", "100px");
        }
    }

}

function Init() {

    if(fileName == null){
        window.location.replace("https://watzonservices.ddns.net/422");
    }else{
        ResizeEvent();
        GetLog(fileName);
        BindActions();
    }
}

function InitUI() {

    $('#headContainer').css("display", "inline");
}

function GetLog(fileName) {

    let firtsResultOver = false;
    let request = new XMLHttpRequest();
    request.open('GET', `https://watzonservices.ddns.net/Projects/Logging/Logs/${fileName}`);
    request.send(null);
    request.onreadystatechange = function() {
        ACTIVE = false;
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseURL == "https://watzonservices.ddns.net/LandingSite/pages/404") {
                window.location.replace("https://watzonservices.ddns.net/404");
            } else if (request.responseURL == "https://watzonservices.ddns.net/LandingSite/pages/403") {
                console.log("UNABLE TO ACCESS THE FILE.");
            } else {
                ACTIVE = true;
                InitUI();
                DisplayLog(request.responseText);

            }
        }
    }
}

function DisplayLog(logs) {

    ClearLog();
    let lines = logs.split('\n');
    lines.pop();

    switch (SORTING_TIME) {
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

    $('.logRow').bind('click', function() {
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

    BindStyle();
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
    <tr id="${fullLog.id}" class="logRow">
        <td class="cellTime">${fullLog.head.time}</td>
        <td class="cellType ${colorLog}">${fullLog.head.type}</td>
        <td class="cellLocation">${fullLog.head.location}</td>
        <td class="cellMethod">${fullLog.head.method}</td>
        <td class="cellId">${fullLog.head.id}</td>
    </tr>
    `;

    return HTMLRow;
}

function BindActions() {

    $('#headerTime').bind('click', function() {
        ChangeSorting();
    });
}

function BindStyle() {
    $('.cellTime').outerWidth(`${$('#headerTime').outerWidth()}px`);
    $('.cellType').outerWidth(`${$('#headerType').outerWidth()}px`);
    $('.cellLocation').outerWidth(`${$('#headerLocation').outerWidth()}px`);
    $('.cellMethod').outerWidth(`${$('#headerMethod').outerWidth()}px`);
    $('.cellId').outerWidth(`${$('#headerId').outerWidth()}px`);
}

function ClearLog() {

    $(logTable).find('tbody').empty();
}

function ChangeSorting() {

    if (SORTING_TIME == "ASC") {
        SORTING_TIME = "DESC";
    } else {
        SORTING_TIME = "ASC";
    }
    window.scrollTo(0, 0);
    GetLog(fileName);
}
