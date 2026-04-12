const socket = io("https://vabhu.onrender.com");

const modal = document.getElementById("join-modal");
const joinBtn = document.getElementById("join-btn");
const usernameInput = document.getElementById("username-input");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages-container");

let uname;

/* ================= JOIN ================= */
joinBtn.addEventListener("click", () => {
    console.log("JOIN CLICKED"); // 👈 ADD THIS

    const username = usernameInput.value.trim();
    if (!username) return;

    uname = username;
    socket.emit("new-user-joined", username);

    modal.style.display = "none";
});

/* ================= SEND ================= */
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    renderMessage("my", {
        username: "You",
        text: message,
        time: getTime()
    });

    socket.emit("send", message);

    messageInput.value = "";
}

/* SEND EVENTS */
sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

/* ================= RECEIVE ================= */
socket.on("receive", (data) => {
    renderMessage("other", {
        username: data.name,
        text: data.message,
        time: getTime()
    });
});

/* ================= JOIN / LEAVE ================= */
socket.on("user-joined", (name) => {
    renderMessage("update", `${name} joined the chat`);
});

socket.on("left", (name) => {
    renderMessage("update", `${name} left the chat`);
});

/* ================= RENDER ================= */
function renderMessage(type, message) {
    const el = document.createElement("div");

    if (type === "my") {
        el.className = "message sent";
        el.innerHTML = `
            <span>${message.username}</span>
            <div>${message.text}</div>
            <small>${message.time}</small>
        `;
    } 
    else if (type === "other") {
        el.className = "message received";
        el.innerHTML = `
            <span>${message.username}</span>
            <div>${message.text}</div>
            <small>${message.time}</small>
        `;
    } 
    else {
        el.className = "update-message";
        el.innerText = message;
    }

    messagesContainer.appendChild(el);

    /* ✅ SMOOTH AUTO SCROLL */
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth"
    });
}

/* ================= TIME ================= */
function getTime() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();

    if (m < 10) m = "0" + m;

    return `${h}:${m}`;
}
