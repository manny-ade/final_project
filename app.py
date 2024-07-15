import os
import sys
import json


from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from helpers import apology, login_required, lookup, return_track, return_album, get_current_time
from werkzeug.security import check_password_hash, generate_password_hash

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///songdiary.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    if request.method == "GET":
        return render_template("index.html")


@app.route("/search", methods=["GET", "POST"])
@login_required
def search():
    """Search for a song or album"""
    if request.method == "POST":


        if not request.args.get("query"):
            return apology("must provide query", 400)

        elif not request.args.get("query_type"):
            return apology("must provide search type", 400)

        else:
            query = request.args.get("query")
            query_type = request.args.get("query_type")

            if query == '' or query == None:

                return apology("must provide query", 400)
            
            elif query_type == '' or query_type == None:

                return apology("must provide search type", 400)
            
            elif query_type != "song" and query_type != "album":

                return apology("must provide valid search type", 400)

            else:

                print("About to call lookup")
                query_return = lookup(query, query_type)

                if query_return != None:
                    return jsonify(query_return)
                else:
                    print(query_return)
                    return apology("no results found", 400)

    if request.method == "GET":
        return render_template("search.html")

@app.route("/add", methods=["GET", "POST"])
@login_required
def add():
    """Add a new song or album"""
    if request.method == "POST":
        
       if not request.args.get("query"):
            return apology("must provide query", 400)
       elif not request.args.get("query_type"):
            return apology("must provide search type", 400)           

       else:
            query = request.args.get("query")
            query_type = request.args.get("query_type")

            if query == '' or query == None:

                return apology("must provide query", 400)
            
            elif query_type == '' or query_type == None:

                return apology("must provide search type", 400)
            
            elif query_type != "song" and query_type != "album":

                return apology("must provide valid search type", 400)

            else:

                print("About to call lookup")
                query_return = lookup(query, query_type)

                if query_return != None:
                    return jsonify(query_return)
                else:
                    print(query_return)
                    return apology("no results found", 400)
        

    else:
        if request.method == "GET":
            return render_template("add.html")
        
