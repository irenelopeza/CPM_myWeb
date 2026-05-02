'use strict'; 
/* ===================================================== 
TRANSLATION STORAGE 
===================================================== */ 
// Object that will hold all translation dictionaries 
let translations = {}; 


/* ReqI3 */
function applyTranslations(locale) { 
 
    const dictionary = translations[locale]; 
 
    if (!dictionary) { 
        console.warn(`Translations for "${locale}" not found.`); 
        return; 
    } 
 
    /* ---- Text content ---- */ 
    document.querySelectorAll('[data-i18n]').forEach(element => { 
        const key = element.dataset.i18n; 
        const text = dictionary[key]; 
 
        if (text !== undefined) { 
            element.innerHTML = text; 
        } 
    }); 
 
    /* ---- ALT attributes ---- */ 
    document.querySelectorAll('[data-i18n-alt]').forEach(element => { 
        const key = element.dataset.i18nAlt; 
        if (dictionary[key]) element.alt = dictionary[key]; 
    }); 
 
    /* ---- TITLE attributes ---- */ 
    document.querySelectorAll('[data-i18n-title]').forEach(element => { 
        const key = element.dataset.i18nTitle; 
        if (dictionary[key]) element.title = dictionary[key]; 
    }); 
 
    // Update document language for accessibility 
    document.documentElement.lang = locale; 
}


/* ReqI5 */ 
(function initI18n() { 
    const i18nSelectors = [ 
        '[data-i18n]', 
        '[data-i18n-alt]', 
        '[data-i18n-title]', 
        '[data-date]', 
        '[data-price]', 
        '#language-switcher' 
    ].join(','); 
 
    if (!document.querySelector(i18nSelectors)) { 
        console.debug('i18n: no translatable elements or language control found — initialization skipped.'); 
        return; 
    }    
 
    //rest of the code runs only if at least one i18n-related element is detected 
    console.debug('i18n: translatable elements or language control  — initializing.'); 
 
    // Load translation file 
    fetch("/CPM_myWeb/js/i18n/translations.json") 
        .then(response => response.json()) 
        .then(data => { 
    
            translations = data; 
    
            // Retrieve saved language or default to English 
            const savedLanguage = 
                localStorage.getItem('preferredLanguage') || 'en'; 
    
            switchLanguage(savedLanguage); 
        }) 
        .catch(error => { 
            console.error('Failed to load translations:', error); 
        }); 

})(); // self-invoking function to run immediately on script load 
    




/** 
* Changes language and stores user preference. 
*/ 
/* ReqI4 - ReqI6 */
function switchLanguage(locale) { 
    applyTranslations(locale); 
    localStorage.setItem('preferredLanguage', locale); 

    applyDateFormat(locale);
    applyPriceFormat(locale);
    applyNumberFormat(locale);
    applyPercentageFormat(locale);

    const footer = document.querySelector("footer");
    if (footer) {
        footer.setAttribute("lang", locale);
    }
} 
//switchLanguage('en'); // Default to eng on initial load

// Load translation file
/* ReqI2 */
fetch('/js/i18n/translations.json') 
    .then(response => response.json()) 
    .then(data => { 
        translations = data; 

        // Retrieve saved language or default to English 
        const savedLanguage = 
            localStorage.getItem('preferredLanguage') || 'en';

        switchLanguage(savedLanguage);
    }) 
    .catch(error => { 
        console.error('Failed to load translations:', error); 
    });
    
console.log("error");   

/* ReqI8 */
function createDateFormatter(locale) { 

    const dateLocale = locale === 'es' ? 'es-ES' : 'en-GB'; 

    return new Intl.DateTimeFormat(dateLocale, { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }); 
}
function formatDate(date, formatter) {
    try {
        return formatter.format(date);
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid date";
    }
}
function applyDateFormat(locale) {
    const formatter = createDateFormatter(locale);
    const elements = document.querySelectorAll("[data-date]");

    elements.forEach(el => {
        let dateStr = (el.dataset.date || "").trim();
        
        if (!dateStr) {
            const now = new Date();
            dateStr = now.toISOString();
            el.dataset.date = dateStr;
        }

        const date = new Date(dateStr);

        if (isNaN(date)) {
            console.error("Invalid date in data-date:", dateStr);
            el.textContent = "Invalid date";
            return;
        }

        el.textContent = formatDate(date, formatter);
    });
}


/* ReqI9 */
function createCurrencyFormatter(locale) {
    const region = locale === 'es' ? 'es-ES' : 'en-GB';
    const currency = locale === 'es' ? 'EUR' : 'GBP';

    return new Intl.NumberFormat(region, {
        style: "currency",
        currency: currency
    });
}
function formatPrice(value, formatter) {
    const number = Number(value);
    if (isNaN(number)) {
        console.error("Invalid price:", value);
        return "Invalid price";
    }
    return formatter.format(number);
}
function applyPriceFormat(locale) {
    const formatter = createCurrencyFormatter(locale);
    const elements = document.querySelectorAll("[data-price]");

    elements.forEach(el => {
        const raw = (el.dataset.price || "").trim();
        if (!raw) return;

        el.textContent = formatPrice(raw, formatter);
    });
}


/* ReqI10 */
function createNumberFormatter(locale) {
    const region = locale === 'es' ? 'es-ES' : 'en-GB';
    return new Intl.NumberFormat(region);
}
function formatNumber(value, formatter) {
    const number = Number(value);
    if (isNaN(number)) {
        console.error("Invalid number:", value);
        return "Invalid number";
    }
    return formatter.format(number);
}
function applyNumberFormat(locale) {
    const formatter = createNumberFormatter(locale);
    const elements = document.querySelectorAll("[data-number]");

    elements.forEach(el => {
        const raw = (el.dataset.number || "").trim();
        if (!raw) return;

        el.textContent = formatNumber(raw, formatter);
    });
}


/* ReqI10 */
function createPercentageFormatter(locale) {
    const region = locale === 'es' ? 'es-ES' : 'en-GB';
    return new Intl.NumberFormat(region, {
        style: "percent",
        maximumFractionDigits: 2
    });
}
function formatPercentage(value, formatter) {
    const number = Number(value);
    if (isNaN(number)) {
        console.error("Invalid percentage:", value);
        return "Invalid percentage";
    }
    return formatter.format(number);
}
function applyPercentageFormat(locale) {
    const formatter = createPercentageFormatter(locale);
    const elements = document.querySelectorAll("[data-percentage]");

    elements.forEach(el => {
        const raw = (el.dataset.percentage || "").trim();
        if (!raw) return;

        el.textContent = formatPercentage(raw, formatter);
    });
}

