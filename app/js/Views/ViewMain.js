var MainPage = Backbone.View.extend({
	initialize: function(options){
		this.options = options;
		this.template = options.template;
		this.parent = this;
		this.render();
	},

	render: function(){
		/*var main = Templates[this.template];
		console.log("MainPage this.el", this.$el);*/
		this.$el.html('Это главная страница');
	},


});