@app.route("/add_music", methods=["GET", "POST"])
@login_required
def add_music():
    if request.method == "POST":
        
        data = request.get_json()
        
        query_type = data["query_type"]

        if query_type != "song" and query_type != "album":

            return jsonify({"status": "error", "message": "Music type could not be identified. Please try again."})
        
        elif query_type == '' or query_type == None:

            return jsonify({"status": "error", "message": "Music type could not be identified. Please try again."})
        
        elif query_type == "song":

            track_id = data["track_id"]

            if track_id == "" or track_id == None:

                return jsonify({"status": "error", "message": "Track could not be identified. Please try again."})
            
            else:

                print(track_id)
                print(query_type)
                track_info = return_track(track_id)
                add_timestamp = get_current_time()  

                if track_info == None:
                    return jsonify({"status": "error", "message": "Could not add song. Please try again."})

                else:
                    artists_artistnames = [row["artist_name"] for row in db.execute("SELECT artist_name FROM artists")]
                    if track_info["artist"] in artists_artistnames:

                        artist_id = db.execute("SELECT artist_id FROM artists WHERE artist_name = ?", track_info["artist"])[0]["artist_id"]
                    
                    else:

                        db.execute("INSERT INTO artists (artist_name, genre, artist_link, artist_image) VALUES (?, ?, ?, ?)",
                                    track_info["artist"], track_info["genre"], track_info["artist_link"], track_info["artist_image"])
                        artist_id = db.execute("SELECT last_insert_rowid()")[0]["last_insert_rowid()"]
                    
                    albums_albumnames = [row["album_name"] for row in db.execute("SELECT album_name FROM albums")]
                    if track_info["album_name"] in albums_albumnames:
                        
                        album_id = db.execute("SELECT album_id FROM albums WHERE album_name = ?", track_info["album_name"])[0]["album_id"]
                    
                    else:

                        db.execute("INSERT INTO albums(album_name, artist_id, genre, release_date, album_link, album_artwork, add_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                   track_info["album_name"], artist_id, track_info["genre"], track_info["release_date"], track_info["album_link"],
                                   track_info["track_artwork"], add_timestamp)
                        album_id = db.execute("SELECT last_insert_rowid()")[0]["last_insert_rowid()"]

                    songs_songnames = [row["song_name"]for row in db.execute("SELECT song_name FROM songs")]
                    if track_info["song_name"] in songs_songnames:

                        song_id = db.execute("SELECT song_id FROM songs WHERE song_name = ?", track_info["song_name"])[0]["song_id"]

                    else:

                        db.execute("INSERT INTO songs(song_name, album_id, artist_id, genre, release_date, song_link, length, explicit_status, song_artwork, add_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                   track_info["song_name"], album_id, artist_id, track_info["genre"], track_info["release_date"], track_info["song_link"],
                                   track_info["length"], track_info["explicit_status"], track_info["song_artwork"], add_timestamp)
                        song_id = db.execute("SELECT last_insert_rowid()")[0]["last_insert_rowid()"]
                    
                    user_id = session["user_id"]

                    if user_id is not None and isinstance(user_id, int):

                        if album_id is not None and isinstance(album_id, int):
                    
                            albums_users_ids = db.execute("SELECT album_id, user_id FROM albums_users WHERE user_id = ? AND album_id = ?",
                                                        user_id, album_id)
                            if albums_users_ids:
                                return jsonify({"status": "info","message": "album already added"})
                            else:
                                db.execute("INSERT INTO albums_users (user_id, album_id) VALUES (?, ?)", user_id, album_id)


                            if song_id is not None and isinstance(song_id, int):

                                songs_users_ids = db.execute("SELECT song_id, user_id FROM songs_users WHERE user_id = ? AND song_id = ?",
                                                            user_id, song_id)
                                if songs_users_ids:
                                    return jsonify({"status": "info", "message": "song already added"})
                                else:
                                    db.execute("INSERT INTO songs_users (user_id, song_id) VALUES (?, ?)", user_id, song_id)

                                song_album_ids = db.execute("SELECT song_id, album_id FROM song_album WHERE song_id = ? AND album_id = ?", 
                                                            song_id, album_id)

                                if song_album_ids:
                                    pass
                                else:
                                    db.execute("INSERT INTO song_album (song_id, album_id) VALUES (?, ?)", song_id, album_id)

                            if artist_id is not None and isinstance(artist_id, int):

                                artists_albums_ids = db.execute("SELECT artist_id, album_id FROM artists_albums WHERE artist_id = ? AND album_id = ?",
                                                            artist_id, album_id)
                                if artists_albums_ids:
                                    pass
                                else:
                                    db.execute("INSERT INTO artists_albums (artist_id, album_id) VALUES (?, ?)", artist_id, album_id)
                    else:
                        return jsonify({"status": "error","message": "user not logged in"})
    
            return jsonify({"status": "success", "message": "Song added to library!"})            
        
        elif query_type == "album":

            album_id = data["album_id"]

            if album_id == "" or album_id == None:

                return jsonify({"status": "error", "message": "Album could not be found. Please try again."})
            
            else:

                print(album_id)
                print(query_type)
                album_info = return_album(album_id)
                add_timestamp = get_current_time()
                
                if album_info is None:
                    return jsonify({"status": "error", "message": "Album could not be found. Please try again."})
                
                else:
                    artists_artistnames = [row["artist_name"] for row in db.execute("SELECT artist_name FROM artists")]
                    if album_info["artist"] in artists_artistnames:

                        artist_id = db.execute("SELECT artist_id FROM artists WHERE artist_name = ?", album_info["artist"])[0]["artist_id"]

                    else:
                        db.execute("INSERT INTO artists (artist_name, genre, artist_link, artist_image) VALUES (?, ?, ?, ?)",
                                    album_info["artist"], album_info["genre"], album_info["artist_link"], album_info["artist_image"])
                        artist_id = db.execute("SELECT last_insert_rowid()")[0]["last_insert_rowid()"]

                    albums_albumnames = [row["album_name"] for row in db.execute("SELECT album_name FROM albums")]
                    if album_info["album_name"] in albums_albumnames:

                        album_id = db.execute("SELECT album_id FROM albums WHERE album_name = ?", album_info["album_name"])[0]["album_id"]
                    
                    else:
                        
                        db.execute("INSERT INTO albums(album_name, artist_id, genre, release_date, album_link, album_artwork, add_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
                                   album_info["album_name"], artist_id, album_info["genre"], album_info["release_date"], album_info["album_link"],
                                   album_info["album_artwork"], add_timestamp)
                        album_id = db.execute("SELECT last_insert_rowid()")[0]["last_insert_rowid()"]            

                    user_id = session["user_id"]

                    if user_id is not None and isinstance(user_id, int):

                        if album_id is not None and isinstance(album_id, int):

                            albums_users_ids = db.execute("SELECT album_id, user_id FROM albums_users WHERE user_id = ? AND album_id = ?",
                                                        user_id, album_id)
                            if albums_users_ids:
                                return jsonify({"status": "info","message": "album already added"})
                            else:
                                db.execute("INSERT INTO albums_users (user_id, album_id) VALUES (?, ?)", user_id, album_id)

                            if artist_id is not None and isinstance(artist_id, int):

                                artists_albums_ids = db.execute("SELECT artist_id, album_id FROM artists_albums WHERE artist_id = ? AND album_id = ?",
                                                            artist_id, album_id)
                                if artists_albums_ids:
                                    pass
                                else:
                                    db.execute("INSERT INTO artists_albums (artist_id, album_id) VALUES (?, ?)", artist_id, album_id)
                    else:
                        return jsonify({"status": "error","message": "user not logged in"})

            return jsonify({"status": "success", "message": "Album added to library!"})
    else:    
        if request.method == "GET":
            return render_template("index.html")

