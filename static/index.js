if (localStorage.getItem('login')) {
    if (localStorage.getItem('channel')) {
        window.location = "/channel/" + localStorage.getItem('channel');
    }
    else {
        window.location = "/channels";
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#form').onsubmit = function() {
        var display_name = document.querySelector('#login').value;
        localStorage.setItem("login", display_name);
        window.location = "/channels";
        // Stop form from submitting
        return false;
    }
});