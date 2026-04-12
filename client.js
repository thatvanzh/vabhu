const socket = io("https://vabhu.onrender.com");

const modal = document.getElementById("join-modal");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages-container");

let uname;

// JOIN CHAT
joinBtn.addEventListener("click", function(){
    let username = usernameInput.value;
    if(username.length == 0) return;

    uname = username;

    // ✅ MATCH SERVER EVENT NAME
    socket.emit("new-user-joined", username);

    modal.style.display = "none";
});

// SEND MESSAGE
function sendMessage(){
    let message = messageInput.value;
    if(message.length == 0) return;

    renderMessage("my", {
        text: message
    });

    // ✅ MATCH SERVER EVENT NAME
    socket.emit("send", message);

    messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});

// RECEIVE MESSAGE
socket.on("receive", function(data){
    renderMessage("other", {
        username: data.name,
        text: data.message
    });
});

// USER JOINED
socket.on("user-joined", function(name){
    renderMessage("update", name + " joined the chat");
});

// USER LEFT
socket.on("left", function(name){
    renderMessage("update", name + " left the chat");
});

// RENDER MESSAGE
function renderMessage(type, message){
    let el = document.createElement("div");

    if(type == "my"){
        // ✅ Changed class to "message sent" to match our CSS
        el.className = "message sent"; 
        el.innerHTML = `
            <span>You</span>
            <div class="text">${message.text}</div>
        `;
    }
    else if(type == "other"){
        // ✅ Changed class to "message received" to match our CSS
        el.className = "message received";
        el.innerHTML = `
            <span>${message.username}</span>
            <div class="text">${message.text}</div>
        `;
    }
    else if(type == "update"){
        el.className = "update-message";
        el.innerText = message;
    }

    messagesContainer.appendChild(el);
    
    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
    messagesContainer.appendChild(el);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

