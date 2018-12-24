// function afterLoad() {
// 	new MoviesSidebar({
// 		el: '.sidebar',
// 		template: 'sidebar',
// 	})

// 	// Пример запроса для авторизации 
// 	// RequestToServer ('http://api.divan.tv/v1/authorization', {client_key: "8a66efabeee725d313673361fa3728c21430809f", device_type: "3"}, GetResponse)


// 	// Авторизация
// 	function doAutorization () {
// 		RequestToServer ("authorization", AUTORISATION_PARAMS, GetResponse)
// 	}

// 	doAutorization ();

// 	// Обработчик-ответа сервера. Запись в глобальную переменную объекта ответа
// 	function GetResponse (response) {
// 		if (response.code === 200) {
// 			window.autorization_data = response.data;
// 			localStorage.setItem( "authorization_key", autorization_data.authorization_key);
// 			buildUi();
// 		} else {
// 		console.log ("try again")
// 		};
// 	};
	

// 	// ------------------------------------------------------------ Построение страницы -----------------------------------
	
// 	// Подготовка объекта allTemplates к использованию для геренации страниц. 
// 	//Сохранение в отдельный объект свойств со строкой шаблона под названием имени шаблона
// 	Templates = {}
// 	for (var key in allTemplates) {
// 		Templates[key] = allTemplates[key].value
// 	}


// 	//Функция для рендеринга (отображения) страницы из шаблона. 
// 	//Компилирует указанный шаблон с объектом информации (ответ с сервера) и вставляет в <body> документа
// 	/*function render_categories (response){
// 		var categories = _.template(Templates.button);
// 		for (var i = 0; i < 5; i++) {
// 			$('.categories-custom').append(categories(response.data.data[i]));
// 		};		
// 	}*/

// 	categories_array = [];

// 	function render_categories (response){
// 		var categories = response.data.data;
// 		for (var i = 0; i < categories.length; i++) {
// 			categories_array[i] = categories[i];
// 		}
// 	var categories_carousel = new Carousel ({template: 'button', wrapper: '.categories-custom', response: categories_array});
// 	}


// 	function render_muvies_browse (response){
// 		var muvies_browse = _.template(Templates.muvies_item);
// 		for (var i = 0; i < 6; i++) {
// 			$('.muvies').append(muvies_browse(response.data.data[i]));
// 		};
// 		$('.muvies-item').on('click', function(e){showMuviesInfo(e)});
// 	};

// 	//Рендеринг попапа для мувис инфо
// 	function renderMeviesInfo(response) {
// 		var muvies_info = _.template(Templates.muvies_info);
// 		$('.muvies-info-overlay').html(muvies_info(response.data.data));
// 		$('.muvies-info-overlay').css({'display': 'block'});
// 		$('body').css({'overflow':'hidden'});
// 		$('.forvard').on('click', function(e){forvard(e)});
// 	};


// 	function forvard(e) {
// 		console.log(e);
// 		$('.muvies-info-overlay').css({'display': 'none'});
// 		$('body').css({'overflow':'auto'});
// 	};
	

// 	// Функция отображения мувис инфо по клику
// 	function showMuviesInfo(e) {
// 		var muvies_id = e.currentTarget.attributes['data-id']['value']
// 		console.log(muvies_id);
// 		RequestToServer('movies/info', {"authorization_key": autorization_data.authorization_key, "movie_id": muvies_id}, renderMeviesInfo); 

// 	};

// 	// Функция построения страницы. По роутеру. Используется после авторизации.
// 	function buildUi () {
// 		var muvies = Templates.muvies;
// 		$('body').html(muvies);

// 		RequestToServer('movies/categories', {"authorization_key": autorization_data.authorization_key}, render_categories); 
// 		RequestToServer('movies/browse', {"authorization_key": autorization_data.authorization_key}, render_muvies_browse); 
		
// 	};



// };

