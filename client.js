const socket = io();

// Elements
const modal = document.getElementById("join-modal");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages-container");

// Sound (Optional - fails silently if file missing)
let notificationSound = new Audio('newmessage.wav');
let uname;

// 1. JOIN CHAT
joinBtn.addEventListener("click", function(){
    let username = usernameInput.value;
    if(username.length == 0){ return; }
    
    uname = username;
    socket.emit("newuser", username);
    
    modal.style.display = "none";
});

// 2. SEND MESSAGE
function sendMessage(){
    let message = messageInput.value;
    if(message.length == 0){ return; }
    
    // Show my message immediately
    renderMessage("my", {
        username: uname,
        text: message
    });
    
    // Send to server
    socket.emit("chat", {
        username: uname,
        text: message
    });
    
    messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){ sendMessage(); }
});

// 3. LISTEN FOR MESSAGES
socket.on("chat", function(message){
    notificationSound.play().catch(e => console.log("Sound blocked"));
    renderMessage("other", message);
});

// 4. LISTEN FOR UPDATES
socket.on("update", function(update){
    renderMessage("update", update);
});

// 5. RENDER FUNCTION
function renderMessage(type, message){
    let el = document.createElement("div");
    
    if(type == "my"){
        el.className = "message my-message";
        el.innerHTML = `<div class="text">${message.text}</div>`;
    } else if(type == "other"){
        el.className = "message other-message";
        el.innerHTML = `
            <span class="username">${message.username}</span>
            <div class="text">${message.text}</div>
        `;
    } else if(type == "update"){
        el.className = "update-message";
        el.innerText = message;
    }

    messagesContainer.appendChild(el);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; 
}
