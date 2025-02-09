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
    
    limit = 20
    offset = 0
    
    # Query API
    try:
        info_dicts = []

        if type == "song":
            results = sp.search(q=q, type="track", limit=limit, offset=offset, market="US")
            
            # loop through results to build dictionary with relevant info
            for item in results["tracks"]["items"]:
                
                track_dict = {}    

                track_dict["track_id"] = item["id"]
                track_dict["song_name"] = item["name"]
                track_dict["song_link"] = item["external_urls"]["spotify"]
                track_dict["artist_name"] = item["artists"][0]["name"]
                track_dict["artist_id"] = item["artists"][0]["id"]
                track_dict["artist_link"] = item["artists"][0]["external_urls"]["spotify"]
                track_dict["artists"] = {artist['name']: artist['external_urls']['spotify'] for artist in item["artists"]}
                track_dict["album_name"] = item["album"]["name"]
                track_dict["album_link"] = item["album"]["external_urls"]["spotify"]
                track_dict["track_artwork"] = item["album"]["images"][1]["url"]
                track_dict["release_date"] = item["album"]["release_date"]
                track_dict["duration_ms"] = item["duration_ms"]
                
                if item["explicit"] == True:

                    track_dict["explicit_status"] = "explicit"
                
                elif item["explicit"] == False:

                    track_dict["explicit_status"] = "clean"
                
                artist_info = sp.artist(item["artists"][0]["id"])
                genre_list = artist_info["genres"]

                if genre_list == []:

                    track_dict["genre"] = "genre not yet available"
                
                else:
                    track_dict["genre"] = ", ".join(genre_list)

                track_dict["artist_image"] = artist_info["images"][1]["url"]
                
        
                info_dicts.append(track_dict)


        elif type == "album":
            results = sp.search(q=q, type="album", limit=limit, offset=offset, market="US")

            # loop through results to build dictionary with relevant info
            for item in results["albums"]["items"]:
                
                album_dict = {}

                album_dict["album_id"] = item["id"]
                album_dict["album_name"] = item["name"]
                album_dict["album_link"] = item["external_urls"]["spotify"]
                album_dict["album_type"] = item["album_type"]
                album_dict["total_tracks"] = item["total_tracks"]
                album_dict["artist_name"] = item["artists"][0]["name"]
                album_dict["artist_id"] = item["artists"][0]["id"]
                album_dict["artist_link"] = item["artists"][0]["external_urls"]["spotify"]
                album_dict["artists"] = {artist['name']: artist['external_urls']['spotify'] for artist in item["artists"]}
                album_dict["album_artwork"] = item["images"][1]["url"]
                album_dict["album_release_date"] = item["release_date"]
                artist_info = sp.artist(item["artists"][0]["id"])
                album_dict["genre"] = artist_info["genres"]
                album_dict["artist_image"] = artist_info["images"][1]["url"]
               

                info_dicts.append(album_dict)


        else:
            info_dicts.append(results)
        
        return info_dicts
            
    except (KeyError, IndexError, requests.RequestException, ValueError):
        return None

#using the below functions to get track info for adding a track to streamline the process
def return_track(track_id):
    """Returns track info for a given track id"""
    try:
        result = sp.track(track_id, market="US")
        
        track_info = {}
        track_info["song_name"] = result["name"]
        track_info["artist"] = result["artists"][0]["name"]
        track_info["artist_link"] = result["artists"][0]["external_urls"]["spotify"]
        track_info["album_name"] = result["album"]["name"]
        track_info["album_link"] = result["album"]["external_urls"]["spotify"]
        track_info["track_artwork"] = result["album"]["images"][1]["url"]
        track_info["release_date"] = result["album"]["release_date"]
        track_info["song_link"] = result["external_urls"]["spotify"]
        track_info["length"] = result["duration_ms"]
        if result["explicit"] == True:
            track_info["explicit_status"] = "explicit"
        elif result["explicit"] == False:
            track_info["explicit_status"] = "clean"
        track_info["song_artwork"] = result["album"]["images"][1]["url"]

        artist_info = sp.artist(result["artists"][0]["id"])
        
        genre_list = artist_info["genres"]

        if genre_list == []:

            track_info["genre"] = "genre not yet available"
                    
        else:
            
            track_info["genre"] = ", ".join(genre_list)

        track_info["artist_image"] = artist_info["images"][1]["url"]
        

        return track_info

    except (KeyError, IndexError, requests.RequestException, ValueError):
        return None


def return_album(album_id):
    """Returns album info for a given album id"""
    try:
        result = sp.album(album_id, market="US")

        album_info = {}
        album_info["album_name"] = result["name"]
        album_info["artist"] = result["artists"][0]["name"]
        album_info["artist_link"] = result["artists"][0]["external_urls"]["spotify"]
        album_info["release_date"] = result["release_date"]
        album_info["album_link"] = result["external_urls"]["spotify"]
        album_info["album_type"] = result["album_type"]
        album_info["total_tracks"] = result["total_tracks"]
        album_info["album_artwork"] = result["images"][1]["url"]

        artist_info = sp.artist(result["artists"][0]["id"])
        genre_list = artist_info["genres"]
        if genre_list == []:

            album_info["genre"] = "genre not yet available"
        
        else:
            album_info["genre"] = ", ".join(genre_list)

        album_info["artist_image"] = artist_info["images"][1]["url"]
        
        return album_info

    except (KeyError, IndexError, requests.RequestException, ValueError):
        return None

def get_current_time():
    """Returns current timestamp for SQL insertion."""

    pure_time = datetime.datetime.now()

    current_timestamp = pure_time.strftime("%Y-%m-%d %H:%M:%S")

    return current_timestamp