// ICI NOTRE LOGIQUE PRINCIPALE (CODE JAVASCRIPT) POUR LE PROJET LifeSpan INSIGHTS
/* ==============================
LIFESPAN INSIGHTS – JAVASCRIPT
Version: 1.0
Auteur : Brenya Sonabo - BS3 DIGITAL
Police : Poppins (Google Fonts)
* Objectif : Calculs temporels précis + signe astrologique
============================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lifespan-form");
  const userNameInput = document.getElementById("user-name");
  const birthdateInput = document.getElementById("birthdate");

  // Éléments de sortie
  const displayName = document.getElementById("display-name");
  const currentAgeEl = document.getElementById("current-age");
  const totalDaysEl = document.getElementById("total-days");
  const decadesLivedEl = document.getElementById("decades-lived");
  const nextBirthdayEl = document.getElementById("next-birthday");
  const ageIn2050El = document.getElementById("age-in-2050");
  const zodiacSignEl = document.getElementById("zodiac-sign");

  // Tableau des signes astrologiques (début de chaque période)
  const zodiacSigns = [
    { start: [3, 21], end: [4, 19], name: "Bélier" },
    { start: [4, 20], end: [5, 20], name: "Taureau" },
    { start: [5, 21], end: [6, 20], name: "Gémeaux" },
    { start: [6, 21], end: [7, 22], name: "Cancer" },
    { start: [7, 23], end: [8, 22], name: "Lion" },
    { start: [8, 23], end: [9, 22], name: "Vierge" },
    { start: [9, 23], end: [10, 22], name: "Balance" },
    { start: [10, 23], end: [11, 21], name: "Scorpion" },
    { start: [11, 22], end: [12, 21], name: "Sagittaire" },
    { start: [12, 22], end: [1, 19], name: "Capricorne" },
    { start: [1, 20], end: [2, 18], name: "Verseau" },
    { start: [2, 19], end: [3, 20], name: "Poissons" },
  ];

  /**
   * Vérifie si une chaîne contient uniquement des lettres et des espaces
   */
  function isValidName(name) {
    return /^[a-zA-ZÀ-ÿ\s]+$/.test(name.trim()) && name.trim().length > 0;
  }

  /**
   * Calcule l’âge exact : années, mois, jours
   * Basé sur l’algorithme de soustraction de dates avec ajustement manuel
   */
  function calculateAge(birthDate) {
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Ajustement si le jour du mois n’est pas encore atteint
    if (days < 0) {
      months--;
      // Obtenir le dernier jour du mois précédent
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  /**
   * Compte les jours entre deux dates (inclut les bissextiles)
   */
  function daysBetween(start, end) {
    const oneDay = 24 * 60 * 60 * 1000; // Millisecondes par jour
    const diffTime = Math.abs(end - start);
    return Math.floor(diffTime / oneDay);
  }

  /**
   * Calcule le prochain anniversaire
   */
  function nextBirthday(birthDate) {
    const today = new Date();
    let nextBday = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );

    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }

    return daysBetween(today, nextBday);
  }

  /**
   * Retourne le signe astrologique
   */
  function getZodiacSign(month, day) {
    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;

      if (startMonth === endMonth) {
        // Cas simple (ex. Bélier)
        if (month === startMonth && day >= startDay && day <= endDay) {
          return sign.name;
        }
      } else if (startMonth > endMonth) {
        // Cas avec passage à l’année suivante (Capricorne)
        if (
          (month === startMonth && day >= startDay) ||
          (month === endMonth && day <= endDay)
        ) {
          return sign.name;
        }
      } else {
        // Cas normal (ex. Scorpion)
        if (month === startMonth && day >= startDay) return sign.name;
        if (month === endMonth && day <= endDay) return sign.name;
      }
    }
    return "Inconnu";
  }

  /**
   * Gestion de la soumission du formulaire
   */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = userNameInput.value.trim();
    const birthStr = birthdateInput.value;

    // Validation du nom
    if (!isValidName(name)) {
      alert(
        "Veuillez entrer un nom valide (lettres uniquement, pas de chiffres)."
      );
      userNameInput.focus();
      return;
    }

    // Validation de la date
    if (!birthStr) {
      alert("Veuillez sélectionner une date de naissance.");
      birthdateInput.focus();
      return;
    }

    const birthDate = new Date(birthStr);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      alert("Date de naissance invalide.");
      return;
    }

    if (birthDate > today) {
      alert("La date de naissance ne peut pas être dans le futur.");
      return;
    }

    // 1. Afficher le nom
    displayName.textContent = name;

    // 2. Âge actuel
    const age = calculateAge(birthDate);
    currentAgeEl.textContent = `${age.years} ans, ${age.months} mois, ${age.days} jours`;

    // 3. Jours vécus
    const totalDays = daysBetween(birthDate, today);
    totalDaysEl.textContent = `${totalDays} jours`;

    // 4. Décennies vécues
    const decades = Math.floor(age.years / 10);
    decadesLivedEl.textContent = `${decades} décennie${decades > 1 ? "s" : ""}`;

    // 5. Prochain anniversaire
    const daysToNextBday = nextBirthday(birthDate);
    nextBirthdayEl.textContent = `${daysToNextBday} jour${
      daysToNextBday !== 1 ? "s" : ""
    }`;

    // 6. Âge en 2050 (jours vécus jusqu’au 1er janvier 2050)
    const target2050 = new Date("2050-01-01");
    let daysUntil2050 = 0;
    if (birthDate < target2050) {
      daysUntil2050 = daysBetween(birthDate, target2050);
    } else {
      daysUntil2050 = 0;
    }
    ageIn2050El.textContent = `${daysUntil2050} jours`;

    // 7. Signe astrologique
    const userMonth = birthDate.getMonth() + 1; // Janvier = 0 → +1
    const userDay = birthDate.getDate();
    const zodiac = getZodiacSign(userMonth, userDay);
    zodiacSignEl.textContent = zodiac;
  });
});
