var Cabinet = Backbone.View.extend({
	initialize: function(options){
		this.options = options;
		this.router = options.router;
		this.render();
	},

	render: function(){

		var inner = $("<div>").css({"display": "block", "padding":"45vh 0", "text-align": "center"})
		$(inner).html("Какой-то текст");
		this.$el.html(inner);
	},

});
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
				// console.log("this.collection.at[i]", this.collection.at(i).toJSON());
				this.$el.append(muvies_browse(this.collection.at(i).toJSON()));
			};
		} else {
			this.$el.html(getToken("muvies_info.category_empty")).css({'display':'block', 'text-align': 'center'});
		}
		console.log('this.$el', this.$el, 'item', this.$el.find('.muvies-item'));
	},

	/*render: function(response){

		console.log(response);
		this.$el.html('');
		if(response.data && response.data.data && response.data.data.length){
			var muvies_browse = _.template(Templates[this.template]);
			for (var i = 0; i < (response.data.data).length; i++) {
				this.$el.append(muvies_browse(response.data.data[i]));
			};
		} else {
			this.$el.html(getToken("muvies_info.category_empty")).css({'display':'block', 'text-align': 'center'});
		}
		console.log('this.$el', this.$el, 'item', this.$el.find('.muvies-item'));

	},*/

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
			"is_adult": '1',
			"include_adults": '1',
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
//Вьюха для построения карусели с указанных данных. (Карусель категорий). 

