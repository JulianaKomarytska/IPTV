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