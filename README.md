# SongDiary
#### Video Demo:  <URL HERE>
#### Description:

SongDiary is a Flask web application that allows someone to keep track of songs or albums and whether or not they’ve listened to them. The application also allows users to make notes about the songs and albums in their collection, as well as see a history of their collection curation. This web app uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api) through the [Spotipy Python library](https://spotipy.readthedocs.io/) for obtaining music and artist data. The main framework of the application is built on Python/Flask, HTML, CSS, and Javascript (the CSS and JavaScript include [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/), [jQuery](https://jquery.com/), and [Toastr](https://codeseven.github.io/toastr/)’s libraries).

Music has always been a huge part of my life, and I figured it might be a good challenge to try and make something to help me keep track of songs and albums I want to listen to. I wasn’t sure what to do for my final project, but I was inspired to go down this route after seeing [Scott Vaudreuil’s iMusicDb](https://www.youtube.com/watch?v=1PyEmbY7vI0) project in the gallery of final projects.

#### Files and functions
*I adapted the structure of my Finance solution as a base and added/changed files and functions as I went along in the interest of time and streamlining things.*

#### 1. helpers.py 
This file was one of the most important, as it was the one responsible for pulling data from the Spotify Web API using the Spotipy library, as well as other important information. This was where I spent a good chunk of time learning how to gain access to the API's data and how to perform searches and data pulls. This file helped make sure that app.py wasn't any longer than it ended up being by the time I reached a satisfactory point with the project.

#### 2. add.html and search.html

Add Page (search and results)

![Screenshot of add page on the SongDiary app.](final_project/doc_images/Screenshot_26-7-2024_18932_127.0.0.1.jpeg)
![Screenshot of add results on the SongDiary app.](final_project/doc_images/Screenshot-2024-07-26-235751.jpeg)

Search Page (search and results)

![Screenshot of search page on the SongDiary app.](final_project/doc_images/Screenshot_26-7-2024_18949_127.0.0.1.jpeg)
![Screenshot of search results on the SongDiary app.](final_project/doc_images/Screenshot_26-7-2024_235715_127.0.0.1.jpeg)

These HTML files both served as pages to display the results of a search query-- the only difference between the two was that add (as the name suggests) included the ability to add a song or album to the user's library. The next two files were **_essential_** in making sure that the functionality of these pages worked as I intended for them to.


#### 3. script.js and script2.js
At some point when writing the JavaScript code for the application, I ran into a problem where for some reason I was unable to fit any more code inside the event listeners I was using or even the first script file itself without running into a wall where the code's functionality wouldn't register. I then decided to create a second script file. The first JavaScript file handles dynamically displaying the results of a search, and the second handles the appearance and behavior of the modal box and its buttons. I had to learn about toastr and jQuery for showing notifications as well as the Fetch API for sending data between the page and the Flask server -- it did get frustrating sometimes, but it was really cool and satisfying to see it work! 

#### 4. index.html 

![Screenshot of homepage/index page on the SongDiary app.](final_project/doc_images/Screenshot_26-7-2024_175015_127.0.0.1.jpeg)

One of the things I was most excited about making work was the index page -- and it happened to be perhaps the most difficult thing. I used Jinja instead of dynamically generating the cards in JavaScript (which turned out to be a much more robust choice anyway!), and I had to consult Bootstrap's card documentation to get it to display four cards for the width of the screen. One of the quirks I'll have to work on in the future may be to figure out how to get the flex to look more elegant when resizing a window but for the most part, the cards worked well! Making the JavaScript to get the modal to show up and allow the features within it to work took a lot of effort and a lot of questions (thanks, Duck 😂), but thankfully I got it to work well and get the functionality for displaying/adding notes and the functionality for deleting a song or album to work too.

#### 5. history.html
![Screenshot of homepage/index page on the SongDiary app.](final_project/doc_images/Screenshot_26-7-2024_17515_127.0.0.1.jpeg)

The history page was also something I adapted from my Finance solution -- thankfully the query to obtain a user's history of curating their collection wasn't too bad, but it required me to create a history table in my database that stored the time a song or album was added to a user's library. 



Speaking of databases...

#### 6. songdiary.db

This is perhaps the most important element of the project -- some of the most time consuming parts of making this all work together was figuring out what tables to create and what queries to craft and execute in order to make sure that data from the API was successfully being entered into the database, and that the appropriate relationships were being formed. Once again, I must thank Duck for suggesting and helping me think through what the structure of the database needed to be, as well as offering help and clarifying things when I needed to pivot or adjust queries in the backend. Namely, the creation of junction tables was **_key_** (ba-dum, tshhh) to making sure that data could be referenced from one place to another, especially so that particular queries could be pulled off and that specifically, each user would have their particular library specified by the songs_users and albums_users tables, respectively. At first I was overthinking how the deletions would work, but since the junction tables existed, I realized I could keep the main records of the songs and albums and not have to delete them, which would have posed issues for the history table. 

Database structure as shown in SQLiteBrowser:
![Database structure in SQLiteBrowser](final_project/doc_images/Screenshot-2024-07-27-005616.jpeg)

songs_users junction table:

![Database structure in SQLiteBrowser](final_project/doc_images/Screenshot-2024-07-27-005905.jpeg)

albums_users junction table:

![Database structure in SQLiteBrowser](final_project/doc_images/Screenshot-2024-07-27-010315.jpeg)

History table:
![Database structure in SQLiteBrowser](final_project/doc_images/Screenshot-2024-07-27-010444.jpeg)

#### 7. app.py (and other miscellaneous)

Last but certainly not least, app.py was the main Python file that the Flask app ran on.As mentioned before, a few of the routes from my Finance solution remained the same in the interest of time and streamlining the development process -- but I added routes for each of the page. Funny enough, I ended up creating auxiliary/assisting routes that were only accessible through event listeners for doing things like dynamically updating/displaying information on a page, or for receiving data necessary for performing backend queries to update the user's library. Adding music ended up being much more complex and lengthy than deleting (which makes sense in hindsight), but it was satisfying to finally get the function to work solidly.

For other files like styles.css, I used it in case I wanted to override the automatic styling Bootstrap chose to do or set the appearance of certain elements to make the user experience less jittery; one example was me setting the width of the cards to the same width as a medium sized photo of the artwork for a song/album provided by Spotify, so as to keep the card images around the same size.

I also created a favicon for the webapp to add a bit of flair:

![SongDiary favicon; a notepad with a pen on top of a white eighth note against a teal/blue background](final_project/static/favicon_io/android-chrome-192x192.png)


### Conclusion
All in all, I'm extremely grateful for the opportunity I had to take on this project -- I wanted to challenge myself, and although it took many twists and turns and there were definitely times where I felt things were impossible (including some technical difficulties, aka forgetting to initialize a repo on GitHub and some other unfortunate hardware mishaps 😂), I made something I'm proud of (and something that's actually going to be useful to me). Although there are definitely refinements I can make and other features I could add, I'm glad I made a functional web application. I wanted to prove to myself that I had what it took to make it through a computer science course and make a project I was proud of, and I'm extremely grateful for the chance to do so. I'm not sure if I'll ever scale this project to something bigger, but who knows? 

This was SongDiary. Thank you to the CS50 staff, CS50 Duck 😂, and the CS50 community for giving me the courage and motivation to accomplish this!

### Resources that Helped me/Tools/Libraries Used:

* [Spotipy Documentation Website](https://spotipy.readthedocs.io/)
* [CS50.ai](https://cs50.ai)
* [Spotify Web API documentation](https://developer.spotify.com/documentation/web-api)
* [Bootstrap documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* [jQuery](https://jquery.com/)
* [Toastr for JavaScript](https://codeseven.github.io/toastr/)
* [Adding Popup box / Modal in a website using Bootstrap](https://www.youtube.com/watch?v=GUrIrbgFmG0)
* [Controlling Bootstrap Modal using Javascript or jQuery](https://www.youtube.com/watch?v=YHEeQVOMbig&t=27s)
* [How to Create Toast Notifications (or Popups) - HTML, CSS & JavaScript Tutorial](https://www.youtube.com/watch?v=JshGYylra5o&t=286s)
* [Spotipy Tutorial Series: A Lightweight Python Spotify Library](https://www.youtube.com/playlist?list=PLqgOPibB_QnzzcaOFYmY2cQjs35y0is9N)
* [JavaScript Promises In 10 Minutes](https://www.youtube.com/watch?v=DHvZLI7Db8E)
* [JavaScript ES6 Arrow Functions Tutorial](https://www.youtube.com/watch?v=h33Srr5J9nY)
* [JavaScript Async Await](https://www.youtube.com/watch?v=V_Kr9OSfDeU)
* [Learn Fetch API in 6 Minutes](https://www.youtube.com/watch?v=cuEtnrL9-H0)
* [CS50x 2024 - Lecture 8 - HTML, CSS, JavaScript](https://youtu.be/ciz2UaifaNM?si=3khdDgjR1HaGMfBT)
* [CS50x 2024 - Lecture 9 - Flask](https://www.youtube.com/watch?v=-aqUek49iL8)
* [Professor Malan suggesting SQLiteBrowser](https://www.reddit.com/r/cs50/comments/ccjjmu/comment/etpqv8x/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)
* [SQLiteBrowser itself 😂](https://sqlitebrowser.org/)


