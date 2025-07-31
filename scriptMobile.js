// Инициализация мобильного меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.nav-mobile');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Закрытие меню при клике на ссылку
    const mobileLinks = document.querySelectorAll('.nav-mobile-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Инициализация слайдера hero-секции
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.pagination-dots');
    let currentSlide = 0;
    let slideInterval;

    // Создание точек пагинации
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(index);
            startSlideTimer();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function startSlideTimer() {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    // Запуск автоматической смены слайдов
    startSlideTimer();
}

// Инициализация системы бронирования
function initBookingSystem() {
    const bookingForm = document.getElementById('booking-form');
    const steps = document.querySelectorAll('.booking-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');
    const hotelOptions = document.querySelectorAll('.hotel-option');
    const roomOptions = document.querySelectorAll('.room-option');
    const checkinDateInput = document.getElementById('checkin-date');
    const checkoutDateInput = document.getElementById('checkout-date');
    
    let currentStep = 1;
    let selectedHotel = null;
    let selectedRoom = 'standard';
    let checkinDate = null;
    let checkoutDate = null;
    
    // Устанавливаем минимальную дату - сегодня
    const today = new Date().toISOString().split('T')[0];
    checkinDateInput.min = today;
    
    // Обработчики для выбора отеля
    hotelOptions.forEach(option => {
        option.addEventListener('click', () => {
            hotelOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedHotel = option.dataset.hotel;
        });
    });
    
    // Обработчики для выбора типа номера
    roomOptions.forEach(option => {
        option.addEventListener('click', () => {
            roomOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedRoom = option.dataset.room;
        });
    });
    
    // Обработчики для кнопок навигации
    nextBtn.addEventListener('click', goToNextStep);
    prevBtn.addEventListener('click', goToPrevStep);
    submitBtn.addEventListener('click', submitBooking);
    
    // Обработчики для дат
    checkinDateInput.addEventListener('change', updateDates);
    checkoutDateInput.addEventListener('change', updateDates);
    
    // Функция перехода к следующему шагу
    function goToNextStep() {
        if (currentStep === 1 && !selectedHotel) {
            showError('Пожалуйста, выберите отель');
            return;
        }
        
        if (currentStep === 2 && (!checkinDate || !checkoutDate)) {
            showError('Пожалуйста, выберите даты заезда и выезда');
            return;
        }
        
        if (currentStep === 2 && new Date(checkoutDate) <= new Date(checkinDate)) {
            showError('Дата выезда должна быть позже даты заезда');
            return;
        }
        
        // Обновляем шаги
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(step => step.classList.remove('active'));
        
        currentStep++;
        
        document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('active');
        
        // Обновляем кнопки
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === 3) {
            updateBookingSummary();
        }
    }
    
    // Функция перехода к предыдущему шагу
    function goToPrevStep() {
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(step => step.classList.remove('active'));
        
        currentStep--;
        
        document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('active');
        
        // Обновляем кнопки
        prevBtn.disabled = currentStep === 1;
    }
    
    // Обновление дат
    function updateDates() {
        checkinDate = checkinDateInput.value;
        checkoutDate = checkoutDateInput.value;
    }
    
    // Обновление сводки бронирования
    function updateBookingSummary() {
        // Обновляем изображение отеля
        const summaryImage = document.querySelector('.summary-image');
        const selectedHotelOption = document.querySelector(`.hotel-option[data-hotel="${selectedHotel}"]`);
        if (selectedHotelOption) {
            const hotelImage = selectedHotelOption.querySelector('.hotel-image');
            summaryImage.style.backgroundImage = hotelImage.style.backgroundImage;
        }
        
        // Обновляем название отеля
        const summaryHotelName = document.querySelector('.summary-details h4');
        if (selectedHotel === 'bulvar') {
            summaryHotelName.textContent = '"У Капитана" на Нагорном бульваре';
        } else {
            summaryHotelName.textContent = '"У Капитана" на Севастопольском проспекте';
        }
        
        // Обновляем даты
        const summaryDates = document.getElementById('summary-dates');
        const checkin = formatDate(checkinDate);
        const checkout = formatDate(checkoutDate);
        summaryDates.textContent = `${checkin} - ${checkout}`;
        
        // Обновляем количество ночей
        const nights = calculateNights(checkinDate, checkoutDate);
        document.getElementById('summary-nights').textContent = `${nights} ${getNightWord(nights)}`;
        
        // Обновляем тип номера
        const summaryRoom = document.getElementById('summary-room');
        const roomNames = {
            'standard': 'Стандарт',
            'comfort': 'Комфорт',
            'junior-suite': 'Полулюкс'
        };
        summaryRoom.textContent = roomNames[selectedRoom] || 'Стандарт';
        
        // Обновляем стоимость
        const roomPrices = {
            'standard': selectedHotel === 'bulvar' ? 3500 : 3800,
            'comfort': 4500,
            'junior-suite': selectedHotel === 'bulvar' ? 6000 : 6500
        };
        
        const pricePerNight = roomPrices[selectedRoom] || 3500;
        const basePrice = nights * pricePerNight;
        let discount = 0;
        
        // Скидка 10% при бронировании от 3 ночей
        if (nights >= 3) {
            discount = basePrice * 0.1;
        }
        
        const total = basePrice - discount;
        
        // Обновляем цены в сводке
        const priceItems = document.querySelectorAll('.price-item');
        priceItems[0].innerHTML = `<span>${nights} ${getNightWord(nights)} × ${pricePerNight}₽</span><span>${basePrice}₽</span>`;
        
        if (discount > 0) {
            priceItems[1].style.display = 'flex';
            priceItems[1].innerHTML = `<span>Скидка 10%</span><span>-${discount}₽</span>`;
        } else {
            priceItems[1].style.display = 'none';
        }
        
        priceItems[2].innerHTML = `<span>Итого</span><span>${total}₽</span>`;
    }
    
    // Расчет количества ночей
    function calculateNights(checkin, checkout) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(checkin);
        const secondDate = new Date(checkout);
        return Math.round(Math.abs((firstDate - secondDate) / oneDay));
    }
    
    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long' };
        return date.toLocaleDateString('ru-RU', options);
    }
    
    // Получение правильной формы слова "ночь"
    function getNightWord(nights) {
        const lastDigit = nights % 10;
        const lastTwoDigits = nights % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return 'ночей';
        }
        
        if (lastDigit === 1) {
            return 'ночь';
        }
        
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'ночи';
        }
        
        return 'ночей';
    }
    
    // Отправка формы бронирования
    function submitBooking(e) {
        e.preventDefault();
        
        // Проверяем заполнение контактной информации
        const guestName = document.getElementById('guest-name').value;
        const guestPhone = document.getElementById('guest-phone').value;
        const guestEmail = document.getElementById('guest-email').value;
        
        if (!guestName || !guestPhone || !guestEmail) {
            showError('Пожалуйста, заполните все поля контактной информации');
            return;
        }
        
        // Здесь должна быть логика отправки данных на сервер
        // Временно используем alert для демонстрации
        
        const bookingData = {
            hotel: selectedHotel === 'bulvar' ? 
                '"У Капитана" на Нагорном бульваре' : 
                '"У Капитана" на Севастопольском проспекте',
            roomType: selectedRoom,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            guestName: guestName,
            guestPhone: guestPhone,
            guestEmail: guestEmail
        };
        
        console.log('Данные бронирования:', bookingData);
        
        // Показываем сообщение об успешном бронировании
        alert('Бронирование успешно оформлено! Мы отправили подтверждение на вашу электронную почту.');
        
        // Сбрасываем форму
        resetBookingForm();
    }
    
    // Сброс формы бронирования
    function resetBookingForm() {
        bookingForm.reset();
        hotelOptions.forEach(opt => opt.classList.remove('selected'));
        roomOptions.forEach(opt => opt.classList.remove('selected'));
        checkinDateInput.value = '';
        checkoutDateInput.value = '';
        checkinDate = null;
        checkoutDate = null;
        selectedHotel = null;
        selectedRoom = 'standard';
        
        // Возвращаемся к первому шагу
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(step => step.classList.remove('active'));
        currentStep = 1;
        document.querySelector('.booking-step[data-step="1"]').classList.add('active');
        document.querySelector('.step-indicator[data-step="1"]').classList.add('active');
        prevBtn.disabled = true;
    }
    
    // Показ ошибки
    function showError(message) {
        // Здесь можно реализовать красивый вывод ошибок
        alert(message);
    }
}

