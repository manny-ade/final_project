document.addEventListener('DOMContentLoaded', function() {
    
    var song_toggle = document.getElementById('song-toggle');
    var album_toggle = document.getElementById('album-toggle');
    var song_collection = document.getElementById('song_collection');
    var album_collection = document.getElementById('album_collection');
    var song_header = document.getElementById('song_collection_header');
    var album_header = document.getElementById('album_collection_header');
    var modal_buttons = document.getElementsByClassName('modal-button');
    var del_buttons = document.getElementsByClassName('delete-button');
    var info_modal = document.getElementById('info_modal');
    var currentId;
    var currentType;
    var currentNoteID;
    info_modal.style.display = 'none';
    
    
    song_toggle.addEventListener('click', function() {

        song_collection.style.display = 'flex';
        song_header.style.display = 'block';
        album_collection.style.display = 'none';
        album_header.style.display = 'none';
});

    album_toggle.addEventListener('click', function() {

        album_collection.style.display = 'flex';
        song_collection.style.display = 'none';
        song_header.style.display = 'none';
        album_header.style.display = 'block';

    });

    console.log("Starting loop...")
    
    let initClickListener = null;
    let initDeleteListener = null;

    for (let button of modal_buttons){
    
        if(initClickListener){

            button.removeEventListener('click', initClickListener);
        } 

        initClickListener = function(event) {

            if (button.dataset.type === 'song') {
    
                event.preventDefault();
    
                let note = document.getElementById('note_content');
                let not_listened_radio = document.getElementById('not_listened_radio');
                let listened_radio = document.getElementById('listened_radio');
    
                console.log('clicked');
                let song_id = button.dataset.id;
                console.log(song_id);
                let data_type = button.dataset.type;
                console.log(data_type);
                
                currentId = song_id;
                currentType = data_type;

                let fetchedData;
                fetch('/detail_view?data_type=' + data_type + '&song_id=' + song_id, {
                    method: 'GET'
                })
    
                .then(response => { if (!response.ok) 
                    { 
                        throw new Error(response.statusText); 
    
                    } 
                    return response.json(); })
    
                .then(data => {
                    
                    note.value = '';

                    fetchedData = data;
                    console.log(fetchedData);

                    let modal_info_name = document.getElementById('info_name');
                    let modal_info_artist = document.getElementById('info_artist');
                    let modal_info_genre = document.getElementById('info_genre');
                    let modal_info_date = document.getElementById('info_date');
                    let modal_info_added = document.getElementById('info_added');
                    let modal_info_listened = document.getElementById('info_listened');
                    let modal_info_link = document.getElementById('spotify_modal_link');
                    
                    modal_info_name.textContent = fetchedData.song_name;
                    modal_info_artist.textContent = fetchedData.artist_name;
                    modal_info_genre.textContent = fetchedData.genre;
                    modal_info_date.textContent = fetchedData.release_date;
                    modal_info_added.textContent = fetchedData.add_time;
                    
                    if (fetchedData.listened === 0) {
        
                        modal_info_listened.textContent = 'Not Listened';
                        not_listened_radio.checked = true;
                    } else if (fetchedData.listened === 1) {
        
                        modal_info_listened.textContent = 'Listened';
                        listened_radio.checked = true;
                    }
        
                    modal_info_link.innerHTML = '';
                    let spotify_link = document.createElement('a');
                    spotify_link.href = fetchedData.song_link;
                    spotify_link.textContent = 'Listen';
                    spotify_link.target = '_blank';
                    modal_info_link.appendChild(spotify_link);

                    note.value = fetchedData.note_content;

                    currentNoteID = fetchedData.note_id;
        
                    $('#info_modal').modal('show');
    
                })
    
                .catch(error => console.log(error));
    
                
    
            } else if(button.dataset.type === 'album') {
    
                event.preventDefault();
    
                let note = document.getElementById('note_content');
                let not_listened_radio = document.getElementById('not_listened_radio');
                let listened_radio = document.getElementById('listened_radio');
    
                console.log('clicked');
                let album_id = button.dataset.id;
                console.log(album_id);
                let data_type = button.dataset.type;
                console.log(data_type); 

                currentId = album_id;
                currentType = data_type;
    
                let fetchedData;
                fetch('/detail_view?data_type=' + data_type + '&album_id=' + album_id, {
                    method: 'GET'
                })
    
                .then(response => { if (!response.ok) 
                    { 
                        throw new Error(response.statusText);
    
            } 
            return response.json(); })
    
            .then(data => { 
                
                note.value = '';
                
                fetchedData = data; 
                console.log(fetchedData);
            
                let modal_info_name = document.getElementById('info_name');
                let modal_info_artist = document.getElementById('info_artist');
                let modal_info_genre = document.getElementById('info_genre');
                let modal_info_date = document.getElementById('info_date');
                let modal_info_added = document.getElementById('info_added');
                let modal_info_listened = document.getElementById('info_listened');
                let modal_info_link = document.getElementById('spotify_modal_link');
            
                modal_info_name.textContent = fetchedData.album_name;
                modal_info_artist.textContent = fetchedData.artist_name;
                modal_info_genre.textContent = fetchedData.genre;
                modal_info_date.textContent = fetchedData.release_date;
                modal_info_added.textContent = fetchedData.add_time;
            
                if (fetchedData.listened === 0) {
        
                    modal_info_listened.textContent = 'Not Listened';
                    not_listened_radio.checked = true;
                } else if (fetchedData.listened === 1) {
        
                    modal_info_listened.textContent = 'Listened';
                    listened_radio.checked = true;
                }
        
                    modal_info_link.innerHTML = '';
                    let spotify_link = document.createElement('a');
                    spotify_link.href = fetchedData.album_link;
                    spotify_link.target = '_blank';
                    spotify_link.textContent = 'Listen';
                    modal_info_link.appendChild(spotify_link);

                    currentNoteID = fetchedData.note_id;
                    note.value = fetchedData.note_content;

                    $('#info_modal').modal('show');

            })
    
            .catch(error => 
                console.log(error));
            
            }

            for (let del_button of del_buttons) {

                if (initDeleteListener) {

                    del_button.removeEventListener('click', initDeleteListener);
                }

                initDeleteListener = function(event) {

                    event.preventDefault();
            
                    console.log("Delete button clicked!")
                    if (currentType === 'song') {
            
                        if (confirm("Are you sure you want to delete this song?")) {
            
                            
                            console.log("User confirmed deletion.");
                            console.log("Current type: " + currentType);
                            console.log("Current id: " + currentId);
                            console.log("Current note id: " + currentNoteID);

                            fetch('/delete_music', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    'song_id': currentId,
                                    'item_type': currentType,
                                    'note_id': currentNoteID
                                })
                            })
                            .then(response => { if (!response.ok)
                                {

                                    throw new Error(response.statusText);
                                }
                            
                                return response.json(); })
                            .then(data => {
                                
                                console.log(data);
                                if (typeof toastr !== 'undefined'){

                                    if ('status' in data && 'message' in data) {

                                        if(data.status == 'success'){
                                            toastr.success("Success", data.message);
                                        } else if (data.status == 'error') {
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
                            .catch(error => 
                                
                                console.log(error)
                            );

                            cardId = 'song-' + currentId;
                            songCard = document.getElementById(cardId);
                            songCard.remove();
                            $('#info_modal').modal('hide');
                            
                        }
            
                    } else if (currentType === 'album') {
            
                        if (confirm("Are you sure you want to delete this album? If you do, \
                            all songs in the album will be deleted as well for database consistency.")) {
            
                            console.log("User confirmed deletion.");
                            console.log("Current type: " + currentType);
                            console.log("Current id: " + currentId);
                            console.log("Current note id: " + currentNoteID);
                            
                            fetch('/delete_music', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    'album_id': currentId,
                                    'item_type': currentType,
                                    'note_id': currentNoteID
                                })
                            })
                            .then(response => { if (!response.ok)
                                {

                                    throw new Error(response.statusText);
                                }
                            
                                return response.json(); })
                            .then(data => {
                                
                                console.log(data);
                                if (typeof toastr !== 'undefined'){

                                    if ('status' in data && 'message' in data) {

                                        if(data.status == 'success'){
                                            toastr.success("Success", data.message);
                                        } else if (data.status == 'error') {
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
                            .catch(error => 
                                
                                console.log(error)
                            );
                            
                            cardId = 'album-' + currentId;
                            albumCard = document.getElementById(cardId);
                            albumCard.remove();
                            $('#info_modal').modal('hide');
            
                        }
                    }
                }

                del_button.addEventListener('click', initDeleteListener);
            }
        }

        button.addEventListener('click', initClickListener);
        

    }


    modal_form.addEventListener('submit', (event) => {

        event.preventDefault();
        let note = document.getElementById('note_content');
        let not_listened_radio = document.getElementById('not_listened_radio');
        let listened_radio = document.getElementById('listened_radio');

        item_note = note.value;

        let listen_status_code;

        if (not_listened_radio.checked) {

            listen_status_code = '0';
        } else if (listened_radio.checked) {

            listen_status_code = '1';
        }

        console.log(listen_status_code);

        if (currentType === 'song') {

            fetch('/detail_view',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'song_id': currentId,
                        'listen_status_code': listen_status_code,
                        'note': item_note,
                        'note_id': currentNoteID,
                        'modal_type': currentType
                    })
                }
            )
            .then(response => { if (!response.ok) 
                { 
                    throw new Error(response.statusText); 

                } return response.json(); })

            .then(data => {
                 
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
                    } 
                
                } else {
                    console.log("Error: toastr not defined");
                }

            })
            .catch(error => 
                console.log(error),
                toastr.error("Error", error)
            );


        } else if (currentType === 'album') {

            fetch('/detail_view',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'album_id': currentId,
                        'listen_status_code': listen_status_code,
                        'note': item_note,
                        'note_id': currentNoteID,
                        'modal_type': currentType
                    })
                }
            )
            .then(response => { if (!response.ok) 
                { 
                    throw new Error(response.statusText);
                }
                return response.json(); })

            .then(data => {

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
                    } 
                
                } else {
                    console.log("Error: toastr not defined");
                }

            })
            .catch(error => console.log(error));
        }

    });


});