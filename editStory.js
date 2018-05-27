const ipcRenderer = require('electron').ipcRenderer;
var idEditStory;
var idS = 0;
var idP = 0;
var availableTags = [
];

ipcRenderer.send('jumpToMainFromEditStory', 'ping');

ipcRenderer.on('jumpToEditStoryFromMain', function (event, id) {
    idEditStory=id;
    updateStory(id,updateStory2);
    
});

function updateStory(idEditStory,callback){

    var array = [];
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database('./database.sqlite3');
    db.each("SELECT rowid AS id, Image,ID,People,Story,Title,Subject,Event,Situation,Date FROM story WHERE ID = " + idEditStory + "", function (err, row) {

        if (err) console.log(err);
        else {
            array[0] = row.Story;
            array[1] = row.People;
            array[2] = row.Date;
            editStoryPicture.src = row.Image;
            editStoryPicture.style.width = "100%";
            editStoryPicture.style.height = "100%";
            editStoryPicture.style.objectFit = "contain";

            
                editStoryTags.innerHTML += '<label style="margin-left: 41px;" for="editStoryTitle">Title:</label> <input value="' + row.Title + '" style="font:15px arial,serif;" size="15" type="text" id="editStoryTitle" />';

                editStoryTags.innerHTML += '<label style="margin-left: 39px;" for="editStorySubject">Subject:</label> <input value="' + row.Subject + '" style="font:15px arial,serif;" size="15" type="text" id="editStorySubject" />';

                editStoryTags.innerHTML += '<label style="margin-left: 30px;" for="editStoryEvent">Event:</label> <input value="' + row.Event + '" style="font:15px arial,serif;" size="15" type="text" id="editStoryEvent" />';

                editStoryTags.innerHTML += '<label style="margin-left: 30px;" for="editStorySituation">Situation:</label> <input value="' + row.Situation + '" style="font:15px arial,serif;" size="15" type="text" id="editStorySituation" />';

            editStoryStory.innerHTML += '<Button class="btn btn-primary" style="width:156px; font:17px arial,serif;" type="submit" id="editStory" onClick="editStoryTextBox()">Add Story</Button>';
            availableTags = [];

            db.each("SELECT rowid AS id, Name FROM people", function (err, row) {
                if (err) console.log(err);
                else {
                  availableTags.push(row.Name);
            }});
            db.close();
            callback(array);

        }
    });


}

var updateStory2 = function (array) {

    var story = array[0];
    var people = array[1];
    setTimeout(function(){
        
    //editStoryPeople.innerHTML += '<input size="15" style="border: 0px;margin-bottom: 8px;font:17px arial,serif;" type="text" id="editStoryDate" value="' + array[2] + '"readonly="readonly"/>'
    editStoryPeople.innerHTML += '<Button class="btn btn-primary" style="width:156px;margin-top: 5px;font:17px arial,serif;position: absolute;top: 4px;" type="submit" id="editPerson" onClick="editPersonTextBox()">Add Person</Button>'    

    if (story != null) {
        var st = story.split("|");

        for (let index = 0; index < st.length; index++) {
            editStoryStory.innerHTML += '<textarea rows="3" style="resize: vertical;margin-top: 7px;font:15px arial,serif;width: 100%;box-sizing:border-box;" id="editStoryStory' + idS + '" >' + st[index] + '</textarea>'
            idS++;
        }

    }
    if (people != null) {
        var pl = people.split("|");

        for (let index = 0; index < pl.length; index++) {
            editStoryPeopleContent.innerHTML += '<input size="15" type="text" class="ui-widget" style="margin-top: 7px;font:15px arial,serif;" value="' + pl[index] + '" id="editStoryPerson' + idP + '">'
            idP++;
        }
    }

    for (let index = 0; index < idP; index++) {
      $( "#editStoryPerson"+index).autocomplete({
        source: availableTags
      });
    }

}, 500);
}


