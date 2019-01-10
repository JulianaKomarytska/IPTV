var NoDataPage = Backbone.View.extend ({
	events: {
		'click .back-home' : 'backToHome',
	},

	initialize: function(options) {
		console.log("NoDataPage")
		this.options = options;
		this.errors = options.errors || undefined;
		console.log("this.errors", this.errors)
		if (this.errors) {
			this.template = 'error_page';
		} else {
			this.template = 'empty_page';
		};
		this.render();
	},

	render: function(){
		var page = _.template(Templates[this.template]);
		this.$el.html(page)
 
	},

	backToHome: function() {
		router.navigate("", {trigger: true});
	},
});