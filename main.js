/* Its all setup, all you need to do is check the RiveScript tutorial and create your own bot!*/

function main() {
    submit.onclick = chat;
    guide.onclick = guideBtn;
    bot = new RiveScript();
    bot.loadFile("begin.rive", botReady, botError);
    $("#chatInput").on('keyup', function (chatEvent) {
        if (chatEvent.keyCode == 13) {
            chat();
        }
    }); 
}

function botReady() {
    console.log("Chatbot Status: OK");
    bot.sortReplies();
}

function botError(error) {
    console.log("Chatbot Status: " + error);
}

let botMessagesArray = [];
let userMessagesArray = [];
let messagesJson = {};

//This function loads the user input and retrieves the bots reply from the RiveScript Fiel
function chat() {
    let userInput = chatInput.value.trim();
    let reply = bot.reply("local-user", userInput);
    let promiseReply = Promise.resolve(reply);
    promiseReply.then(function (value) {
        botMessagesArray.push(value);
        msgJSON();
    });
    userMessagesArray.push(userInput);
    document.getElementById("chatInput").value = ""; //removing entries after button is clicked
}

let count = 0;
//this seperates each one into a json format for exporting
function msgJSON() {
    let message = ['user', 'bot'];
    let messages = [userMessagesArray, botMessagesArray];

    function arrMerge(key, value) {
        let object = {};
        for (let i = 0; i < key.length; i++) {
            object[key[i]] = value[i];
            count++;
        }
        return object;
    }
    let messagesCombination = arrMerge(message, messages);
    let json = JSON.stringify(messagesCombination);
    parsedMsg = JSON.parse(json)
    console.table(parsedMsg);
    console.log(parsedMsg.user)
    console.log(parsedMsg.bot)
    addElement();
}

//DOM div insertion
function addElement() {
    botDiv = document.createElement("div");
    botDiv.classList.add("innerBot");
    userDiv = document.createElement("div");
    userDiv.classList.add("innerUser");
    let newContentBot = document.createTextNode(parsedMsg.bot.slice(-1)[0]);
    let newContentUser = document.createTextNode(parsedMsg.user.slice(-1)[0]);
    botDiv.appendChild(newContentBot);
    userDiv.appendChild(newContentUser);
    $('.wrapper').append($(userDiv));
    $('.wrapper').append($("<br /><br />"));
    $('.wrapper').append($(botDiv));
    //setTimeout(botReply, 500);
    $('.wrapper').append($("<br /><br />"));
    $(".wrapper").scrollTop($(".wrapper")[0].scrollHeight);
}

function botReply() {
    $('.wrapper').append($(botDiv));
    $('.wrapper').append($("<br>"));
}

function guideBtn() {
    document.getElementById("chatInput").value = "help";
    chat();
}
