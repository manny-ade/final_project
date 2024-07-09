import csv
import datetime
import json
import pytz
import requests
import spotipy
import spotipy.util as util
import sys
import urllib
import uuid

from flask import jsonify, redirect, render_template, request, session
from functools import wraps
from json.decoder import JSONDecodeError
from spotipy.oauth2 import SpotifyClientCredentials

#Consulted ChatGPT, the Spotify Web API/Spotipy documentation and tutorials to learn how to create the Spotify Object.
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="6385bf4124c44969817344989df5e4ab", 
                                                           client_secret="444e746ef3b84073b5ff95e36b7a3dee"))

def apology(message, code=400):
    """Render message as an apology to user."""

    def escape(s):
        """
        Escape special characters.

        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [
            ("-", "--"),
            (" ", "-"),
            ("_", "__"),
            ("?", "~q"),
            ("%", "~p"),
            ("#", "~h"),
            ("/", "~s"),
            ('"', "''"),
        ]:
            s = s.replace(old, new)
        return s

    return render_template("apology.html", top=code, bottom=message), code


def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function


def lookup(q, type):
    """Look up song and album info."""
    
    limit = 5
    offset = 0
    
    # Query API
    try:
        info_dicts = []
        track_list = []

        if type == "song":
            results = sp.search(q=q, type="track", limit=limit, offset=offset, market="US")
        elif type == "album":
            results = sp.search(q=q, type="album", limit=limit, offset=offset, market="US")
        else:
            results = None
        
        results_dict = json.loads(json.dumps(results, sort_keys=True, indent=4))

        for result in results_dict["tracks"]["items"]:

            if type == "song":

                track = result
                

                track_list.append(track)
            
            elif type == "album":

                album_info = {}
                album_info["album_name"] = result["name"]
                album_info["artist_name"] = result["artists"][0]["name"]
                album_info["album_art"] = result["album"]["images"][0]["url"]

                info_dicts.append(album_info)

        return track_list
            
    except (KeyError, IndexError, requests.RequestException, ValueError):
        return None

