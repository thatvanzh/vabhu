const socket = io();

// Elements
const modal = document.getElementById("join-modal");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages-container");

let uname;

// 1. JOIN CHAT
joinBtn.addEventListener("click", function(){
    let username = usernameInput.value;
    if(username.length == 0){ return; }
    
    uname = username;
    socket.emit("newuser", username);
    
    modal.style.display = "none";
});

// 2. SEND MESSAGE (The Fix is Here)
function sendMessage(){
    let message = messageInput.value;
    
    // SAFETY CHECK: If message is empty, stop.
    if(message.length == 0){ return; }
    
    // SAFETY CHECK: If username is lost, ask again (or use Guest)
    if(!uname){ uname = "Guest"; }

    // 1. Show my message locally
    renderMessage("my", {
        username: uname,
        text: message
    });
    
    // 2. Send to server
    socket.emit("chat", {
        username: uname,
        text: message
    });
    
    // 3. Clear input
    messageInput.value = "";
}

// Button Click Event
sendBtn.addEventListener("click", function() {
    sendMessage();
});

// Enter Key Event
messageInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});

// 3. LISTEN FOR MESSAGES
socket.on("chat", function(message){
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
        el.innerHTML = `
            <div class="text">${message.text}</div>
        `;
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