function editStory(){
    if (confirm('Are you sure you want to edit this story ?')) {

    editStorySubmit.disabled = "disabled";

    var story, people, title, subject, event, situation;

  if (editStoryTitle.value != null && /\S/.test(editStoryTitle.value)) {
    title = document.getElementById("editStoryTitle").value;
  } else {
    title = "";
  }

  if (editStorySubject.value != null && /\S/.test(editStorySubject.value)) {
    subject = document.getElementById("editStorySubject").value;
  } else {
    subject = "";
  }

  if (editStoryEvent.value != null && /\S/.test(editStoryEvent.value)) {
    event = document.getElementById("editStoryEvent").value;
  } else {
    event = "";
  }

  if (editStorySituation.value != null && /\S/.test(editStorySituation.value)) {
    situation = document.getElementById("editStorySituation").value;
  } else {
    situation = "";
  }

  for (let index = 0; index < idS; index++) {

    if (document.getElementById("editStoryStory" + index).value != null && /\S/.test(document.getElementById("editStoryStory" + index).value)) {
      if (index == 0) {

        story = document.getElementById("editStoryStory" + index).value;

      } else {

        story += "|" + (document.getElementById("editStoryStory" + index).value);
      }
    }
  }


  var nameForNamesDB = [];
  for (let index = 0; index < idP; index++) {
    if (document.getElementById("editStoryPerson" + index).value != null && /\S/.test(document.getElementById("editStoryPerson" + index).value)) {

      if (index == 0) {
        nameForNamesDB.push(document.getElementById("editStoryPerson" + index).value);
        people = document.getElementById("editStoryPerson" + index).value;
        
      } else {
        nameForNamesDB.push(document.getElementById("editStoryPerson" + index).value);
        people += "|" + (document.getElementById("editStoryPerson" + index).value);
      }
    }
    if(index == idP-1){
      addNamesToDB(nameForNamesDB);
    }
  }

  var sqlite3 = require('sqlite3').verbose();
  //var db = new sqlite3.Database(':memory:');
  var db = new sqlite3.Database('./database.sqlite3');
  db.serialize(function () {
    var stmt = db.prepare("UPDATE story SET People='"+people+"',Story='"+story+"',Title ='"+title+"',Subject='"+subject+"',Event='"+event+"',Situation='"+situation+"' WHERE ID="+idEditStory);
    stmt.run();

    stmt.finalize();
  });

  setTimeout(function(){
    jumpToIndex(db);
}, 1500);

function jumpToIndex(db) {

    setTimeout(function(){
      db.close();
    ipcRenderer.send('jumpToMainFromEditStory2');
  }, 500);
  }

function addNamesToDB(namesToCompare){

    var uniqueNames = [];
    $.each(namesToCompare, function(i, el){
        if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });
    
      var sqlite3 = require('sqlite3').verbose();
      var db = new sqlite3.Database('./database.sqlite3');
    var namesInDB = [];
    var namesInDB2 = [];
    
      db.each("SELECT rowid AS id, Name FROM people", function (err, row) {
        if (err) console.log(err);
      
        else {
          namesInDB.push(row.Name);
          namesInDB2.push(row.Name);
      }});
      
      var finalNames=[];
      var finalNamesKinda=[];
      
      setTimeout(function(){
    
        var a = [], diff = [];
    
        for (let index = 0; index < namesInDB.length; index++) {
          uniqueNames.push(namesInDB[index]);
        }
    
        for (var i = 0; i < uniqueNames.length; i++) {
            a[uniqueNames[i]] = true;
        }
    
        for (var i = 0; i < namesInDB.length; i++) {
            if (a[namesInDB[i]]) {
                delete a[namesInDB[i]];
            } else {
                a[namesInDB[i]] = true;
            }
        }
    
        for (var k in a) {
          finalNames.push(k);
        }
    //////////////////
    setTimeout(function(){
        for (var i = 0; i < namesInDB2.length; i++) {
    
      }
    
      for (var i = 0; i < finalNamesKinda.length; i++) {
    
      }
    
      for (var k in a) {
    
      }
    
       setTimeout(function(){
        for (var i = 0; i < finalNames.length; i++) {
        db.serialize(function () {
    
          var stmt = db.prepare("INSERT INTO people(Name) VALUES (?)");
          stmt.run(finalNames[i]);
          stmt.finalize();
        });
      }
    
      }, 500);
    }, 500);
    }, 500);
    
    }
} else {}

}

function editStoryTextBox(){

    var pic, storyArray = [],
    image, title, subject, event, situation;

  if (editStoryTitle.value != null && /\S/.test(editStoryTitle.value)) {
    title = document.getElementById("editStoryTitle").value;
  } else {
    title = "";
  }

  if (editStorySubject.value != null && /\S/.test(editStorySubject.value)) {
    subject = document.getElementById("editStorySubject").value;
  } else {
    subject = "";
  }

  if (editStoryEvent.value != null && /\S/.test(editStoryEvent.value)) {
    event = document.getElementById("editStoryEvent").value;
  } else {
    event = "";
  }

  if (editStorySituation.value != null && /\S/.test(editStorySituation.value)) {
    situation = document.getElementById("editStorySituation").value;
  } else {
    situation = "";
  }

  for (let index = 0; index < idS; index++) {
    if (document.getElementById("editStoryStory" + index).value != null && /\S/.test(document.getElementById("editStoryStory" + index).value)) {

      storyArray[index] = document.getElementById("editStoryStory" + index).value;

    } else {
      storyArray[index] = "";
    }
  }

  editStoryStory.innerHTML += '<textarea rows="3" style="resize: vertical;margin-top: 7px;font:15px arial,serif;width: 100%;box-sizing:border-box;" id="editStoryStory' + idS + '" ></textarea>'

  document.getElementById("editStoryTitle").value = title;
  document.getElementById("editStorySubject").value = subject;
  document.getElementById("editStoryEvent").value = event;
  document.getElementById("editStorySituation").value = situation;

  for (let index = 0; index < idS; index++) {
    document.getElementById("editStoryStory" + index).value = storyArray[index];
  }
  idS++;


}

function editPersonTextBox(){

  var peopleArray = [];
  for (let index = 0; index < idP; index++) {
    if (document.getElementById("editStoryPerson" + index).value != null && /\S/.test(document.getElementById("editStoryPerson" + index).value)) {

      peopleArray[index] = document.getElementById("editStoryPerson" + index).value;

    } else {
      peopleArray[index] = "";
    }
  }

  editStoryPeopleContent.innerHTML += '<input size="15" type="text" class="ui-widget" style="margin-top: 7px;font:15px arial,serif;" id="editStoryPerson' + idP + '">'

  for (let index = 0; index < idP; index++) {
    document.getElementById("editStoryPerson" + index).value = peopleArray[index];
  }
  idP++;

  for (let index = 0; index < idP; index++) {
    $( "#editStoryPerson"+index).autocomplete({
      source: availableTags
    });
  }



}