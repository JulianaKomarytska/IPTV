	//информация о муви

	var MovieDescriptionElement = Backbone.View.extend({
		events: {
			"click .loock" : "showPreview",
			'click .forvard': 'hide'
		},

		initialize: function(options){
			this.options = options;
			this.fromRouter = options.fromRouter;
			this.movie_id = options.movie_id;
			this.parentRouter = options.parentRouter;
			console.log(options)
			RequestToServer('movies/info', {"authorization_key": autorization_data.authorization_key, "movie_id": this.movie_id}, _.bind(this.render, this));
			
		},

		render: function(response) {
			
			router.navigate("movie/" + this.movie_id , {silent: true});
			this.delegateEvents();
			this.responseData = response.data.data;
			var self = this;
			try {
				var muvies_info = _.template(Templates.muvies_info);
				this.$el.html(muvies_info(this.responseData));
				this.$el.show();
				$('body').css({'overflow':'hidden'});
			} catch {
				var errorsCode = Object.keys(response.data.errors)[0]
				console.log("errorsCode", errorsCode)
				if (errorsCode == 301 ) {
					console.log("this.el", this.$el)
					this.$el.show();
					new NoDataPage({
						el: this.el,
						errors: errorsCode,
					});
				} else {

					console.log("this.el", this.el)
				}
			}
		},		


		hide: function(e) {
			this.undelegateEvents();
			this.stopListening();
			$('.muvies-info-overlay').hide();
			$('body').css({'overflow':'auto'});
			$(".muvies-info-overlay").find(".wrapp").remove();
			$(".muvies-info-overlay").find("img").remove();
			if (this.fromRouter){
				router.navigate("movies", {trigger: true});
			} else {
				router.navigate(this.parentRouter, {silent: true});
			};
		
		},

		showPreview: function() {
			// this.$el.off("click", ".loock");
			this.$el.find(".wrapp").append("<section class='preview-wrapp'></section>");
			new MoviesPreview({
				el: ".preview-wrapp",
				template: "muvies_preview",
				url: this.responseData.streams[0].url,
				parent: this,
			});
		},
	});