//Рендер мувиков по результатам запроса
var SearchResponse = Backbone.View.extend({
	events: {
		'click .muvies-item': 'showMovieDescriptionElement',
	},
	initialize: function(options){
		this.options = options;
		this.template = options.template;
		this.collection = options.collection;
		this.render();
	},

	render: function(){
		var items = _.template(Templates[this.template]);
		if(this.collection.length && this.collection.models.length){
			var muvies_browse = _.template(Templates[this.template]);

			for (var i = 0; i < this.collection.length; i++) {
				var x = muvies_browse(this.collection.at(i).toJSON())
				var random = Math.round(Math.random()*(20-1)+1);
				var windowHeight = $(window).height();
				var imgHeight = windowHeight*25/100 + random*10;
				$(x).css({"height": imgHeight}).appendTo(this.$el);
			};
		} else {
			new NoDataPage({
				el: this.el,
			});
		};
			
			$(this.$el).masonry({
				// options
				itemSelector: '.muvies-item',
				columnWidth: '.muvies-item',
			});
	},

	showMovieDescriptionElement: function(e){
		new MovieDescriptionElement({
			movie_id: e.currentTarget.attributes['data-id']['value'],
			el: '.content-container > .muvies-info-overlay',
			parentRouter: 'search',
		});
	},

});