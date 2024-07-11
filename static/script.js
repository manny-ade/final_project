document.addEventListener('DOMContentLoaded', function() {

    var search_form = document.getElementById('search_form');


    search_form.addEventListener('submit', function(event) {
    
        event.preventDefault();
        var search_error = document.getElementById('search_error');
        search_error.style.display = 'none';
        var query = document.getElementById('query');
        var query_type = document.querySelector('input[name="query_type"]:checked')
        console.log(query);
        console.log(query_type);
        
        var url = '/search?query=' + query + '&query_type=' + query_type;
    
        if (query === null || query_type === null) {
            
            search_error.textContent = 'You must enter both a query and a query type.';
            search_error.style.color = 'red';
            search_error.style.display = 'block';
        };
    
    });
});