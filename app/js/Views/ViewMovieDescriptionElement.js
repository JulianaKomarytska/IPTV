	var MovieDescriptionElement = Backbone.View.extend({
		events: {
			//"click .loock" : "showPreview",
		},

		initialize: function(options){
		  this.options = options;
		  this.collection = options.collection;
		  RequestToServer('movies/info', {"authorization_key": autorization_data.authorization_key, "movie_id": options.movie_id}, _.bind(this.render, this));
		},
		prepareData: function() {

		},
		render: function(response) {
			this.responseData = response.data.data;
			var self = this;
			var muvies_info = _.template(Templates.muvies_info);
			this.$el.html(muvies_info(this.responseData));
			this.$el.css({'display': 'block'});
			$('body').css({'overflow':'hidden'});
			$('.forvard').on('click', self.hide);

		},
		hide: function(e) {
			$('.muvies-info-overlay').css({'display': 'none'});
			$('body').css({'overflow':'auto'});

		},

		/*showPreview: function(e){
			new MoviesPreview({
				el: ".muvies-info-overlay .wrapp",
				template: "MoviesPreviewPlayer",
				data: this.responseData,
			})
		}*/



	});