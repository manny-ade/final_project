    document.addEventListener('DOMContentLoaded', function() {

    var search_form = document.getElementById('search_form');
    var search_header = document.getElementById('search_header');
    var search_instruction = document.getElementById('search_instruction');
    var search_tip1 = document.getElementById('search_tip1');
    var new_search = document.getElementById('new_search');

    search_form.addEventListener('submit', function(event) {
    
        event.preventDefault();
        var search_error = document.getElementById('search_error');
        search_error.style.display = 'none';
        var query = document.getElementById('query');
        var query_type = document.querySelector('input[name="query_type"]:checked');
    
        if (query === null || query_type === null) {
            event.preventDefault();
            search_error.textContent = 'You must enter both a query and a query type.';
            search_error.style.color = 'red';
            search_error.style.display = 'block';
        } else if (query.value === '' || query.value.trim() === '') {
            event.preventDefault();
            search_error.textContent = 'Your query cannot be empty.';
            search_error.style.color = 'red';
            search_error.style.display = 'block';
        } else if (query_type.value === '' || query_type.value.trim() === '') {
            event.preventDefault();
            search_error.textContent = 'You must select a valid query type.';
            search_error.style.color = 'red';
            search_error.style.display = 'block';
        } else if (query_type.value !== 'song' && query_type.value !== 'album') {
            event.preventDefault();
            search_error.textContent = 'You must select a valid query type.';
            search_error.style.color = 'red';
            search_error.style.display = 'block';
        } else {

            search_error.style.display = 'none';
            var url = '/search?query=' + query.value + '&query_type=' + query_type.value;

            fetch(url, {
                method: 'POST',
              })
              .then(response => response.json()) // parse the response to JSON
              .then(data => {
                // handle the data from the response here
                
                var search_content = document.getElementById('search');
                
                if (data === null) {
                    if (typeof toastr !== 'undefined'){
                    
                        if ('status' in data && 'message' in data) {
                            if(data.status == 'error') {
                                event.preventDefault();
                                toastr.error("Error", data.message);
                            } 
                        } else {
                            console.log("Error: toastr not defined");
                        }
                    } 
                } else {

                    search_header.style.display = 'none';
                    search_instruction.style.display = 'none';
                    search_tip1.style.display = 'none';
                    search_form.style.display = 'none';

                    var resultsHeading = document.createElement('h2');
                    var searchSpacer = document.createElement('br');
                    resultsHeading.classList.add('search-heading');
                    searchSpacer.classList.add('search-heading-spacer');
                    resultsHeading.textContent = 'Search Results';
                    resultsHeading.style.display = 'block';
                    search_content.appendChild(resultsHeading);

                    var resultsTable = document.createElement('table');
                    resultsTable.classList.add('table');
                    resultsTable.classList.add('table-striped');

                    if (query_type.value == 'song'){
                        
                        var resultsTableHeader= document.createElement('thead');
                        var resultsTableHeaderRow = document.createElement('tr');
                        var resultsTableBody = document.createElement('tbody');
                        var resultsSong = document.createElement('th');
                        resultsSong.classList.add('text-start');
                        resultsSong.textContent = 'Song';
                        resultsTableHeaderRow.appendChild(resultsSong);
                        var resultsArtist = document.createElement('th');
                        resultsArtist.classList.add('text-start');
                        resultsArtist.textContent = 'Artist';
                        resultsTableHeaderRow.appendChild(resultsArtist);
                        var resultsAlbum = document.createElement('th');
                        resultsAlbum.classList.add('text-start');
                        resultsAlbum.textContent = 'Album';
                        resultsTableHeaderRow.appendChild(resultsAlbum);
                        var resultsRelease = document.createElement('th');
                        resultsRelease.classList.add('text-start');
                        resultsRelease.textContent = 'Release Date';
                        resultsTableHeaderRow.appendChild(resultsRelease);
                        var resultsListen = document.createElement('th');
                        resultsListen.textContent = 'Listen';
                        resultsTableHeaderRow.appendChild(resultsListen);
                        resultsTableHeader.appendChild(resultsTableHeaderRow); 
                        resultsTable.appendChild(resultsTableHeader); 

                        for (let item of data) {
                        
                            var resultsTableRow = document.createElement('tr');
                            var resultsSongName = document.createElement('td');
                            resultsSongName.classList.add('text-start');
                            resultsSongName.textContent = item.song_name;
                            resultsTableRow.appendChild(resultsSongName);
                            var resultsArtistName = document.createElement('td');
                            resultsArtistName.classList.add('text-start');
                            var resultsArtistLink = document.createElement('a');
                            resultsArtistLink.href = item.artist_link;
                            resultsArtistLink.textContent = item.artist_name;
                            resultsArtistLink.target = '_blank';
                            resultsArtistName.appendChild(resultsArtistLink);
                            resultsTableRow.appendChild(resultsArtistName);
                            var resultsAlbumName = document.createElement('td');
                            resultsAlbumName.classList.add('text-start');
                            resultsAlbumName.textContent = item.album_name;
                            resultsTableRow.appendChild(resultsAlbumName);
                            var resultsReleaseDate = document.createElement('td');
                            resultsReleaseDate.classList.add('text-start');
                            resultsReleaseDate.textContent = item.release_date;
                            resultsTableRow.appendChild(resultsReleaseDate);
                            var resultsSongLink = document.createElement('td');
                            var resultsSongLinkAnchor = document.createElement('a');
                            resultsSongLinkAnchor.href = item.song_link;
                            resultsSongLinkAnchor.textContent = 'Link';
                            resultsSongLinkAnchor.target = '_blank';
                            resultsSongLink.appendChild(resultsSongLinkAnchor);
                            resultsTableRow.appendChild(resultsSongLink);
                            resultsTableBody.appendChild(resultsTableRow); 

                            

                    }

                } else if (query_type.value == 'album'){
                    
                    var resultsTableHeader= document.createElement('thead');
                    var resultsTableHeaderRow = document.createElement('tr');
                    var resultsAlbum = document.createElement('th');
                    var resultsTableBody = document.createElement('tbody');
                    resultsAlbum.classList.add('text-start');
                    resultsAlbum.textContent = 'Album';
                    resultsTableHeaderRow.appendChild(resultsAlbum);
                    var resultsArtist = document.createElement('th');
                    resultsArtist.classList.add('text-start');
                    resultsArtist.textContent = 'Artist';
                    resultsTableHeaderRow.appendChild(resultsArtist);
                    var resultsRelease = document.createElement('th');
                    resultsRelease.classList.add('text-start');
                    resultsRelease.textContent = 'Release Date';
                    resultsTableHeaderRow.appendChild(resultsRelease);
                    var resultsListen = document.createElement('th');
                    resultsListen.classList.add('text-start');
                    resultsListen.textContent = 'Listen';
                    resultsTableHeaderRow.appendChild(resultsListen);
                    resultsTableHeader.appendChild(resultsTableHeaderRow); 
                    resultsTable.appendChild(resultsTableHeader);

                    for (let item of data) {
                    
                        var resultsTableRow = document.createElement('tr');
                        var resultsAlbumName = document.createElement('td');
                        resultsAlbumName.textContent = item.album_name;
                        resultsAlbumName.classList.add('text-start');
                        resultsTableRow.appendChild(resultsAlbumName);
                        var resultsArtistName = document.createElement('td');
                        resultsArtistName.classList.add('text-start');
                        var resultsArtistLink = document.createElement('a');
                        resultsArtistLink.href = item.artist_link;
                        resultsArtistLink.textContent = item.artist_name;
                        resultsArtistLink.target = '_blank';
                        resultsArtistName.appendChild(resultsArtistLink);
                        resultsTableRow.appendChild(resultsArtistName);
                        var resultsReleaseDate = document.createElement('td');
                        resultsReleaseDate.textContent = item.album_release_date;
                        resultsReleaseDate.classList.add('text-start');
                        resultsTableRow.appendChild(resultsReleaseDate);
                        var resultsAlbumLink = document.createElement('td');
                        var resultsAlbumLinkAnchor = document.createElement('a');
                        resultsAlbumLink.classList.add('text-start');
                        resultsAlbumLinkAnchor.href = item.album_link;
                        resultsAlbumLinkAnchor.textContent = 'Link';
                        resultsAlbumLinkAnchor.target = '_blank';
                        resultsAlbumLink.appendChild(resultsAlbumLinkAnchor);
                        resultsTableRow.appendChild(resultsAlbumLink);
                        resultsTableBody.appendChild(resultsTableRow);
                    }
                }
                }
                

            if (typeof toastr !== 'undefined'){
                    
                if ('status' in data && 'message' in data) {
                    if (data.status == 'success') {
                        toastr.success("Success", data.message);
                    } else if(data.status == 'error') {
                        toastr.error("Error", data.message);
                    } else if(data.status == 'warning') {
                        toastr.warning("Warning", data.message);
                    } else if (data.status == 'info') {
                        toastr.info("Info", data.message);
                    }
                } else {
                    console.log("Error: toastr not defined");
                }
            } 
                resultsTable.appendChild(resultsTableBody);
                search_content.appendChild(resultsTable);
                new_search.style.display = 'block';
                new_search.addEventListener('click', () => {

                    new_search.style.display = 'none';
                    resultsHeading.style.display = 'none';
                    resultsTable.style.display = 'none';
                    search_form.reset();
                    search_header.style.display = 'block';
                    search_instruction.style.display = 'block';
                    search_tip1.style.display = 'block';
                    search_form.style.display = 'block';
                    

                })
            })
              .catch(error => {
                // handle any errors here
                console.log(error);
                toastr.error("Error", "Internal error. Please try again with a different query.");
                toastr.info("Info", "Adding the artist's name may help.");
                new_search.style.display = 'block';
                new_search.addEventListener('click', () => {

                    new_search.style.display = 'none';
                    search_form.reset();
                    search_header.style.display = 'block';
                    search_instruction.style.display = 'block';
                    search_tip1.style.display = 'block';
                    search_form.style.display = 'block';
                    var searchResultsHeading = document.getElementsByClassName('search-heading');
                    var searchHeadingSpacer = document.getElementsByClassName('search-heading-spacer');

                    for (let heading of searchResultsHeading) {

                        heading.style.display = 'none';
                        heading.remove();
                    }

                    for(let spacer of searchHeadingSpacer) {

                        spacer.style.display = 'none';
                        spacer.remove();
                    }
                })
              });


        }
    
    });

});

