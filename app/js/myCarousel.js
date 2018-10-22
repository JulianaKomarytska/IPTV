function Carousel (options) {
	var self = this;
	var wrapper = options.wrapper;

	items_array_render =  function() {
		var template = _.template(Templates[options.template]);
		for (var i = 0; i < options.response.length; i++) {
			$(wrapper).append(template(options.response[i]))
		};
	};



}

options = {
	template: 'button';
	wrapper: '.categories-custom';
	response: categories_array;


}