document.addEventListener('DOMContentLoaded', function() {

    var search_form = document.getElementById('search_form');


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
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  query: query.value,
                  query_type: query_type.value
                })
              })
              .then(response => response.json()) // parse the response to JSON
              .then(data => {
                // handle the data from the response here
                
                var search_content = document.getElementById('search');
                search_content.style.display = 'none';
                console.log(data);

                resultHeading = document.createElement('h2')
                search_content.appendChild(resultHeading);
                resultHeading.textContent = 'Search Results'
                resultHeading.style.display = 'block';
                
                
                if (query_type.value == 'song'){
                
                
                    for (let item of data) {
                    
                        console.log(item);
                }
                
            
            }
              })
              .catch(error => {
                // handle any errors here
                console.log(error);
              });


        }
    
    });
});