var MovieCategoriesCarousel = Backbone.View.extend({
	events: {
		'click .before' : 'carouselBack',
		'click .after'	: 'carouselNext',
		'click .btn'	: 'setCategoryId',
	},
	
	initialize: function(options) {
		this.options = options;
		this.template = options.template;
		this.counter = 0;
		this.before = this.$el.find('.before');
		this.after = this.$el.find('.after');
		this.state = options.state;
		this.listenTo(this.state, 'change:categoryGroupId', this.renderCategoryBrowsByGroupId)
		RequestToServer('movies/categories', {"authorization_key": autorization_data.authorization_key}, _.bind(this.prepareData, this));
	},
	
	prepareData: function(response) {
		var responseData = response.data.data;
		this.categoriesList = responseData;
		var categories_array = []
		var categories = response.data.data;
		for (var i = 0; i < categories.length; i++) {
			categories_array[i] = categories[i];
		};
		this.rendenWrapper(responseData);
	},
	
	rendenWrapper: function() {
		// Создание враппера карусели
	if($('.сarousel-wrapper') && ($('.сarousel-wrapper').length > 0)) {$('.сarousel-wrapper').remove()};
	this.before.css({'display': 'none'});
	this.after.css({'display': 'inline-block'});
	$('<div>', {class: 'сarousel-wrapper'}).appendTo(this.$el);
		
		// Вычисление первичного офсета
		console.log("this.$el", this.$el)
	this.current_left_offset = ($(this.$el).offset()).left;
	this.left_offset_to_viewport_end = (($(this.$el).offset()).left + ($(this.$el).outerWidth()));
	this.left_offset_to_viewport = ($(this.$el).offset()).left;
	this.render();
	},

	render: function() {

		var item_template = _.template(Templates[this.template]);
		for (var i = 0; i < this.categoriesList.length; i++) {
			$('.сarousel-wrapper').append(item_template(this.categoriesList[i]))
		};
		this.doCurrentItem();
		this.current_item_width = $('.current_item').outerWidth(true);

	}, 

	doCurrentItem: function(){
		$('.сarousel-wrapper .btn').eq([this.counter]).addClass('current_item');
	},

	carouselNext: function() {
		$('.current_item').removeClass('current_item');
		this.counter += 1;

		console.log(this.counter);
		if (this.counter > 0) {
			$(this.before).css({'display': 'inline-block'});
		};

		$('.сarousel-wrapper .btn').eq([this.counter]).addClass('current_item');
		this.current_left_offset -= this.current_item_width;
		$('.сarousel-wrapper').offset({left: this.current_left_offset});

		this.last_item_offset_left = ($('.сarousel-wrapper .btn:last').offset()).left;

		if (this.left_offset_to_viewport_end >= this.last_item_offset_left) {
			$(this.after).css({'display':'none'});
			this.counter = $('.сarousel-wrapper .btn').length - 1;
			$('.current_item').removeClass('current_item');
			this.doCurrentItem();
		};

	},


	carouselBack: function() {
		$('.current_item').removeClass('current_item');
		this.counter -=1;
		console.log(this.counter);
		this.doCurrentItem();
		
		if (this.counter < ($('.сarousel-wrapper .btn').length - 1)){
			$(this.before).css({'display':'inline-block'});
		};
		this.current_left_offset += this.current_item_width;
		$('.сarousel-wrapper').offset({left: this.current_left_offset});
		
		var first_item_offset_left = ($('.сarousel-wrapper .btn:first').offset()).left;
		
		if (this.left_offset_to_viewport <= first_item_offset_left) {
			$(this.before).css({'display':'none'});
			$('.current_item').removeClass('current_item');
			this.counter = 0;
			this.doCurrentItem();

		};

	},

	setCategoryId: function(e){
		var id = $(e.currentTarget).data('id');
		this.state.set('categoryId', id);
	},

	renderCategoryBrowsByGroupId: function(){
		var self = this.state;
		var categoriesByGroup = _.filter(this.categoriesList, function(key){
			var id = self.get('categoryGroupId');
			if (id == '') {
				return true
			} else {
			return (key['group_id'] == id);
		};
			
		});
		this.rendenWrapper(categoriesByGroup);
	},
	
});
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
		console.log("MoviesPage this.el", this.$el);
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
var MoviesCategoriesMain = Backbone.View.extend({
	events:{
		'click .main-menu-categories' : 'categoriesBrowsRequest',
		'click .group_btn'	: 'setCategoryGroupId',
	},

	initialize: function(options){
		this.options = options;
		this.state = options.state;
		this.template = options.template;
		this.popupTemplate = options.popupTemplate;
		this.listenTo(this.state, 'change:categoryGroupId', this.render);
		this.render();
	},

	render: function() {
		$('.main-menu-categories').remove();
		if (this.state.attributes.categoryGroupName && this.state.attributes.categoryGroupName.length > 0 ){
			var tokken = this.state.attributes.categoryGroupName;
		} else {
			var tokken = getToken("muvies_info.all")
		};
		var btn = $('<div>', {class: "main-menu-categories btn"});
		$(btn).html(tokken);
		this.$el.append(btn);
	},

	categoriesBrowsRequest: function(){
		RequestToServer('movies/groups', {"authorization_key": autorization_data.authorization_key}, _.bind(this.categoriesBrowsRender, this));
	},

	categoriesBrowsRender: function(response){
		var self = this;

		var wrapp = _.template(Templates[this.popupTemplate]);
		this.$el.append(wrapp({}));
		$('body').css({'overflow':'hidden'});

		var categories = _.template(Templates[this.template]);
		var tokken = getToken("muvies_info.all");
		$('.wrapp').append(categories({'id': '', 'group_name': tokken}));
		for (var i=0; i < response.data.data.length; i++){
			$('.wrapp').append(categories(response.data.data[i]))
		};
		$('.forvard').on('click', self.hide);
	},

	hide: function(e) {
		$('.muvies-info-overlay').css({'display': 'none'});
		$('body').css({'overflow':'auto'});

	},

	setCategoryGroupId: function(e){
		var id = $(e.currentTarget).data('id');
		var name = $(e.currentTarget).html();

		this.state.set({'categoryGroupId': id, 'categoryGroupName': name});
		this.hide();
	},

})
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
var MoviesPreview = Backbone.View.extend({
	initialize: function(options){
		this.options = options;
		this.data = options.data;
		this.render();
	},

	render: function(){
		
	},


});