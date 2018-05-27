const {
    ipcRenderer
} = require('electron');

var idLibrary=-1;

function eventKey(event){
    if (event.which == 9 || (event.which >= 16 && event.which <= 20) || event.which == 27 || (event.which >= 33 && event.which <= 40) || event.which == 44 || event.which == 45 || event.which == 91 || event.which == 93 || (event.which >= 112 && event.which <= 123) || event.which == 144 || event.which == 145){
        
    }else{listImages();}
}

function listImages() {
    //3 letras usa-se WHERE People,Story,Title LIKE '%200%'
    if (search.value == "") {
        clear();
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('./database.sqlite3');
        db.each("SELECT rowid AS id, Image,ID FROM story ORDER BY ID DESC", function (err, row) {

            if (err) console.log(err);

            else {

                libraryFrame.innerHTML += '<img onclick="saveID(this.id)" ondblclick="jumpToIndex(this.id)" src="' + row.Image + '" id="' + row.ID + '"' + ' style="width:255px;height:143.4375px;padding:5px 5px 5px 5px;border-radius:15px;" >';

            }
        });
        db.close();
    } else if (search.value.length >= 3) {
        clear();
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database('./database.sqlite3');
        
        var array = $('select#options').val();
        var str = "";
        for (let index = 0; index < array.length; index++) {
            if(index==(array.length)-1){
                str += array[index]+" LIKE '%"+search.value+ "%' ORDER BY ID DESC";
            }else{
          str += array[index]+" LIKE '%"+search.value+ "%' OR ";
            }
        }
            db.each("SELECT * FROM story WHERE "+str, function (err, row) {
            if (err) console.log(err);

            else {

                libraryFrame.innerHTML += '<img onclick="saveID(this.id)" ondblclick="jumpToIndex(this.id)" src="' + row.Image + '" id="' + row.ID + '"' + ' style="width:255px;height:143.4375px;padding:5px 5px 5px 5px;border-radius:15px;" >';

            }
        });
        db.close();

    }

}

function clear() {
    libraryFrame.innerHTML = "";
}


function jumpToIndex(id) {
    ipcRenderer.send('jumpToMainFromLibrary', id);
}

function saveID(id) {

    if(idLibrary!=-1){
        document.getElementById(idLibrary).style.border="";
    }
    idLibrary = id;

    document.getElementById(idLibrary).style.border="2px solid #428bca";

}

function editStory(id) {

    if (idLibrary === undefined) {
        alert("Click in a picture first!");
    } else {
        if (confirm('Are you sure you want to edit this story ?')) {

            jumpToEdit(idLibrary);

        } else {}

    }
}

function jumpToEdit(id) {
    ipcRenderer.send('jumpToMainFromLibrary2', id);
}

function deleteStory(id) {
    if (idLibrary === undefined) {
        alert("Click in a picture first!");
    } else {
        if (confirm('Are you sure you want to delete this story ?')) {

            var sqlite3 = require('sqlite3').verbose();
            //var db = new sqlite3.Database(':memory:');
            var db = new sqlite3.Database('./database.sqlite3');
            db.serialize(function () {

                var stmt = db.prepare("DELETE FROM story WHERE ID=" + idLibrary);
                stmt.run();

                stmt.finalize();
            });

            db.close();

            setTimeout(function () {
                listImages();
            }, 500);

        } else {}
    }
}

$(function () {
    $('#options').multiselect({
        buttonText: function (options, select) {
            if (options.length === 0) {
                return 'None selected';
            }
            if (options.length === select[0].length) {
                return 'All selected (' + select[0].length + ')';
            } else if (options.length >= 3) {
                return options.length + ' selected';
            } else {
                var labels = [];
                options.each(function () {
                    labels.push($(this).val());
                });
                return labels.join(', ') + '';
            }
        }

    });
});