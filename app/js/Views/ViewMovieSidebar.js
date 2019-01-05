var MoviesSidebar = Backbone.View.extend({
	events:{
		"click" : "toggleSidebar",
		"click .content-container": "hideSidebar",
		"click .main span" : "backToHome",
		"click .logo img" : "backToHome",
		"click .archive span" : "renderMoviesPage",
		"click .channels span" : "renderCannelsPage",
		"click .cinema span" : "renderCinemaPage",
		"click .search span" : "renderSearchPage",
	},

	initialize: function(options) {
		this.options = options;
		this.template = options.template;
		this.parent = options.parent;
		this.state = new Backbone.Model;
		this.render();
	},

	render: function(){
		var sidebar = _.template(Templates[this.template]);
		this.$el.prepend(sidebar({}));
		if($('body').outerWidth() <= 768) {
			this.$el.addClass('mobile-mnu');
		}
	},

	toggleSidebar: function(e){
		console.log("1", this)
		this.$el.toggleClass("showSidebar");
		if(this.$el.hasClass("showSidebar") && $('body').outerWidth() <= 768) {
			this.$el.removeClass("mobile-mnu")
			this.$el.addClass("on")
		} else  if ($('body').outerWidth() <= 768){
			this.$el.toggleClass("mobile-mnu");
			this.$el.toggleClass("on");
		};
/*		this.$el.find(".sidebar").css({"width":"max-content"});
		this.$el.find('li').css({"width":"max-content", "margin":"1em 1.5em", "text-indent": "3.5em"});
		this.$el.find('.logo img').css({"display":"block"});
		$(".content-container").css({"filter":"blur(5px)"});
		$(".content-container div").css({"pointer-events":"none"});*/
	},

	hideSidebar: function(e){
		this.$el.removeClass("showSidebar");
		if($('body').outerWidth() <= 768) {
			this.$el.addClass('mobile-mnu');
		}
		/*ddd = this.$el;
		console.log('2133213', this.$el, "this.$el.find('.sidebar') ", this.$el.find('.sidebar'));
		this.$el.find('.sidebar').css({"width":"6em"});
		this.$el.find('li').css({"width":"3em", "margin":"1em auto", "text-indent": "6.5em"});
		this.$el.find('.logo img').css({"display":"none"});
		$(".content-container").css({"filter":"none"});
		$(".content-container div").css({"pointer-events":"auto"});*/
	},


	backToHome: function(e) {
		console.log("backToHome", e.target.parentElement);
		$("li.active").removeClass("active");
		$(e.target.parentElement).addClass("active")
		router.navigate("", {trigger: true});
	},

	renderMoviesPage: function(e){
		console.log("renderMoviesPage", e.target.parentElement);
		$("li.active").removeClass("active");
		$(e.target.parentElement).addClass("active")
		router.navigate("movies", {trigger: true});
	},

	renderCannelsPage: function(e){
		console.log("renderCannelsPage", e.target.parentElement);
		$("li.active").removeClass("active");
		$(e.target.parentElement).addClass("active")
		router.navigate("channels", {trigger: true});
	},

	renderCinemaPage: function(e){
		console.log("renderCinemaPage", e.target.parentElement);
		$("li.active").removeClass("active");
		$(e.target.parentElement).addClass("active")
		router.navigate("cinema", {trigger: true});
	},

	renderSearchPage: function(e){
		console.log("backToHome", e.target.parentElement);
		$("li.active").removeClass("active");
		$(e.target.parentElement).addClass("active")
		router.navigate("search", {trigger: true});
	},
});