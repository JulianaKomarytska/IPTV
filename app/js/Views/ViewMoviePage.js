var MoviesPage = Backbone.View.extend({
	initialize: function(options){
		this.options = options;
		this.template = options.template;
		this.state = new Backbone.Model;
		this.collection = new Backbone.Collection;
		this.parent = this;
		this.render();
	},

	render: function(){
		var muvies = Templates[this.template];
		this.$el.html(muvies);

		
		new MovieCategoriesCarousel({
			template: 'button', 
			el: '.categories-custom',
			state: this.state,
			parent: this,
			});
		new MoviesBrowsElement({
			template: 'muvies_item',
			el: '.muvies',
			state: this.state,
			collection: this.collection,
			parent: this,
		});
		new MoviesCategoriesMain({
			el: '.categories-main',
			state: this.state,
			popupTemplate: 'popUpWrapp',
			template: 'movies_group_browse',
			parent: this,
		});
		
	},
});