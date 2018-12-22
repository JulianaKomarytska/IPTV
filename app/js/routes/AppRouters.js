var AppRouters = Backbone.Router.extend({
	routes: {
		'login(/)'	:	 'login',
		"channels(/)"	: 	"channels",
		'cabinet(/)'	: 	"cabinet",
		 // home
        ''	: 	'defaultRoute',

        // tv-series
        'tv-series(/)'	: 	'tv-series',

        // movies
        'movies(/)'	: 	'movies',
        'movies(/)(description)(/)(id)' : 	'movies',

	},

	initialize: function(){
		// Backbone.history.start();
	},

	
});