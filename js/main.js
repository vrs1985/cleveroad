var myApp = [];
    myApp.users = { // create object with default data
        1 : { name : "John", birthday : "06.07.2008", city : "Budapesht", active : true, boss : false},
        2 : { name : "Mary", birthday : "01.02.2003", city : "Berlin", active : true, boss : true},
        3 : { name : "James", birthday : "04.05.2006", city : "Viena", active : false, boss : false}
    };

    // check if hasn't local storage, save new
    if(!(localStorage.getItem("user"))){
        setStorage(myApp.users);
    }

function setStorage(args) { // set local storage with name "user"
    let value = JSON.stringify(args); // save in json format
    localStorage.setItem("user", value);
}

(function getStorage(args) { // get local storage
    let valueStorage = localStorage.getItem("user"); // take value storage
    myApp.curStorage = JSON.parse(valueStorage); // parse and save like method in global var
    makeTable(); // call nex funct.
})();

// make global method and bind with logout menu
myApp.removeStorage = document.getElementById('logout');
myApp.removeStorage.addEventListener("click", function () {
    localStorage.removeItem("user"); // if we click on 'logout' remove our storage
    location.reload(true); // and refresh page
});

// fill our table which are created in index.html by default
function makeTable(args) {
    let tbody = document.getElementsByTagName('tbody')[0]; // take body table
    // make counter for tracking subobject which we parse and assign number in row table's
    let count = 0;
    for(key in myApp.curStorage) {
        let tr = document.createElement("tr");
        let user = myApp.curStorage[key];// get subobject our global object and saving in variables
        count ++; // make counter more than was
        let td = document.createElement("td");
        td.innerHTML = count; // first column number
        tr.append(td);
        for(key in user){ // parse subobject
            let td = document.createElement("td");
            // if we get value with key active or boss we call func for create checkbox or radio
            if(key == "active" || key == "boss"){
                td.append(makeCheckbox(key, user[key])); // send key and value (true/false)
            }else{ // for name, birthday and city
                td.setAttribute("data-row", "row-"+count); // from data-row we will get number row in table
                td.classList.add("target-name"); // set attribute after we will watch event
                td.innerHTML = user[key]; // put our data
            }
            tr.append(td);
        }
        tbody.append(tr);
    }
}

// make checkbox and return prepared input -- key-active/boss value true/false
function makeCheckbox(key, value) {
    let input = document.createElement("input");
    if(key == "active"){
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", "active");
    }else{
        input.setAttribute("type", "radio");
        input.setAttribute("name", "boss");
    }
        input.checked = value;
        return input;
}

// watch event click on table row with data
$('.target-name').click(function () {
   let number = $(this).attr("data-row"); // get -- "row-2"
   myApp.digitRow = number.slice(4); // cut row and get only digit our row -- 2
   getProfile(myApp.digitRow);
});

function getProfile(digit) {
    let navMenu = document.getElementsByClassName('nav')[0];
    navMenu.childNodes[1].classList.remove("active"); // delete active home
    navMenu.childNodes[3].classList.add("active"); // make active profile
        myApp.userName = myApp.curStorage[digit].name; // get current name
        myApp.userBirth = myApp.curStorage[digit].birthday; // get current birthday
        myApp.userCity = myApp.curStorage[digit].city; // get current city
    breadcrumbs(myApp.userName, "Profile"); // make breadcrummbs
    $('#home').find("div").remove(); // delete table
    dataProfile(digit);
    $('#header').text("Profile"); // change header
}

function breadcrumbs(uname, prof, ed) { // arguments username, profile, edit
    let arrLi = $('.breadcrumb>li'); // get array with list item breadcrumbs
    for(let i=arrLi.length; i>1;i--){ // delete all, exept "home"
        $('.breadcrumb>li:nth-child('+i+')').remove();
    }
    let uprofile = $("<li></li>").text(uname); // create new list item with user name
    let profile = $("<li></li>").text(prof); // create new list item profile
    let edit;
    if (ed){ // create new list item if get edit param
        edit = $("<li></li>").text(ed);
    }
    $('.breadcrumb').append(uprofile, profile, edit);
}

