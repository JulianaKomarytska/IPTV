/*var Cabinet = Backbone.View.extend({
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

});*/
var MainPage = Backbone.View.extend({
	events: {
		'click .muvies-item': 'showMovieDescriptionElement',
	},

	initialize: function(options){
		this.options = options;
		this.template = options.template;
		this.bannerItem = options.bannerItem;
		this.moviesItem = options.moviesItem;
		this.parent = this;
		this.collection = new Backbone.Collection;
		this.render();

	},

	render: function(){
			// создание врапперов для каруселей
		var wrapp = _.template(Templates[this.template]);
		this.$el.append(wrapp({}));
		RequestToServer("banners/browse", autorization_data, _.bind(this.prepareData, this));
		RequestToServer("movies/browse", {"authorization_key": autorization_data.authorization_key, "category_id" : "80"}, _.bind(this.bestForWeekSlider, this));
		RequestToServer("movies/browse", {"authorization_key": autorization_data.authorization_key, "category_id" : "193"}, _.bind(this.adventuresSlider, this));
		RequestToServer("movies/browse", {"authorization_key": autorization_data.authorization_key, "category_id" : "78"}, _.bind(this.horrorSlider, this));
		this.slickOptions = {
			infinite: true,
			centerMode: false,
			focusOnSelect: true,
			slidesToShow: 4,
			slidesToScroll: 2,
			centerPadding: "0",
			respondTo: "slider",
			variableWidth: true,
			adaptiveHeight: true,
			responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 425,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 1,
					},
				},
				{
					breakpoint: 320,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
					},
				},
			]
		};

	},


	prepareData: function(response){
		var responseData = response.data.data;
		this.collection.set(responseData);
		var item = _.template(Templates[this.bannerItem])
		
		responseData.forEach(function(data){
			$(".banner-wrapper").append(item(data));
		});

		$('.banner-wrapper').slick({
			infinite: true,
			autoplay: true,
			autoplaySpeed: 10000,
			dots: true,
			focusOnSelect: true,
			pauseOnDotsHover: true,
			fade: true,

		});

		
	},

	bestForWeekSlider: function(response){
		var responseData = response.data.data;
		this.collection.set(responseData);
		var item = _.template(Templates[this.moviesItem])
		
		responseData.forEach(function(data){
			$(".best-for-week").append(item(data));
		});
		$('.best-for-week').slick(this.slickOptions);
	},

	adventuresSlider: function(response){
		var responseData = response.data.data;
		this.collection.set(responseData);		
		var item = _.template(Templates[this.moviesItem])
		
		responseData.forEach(function(data){
			$(".adventures").append(item(data));
		});
		$('.adventures').slick(this.slickOptions);

	},

	horrorSlider: function(response){
		var responseData = response.data.data;
		this.collection.set(responseData);
		var item = _.template(Templates[this.moviesItem])
		
		responseData.forEach(function(data){
			$(".horror").append(item(data));
		});
		$('.horror').slick(this.slickOptions);

	},


	showMovieDescriptionElement: function(e){
		new MovieDescriptionElement({
			movie_id: e.currentTarget.attributes['data-id']['value'],
			el: '.content-container > .muvies-info-overlay',
			collection: this.collection,
		});
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
		this.rendenWrapper(responseData);
	},
	
	rendenWrapper: function(responseData) {
		var responseData = responseData;
		// Создание враппера карусели
	if($('.сarousel-wrapper') && ($('.сarousel-wrapper').length > 0)) {$('.сarousel-wrapper').remove()};
	this.before.css({'display': 'none'});
	this.after.css({'display': 'inline-block'});
	$('<div>', {class: 'сarousel-wrapper'}).appendTo(this.$el);
		
		// Вычисление первичного офсета
	this.current_left_offset = ($('body').offset()).left;
	this.left_offset_to_viewport_end = (($(this.$el).offset()).left + ($(this.$el).outerWidth()));
	this.left_offset_to_viewport = ($(this.$el).offset()).left;
	this.render(responseData);
	},

	render: function(responseData) {

		var item_template = _.template(Templates[this.template]);
		for (var i = 0; i < responseData.length; i++) {
			$('.сarousel-wrapper').append(item_template(responseData[i]))
		};
		this.doCurrentItem();
		this.current_item_width = $('.current_item').outerWidth(true);
		if(
			($('.сarousel-wrapper .btn:last').offset().left + $('.сarousel-wrapper .btn:last').outerWidth()) <= 
			($(this.$el).offset().left + $(this.$el).outerWidth())) {
			this.after.css({'display': 'none'})
		};
	}, 

	doCurrentItem: function(){
		$('.сarousel-wrapper .btn').eq([this.counter]).addClass('current_item');
	},

	carouselNext: function() {
		$('.current_item').removeClass('current_item');
		this.counter += 1;

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
		this.doCurrentItem();
		
		if (this.counter < ($('.сarousel-wrapper .btn').length - 1)){
			$(this.before).css({'display':'inline-block'});
		};

		this.current_left_offset += this.current_item_width;
		console.log('this.current_left_offset', this.current_left_offset);
		$('.сarousel-wrapper').offset({left: this.current_left_offset});
		
		var first_item_offset_left = ($('.сarousel-wrapper .btn:first').offset()).left;
		
		if (this.left_offset_to_viewport <= first_item_offset_left) {
			console.log("this.left_offset_to_viewport", this.left_offset_to_viewport, "first_item_offset_left", first_item_offset_left)
			$(this.before).css({'display':'none'});
			$(this.after).css({'display': 'inline-block'});
			$('.current_item').removeClass('current_item');
			this.counter = 0;
			$('.сarousel-wrapper').offset({'left': this.left_offset_to_viewport});
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
	//информация о муви

	var MovieDescriptionElement = Backbone.View.extend({
		events: {
			"click .loock" : "showPreview",
			'click .forvard': 'hide'
		},

		initialize: function(options){
		  this.options = options;
		  this.URLmodel = new Backbone.Model;
		  // this.listenTo(this.URLmodel, "change", function(){this.on("click .loock", this.showPreview, this)})
		  RequestToServer('movies/info', {"authorization_key": autorization_data.authorization_key, "movie_id": options.movie_id}, _.bind(this.render, this));

		},
		prepareData: function() {


		},

		render: function(response) {
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
//запуск плеера для муви превью
var MoviesPreview = Backbone.View.extend({
	events: {
		"click .close" : "hide",
	},
	initialize: function(options){
		this.options = options;
		this.url = options.url;
		this.parent = options.parent;
		this.template = options.template;
		this.render();
	},

	render: function(){
		this.$el.show();
		console.log("this.url", this.url)
		var video_wrapp = _.template(Templates[this.template])
		this.$el.append(video_wrapp({}));

		this.video = document.getElementById('video');
/*		var customLoader = function() {

		};*/
		if(Hls.isSupported()) {
			this.hls = new Hls();
			this.hls.loadSource(this.url);
			this.hls.attachMedia(video);
			this.hls.on(Hls.Events.MANIFEST_PARSED,function() {
				video.play();
			});

		};
	},


	hide: function(e) {
		this.hls.destroy();		
		this.remove();
	},


});
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
var SearchPage = Backbone.View.extend({
	events:{
		"click .find" : "sendSearchRequest",
		"keyup"	:	"keyAction",
	},

	initialize: function (options) {
		this.options = options;
		this.template = options.template;
		this.searchCollection = new Backbone.Collection;
		this.searchString = ''; 
		this.listenTo(this.searchCollection, "reset", this.renderQuery);
		this.render();
	},

	render: function(){
		var template = _.template(Templates[this.template]);
		this.$el.append(template({}));

	},

	sendSearchRequest: function(){
		var requestParams = {
			"query" : this.$el.find("input").val(),
			"authorization_key": autorization_data.authorization_key,
		};
		RequestToServer ("search/movies", requestParams, _.bind(this.setToSearchCollection, this));


	},

	setToSearchCollection: function(response){
		this.searchCollection.reset(response.data.data);
	},

	renderQuery: function(){
		this.$el.find(".muvies").remove();
		this.$el.append("<div class='muvies'>");
		router.navigate("search/", {trigger: true});

		new SearchResponse({
			template: 'muvies_item',
			el: '.muvies',
			collection: this.searchCollection,
		});
	},

	keyAction: function(e){
		var self = this
		var code = e.keyCode || e.which;		
		if(code == 13) {
			this.sendSearchRequest();
		};
	},

});
//Рендер мувиков по результатам запроса
var SearchResponse = Backbone.View.extend({
	events: {
		'click .muvies-item': 'showMovieDescriptionElement',
	},
	initialize: function(options){
		this.options = options;
		this.template = options.template;
		this.collection = options.collection;
		this.render();
	},

	render: function(){
		var items = _.template(Templates[this.template]);
		if(this.collection.length && this.collection.models.length){
			var muvies_browse = _.template(Templates[this.template]);

			for (var i = 0; i < this.collection.length; i++) {
				var x = muvies_browse(this.collection.at(i).toJSON())
				var random = Math.round(Math.random()*(20-1)+1);
				var windowHeight = $(window).height();
				var imgHeight = windowHeight*25/100 + random*10;
				$(x).css({"height": imgHeight}).appendTo(this.$el);
			};
		} else {
			new NoDataPage({
				el: this.el,
			});
		};
			
			$(this.$el).masonry({
				// options
				itemSelector: '.muvies-item',
				columnWidth: '.muvies-item',
			});
	},

	showMovieDescriptionElement: function(e){
		new MovieDescriptionElement({
			movie_id: e.currentTarget.attributes['data-id']['value'],
			el: '.content-container > .muvies-info-overlay',
			collection: this.collection,
		});
	},

});