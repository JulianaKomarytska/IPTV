var AppRouters = Backbone.Router.extend({
	routes: {
		'login(/)'		:	 'login',
		'channels(/)'	: 	'channels',
		'cabinet(/)'	: 	"cabinet",
		'cinema(/)'		: 	"cinema",
		 // home
        ''	: 	'defaultRoute',

        // tv-series
        'tv-series(/)'	: 	'tv-series',

        // movies
        'movies(/)'	: 	'movies',
        'movies(/)(description)(/)(id)' : 	'movies',

        //search
        'search(/)'		: 	"search",
		'search(/)(/query)(/)'		: 	"search",

	},

	initialize: function(){
		// Backbone.history.start();
	},

	
});