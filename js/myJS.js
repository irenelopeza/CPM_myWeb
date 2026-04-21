/* ReqJ1 */
const form = document.querySelector('form');
if (!form) {
    console.log('No form found; exit')
    exit(0);
}

/* ReqJ2 */
function updatePreview() {
    const name = document.querySelector('#name').value;
    const phone = document.querySelector('#phone').value;
    const email = document.querySelector('#email').value;
    const message = document.querySelector('#message').value;

    preview.innerHTML = `
    <h3>Contact Preview</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong> ${message}</p>
    `;
}

/* ReqJ3 */
function checkValidityState(field) {

    field.classList.remove('valid', 'invalid');

    if (field.checkValidity()) {
        field.classList.add('valid');
    } else {
        field.classList.add('invalid');
    }
}

/* ReqJ4 */ 
function validateForm() {

    /* ReqJ5 */ 
    const errorBox = document.getElementById('error-box');

    errorBox.textContent = '';
    errorBox.classList.remove('visible');

    const form = document.querySelector('form');
    if (!form.reportValidity()) {
        return false;
    }

    const customError = checkCustomRules();

    if (customError) {
        errorBox.textContent = customError;
        errorBox.classList.add('visible');
        return false;
    }

    document.querySelector('#message').focus();

    return true;
}

function checkCustomRules() {

    const referralSelected = document.querySelector('#referral').checked;
    const message = document.querySelector('#message').value.toLowerCase();
    // Rule: if "Referral" is selected, message must include "friend"
    if (referralSelected && !message.includes("friend")) {
        /* ReqJ6 */ 
        document.querySelector('#message').focus();
        return 'If you select "Referral", please mention your friend in the message.';
    }

    const version = document.querySelector('#category').value;
    // Rule: certain game versions do NOT support fossil hunting
    if (version === 'designer' || version === 'amiibo') {
        document.querySelector('#category').focus();
        return 'This version of Animal Crossing does not support fossil hunting or related features.';
    }

    return null;
}

 /* ReqJ7 */
function handleKeyDown(event) {
    if (event.key === 'Enter') {
        document.getElementById('submit').classList.add('highlight');
    }
}

/* ReqJ8 */
function handleMouseOver(element) {
    element.dataset.originalText = element.textContent; // guardar texto original
    element.textContent = "Ready to click!";
}
function handleMouseOut(element) {
    element.textContent = element.dataset.originalText; // restaurar texto
}



