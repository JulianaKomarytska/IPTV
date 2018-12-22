	var MovieDescriptionElement = Backbone.View.extend({
	initialize: function(options){
	  this.options = options;
	  RequestToServer('movies/info', {"authorization_key": autorization_data.authorization_key, "movie_id": options.movie_id}, _.bind(this.render, this));
	},
	prepareData: function() {

	},
	render: function(response) {
		var self = this;
		var muvies_info = _.template(Templates.muvies_info);
		this.$el.html(muvies_info(response.data.data));
		this.$el.css({'display': 'block'});
		$('body').css({'overflow':'hidden'});
		$('.forvard').on('click', self.hide);

	},
	hide: function(e) {
		$('.muvies-info-overlay').css({'display': 'none'});
		$('body').css({'overflow':'auto'});

	}

	});