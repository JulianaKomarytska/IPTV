var AppRouters = Backbone.Router.extend({
	routes: {
		'cinema(/)'		: 	"cinema",
		'movie/:id'		: 	"movie",
        // tv-series
        'tv-series(/)'	: 	'tv-series',

        // movies
        'movies(/)'	: 	'movies',

        //search
        'search(/)'		: 	"search",
 		// home
        ''	: 	'defaultRoute',
	},

	initialize: function(){
		// this.route(/^(?:movie)\/(?:[a-zA-Z0-9\-]+-)?([0-9]+)$/, 'movie');
	},

	
});