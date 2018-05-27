fs = require('fs');
const {
  ipcRenderer
} = require('electron');

var availableTags = [
];

var idP = 0;
var idS = 0;
var picExists=false;
FileUpload.onchange = function (input) {
  //console.log(input);
  picExists = true;
  var image = document.getElementById("picture");
  image.style.display = image.style.display === 'none' ? '' : '';

  image.src = input.target.files[0].path;
  //image.src = input.value;
  image.style.width = "100%";
  image.style.height = "100%";
  image.style.objectFit = "contain";

};

function createPersonTextBox() {
  availableTags = [];

  var sqlite3 = require('sqlite3').verbose();
  var db = new sqlite3.Database('./database.sqlite3');
  db.each("SELECT rowid AS id, Name FROM people", function (err, row) {
      if (err) console.log(err);
      else {
        availableTags.push(row.Name);
  }});
  db.close();

  var peopleArray = [];
  for (let index = 0; index < idP; index++) {
    if (document.getElementById("createStoryPerson" + index).value != null && /\S/.test(document.getElementById("createStoryPerson" + index).value)) {

      peopleArray[index] = document.getElementById("createStoryPerson" + index).value;

    } else {
      peopleArray[index] = "";
    }
  }

  createStoryPeopleContent.innerHTML += '<input type="text" size="15" class="ui-widget" style="margin-top: 7px;font:15px arial,serif;" id="createStoryPerson' + idP + '">'

  for (let index = 0; index < idP; index++) {
    document.getElementById("createStoryPerson" + index).value = peopleArray[index];
  }
  idP++;

  for (let index = 0; index < idP; index++) {
    $( "#createStoryPerson"+index).autocomplete({
      source: availableTags
    });
  }
}

function createStoryTextBox() {

  var pic, storyArray = [],
    image, title, subject, event, situation;

  if (createStoryTitle.value != null && /\S/.test(createStoryTitle.value)) {
    title = document.getElementById("createStoryTitle").value;
  } else {
    title = "";
  }

  if (createStorySubject.value != null && /\S/.test(createStorySubject.value)) {
    subject = document.getElementById("createStorySubject").value;
  } else {
    subject = "";
  }

  if (createStoryEvent.value != null && /\S/.test(createStoryEvent.value)) {
    event = document.getElementById("createStoryEvent").value;
  } else {
    event = "";
  }

  if (createStorySituation.value != null && /\S/.test(createStorySituation.value)) {
    situation = document.getElementById("createStorySituation").value;
  } else {
    situation = "";
  }

  for (let index = 0; index < idS; index++) {
    if (document.getElementById("createStoryStories" + index).value != null && /\S/.test(document.getElementById("createStoryStories" + index).value)) {

      storyArray[index] = document.getElementById("createStoryStories" + index).value;

    } else {
      storyArray[index] = "";
    }
  }

  createStoryStories.innerHTML += '<textarea rows="3" style="resize: vertical;font:15px arial,serif;width: 100%;box-sizing:border-box;" id="createStoryStories' + idS + '"></textarea>';


  document.getElementById("createStoryTitle").value = title;
  document.getElementById("createStorySubject").value = subject;
  document.getElementById("createStoryEvent").value = event;
  document.getElementById("createStorySituation").value = situation;

  for (let index = 0; index < idS; index++) {
    document.getElementById("createStoryStories" + index).value = storyArray[index];
  }
  idS++;
}

function createStory() {
  if(picExists==true){
  if (confirm('Are you sure you want to create this story ?')) {
  createStorySubmit.disabled = "disabled";
  var pic;
  pic = document.getElementById("FileUpload");

  encodeImageFileAsURL(pic, saveDB);

} else {}}else{alert("Add a picture!")}

}

function encodeImageFileAsURL(image, callback) {

  var file = image.files[0];
  var reader = new FileReader();
  reader.onloadend = function () {

    pic = reader.result;
    callback(pic);

  }
  reader.readAsDataURL(file);

}

var saveDB = function (base64img) {

  var story, people, image, originDate;

  fs.stat(document.getElementById("FileUpload").files[0].path, function (err, stats) {
    if (err) return cb2(err);
    var fileInfo = stats.birthtime;
    saveDBEmpireStrikesBack(base64img, fileInfo);
  });
}

function saveDBEmpireStrikesBack(base64img, origin) {

  var pic, story,
    people, image, title, subject, event, situation;

  var weekDay = origin.toString().substring(0, 3);
  var day = origin.toString().substring(8, 10);
  var month = origin.toString().substring(4, 7);
  var year = origin.toString().substring(11, 15);
  var hours = origin.toString().substring(16, 24);
  var originDate = day + " " + month + " " + year + " " + hours;

  if (createStoryTitle.value != null && /\S/.test(createStoryTitle.value)) {
    title = document.getElementById("createStoryTitle").value;
  } else {
    title = "";
  }

  if (createStorySubject.value != null && /\S/.test(createStorySubject.value)) {
    subject = document.getElementById("createStorySubject").value;
  } else {
    subject = "";
  }

  if (createStoryEvent.value != null && /\S/.test(createStoryEvent.value)) {
    event = document.getElementById("createStoryEvent").value;
  } else {
    event = "";
  }

  if (createStorySituation.value != null && /\S/.test(createStorySituation.value)) {
    situation = document.getElementById("createStorySituation").value;
  } else {
    situation = "";
  }

  for (let index = 0; index < idS; index++) {

    if (document.getElementById("createStoryStories" + index).value != null && /\S/.test(document.getElementById("createStoryStories" + index).value)) {
      if (index == 0) {

        story = document.getElementById("createStoryStories" + index).value;

      } else {

        story += "|" + (document.getElementById("createStoryStories" + index).value);
      }
    }
  }


  var nameForNamesDB = [];
  for (let index = 0; index < idP; index++) {
    if (document.getElementById("createStoryPerson" + index).value != null && /\S/.test(document.getElementById("createStoryPerson" + index).value)) {

      if (index == 0) {
        nameForNamesDB.push(document.getElementById("createStoryPerson" + index).value);
        people = document.getElementById("createStoryPerson" + index).value;
        
      } else {
        nameForNamesDB.push(document.getElementById("createStoryPerson" + index).value);
        people += "|" + (document.getElementById("createStoryPerson" + index).value);
      }
    }
    if(index == idP-1){
      addNamesToDB(nameForNamesDB);
    }
  }

  var image = base64img;

  var sqlite3 = require('sqlite3').verbose();
  //var db = new sqlite3.Database(':memory:');
  var db = new sqlite3.Database('./database.sqlite3');
  db.serialize(function () {

    var stmt = db.prepare("INSERT INTO story(Date,Image,People,Story,Title,Subject,Event,Situation) VALUES (?,?,?,?,?,?,?,?)");
    stmt.run(originDate, image, people, story, title, subject, event, situation);

    stmt.finalize();
  });

 

  setTimeout(function(){
    jumpToIndex(db);
}, 1500);

  
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

function jumpToIndex(db) {

  setTimeout(function(){
    db.close();
  ipcRenderer.send('jumpToMainFromCreateStory');
}, 500);
}