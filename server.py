import base64

import requests

from flask import Flask, redirect

app = Flask(__name__)

REDIRECT_URI = "http://localhost:8000"
CLIENT_ID = "test"
CLIENT_SECRET = " test2"
TOKEN_URL = "https://accounts.spotify.com/api/token"


def querystringify(params):
    return "&".join([f"{key}={value}" for key, value in params.items()])


@app.route("/")
def root():
    token_url = "https://accounts.spotify.com/api/token"
    code = incoming_flask_request.args.code

    requests.post(
        TOKEN_URL,
        {
            "headers": {
                "Authorization": f"Basic {base64.b64encode(f'{CLIENT_ID}:{CLIENT_SECRET}')}",
                "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            }
        },
    )


@app.route("/login")
def login():
    data = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": "user-read-playback-state",
    }
    return redirect("https://accounts.spotify.com/authorize?" + querystringify(data))