// Инициализация галереи
function initGallery() {
    // Данные галереи
    const galleryData = {
        "bulvar": {
            name: "'У Капитана' на Нагорном бульваре",
            address: "г. Москва, Нагорный бульвар, д. 19, корпус 1",
            description: "Современный отель с комфортабельными номерами и высоким уровнем сервиса. Идеальное расположение в шаговой доступности от метро.",
            images: [
                'images/hotel1/1-mobile.jpg', 'images/hotel1/2-mobile.jpg', 'images/hotel1/3-mobile.jpg',
                'images/hotel1/4-mobile.jpg', 'images/hotel1/5-mobile.jpg', 'images/hotel1/6-mobile.jpg'
            ]
        },
        "sevastopol": {
            name: "Отель 'У Капитана' на Севастопольском проспекте",
            address: "г. Москва, Севастопольский пр-т, д. 28, корпус 8",
            description: "Элегантный отель с просторными номерами и панорамными видами. Удобная транспортная развязка и бесплатная парковка для гостей.",
            images: [
                'images/hotel2/1-mobile.jpg', 'images/hotel2/2-mobile.jpg', 'images/hotel2/3-mobile.jpg',
                'images/hotel2/4-mobile.jpg', 'images/hotel2/5-mobile.jpg', 'images/hotel2/6-mobile.jpg'
            ]
        }
    };

    // DOM элементы
    const tabs = document.querySelectorAll('.gallery-tab');
    const mainSlide = document.querySelector('.main-slide');
    const thumbnailsContainers = document.querySelectorAll('.thumbnails-grid');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const currentSlideEl = document.querySelector('.current-slide');
    const totalSlidesEl = document.querySelector('.total-slides');
    const hotelNameEl = document.querySelector('.hotel-name');
    const hotelAddressEl = document.querySelector('.hotel-address span');
    const hotelTextEl = document.querySelector('.hotel-text');

    // Состояние галереи
    let currentHotel = "bulvar";
    let currentImageIndex = 0;
    let currentImages = galleryData[currentHotel].images;
    
    // Инициализация миниатюр
    function initThumbnails() {
        thumbnailsContainers.forEach(container => {
            container.innerHTML = '';
            const hotel = container.dataset.hotel;
            
            galleryData[hotel].images.forEach((img, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                thumbnail.dataset.index = index;
                
                const imgElement = document.createElement('img');
                imgElement.src = img;
                imgElement.alt = `Фото отеля ${index + 1}`;
                imgElement.loading = 'lazy';
                
                thumbnail.appendChild(imgElement);
                container.appendChild(thumbnail);
                
                // Обработчик клика по миниатюре
                thumbnail.addEventListener('click', () => {
                    goToSlide(index);
                });
            });
        });
        
        // Установка общего количества слайдов
        totalSlidesEl.textContent = currentImages.length;
    }
    
    // Переключение между отелями
    function switchHotel(hotel) {
        currentHotel = hotel;
        currentImages = galleryData[hotel].images;
        currentImageIndex = 0;
        
        // Обновление активной вкладки
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.hotel === hotel);
        });
        
        // Показать соответствующие миниатюры
        thumbnailsContainers.forEach(container => {
            container.style.display = container.dataset.hotel === hotel ? 'grid' : 'none';
        });
        
        // Обновление информации об отеле
        hotelNameEl.textContent = galleryData[hotel].name;
        hotelAddressEl.textContent = galleryData[hotel].address;
        hotelTextEl.textContent = galleryData[hotel].description;
        
        // Обновление счетчика
        totalSlidesEl.textContent = currentImages.length;
        
        // Показать первое изображение
        goToSlide(0);
    }
    
    // Переход к определенному слайду
    function goToSlide(index) {
        // Проверка границ
        if (index < 0) index = currentImages.length - 1;
        if (index >= currentImages.length) index = 0;
        
        currentImageIndex = index;
        
        // Создаем новое изображение
        const newImage = document.createElement('img');
        newImage.src = currentImages[index];
        newImage.alt = `Фото отеля ${index + 1}`;
        newImage.classList.add('main-image');
        
        // Добавляем в контейнер
        mainSlide.appendChild(newImage);
        
        // Анимация перехода
        setTimeout(() => {
            newImage.style.opacity = '1';
            newImage.classList.add('active');
            
            // Удаляем старое активное изображение
            const oldImage = document.querySelector('.main-image:not(.active)');
            if (oldImage) {
                oldImage.style.opacity = '0';
                setTimeout(() => {
                    oldImage.remove();
                }, 500);
            }
            
            // Обновляем активную миниатюру
            updateActiveThumbnail();
            
            // Обновляем счетчик
            currentSlideEl.textContent = index + 1;
        }, 50);
    }
    
    // Обновление активной миниатюры
    function updateActiveThumbnail() {
        // Убираем активный класс у всех миниатюр текущего отеля
        document.querySelectorAll(`.thumbnails-grid[data-hotel="${currentHotel}"] .thumbnail`).forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        // Добавляем активный класс к текущей миниатюре
        const activeThumb = document.querySelector(`.thumbnails-grid[data-hotel="${currentHotel}"] .thumbnail[data-index="${currentImageIndex}"]`);
        if (activeThumb) {
            activeThumb.classList.add('active');
        }
    }
    
    // Следующее изображение
    function nextSlide() {
        goToSlide(currentImageIndex + 1);
    }
    
    // Предыдущее изображение
    function prevSlide() {
        goToSlide(currentImageIndex - 1);
    }
    
    // Обработчики событий
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchHotel(tab.dataset.hotel);
        });
    });
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Инициализация
    initThumbnails();
    switchHotel(currentHotel);
    
    // Автопрокрутка
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Остановка автопрокрутки при наведении
    const galleryArea = document.querySelector('.gallery-content');
    galleryArea.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    galleryArea.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

