const ipcRenderer = require('electron').ipcRenderer;
var idIndex;
var idS = 0;
var idP = 0;
var picContent;
var picTitle;

ipcRenderer.send('jumpToMainFromIndex', 'ping');

ipcRenderer.on('jumpToIndexFromMain', function (event, id) {
    updateIndex(id, updateIndex2);
});

function updateIndex(idIndex, callback) {

    var array = [];
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('./database.sqlite3');
    db.each("SELECT rowid AS id, Image,ID,People,Story,Title,Subject,Event,Situation,Date FROM story WHERE ID = " + idIndex + "", function (err, row) {

        if (err) console.log(err);
        else {
            picContent = row.Image;
            if(row.Title != ""){picTitle = row.Title;}else{picTitle="myImage";}
            
            array[0] = row.Story;
            array[1] = row.People;
            array[2] = row.Date;

            //input.target.files[0]=file;
            //indexPicture.src="'image.'+ext"
            indexPicture.src = row.Image;
            indexPicture.style.width = "100%";
            indexPicture.style.height = "100%";
            indexPicture.style.objectFit = "contain";

            if (row.Title != "") {
                indexTags.innerHTML += '<label style="margin-left: 38px;" for="indexTitle">Title:</label> <input value="' + row.Title + '" style="background: #8b888c;border: 0px;font:15px arial,serif;" size="15" type="text" id="indexTitle" readonly="readonly" />';

            }
            if (row.Subject != "") {
                indexTags.innerHTML += '<label style="margin-left: 39px;" for="indexSubject">Subject:</label> <input value="' + row.Subject + '" style="background: #8b888c;border: 0px;font:15px arial,serif;" size="15" type="text" id="indexSubject" readonly="readonly" />';

            }
            if (row.Event != "") {
                indexTags.innerHTML += '<label style="margin-left: 40px;" for="indexEvent">Event:</label> <input value="' + row.Event + '" style="background: #8b888c;border: 0px;font:15px arial,serif;" size="15" type="text" id="indexEvent" readonly="readonly"/>';

            }
            if (row.Situation != "") {
                indexTags.innerHTML += '<label style="margin-left: 25px;" for="indexSituation">Situation:</label> <input value="' + row.Situation + '" style="background: #8b888c;border: 0px;font:15px arial,serif;" size="15" type="text" id="indexSituation" readonly="readonly"/>';

            }

            db.close();
            callback(array);

        }
    });

}

var updateIndex2 = function (array) {
    var story = array[0];
    var people = array[1];
    indexPeople.innerHTML += '<input size="15" style="background: #8b888c;border: 0px;margin-top: 5px;font:17px arial,serif;position: absolute;top: 10px;" type="text" id="indexDate" value="' + array[2] + '"readonly="readonly"/>'

    if (story != null) {
        var st = story.split("|");

        for (let index = 0; index < st.length; index++) {
            indexStories.innerHTML += '<textarea rows="3" style="background: #8b888c;border: 0px;resize: vertical;margin-top: 7px;font:15px arial,serif;width: 100%;box-sizing:border-box;" id="indexStory' + idS + '" readonly="readonly" >' + st[index] + '</textarea>'
            idS++;
        }

    }
    if (people != null) {
        var pl = people.split("|");

        for (let index = 0; index < pl.length; index++) {
            indexPeopleContent.innerHTML += '<input size="15" type="text" style="background: #8b888c;border: 0px;margin-top: 7px;font:15px arial,serif;" value=" ' + pl[index] + '" id="indexPerson' + idP + '" readonly="readonly">'
            idP++;
        }
    }

}

function saveMeFromMyselfDontLetMeDrown() {
    if (confirm('Are you sure you want to save this image ?')) {
    var ba64 = require("ba64");
    var ext = ba64.getExt(picContent);
    var image=picContent;
    var fs = require('fs');
    var data = image.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');

    var path = require('path');

    var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/');

    fs.writeFile(DOWNLOAD_DIR + picTitle + '.' + ext, buf);
        alert(picTitle + '.' + ext + " saved at "+DOWNLOAD_DIR);
    } else {}
}

/*

function editIndexTextBox() {
    indexStoryTextBox.removeAttribute('readonly');

}

function editIndexTextBox2() {

    indexStoryTextBox.setAttribute("readonly", "readonly");
    //guardar story na BD
}*/