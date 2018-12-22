var API_HOST = "http://api.divan.tv/v1/"
window.leng = "EN" 
window.language = "RU" // "UA", "RU", "EN"

// ------------------------------------------------ Аяксы ----------------------------------- 
// Запрос объекта с шаблонами страниц
var allTemplates = {}
$.ajax({
url: '/js/compiled.json',
type: "GET",
dataType: "json",
success: function (response) {
console.log ('success_json', response) 
allTemplates = response;
afterLoad()
},
error: function (response) {
console.log ('error_json', response)
}});

// Запрос на авторизацию на сервере 
function RequestToServer (url, params, callback) {
$.ajax({
url: API_HOST + url,
type: "POST",
data: _.extend(params, (localStorage.getItem("authorization_key"))? localStorage.getItem("authorization_key") : (typeof(autorization_data) != 'undefined') ? {"authorization_key": autorization_data.authorization_key} : {}),
crossDomain: true,
dataType: "json",
success: function (response) {
console.log ('success', response)
if (!!callback) {callback (response)
}},
error: function (response) {
console.log ('error', response)
if (!!callback) {callback (response)}
}
})
};


// ------------------------------------------------------ Обработчики даты--------------------------------------------

// Вывод даты опционально.
// В фукцию передается желаемая дата в формате  setTimeout и запрашиваемые опции вывода в виде строки через пробел ("d month yyyy")
function getDateOptionaly(setTimeout, options) {
	var dateObj = {};
	var time = new Date(+setTimeout*1000);
	dateObj.yyyy = time.getFullYear();
	dateObj.yy = time.toLocaleString([language], {year: '2-digit'}); 
	dateObj.weekday = time.toLocaleString([language], {weekday: 'long'});
	dateObj.wd = time.toLocaleString([language], {weekday: 'short'});
	dateObj.mm = time.toLocaleString([language], {month: '2-digit'});
	dateObj.m = time.toLocaleString([language], {month: 'numeric'});
	dateObj.mon = time.toLocaleString([language], {month: 'short'});
	var monthToken = ("monthes" + "." + dateObj.m);
	dateObj.month = getToken(monthToken);
	dateObj.dd = time.toLocaleString([language], {day: '2-digit'});
	dateObj.d = time.toLocaleString([language], {day: 'numeric'});
	dateObj.hh = time.getHours();
	dateObj.min = time.getMinutes();
	dateObj.ss = time.getSeconds();

	var dateArray = options.split(" ");
	var dateOptionString = "";
	for (i = 0; i < dateArray.length; i++) {
		dateOptionString += dateObj[dateArray[i]];
		 if (i< dateArray.length - 1) {dateOptionString += " "};
	};
	return dateOptionString;
}; 


// Высчитывает разницу между будущей датой и текущим временем в формате таймстемпа для получения оставшегося количества секунд.
function timeDiffeterce(setTimeout) {
	var date = (Date.now()/1000); 
	return (setTimeout - date);
};


//Перевод времени UNIX в года/месяцы/дни/часы/минуты с сокращенной локализацией
function timeDuration(unix) {
	var years = parseInt(unix/31556926);
	var month = parseInt(unix/2629743 - parseInt(unix/31556926)*31556926/2629743);
	var days = parseInt(unix/86400 - parseInt(unix/2629743)*2629743/86400);
	var hours = parseInt(unix/3600 - parseInt(unix/86400)*86400/3600);
	var minutes = Math.round(unix/60 - parseInt(unix/3600)*3600/60);
	var content = "";
	
	// Выводит всю имеющуюся строку времени. Если первым есть месяц - вывдедет ГГ ММ, ДД, ЧЧ, МИН
	/*
	if (years) {content += years +" " + getToken("time_counter.years") + " "}
	if (month || years) {content += month +" " + getToken("time_counter.month") + " "};
	if (days || month || years) {content += days +" " + getToken("time_counter.days") + " "};
	if (hours || days) {content += hours +" " + getToken("time_counter.hours") + " "};
	if (minutes) {content += minutes +" " + getToken("time_counter.minutes") + " "};
	
*/
	//выведет только часто строки времени. Если есть месяц - выведет только его, а остальное откинет. 
	//Если есть только часи и минуты - выведет их вместе.
	
	if (years) { 
		content += years +" " + getToken("time_counter.years") + " "; 
		return content;
	} else 
	if (month) {
		content += month +" " + getToken("time_counter.month") + " "; 
		return content;
	} else 
	if (days) {
		content += days +" " + getToken("time_counter.days") + " ";
	return content;
	} else
	if (hours) {content += hours +" " + getToken("time_counter.hours") + " "};
	if (minutes) {content += minutes +" " + getToken("time_counter.minutes") + " "};

	return content;
};

// ----------------------------------------------------------------Локализация---------------------------------------------------

