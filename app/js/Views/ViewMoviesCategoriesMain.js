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