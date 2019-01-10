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