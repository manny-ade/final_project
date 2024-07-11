import os
import sys
import json

from cs50 import SQL
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup

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

        if not request.form.get("query"):
            return apology("must provide query", 400)
        
        elif not request.form.get("query_type"):
            return apology("must provide search type", 400)
        
        elif request.form.get("query") and request.form.get("query_type"):

            query = request.form.get("query")
            query_type = request.form.get("query_type")
            
            query_return = lookup(query, query_type)
            
            if query_return != None:
                return jsonify(query_return)
            else:
                print(query_return)
                return apology("no results found", 400)
        
    

    if request.method == "GET":
        return render_template("search.html")


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
