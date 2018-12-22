var MoviesSidebar = Backbone.View.extend({
	events:{
		"click" : "toggleSidebar",
		"click .content-container": "hideSidebar",
		"click .cabinet span" : "showCabinet",
		"click .main span" : "backToHome",
		"click .logo img" : "backToHome",
		"click .archive span" : "renderMoviesPage"
	},

	initialize: function(options) {
		this.options = options;
		this.template = options.template;
		this.router = options.router;
		this.parent = options.parent;
		this.state = new Backbone.Model;
		this.render();
	},

	render: function(){
		var sidebar = _.template(Templates[this.template]);
		this.$el.prepend(sidebar({}));
	},

	toggleSidebar: function(e){
		console.log("1", this)
		this.$el.toggleClass("showSidebar");
/*		this.$el.find(".sidebar").css({"width":"max-content"});
		this.$el.find('li').css({"width":"max-content", "margin":"1em 1.5em", "text-indent": "3.5em"});
		this.$el.find('.logo img').css({"display":"block"});
		$(".content-container").css({"filter":"blur(5px)"});
		$(".content-container div").css({"pointer-events":"none"});*/
	},

	hideSidebar: function(e){
		this.$el.removeClass("showSidebar");
		/*ddd = this.$el;
		console.log('2133213', this.$el, "this.$el.find('.sidebar') ", this.$el.find('.sidebar'));
		this.$el.find('.sidebar').css({"width":"6em"});
		this.$el.find('li').css({"width":"3em", "margin":"1em auto", "text-indent": "6.5em"});
		this.$el.find('.logo img').css({"display":"none"});
		$(".content-container").css({"filter":"none"});
		$(".content-container div").css({"pointer-events":"auto"});*/
	},

	showCabinet: function(e){
		router.navigate("cabinet", {trigger: true});
	},

	backToHome: function() {
		router.navigate("", {trigger: true});
	},

	renderMoviesPage: function(){
		router.navigate("movies", {trigger: true});
	},
});