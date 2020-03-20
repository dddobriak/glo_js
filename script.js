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

      // Второе усложненное дз за 19е
      const fixInput = input.value.toLowerCase();
      //-- Выводим только те города, где соответствует 1я буква
      if (fixInput[0] !== fixItem[0]) return false;

      return fixItem.includes(input.value.toLowerCase())
    });

    //-- Сортируем по алфавиту
    const sortFilterCity = filterCity.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    sortFilterCity.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('dropdown__city');
      li.textContent = item.name;
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

const renderCheapDay = (cheapTicket) => {
  //console.log(cheapTicket);
};

// ДЗ за 19 число - сортировка билетов (которые не на этот день) по дате
const renderCheapYear = (cheapTickets) => {
  const sortItems = cheapTickets.sort((a, b) => {
    if (a.depart_date > b.depart_date) return 1;
    if (a.depart_date < b.depart_date) return -1;
    return 0;
  });

  // Временный массив дат, для проверки
  const getItemDates = sortItems.map((item) => {
    return item.depart_date;
  });

  console.log(getItemDates);
};

const renderCheap = (data, date) => {
  const cheapTicketYear = JSON.parse(data).best_prices;

  const cheapTicketDay = cheapTicketYear.filter((item) => {
    return item.depart_date === date; 
  });

  renderCheapYear(cheapTicketYear);
  renderCheapDay(cheapTicketDay);
};

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

// -- Работа с формой
formSearch.addEventListener('submit', (event) => {
  event.preventDefault();

  const cityFrom = city.find((item) => {
    return inputCitiesFrom.value === item.name;
  });

  const cityTo = city.find((item) => {
    return inputCitiesTo.value === item.name;
  });

  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value
  }

  const requestData = `?depart_date=${formData.when}&origin=${formData.from}` +
    `&destination=${formData.to}&one_way=true`;

  getData(calendar + requestData, (response) => {
    renderCheap(response, formData.when);
  });

});

// Вызовы функций
getData(citiesApi, (data) => {
  city = JSON.parse(data).filter((item) => item.name);
});

// city = JSON.parse(data).filter((item) => {
//   return item.name !== null or undefined
// });