var add_form = document.getElementById('add_form');
var add_header = document.getElementById('add_header');
var add_instruction = document.getElementById('add_instruction');
var add_tip1 = document.getElementById('add_tip1');
var new_add = document.getElementById('new_add');

add_form.addEventListener('submit', function(event) {
    
    event.preventDefault();
    var add_error = document.getElementById('add_search_error');
    add_error.style.display = 'none';
    var add_query = document.getElementById("add_query");
    var add_query_type = document.querySelector('input[name="query_type2"]:checked');
    
    if (add_query === null || add_query_type === null) {
        event.preventDefault();
        add_error.textContent = 'You must enter both a query and a query type.';
        add_error.style.color = 'red';
        add_error.style.display = 'block';
    } else if (add_query.value === '' || add_query.value.trim() === '') {
        event.preventDefault();
        add_error.textContent = 'You must enter a query.';
        add_error.style.color = 'red';
        add_error.style.display = 'block';
    } else if (add_query_type.value === '' || add_query_type.value.trim() === '') {
        event.preventDefault();
        add_error.textContent = 'You must enter a query type.';
        add_error.style.color = 'red';
        add_error.style.display = 'block';
    } else if (add_query_type.value !== 'song' && add_query_type.value !== 'album') {
        event.preventDefault();
        add_error.textContent = 'Query type must be either "song" or "album".';
        add_error.style.color = 'red';
        add_error.style.display = 'block';
    } else {

        add_error.style.display = 'none';
        var url = '/add?query=' + add_query.value + '&query_type=' + add_query_type.value;

        fetch(url, {
            method: 'POST',
          })
            .then(response => response.json()) // parse the response to JSON
            .then(data => {
                // do something with the data
                console.log(data);
                
                var add_content = document.getElementById('add');
                if (data === null || data.length === 0) {

                    event.preventDefault();
                    toastr.error("Error", "No results found. Please try again.");

                    } else {
                        
                        add_header.style.display = 'none';
                        add_instruction.style.display = 'none';
                        add_tip1.style.display = 'none';
                        add_form.style.display = 'none';

                        var resultsHeading = document.createElement('h2');
                        var heading_spacer = document.createElement('br');
                        resultsHeading.textContent = 'Add Songs/Albums';
                        resultsHeading.style.display = 'block';
                        resultsHeading.classList.add('add-heading');
                        heading_spacer.classList.add('add-heading-spacer');
                        add_content.appendChild(resultsHeading);
                        add_content.appendChild(heading_spacer);

                        var resultsTable = document.createElement('table');
                        resultsTable.classList.add('table');
                        resultsTable.classList.add('table-striped');

                        if (add_query_type.value == 'song'){

                            var resultsTableHeader= document.createElement('thead');
                            var resultsTableHeaderRow = document.createElement('tr');
                            var resultsTableBody = document.createElement('tbody');
                            var resultsSong = document.createElement('th');
                            resultsSong.classList.add('text-start');
                            resultsSong.textContent = 'Song';
                            resultsTableHeaderRow.appendChild(resultsSong);
                            var resultsArtist = document.createElement('th');
                            resultsArtist.classList.add('text-start');
                            resultsArtist.textContent = 'Artist';
                            resultsTableHeaderRow.appendChild(resultsArtist);
                            var resultsAlbum = document.createElement('th');
                            resultsAlbum.classList.add('text-start');
                            resultsAlbum.textContent = 'Album';
                            resultsTableHeaderRow.appendChild(resultsAlbum);
                            var resultsRelease = document.createElement('th');
                            resultsRelease.classList.add('text-start');
                            resultsRelease.textContent = 'Release Date';
                            resultsTableHeaderRow.appendChild(resultsRelease);
                            var resultsListen = document.createElement('th');
                            resultsListen.textContent = 'Add';
                            resultsTableHeaderRow.appendChild(resultsListen);
                            resultsTableHeader.appendChild(resultsTableHeaderRow); 
                            resultsTable.appendChild(resultsTableHeader);
                            
                            for (let item of data) {
                        
                                var resultsTableRow = document.createElement('tr');
                                var resultsSongName = document.createElement('td');
                                resultsSongName.classList.add('text-start');
                                resultsSongName.textContent = item.song_name;
                                resultsTableRow.appendChild(resultsSongName);
                                var resultsArtistName = document.createElement('td');
                                resultsArtistName.classList.add('text-start');
                                var resultsArtistLink = document.createElement('a');
                                resultsArtistLink.href = item.artist_link;
                                resultsArtistLink.textContent = item.artist_name;
                                resultsArtistLink.target = '_blank';
                                resultsArtistName.appendChild(resultsArtistLink);
                                resultsTableRow.appendChild(resultsArtistName);
                                var resultsAlbumName = document.createElement('td');
                                resultsAlbumName.classList.add('text-start');
                                resultsAlbumName.textContent = item.album_name;
                                resultsTableRow.appendChild(resultsAlbumName);
                                var resultsReleaseDate = document.createElement('td');
                                resultsReleaseDate.classList.add('text-start');
                                resultsReleaseDate.textContent = item.release_date;
                                resultsTableRow.appendChild(resultsReleaseDate);
                                var resultsAdd = document.createElement('td');
                                var resultsAddButton = document.createElement('button');
                                resultsAddButton.classList.add('btn');
                                resultsAddButton.classList.add('btn-primary');
                                resultsAddButton.textContent = 'Add';
                                var url = '/add_music?track_id=' + item.track_id + '&query_type=' + add_query_type.value;
                                resultsAddButton.addEventListener('click', function() {
                                    fetch(url, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            
                                            track_id: item.track_id,
                                            query_type: add_query_type.value
                                        })
                                    })
                                    .then(response => response.json()) // parse the response to JSON
                                    .then(data => {
                                        
                                        console.log(data);
                                        if ('status' in data && 'message' in data) {
                                            
                                            if (typeof toastr !== 'undefined'){

                                                if(data.status == 'success'){
                                                
                                                    toastr.success("Success", data.message);
            
                                                } else if(data.status == 'error'){
            
                                                    toastr.error("Error", data.message);
                                                } else if(data.status == 'warning'){
            
                                                    toastr.warning("Warning", data.message);
                                                } else if (data.status == 'info'){
            
                                                    toastr.info("Info", data.message);
                                                }
                                            } else {
                                                console.log("Error: toastr not defined");
                                            }
                                        }
                                    })
                                    .catch(error => {
                                        // handle any errors here
                                        console.log(error);
                                        toastr.error("Error", "Something went wrong. Please try again with a different query.");
                                        new_add.style.display = 'block';
                                        new_add.addEventListener('click', () => {
                                        
                                            new_add.style.display = 'none';
                                            add_form.style.display = 'block';
                                            add_form.reset();
                                            add_header.style.display = 'block';
                                            add_instruction.style.display = 'block';
                                            add_tip1.style.display = 'block';
                                            add_form.style.display = 'block';
                                        
                                        
                                        });

                                    });
                                })
                                resultsAdd.appendChild(resultsAddButton);
                                resultsTableRow.appendChild(resultsAdd);

                                resultsTableBody.appendChild(resultsTableRow);

                            }

                    } else if (add_query_type.value == 'album'){

                        var resultsTableHeader= document.createElement('thead');
                        var resultsTableHeaderRow = document.createElement('tr');
                        var resultsAlbum = document.createElement('th');
                        var resultsTableBody = document.createElement('tbody');
                        resultsAlbum.classList.add('text-start');
                        resultsAlbum.textContent = 'Album';
                        resultsTableHeaderRow.appendChild(resultsAlbum);
                        var resultsArtist = document.createElement('th');
                        resultsArtist.classList.add('text-start');
                        resultsArtist.textContent = 'Artist';
                        resultsTableHeaderRow.appendChild(resultsArtist);
                        var resultsRelease = document.createElement('th');
                        resultsRelease.classList.add('text-start');
                        resultsRelease.textContent = 'Release Date';
                        resultsTableHeaderRow.appendChild(resultsRelease);
                        var resultsListen = document.createElement('th');
                        resultsListen.classList.add('text-start');
                        resultsListen.textContent = 'Add';
                        resultsTableHeaderRow.appendChild(resultsListen);
                        resultsTableHeader.appendChild(resultsTableHeaderRow); 
                        resultsTable.appendChild(resultsTableHeader);


                        for (let item of data) {
                            var resultsTableRow = document.createElement('tr');
                            var resultsAlbumName = document.createElement('td');
                            resultsAlbumName.textContent = item.album_name;
                            resultsAlbumName.classList.add('text-start');
                            resultsTableRow.appendChild(resultsAlbumName);
                            var resultsArtistName = document.createElement('td');
                            resultsArtistName.classList.add('text-start');
                            var resultsArtistLink = document.createElement('a');
                            resultsArtistLink.href = item.artist_link;
                            resultsArtistLink.textContent = item.artist_name;
                            resultsArtistLink.target = '_blank';
                            resultsArtistName.appendChild(resultsArtistLink);
                            resultsTableRow.appendChild(resultsArtistName);
                            var resultsReleaseDate = document.createElement('td');
                            resultsReleaseDate.textContent = item.album_release_date;
                            resultsReleaseDate.classList.add('text-start');
                            resultsTableRow.appendChild(resultsReleaseDate);
                            var resultsAlbumAdd = document.createElement('td');
                            var resultsAlbumAddButton = document.createElement('button');
                            resultsAlbumAddButton.classList.add('btn');
                            resultsAlbumAddButton.classList.add('btn-primary');
                            resultsAlbumAddButton.textContent = 'Add';
                            var url = '/add_music?album_id=' + item.album_id + '&query_type=' + add_query_type.value;
                            resultsAlbumAddButton.addEventListener('click', function() {
                                fetch(url, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        
                                        album_id: item.album_id,
                                        query_type: add_query_type.value
                                    })
                                })
                                .then(response => response.json()) // parse the response to JSON
                                .then(data => {
                                    console.log(data);
                                    if ('status' in data && 'message' in data) {

                                        if (typeof toastr !== 'undefined'){

                                            if(data.status == 'success'){
                                            
                                                toastr.success("Success", data.message);
        
                                            } else if(data.status == 'error'){
        
                                                toastr.error("Error", data.message);
                                            } else if(data.status == 'warning'){
        
                                                toastr.warning("Warning", data.message);
                                            } else if (data.status == 'info'){
        
                                                toastr.info("Info", data.message);
                                            }

                                    } else {
                                        console.log("Error: toastr not defined");
                                    }                                
                                }
                            })
                                .catch(error => {
                                    // handle any errors here
                                    console.log(error);
                                    toastr.error("Error", "Something went wrong. Please try again with a different query.");
                                        new_add.style.display = 'block';
                                        new_add.addEventListener('click', () => {
                                        
                                            new_add.style.display = 'none';
                                            add_form.style.display = 'block';
                                            add_form.reset();
                                            add_header.style.display = 'block';
                                            add_instruction.style.display = 'block';
                                            add_tip1.style.display = 'block';
                                            add_form.style.display = 'block';
                                        
                                        });

                                });
                            })
                            resultsAlbumAdd.appendChild(resultsAlbumAddButton);
                            resultsTableRow.appendChild(resultsAlbumAdd);

                            resultsTableBody.appendChild(resultsTableRow);
                        }
                    }
                        }
                    

                    if (typeof toastr !== 'undefined'){
                        
                        if ('status' in data && 'message' in data) {
                            if (data.status == 'success') {
                                toastr.success("Success", data.message);
                            } else if(data.status == 'error') {
                                toastr.error("Error", data.message);
                            } else if(data.status == 'warning') {
                                toastr.warning("Warning", data.message);
                            } else if (data.status == 'info') {
                                toastr.info("Info", data.message);
                            }
                        } else {
                            console.log("Error: toastr not defined");
                        }
                    } 

                        resultsTable.appendChild(resultsTableBody);
                        add_content.appendChild(resultsTable);
                        new_add.style.display = 'block';
                        new_add.addEventListener('click', () => {

                            new_add.style.display = 'none';
                            resultsHeading.style.display = 'none';
                            resultsTable.style.display = 'none';
                            add_form.reset();
                            add_header.style.display = 'block';
                            add_instruction.style.display = 'block';
                            add_tip1.style.display = 'block';
                            add_form.style.display = 'block';


                    })             

                })
                .catch(error => {
                    // handle any errors here
                    console.log(error);
                    toastr.error("Error", "Something went wrong. Please try again with a different query.");
                    toastr.info("Info", "Adding the artist's name may help.");

                    new_add.style.display = 'block';
                    new_add.addEventListener('click', () => {
                    
                        new_add.style.display = 'none';
                        add_form.style.display = 'block';
                        add_form.reset();
                        add_header.style.display = 'block';
                        add_instruction.style.display = 'block';
                        add_tip1.style.display = 'block';
                        add_form.style.display = 'block';
                        var addresultsHeading = document.getElementsByClassName('add-heading');
                        var addresultsSpacer = document.getElementsByClassName('add-heading-spacer');

                        for ( let heading of addresultsHeading) {

                            heading.style.display = 'none';
                            add_content.removeChild(heading);
                        }

                        for ( let spacer of addresultsSpacer) {

                            spacer.style.display = 'none';
                            add_content.removeChild(spacer);
                        }
                
                
                });
                });
            

        }

});


