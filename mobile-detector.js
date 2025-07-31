// Функция для определения мобильного устройства
function isMobileDevice() {
return (typeof window.orientation !== "undefined") ||
(navigator.userAgent.indexOf('IEMobile') !== -1) ||
(window.innerWidth <= 768);
}

    // Перенаправление на соответствующую версию сайта
    if (isMobileDevice()) {
    // Проверяем, не находимся ли мы уже на мобильной версии
    if (!window.location.href.includes('mobile.html')) {
        // Сохраняем оригинальный путь без параметров
        const cleanPath = window.location.href.split('?')[0].split('#')[0];
        const mobileUrl = cleanPath.replace(/index.html$/, 'mobile.html') +
        window.location.search + window.location.hash;
            // Перенаправляем на мобильную версию
            window.location.href = mobileUrl;
    }
}