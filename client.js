const socket = io();

// 1. SELECT ELEMENTS FROM YOUR HTML
const app = document.querySelector(".glass-container");
const modal = document.getElementById("join-modal");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages-container");

// Optional: Sound
let notificationSound = new Audio('newmessage.wav');

let uname; // Variable to store your name

// 2. JOIN CHAT FUNCTION
joinBtn.addEventListener("click", function(){
    let username = usernameInput.value;
    if(username.length == 0){
        return; // Don't do anything if name is empty
    }
    uname = username;
    
    // Tell server we are here
    socket.emit("newuser", username);
    
    // Hide the popup
    modal.style.display = "none";
});

// 3. SEND MESSAGE FUNCTION
function sendMessage(){
    let message = messageInput.value;
    if(message.length == 0){
        return;
    }
    
    // A. Show MY message immediately on my screen
    renderMessage("my", {
        username: uname,
        text: message
    });
    
    // B. Send message to SERVER (so others see it)
    socket.emit("chat", {
        username: uname,
        text: message
    });
    
    // Clear the input box
    messageInput.value = "";
}

// Click the send button
sendBtn.addEventListener("click", sendMessage);

// Press "Enter" key to send
messageInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});

// 4. LISTEN FOR MESSAGES FROM OTHERS
socket.on("chat", function(message){
    // Play sound
    notificationSound.play().catch(err => console.log("Sound blocked"));
    // Show the message
    renderMessage("other", message);
});

// 5. LISTEN FOR UPDATES (Join/Left)
socket.on("update", function(updateText){
    renderMessage("update", updateText);
});

// 6. RENDER FUNCTION (Draws the bubbles)
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
        el.innerText = message; // 'message' is just text here
    }

    messagesContainer.appendChild(el);
    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight; 
}
