import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { addDoc, collection, getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD19Zoc4lOgeZY5SBHf9zQpZPdk4GV6O5o",
  authDomain: "it-serwis-opole-lukdobo70.firebaseapp.com",
  projectId: "it-serwis-opole-lukdobo70",
  storageBucket: "it-serwis-opole-lukdobo70.firebasestorage.app",
  messagingSenderId: "40030709547",
  appId: "1:40030709547:web:e39143edbeac832014876e"
};

const form = document.querySelector("#service-form");

if (form) {
  const db = getFirestore(initializeApp(firebaseConfig));
  const message = form.querySelector("#form-message");
  const submitButton = form.querySelector("button[type='submit']");
  const submitLabel = form.querySelector(".submit-label");
  const description = form.elements.description;
  const descriptionCount = form.querySelector("#description-count");
  const openedAt = Date.now();

  description.addEventListener("input", () => {
    descriptionCount.textContent = description.value.length;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.className = "form-message";
    message.textContent = "";

    if (!form.checkValidity()) {
      form.reportValidity();
      message.classList.add("error");
      message.textContent = "Uzupełnij wymagane pola i spróbuj ponownie.";
      return;
    }

    if (form.elements.company.value || Date.now() - openedAt < 2500) return;

    const contactType = form.elements.contactType.value;
    const contact = form.elements.contact.value.trim();
    const phonePattern = /^[+\d][\d\s()-]{4,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactIsValid = contactType === "email" ? emailPattern.test(contact) : phonePattern.test(contact);

    if (!contactIsValid) {
      message.classList.add("error");
      message.textContent = contactType === "email" ? "Wpisz poprawny adres e-mail." : "Wpisz poprawny numer telefonu.";
      form.elements.contact.focus();
      return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = "Wysyłanie...";

    try {
      await addDoc(collection(db, "zgloszenia"), {
        name: form.elements.name.value.trim(),
        contact,
        contactType,
        device: form.elements.device.value,
        serviceType: form.elements.serviceType.value,
        description: description.value.trim(),
        preferredContact: form.elements.preferredContact.value,
        createdAt: serverTimestamp(),
        status: "nowe",
        source: "strona-www",
        consent: form.elements.consent.checked
      });

      form.reset();
      descriptionCount.textContent = "0";
      message.classList.add("success");
      message.textContent = "Zgłoszenie wysłane. Skontaktujemy się z Tobą możliwie szybko.";
    } catch (error) {
      console.error("Nie udało się wysłać zgłoszenia:", error);
      message.classList.add("error");
      message.textContent = "Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub napisz przez OLX.";
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = "Wyślij zgłoszenie";
    }
  });
}

