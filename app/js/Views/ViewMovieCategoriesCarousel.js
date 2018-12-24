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
		console.log('responseData start', responseData)
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
	this.current_left_offset = ($(this.$el).offset()).left;
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
		console.log("123")
		var self = this.state;
		var categoriesByGroup = _.filter(this.categoriesList, function(key){
			var id = self.get('categoryGroupId');
			if (id == '') {
				return true
			} else {
			return (key['group_id'] == id);
		};
			
		});
		console.log("categoriesByGroup", categoriesByGroup)
		this.rendenWrapper(categoriesByGroup);
	},
	
});