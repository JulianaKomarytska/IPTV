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