(function ($) {
	'use strict';

   /**
    * Ajax-based random post fetching.
    */



    $('#new-quote-button').on('click', function(event){
        event.preventDefault();

        $.ajax({
            method: 'get',
            url: api_vars.root_url + 'wp/v2/posts?filter[orderby]=rand&filter[posts_per_page]=1',
            cache: false

        }).done(function(data) {
            var post = data.shift(),
                quoteSource = post._qod_quote_source,
                quoteSourceUrl = post._qod_quote_source_url,
                $sourceSpan = $('.source');

            $('.entry-content').html( post.content.rendered );
            $('.entry-title').html( '<h2 class="entry-title">&mdash; ' + post.title.rendered + "</h2>" );


            if ( quoteSource && quoteSourceUrl ) {
                $sourceSpan.html( ', <a href="' + quoteSourceUrl + '">' + quoteSource + "</a>" );

            } else if ( quoteSource ) {
                $sourceSpan.html( ', ' + quoteSource );

            } else {
                $sourceSpan.text('');
            }

        });
    });


/**
* Ajax-based front-end post submissions.
*/

    $('#quote-submission-form').on('submit', function(event) {
        event.preventDefault();

        var title = $('#quote-author').val(),
            content = $('#quote-content').val(),
            quoteSource = $('#quote-source').val(),
            quoteSourceUrl = $('#quote-source-url').val(),
            status = 'pending',
            $successMessage = $('.submit-success-message');

        var data = {
            title: title,
            content: content,
            _qod_quote_source: quoteSource,
            _qod_quote_source_url: quoteSourceUrl,
            post_status: status
        };


        $.ajax({
            method: 'POST',
            url: api_vars.root_url + 'wp/v2/posts',
            data: data,
            beforeSend: function ( xhr ) {
                xhr.setRequestHeader('X-WP-Nonce', api_vars.nonce);
            }


        }).done(function( response ) {
            $('#quote-submission-form').slideUp();
            $successMessage.append( api_vars.success );
            $successMessage.show();
            console.log( response );



        }).fail(function( response ) {
            console.log( response );
            alert( api_vars.failure );
        });


    });




}(jQuery));
