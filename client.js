const socket = io();

// Elements
const modal = document.getElementById("join-modal");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages-container");

// Load the sound
const notificationSound = new Audio('newmessage.wav');

let uname;

// 1. JOIN CHAT (Clicking the button in the popup)
joinBtn.addEventListener("click", function(){
    let username = usernameInput.value;
    if(username.length == 0){
        return; 
    }
    uname = username;
    
    // Notify Server
    socket.emit("newuser", username);
    
    // Hide the Popup
    modal.style.display = "none";
});

// 2. SEND MESSAGE
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});

function sendMessage(){
    let message = messageInput.value;
    if(message.length == 0){
        return;
    }
    
    // Render my message
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

// 3. LISTEN FOR MESSAGES
socket.on("chat", function(message){
    // Play Sound
    notificationSound.play().catch(error => console.log("Sound blocked by browser until interaction"));
    
    renderMessage("other", message);
});

// 4. LISTEN FOR UPDATES (Join/Left)
socket.on("update", function(update){
    renderMessage("update", update);
});

// HELPER: Render
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
