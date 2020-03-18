// Получаем элементы со страницы
const formSearch = document.querySelector('.form-search'),
  inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
  dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
  inputCitiesTo = formSearch.querySelector('.input__cities-to'),
  dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
  inputDateDepart = formSearch.querySelector('.input__date-depart');

// База данных городов
//const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск', 'Керчь', 'Волгоград', 'Самара', 'Днепропетровск', 'Екатеринбург', 'Одесса', 'Ухань', 'Шымкент', 'Нижний Новгород', 'Калининград', 'Вроцлав', 'Ростов-на-Дону', 'Кишинев'];
let city = [];

// API
const citiesApi = 'base/cities.json',
  proxy = 'https://cors-anywhere.herokuapp.com/',
  APY_KEY = 'c6960e29e36701f38ae236d8a2857d97',
  calendar = 'http://min-prices.aviasales.ru/calendar_preload';

// Отображение городов
const showCity = (input, list) => {
  list.textContent = '';

  if (input.value !== '') {
    const filterCity = city.filter((item) => {
      const fixItem = item.name.toLowerCase();
      return fixItem.includes(input.value.toLowerCase())
    });

    filterCity.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name + ' ' + item.code;
      list.append(li);
    });

  }
};

// http request
const getData = (url, callback) => {
  const request = new XMLHttpRequest();

  request.open('GET', url);
  request.addEventListener('readystatechange', () => {
    if (request.readyState !== 4) return;

    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });

  request.send();
}

// Выбор городов
const selectCity = (event, input, dropdown) => {
  const target = event.target;

  if (target.tagName.toLowerCase() === 'li') {
    input.value = target.textContent;
    dropdown.textContent = '';
  }
}

// Обработчики событий
//-- Отображение списка городов
inputCitiesFrom.addEventListener('input', () => {
  showCity(inputCitiesFrom, dropdownCitiesFrom);
});
inputCitiesTo.addEventListener('input', () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});

//-- Установка города в поле по клику
dropdownCitiesFrom.addEventListener('click', (event) => {
  selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});
dropdownCitiesTo.addEventListener('click', (event) => {
  selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

// Вызовы функций
getData(citiesApi, (data) => {
  city = JSON.parse(data).filter((item) => item.name);
});

// ДЗ
// -- 25 мая, екб-калининград
let atts = {
  'origin': 'KGD',
  'destination': 'SVX',
  'depart_date': '2020-05-25'
};

// формируем запрос
const getPrice = (url, atts) => {
  return calendar + '/?' + Object.keys(atts).map(key => key + '=' + atts[key]).join('&');
}

// выводим результат
getData(getPrice(calendar,atts), (data) => {
  console.log(JSON.parse(data));
});


// city = JSON.parse(data).filter((item) => {
//   return item.name !== null or undefined
// });