@app.route("/history", methods=["GET"])
@login_required
def history():
    """Show history of transactions"""

    if request.method == "GET":

        return apology("TODO")

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:

        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/password_change", methods=["GET", "POST"])
@login_required
def password_change():
    """Changes user password."""

    if request.method == "POST":

        if not request.form.get("old_password"):

            return apology("Must provide old password", 400)

        elif not request.form.get("new_password"):

            return apology("Must provide new password", 400)

        elif not request.form.get("confirmation"):

            return apology("Must confirm new password", 400)

        old_password = request.form.get("old_password")
        new_password = request.form.get("new_password")
        confirmation = request.form.get("confirmation")

        if old_password == new_password:

            return apology("Old and new passwords must be different", 400)

        else:

            current_hash = db.execute("SELECT hash FROM users WHERE id = ?",
                                      session["user_id"])[0]['hash']

            if not check_password_hash(current_hash, old_password):

                return apology("Incorrect current password", 400)

            elif check_password_hash(current_hash, old_password):

                if confirmation != new_password:

                    return apology("Passwords do not match", 400)

                elif confirmation == new_password:

                    new_hash = generate_password_hash(new_password)

                    try:
                        db.execute("UPDATE users SET hash = ? WHERE id = ?",
                                   new_hash, session["user_id"])

                        if current_hash == new_hash:

                            return apology("Password change failed. Try again", 400)

                        elif current_hash != new_hash:

                            flash("Password successfully changed!")
                            return redirect("/")

                    except ValueError:

                        return apology("Error updating password", 400)

                    except RuntimeError:

                        return apology("Internal server error", 500)

    else:

        if request.method == "GET":

            return render_template("password_change.html")


@app.route("/reset_password", methods=["GET", "POST"])
def reset_password():
    """Resets user password if user forgets."""

    if request.method == "POST":

        if not request.form.get("username"):

            return apology("Must provide username", 400)

        elif not request.form.get("new_password"):

            return apology("Missing new password", 400)

        elif not request.form.get("confirmation"):

            return apology("Must confirm new password", 400)

        username = request.form.get("username")
        new_password = request.form.get("new_password")
        confirmation = request.form.get("confirmation")

        username_info = db.execute("SELECT username FROM users WHERE username = ?", username)

        if not username_info:

            return apology("Username does not exist", 400)

        elif username_info:

            if confirmation != new_password:

                return apology("Passwords do not match", 400)

            elif confirmation == new_password:

                new_hash = generate_password_hash(new_password)

                try:
                    db.execute("UPDATE users SET hash = ? WHERE username = ?", new_hash, username)

                    flash("Password successfully reset!")
                    return redirect("/login")

                except ValueError:

                    return apology("Error updating password", 400)

                except RuntimeError:

                    return apology("Internal server error", 500)
    else:

        if request.method == "GET":

            return render_template("reset_password.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 400)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 400)

        elif not request.form.get("confirmation"):
            return apology("must confirm password", 400)

        elif request.form.get("confirmation") != request.form.get("password"):
            return apology("passwords do not match", 400)

        username = request.form.get("username")
        password = request.form.get("password")

        try:
            rows = db.execute("SELECT * FROM users WHERE username = ?",
                              request.form.get("username"))

            if len(rows) != 0:
                raise Exception("Username already taken")
            else:
                password_hash = generate_password_hash(password)
                db.execute("INSERT INTO users (username, hash) VALUES (?, ?)",
                           username, password_hash)

                rows = db.execute("SELECT * FROM users WHERE username = ?",
                                  request.form.get("username"))
                session["user_id"] = rows[0]["id"]

            flash("Registered!")
            return redirect("/")

        except Exception as e:

            return apology(str(e), 400)

    else:
        return render_template("register.html")
