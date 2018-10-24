import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


channel_list = [{"name": "general"}]
messages = {"general": []}


@app.route("/", methods=["GET", "POST"])
def index():
    return render_template('index.html')


@app.route("/channels", methods=["POST", "GET"])
def channels():
    return render_template("channels.html", channel_list=channel_list)


@app.route("/channel/<string:channel_name>", )
def chat(channel_name):
    return render_template("channel.html",  messages=messages[channel_name], name=channel_name)


@socketio.on("add_channel")
def add_channel(data):
    name = data["name"]
    new_channel = {"name": name}
    channel_list.append(new_channel)
    messages.setdefault(name, [])
    emit("new_channel", {"name": name}, broadcast=True)


@socketio.on("add message")
def sent(data):
    messages[data["name"]].append((data["user"], data["time"], data["message"]))
    while len(messages[data["name"]]) > 100:
        messages[data["name"]].pop(0)
    emit("announce message",
         {"user": data["user"], "time": data["time"], "message": data["message"], "name": data["name"]},
         broadcast=True)