function dataProfile(args) { // make table with data profile
    let arr = ["name", "birthday", "city"];
    for(let i=0;i<3;i++){
    let col = $("<div></div>").addClass('col-lg-2 col-sm-6 col-xs-6');
    let col1, col2, row; // create column left, right and row
        col1 = $("<div></div>").addClass('col-lg-1 col-sm-6 col-xs-6 capitalLetter').text(arr[i]+": ");
        col2 = $("<div></div>").addClass('col-lg-2 col-sm-6 col-xs-6 bold')
        .text(myApp.curStorage[args][arr[i]]);
        row = $("<div></div>").addClass("row h2em").append(col1, col2);
    $('#home').append(row);
    }
    let btnEdit = $("<input>").attr("type", "button").attr("id", "editMode") // make edit button
    .addClass("btn btn-primary").val("Edit");
    let colBtn = $("<div></div>") // wrapping in row, button will be in the right block
    .addClass('col-lg-offset-1 col-sm-offset-6 col-xs-offset-6 col-lg-2 col-sm-6 col-xs-6')
    .append(btnEdit);
    let row = $("<div></div>").addClass("row h2em").append(colBtn);
    $('#home').append(row);
    watchEdit();
}

function watchEdit() { // catch click on the button edit
    $("#editMode").click(function() {
    $('#home').find("div").remove(); // destruct our user data
    $('#header').text("Edit profile"); // make header Edit
    breadcrumbs(myApp.userName, "Profile", "Edit");
    makeEditor();
});
}

// make form with input fields
function makeEditor() {
    let arrValue = [myApp.userName, myApp.userBirth, myApp.userCity]; // create array vith value
    let arrPlacehold = ["Username", "Birthday", "City"]; // create array placeholder data
    let form = $('<form></form>').attr("role", "form").addClass("col-lg-3");
    // make button because after save we should refresh page and go to dashboard
    let btn = $('<button></button>').attr("id", "submit").addClass("btn btn-success pull-right").text("Save");
    for(let i=0;i<3;i++){ // use loop for create input field
        let inputGroup = $('<div></div>').addClass('input-group');
        let span = $("<span></span>").addClass('input-group-addon');
        let span1 = $('<span></span>').addClass('glyphicon glyphicon-user');
        // in loop we put unique placeholder also we add value, order to user doesn't confused
        // and if want to change some data, make it fast and easy
        let inputName = $('<input>').attr("type", "text").attr("value", arrValue[i])
        .attr("id", "new"+arrPlacehold[i]).attr("placeholder", arrPlacehold[i]).addClass("form-control");
        span.append(span1);
        inputGroup.append(span, inputName);
        form.append(inputGroup);
    }
    form.append(btn);
    $('#home').append(form);
    blockEnter(); // here call func which block enter button because we watch click on mouse
    verifyForm(); // watch for correct data type in field used regExp

}
 // block enter button because we catching event click on submit
    function blockEnter() {
        $('form').keydown(function (e) {
        if(e.keyCode == 13) {
          e.preventDefault();
          return false;
      }
        });
    }

// verify input field by regExp if get false we block button and mark field in red color
function verifyForm() {
    $('input').bind("keyup", function (e) {
        let id = $(this).attr('id'); // catch id field
        let arrTitle = ["use only letter min 2", "format: dd.mm.yyyy"];
        switch (id){
            case "newUsername":
            // arguments in regExp func: field value, regExp, id field, title
            // if incorrect input, title use for help user
                regExp($(this).val(), /[^\sA-ZА-я]/gi, id, arrTitle[0]);
                break;
            case "newBirthday":
                regExp($(this).val(), /[^\d\.]/gi, id, arrTitle[1]);
                break;
            case "newCity":
                regExp($(this).val(), /[^\s\-A-ZА-я]/gi, id, arrTitle[0] + " and -");
                break;
            default : return;
        }
    });
    saveData();
}

function regExp(str, reg, id, title) {
// in checking, used length min 2, because name/city/date of birth cannot contain less than 2 symbols
    if(str.match(reg) || str.length<2 || str == undefined || str == null){
        // if incorrect input mark red border
        $("#"+id).closest(".input-group").addClass("has-error").attr("title", title);
        // make disabled button
        $("#submit").attr("disabled", "disabled");
    } else{  // if all great we get profit and destruct restrictions
        $("#"+id).closest(".input-group").removeClass("has-error");
        $("#submit").removeAttr("disabled", "disabled");
    }
}

function saveData() {
    $('#submit').click(function () { // catch click on submit
        let arrKey = ["name", "birthday", "city"];
        let arrValue = [$('#newUsername').val(), $('#newBirthday').val(), $('#newCity').val()];
        for(let i=0; i<3; i++) // in loop we are changing our old data
            myApp.curStorage[myApp.digitRow][arrKey[i]]  =  arrValue[i];
        setStorage(myApp.curStorage); // send object for save on local storage
    });
}