// Инициализация интерактивных контактов
function initInteractiveContacts() {
    // Переключение между табами контактов
    const contactTabs = document.querySelectorAll('.contact-tab');
    const contactInfos = document.querySelectorAll('.contact-info');
    
    contactTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Убираем активный класс у всех табов и контента
            contactTabs.forEach(t => t.classList.remove('active'));
            contactInfos.forEach(info => info.classList.remove('active'));
            
            // Добавляем активный класс текущему табу и соответствующему контенту
            tab.classList.add('active');
            document.querySelector(`.contact-info[data-tab="${tabName}"]`).classList.add('active'));
            
            // Обновляем карту (если нужно)
            updateMapMarker(tabName);
        });
    });
    
    // Управление картой через кнопки
    const mapControls = document.querySelectorAll('.map-control-btn');
    if (mapControls.length > 0) {
        mapControls.forEach(control => {
            control.addEventListener('click', () => {
                const hotel = control.dataset.hotel;
                
                // Обновляем активный таб
                contactTabs.forEach(t => t.classList.remove('active'));
                contactInfos.forEach(info => info.classList.remove('active'));
                
                document.querySelector(`.contact-tab[data-tab="${hotel}"]`).classList.add('active'));
                document.querySelector(`.contact-info[data-tab="${hotel}"]`).classList.add('active'));
                
                // Обновляем карту
                updateMapMarker(hotel);
            });
        });
    }
    
    // Обработка формы обратной связи
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь должна быть логика отправки формы
            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                message: document.getElementById('contact-message').value
            };
            
            console.log('Форма отправлена:', formData);
            
            // Показываем сообщение об успешной отправке
            alert('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
            
            // Сбрасываем форму
            contactForm.reset();
        });
    }
}