//возврат локализации в зависимости от языка приложения
function getToken(someKey) {
	if (~someKey.indexOf(".")) {
		var localization_template = someKey.slice(0, someKey.indexOf("."));
		var template_key = someKey.slice(someKey.indexOf(".") + 1);
		return (Localisation[language][localization_template][template_key])
	} else return (Localisation[language][someKey]);
};



// функцию getOneOff которая будет выбирать один из языков в объекте по глобальному языку приложения
//1. Проверить объект ли это
//2. Если объект - есть ли там ключ leng (интерфейса), если да - строка ли это.
//3. Если нет - взять другой ключ. Выполнить п.2
// Порядок ключей: UA, RU, ENG. Если нет ключа - вывести пустую строку. 

function getOneOff(data) {
	if (typeof(data) === "object") {
		if (data.hasOwnProperty(language) && (typeof(data[language]) === "string") && !(data[language] === "")) {
			return data[language];
		} else 
		if (data.hasOwnProperty("UA") && (typeof(data.UA) === "string") && !(data.UA === "")) {
			return data.UA;
		} else 
		if (data.hasOwnProperty("RU") && (typeof(data.RU) === "string") && !(data.RU === "")) {
			return data.RU;
		} else if (data.hasOwnProperty("EN") && (typeof(data.EN) === "string") && !(data.EN === "")) {
			return data.EN;
		} else return "";
} else return "";
};


// Переводит массив данных в одну строку. 
function makeString(arr, data, callback) {
	var preConcatArray = [];

	if (Array.isArray(arr)) {
		for (i = 0; i < arr.length; i++) {
			var info = arr[i][data];
			preConcatArray[i] = callback(info);
		};
	};

	if (preConcatArray.length > 1) {
		var concatedArray = preConcatArray.join(", ");
		return concatedArray;
	} else 
	return preConcatArray[0]
};


//Корструктор карусели

// function Carousel (options) {
// 	console.log (options)
// 	var wrapp = options.wrapper;
// 	var counter = 0;
// 	var prev_btn = $('.before');
// 	var next_btn = $('.after');
	
// 	// Создание враппера карусели
// 	$('<div>', {class: 'сarousel-wrapper'}).appendTo(options.wrapper)
// 	// Вычисление первичного офсета
// 	var current_left_offset = ($('.сarousel-wrapper').offset()).left;
// 	var left_offset_to_viewport_end = (($(wrapp).offset()).left + ($(wrapp).outerWidth()));
// 	var left_offset_to_viewport = ($(wrapp).offset()).left;


// 	// создание элементов карусели
// 	items_array_render =  function() {
// 		var template_name = options.template
// 		var item_template = _.template(Templates[template_name]);
// 		for (var i = 0; i < options.response.length; i++) {
// 			$('.сarousel-wrapper').append(item_template(options.response[i]))
// 		};
// 		doCurrentItem();
// 		$(prev_btn).on('click', function(e){carouselBack(e)});
// 		$(next_btn).on('click', function(e){carouselNext(e)});
// 	};

// 	items_array_render();

// 	var current_item_width = $('.current_item').outerWidth(true);


// 	function doCurrentItem() {
// 		// $('.сarousel-wrapper .btn').eq([counter]).addClass('current_item');
// 	};


// 	function carouselNext (e) {		
// 		current_left_offset -= current_item_width;

// 		$('.сarousel-wrapper').offset({left: current_left_offset});
// 		$('.current_item').removeClass('current_item');
// 		counter += 1;
// 		if (counter > 0) {
// 			$(prev_btn).css({'display': 'inline-block'});
// 		};

// 		doCurrentItem();
		
// 		var last_item_offset_left = ($('.сarousel-wrapper .btn:last').offset()).left;

// 		if (left_offset_to_viewport_end >= last_item_offset_left) {
// 			$(next_btn).css({'display':'none'});
// 			counter = $('.сarousel-wrapper .btn').length - 1;
// 			$('.current_item').removeClass('current_item');
// 			doCurrentItem();
// 		};

// 	};

// 	function carouselBack(e) {
// 		console.log(e);
// 		$('.current_item').removeClass('current_item');
// 		counter -=1;
// 		doCurrentItem();
		
// 		if (counter < ($('.сarousel-wrapper .btn').length - 1)){
// 			$(next_btn).css({'display':'inline-block'});
// 		};
// 		current_left_offset += current_item_width;
// 		$('.сarousel-wrapper').offset({left: current_left_offset});
		
// 		var first_item_offset_left = ($('.сarousel-wrapper .btn:first').offset()).left;
		
// 		if (left_offset_to_viewport <= first_item_offset_left) {
// 			$(prev_btn).css({'display':'none'});
// 			$('.current_item').removeClass('current_item');
// 			counter = 0;
// 			doCurrentItem();

// 		};

// 	};

// };


// // TODO
// // Троеточие?.... 
