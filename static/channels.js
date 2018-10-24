if (!localStorage.getItem('login')) {
    window.location = "/";
}
// When the webpage loading
document.addEventListener('DOMContentLoaded', () => {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // update display name label
    document.getElementById("user_name").innerHTML = localStorage.getItem('login');
    document.getElementById("logout_button").onclick = () => {
        localStorage.setItem('login', "");
        window.location = "/";
    };
    document.querySelectorAll('.channel').forEach(channel => {
         channel.onclick = () => {window.location = "/channel/" + channel.innerHTML;
         };
     });
    socket.on('connect', () => {
        document.querySelector('#new-channel').disabled = true;
        document.querySelector('#channel_name').onkeyup = () => {
            if (document.querySelector('#channel_name').value.length > 0)
                document.querySelector('#new-channel').disabled = false;
        };
        localStorage.setItem('channel', "");
        document.querySelector('#new-channel').onclick = () => {
            let name = document.querySelector('#channel_name').value;
            let match = false;
            document.querySelectorAll("td").forEach(td => {
                if (td.innerHTML === name) {
                    match = true;
                }
            });
            if (match) {
                alert('This channel exists');
            }
            else {
                socket.emit("add_channel", {'name': name});
            }
        };
    });
    socket.on('new_channel', data => {
        document.getElementById("channels").innerHTML += `<tr><td>${data['name']}</td></tr>`;
        document.querySelector("#channel_name").value = "";
        window.location = "/channels";
    });
});