// Функция для обновления маркера на карте (заглушка)
function updateMapMarker(hotel) {
    console.log(`Активный отель: ${hotel}`);
    // Здесь должна быть логика обновления карты
    // В реальном проекте это будет взаимодействие с API Яндекс.Карт
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeroSlider();
    initBookingSystem();
    initGallery();
    initInteractiveContacts();
    
    // Инициализация Яндекс.Карт
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(init);
        
        function init() {
            const map = new ymaps.Map('yandex-map', {
                center: [55.6716345, 37.5997224],
                zoom: 12,
                controls: ['zoomControl']
            });

            // Создаем метки
            const hostel1 = new ymaps.Placemark(
                [55.6716345, 37.5997224],
                { hintContent: '"У Капитана" на Нагорном бульваре' },
                { iconImageHref: 'images/Loggo2.png', iconImageSize: [40, 40] }
            );

            const hostel2 = new ymaps.Placemark(
                [55.6633108, 37.5744657],
                { hintContent: '"У Капитана" на Севастопольском проспекте' },
                { iconImageHref: 'images/Loggo2.png', iconImageSize: [40, 40] }
            );

            // Добавляем метки на карту
            map.geoObjects.add(hostel1).add(hostel2);

            // Обработчики для кнопок управления картой
            document.querySelector('.map-control-btn[data-hotel="bulvar"]').addEventListener('click', function() {
                map.setCenter([55.6716345, 37.5997224], 15);
                document.querySelector('.contact-tab[data-tab="bulvar"]').click();
            });

            document.querySelector('.map-control-btn[data-hotel="sevastopol"]').addEventListener('click', function() {
                map.setCenter([55.6633108, 37.5744657], 15);
                document.querySelector('.contact-tab[data-tab="sevastopol"]').click();
            });
        }
    }
});