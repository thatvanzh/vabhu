const socket = io();

// DOM Elements
const modal = document.getElementById("join-modal");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages-container");

// Sound (Optional - wrap in try/catch to prevent errors if file missing)
let notificationSound;
try {
    notificationSound = new Audio('newmessage.wav');
} catch (e) {
    console.log("Sound file not found");
}

let uname;

// --- JOIN CHAT ---
joinBtn.addEventListener("click", function(){
    let username = usernameInput.value;
    if(username.length == 0){
        return; 
    }
    uname = username;
    
    socket.emit("newuser", username);
    
    modal.style.display = "none";
});

// --- SEND MESSAGE ---
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
    
    messageInput.value = "";
}

// --- RECEIVE MESSAGES ---
socket.on("chat", function(message){
    // Play sound if possible
    if(notificationSound) {
        notificationSound.play().catch(error => console.log("Browser blocked sound"));
    }
    renderMessage("other", message);
});

// --- RECEIVE UPDATES (Join/Left) ---
socket.on("update", function(updateText){
    renderMessage("update", updateText);
});

// --- RENDER FUNCTION ---
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
        // 'message' here is just a string (e.g. "Vabhu joined")
        el.innerText = message; 
    }

    messagesContainer.appendChild(el);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; 
}
