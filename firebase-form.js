const form = document.querySelector('#service-form');

if (form) {
  const message = form.querySelector('#form-message');
  const continuation = form.querySelector('#continuation-choice');
  const contactInput = form.elements.contact;

  form.elements.contactType.addEventListener('change', () => {
    const email = form.elements.contactType.value === 'email';
    contactInput.placeholder = email ? 'np. kontakt@example.pl' : 'np. 500 000 000';
    contactInput.autocomplete = email ? 'email' : 'tel';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.className = 'form-message';
    message.textContent = '';

    if (!form.checkValidity()) {
      form.reportValidity();
      message.classList.add('error');
      message.textContent = 'Uzupełnij podstawowe dane i wybierz sposób przekazania sprzętu.';
      return;
    }
    if (form.elements.company.value) return;

    const contactType = form.elements.contactType.value;
    const contact = contactInput.value.trim();
    const valid = contactType === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) : /^[+\d][\d\s()-]{4,}$/.test(contact);
    if (!valid) {
      message.classList.add('error');
      message.textContent = contactType === 'email' ? 'Wpisz poprawny adres e-mail.' : 'Wpisz poprawny numer telefonu.';
      contactInput.focus();
      return;
    }

    sessionStorage.setItem('itServiceDraft', JSON.stringify({
      name: form.elements.name.value.trim(),
      contact,
      contactType,
      device: form.elements.device.value,
      serviceType: form.elements.serviceType.value,
      deliveryMethod: form.elements.deliveryMethod.value
    }));
    continuation.hidden = false;
    form.querySelector('.form-grid').classList.add('form-complete');
    form.querySelector('.form-submit').hidden = true;
    continuation.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

