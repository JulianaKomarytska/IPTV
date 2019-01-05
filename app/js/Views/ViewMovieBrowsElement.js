//Вьюха для построения списка фильмов на главной странице
var MoviesBrowsElement = Backbone.View.extend ({
	events: {
		'click .muvies-item': 'showMovieDescriptionElement',
	},

	initialize: function(options){
		this.options = options;
		this.template = options.template;
		this.moviesDataCollection = new Backbone.Collection;
		this.state = options.state;
		this.collection = options.collection;
		this.listenTo(this.state, 'change:categoryId', this.loadDataByCategory);
		this.listenTo(this.state, 'change:categoryGroupId', this.loadMoviesBrowsByGroupId);
		this.listenTo(this.collection, 'reset', this.render);		
		RequestToServer('movies/browse', {"authorization_key": autorization_data.authorization_key}, _.bind(this.resetToCollection, this));

	},
	resetToCollection: function(response) {
		this.collection.reset(response.data.data);
		console.log("this.collection", this.collection);
	},

	render: function(){
		this.$el.html('');
		if(this.collection.length && this.collection.models.length){
			var muvies_browse = _.template(Templates[this.template]);
			for (var i = 0; i < this.collection.length; i++) {
				this.$el.append(muvies_browse(this.collection.at(i).toJSON()));
			};
		} else {
			new NoDataPage({
				el: this.el,
			});
		}
		console.log('this.$el', this.$el, 'item', this.$el.find('.muvies-item'));
	},

	showMovieDescriptionElement: function(e){
		new MovieDescriptionElement({
			movie_id: e.currentTarget.attributes['data-id']['value'],
			el: '.content-container > .muvies-info-overlay',
			collection: this.collection,
		});
	},

	loadDataByCategory: function(){
		var params = {
			"authorization_key": autorization_data.authorization_key, 
			"category_id": this.state.get('categoryId'),
			"is_adult": '0',
			"include_adults": '0',
		};
		RequestToServer('movies/browse', params, _.bind(this.resetToCollection, this));
	},

	loadMoviesBrowsByGroupId: function(){
		var params = {
			"authorization_key": autorization_data.authorization_key, 
			"group_id": this.state.get('categoryGroupId'),
		};
		RequestToServer('movies/browse', params, _.bind(this.resetToCollection, this));
	},


});