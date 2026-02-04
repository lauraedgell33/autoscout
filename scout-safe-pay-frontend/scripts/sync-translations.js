#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../messages');

// Translations to add/update for each language
const translations = {
  de: {
    dashboard: {
      seller: {
        add_vehicle: "Neues Fahrzeug hinzufügen",
        add_vehicle_desc: "Fahrzeug zum Verkauf anbieten"
      }
    },
    dealers: {
      independent: "Unabhängig",
      franchise: "Franchise",
      verifiedDealers: "Verifizierte Händler",
      viewDetails: "Details anzeigen",
      visitUs: "Besuchen Sie uns"
    }
  },
  ro: {
    dashboard: {
      seller: {
        add_vehicle: "Adaugă vehicul nou",
        add_vehicle_desc: "Listează un vehicul de vânzare"
      }
    },
    dealers: {
      independent: "Independent",
      franchise: "Franciză",
      verifiedDealers: "Dealeri verificați",
      viewDetails: "Vezi detalii",
      visitUs: "Vizitează-ne",
      qualityChecked: "Verificat calitativ",
      support: "Suport",
      findYourDealer: "Găsește dealerul perfect",
      filterResults: "Folosește filtrele pentru a restrânge căutarea",
      dealersFound: "dealeri găsiți",
      page: "Pagina",
      of: "din",
      clearFilters: "Șterge toate filtrele",
      dealerType: "Tip dealer",
      activeListings: "Anunțuri active",
      viewProfile: "Vezi profilul",
      beTheFirstToReview: "Fii primul care lasă o recenzie!",
      writeAReview: "Scrie o recenzie",
      verifiedDealer: "Dealer verificat",
      verifiedDealerDescription: "Acest dealer a fost verificat de echipa noastră și îndeplinește toate standardele de calitate."
    },
    pages: {
      imprint: {
        liability: "Responsabilitate pentru conținut",
        liability_text: "Conținutul paginilor noastre a fost creat cu cea mai mare grijă. Cu toate acestea, nu putem garanta acuratețea, completitudinea sau actualitatea conținutului. Conform prevederilor legale, suntem responsabili pentru propriul conținut de pe aceste pagini web.",
        all_rights_reserved: "Toate drepturile rezervate."
      }
    },
    checkout: {
      kyc: {
        camera: {
          selfie_title: "Fă un selfie",
          document_title: "Captează documentul de identitate",
          selfie_guide: "Poziționează fața în centru",
          document_guide: "Plasează actul de identitate în cadru",
          selfie_instruction: "Privește camera și stai nemișcat",
          document_instruction: "Asigură-te că toate detaliile sunt vizibile",
          permission_denied: "Acces cameră refuzat. Te rugăm să permiți accesul la cameră în setările browserului.",
          not_found: "Nu s-a găsit nicio cameră. Verifică dispozitivul.",
          error: "Eroare la accesarea camerei. Te rugăm să încerci din nou.",
          capture_error: "Eroare la capturarea imaginii. Te rugăm să încerci din nou.",
          retry: "Reîncearcă",
          retake: "Refă",
          use_photo: "Folosește poza"
        }
      }
    },
    kyc: {
      camera: {
        selfie_title: "Fă un selfie",
        document_title: "Captează documentul de identitate",
        selfie_guide: "Poziționează fața în centru",
        document_guide: "Plasează actul de identitate în cadru",
        selfie_instruction: "Privește camera și stai nemișcat",
        document_instruction: "Asigură-te că toate detaliile sunt vizibile",
        permission_denied: "Acces cameră refuzat. Te rugăm să permiți accesul la cameră în setările browserului.",
        not_found: "Nu s-a găsit nicio cameră. Verifică dispozitivul.",
        error: "Eroare la accesarea camerei. Te rugăm să încerci din nou.",
        capture_error: "Eroare la capturarea imaginii. Te rugăm să încerci din nou."
      }
    }
  },
  es: {
    dashboard: {
      seller: {
        add_vehicle: "Añadir vehículo nuevo",
        add_vehicle_desc: "Publicar un vehículo a la venta"
      }
    },
    dealers: {
      independent: "Independiente",
      franchise: "Franquicia",
      verifiedDealers: "Concesionarios verificados",
      viewDetails: "Ver detalles",
      visitUs: "Visítanos",
      beTheFirstToReview: "¡Sé el primero en dejar una reseña!",
      writeAReview: "Escribir una reseña",
      verifiedDealer: "Concesionario verificado",
      verifiedDealerDescription: "Este concesionario ha sido verificado por nuestro equipo y cumple con todos los estándares de calidad."
    },
    pages: {
      imprint: {
        liability: "Responsabilidad por el contenido",
        liability_text: "El contenido de nuestras páginas ha sido creado con el máximo cuidado. Sin embargo, no podemos garantizar la exactitud, integridad o actualidad del contenido. De acuerdo con las disposiciones legales, somos responsables de nuestro propio contenido en estas páginas web.",
        all_rights_reserved: "Todos los derechos reservados."
      }
    },
    checkout: {
      kyc: {
        camera: {
          selfie_title: "Toma un selfie",
          document_title: "Captura el documento de identidad",
          selfie_guide: "Coloca tu rostro en el centro",
          document_guide: "Coloca tu identificación dentro del marco",
          selfie_instruction: "Mira a la cámara y quédate quieto",
          document_instruction: "Asegúrate de que todos los detalles sean visibles",
          permission_denied: "Acceso a la cámara denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador.",
          not_found: "No se encontró ninguna cámara. Por favor, verifica tu dispositivo.",
          error: "Error al acceder a la cámara. Por favor, inténtalo de nuevo.",
          capture_error: "Error al capturar la imagen. Por favor, inténtalo de nuevo.",
          retry: "Reintentar",
          retake: "Retomar",
          use_photo: "Usar foto"
        }
      }
    },
    kyc: {
      camera: {
        selfie_title: "Toma un selfie",
        document_title: "Captura el documento de identidad",
        selfie_guide: "Coloca tu rostro en el centro",
        document_guide: "Coloca tu identificación dentro del marco",
        selfie_instruction: "Mira a la cámara y quédate quieto",
        document_instruction: "Asegúrate de que todos los detalles sean visibles",
        permission_denied: "Acceso a la cámara denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador.",
        not_found: "No se encontró ninguna cámara. Por favor, verifica tu dispositivo.",
        error: "Error al acceder a la cámara. Por favor, inténtalo de nuevo.",
        capture_error: "Error al capturar la imagen. Por favor, inténtalo de nuevo."
      }
    },
    auth: {
      register: {
        secure_registration: "Registro seguro",
        trusted: "Confiado por más de 50.000",
        support_24_7: "Soporte 24/7"
      }
    }
  },
  fr: {
    dashboard: {
      seller: {
        add_vehicle: "Ajouter un nouveau véhicule",
        add_vehicle_desc: "Mettre un véhicule en vente"
      }
    },
    dealers: {
      independent: "Indépendant",
      franchise: "Franchise",
      verifiedDealers: "Concessionnaires vérifiés",
      viewDetails: "Voir les détails",
      visitUs: "Visitez-nous",
      beTheFirstToReview: "Soyez le premier à laisser un avis !",
      writeAReview: "Écrire un avis",
      verifiedDealer: "Concessionnaire vérifié",
      verifiedDealerDescription: "Ce concessionnaire a été vérifié par notre équipe et répond à toutes les normes de qualité."
    },
    pages: {
      imprint: {
        liability: "Responsabilité du contenu",
        liability_text: "Le contenu de nos pages a été créé avec le plus grand soin. Cependant, nous ne pouvons garantir l'exactitude, l'exhaustivité ou l'actualité du contenu. Conformément aux dispositions légales, nous sommes responsables de notre propre contenu sur ces pages web.",
        all_rights_reserved: "Tous droits réservés."
      }
    },
    checkout: {
      kyc: {
        camera: {
          selfie_title: "Prenez un selfie",
          document_title: "Capturez le document d'identité",
          selfie_guide: "Positionnez votre visage au centre",
          document_guide: "Placez votre pièce d'identité dans le cadre",
          selfie_instruction: "Regardez la caméra et restez immobile",
          document_instruction: "Assurez-vous que tous les détails sont visibles",
          permission_denied: "Accès à la caméra refusé. Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.",
          not_found: "Aucune caméra trouvée. Veuillez vérifier votre appareil.",
          error: "Échec de l'accès à la caméra. Veuillez réessayer.",
          capture_error: "Échec de la capture d'image. Veuillez réessayer.",
          retry: "Réessayer",
          retake: "Reprendre",
          use_photo: "Utiliser la photo"
        }
      }
    },
    kyc: {
      camera: {
        selfie_title: "Prenez un selfie",
        document_title: "Capturez le document d'identité",
        selfie_guide: "Positionnez votre visage au centre",
        document_guide: "Placez votre pièce d'identité dans le cadre",
        selfie_instruction: "Regardez la caméra et restez immobile",
        document_instruction: "Assurez-vous que tous les détails sont visibles",
        permission_denied: "Accès à la caméra refusé. Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur.",
        not_found: "Aucune caméra trouvée. Veuillez vérifier votre appareil.",
        error: "Échec de l'accès à la caméra. Veuillez réessayer.",
        capture_error: "Échec de la capture d'image. Veuillez réessayer."
      }
    },
    auth: {
      register: {
        secure_registration: "Inscription sécurisée",
        trusted: "Plus de 50 000 utilisateurs",
        support_24_7: "Support 24/7"
      }
    }
  },
  it: {
    dashboard: {
      seller: {
        add_vehicle: "Aggiungi nuovo veicolo",
        add_vehicle_desc: "Pubblica un veicolo in vendita"
      }
    },
    dealers: {
      independent: "Indipendente",
      franchise: "Franchising",
      verifiedDealers: "Concessionari verificati",
      viewDetails: "Vedi dettagli",
      visitUs: "Visitaci",
      beTheFirstToReview: "Sii il primo a lasciare una recensione!",
      writeAReview: "Scrivi una recensione",
      verifiedDealer: "Concessionario verificato",
      verifiedDealerDescription: "Questo concessionario è stato verificato dal nostro team e soddisfa tutti gli standard di qualità."
    },
    pages: {
      imprint: {
        liability: "Responsabilità per i contenuti",
        liability_text: "I contenuti delle nostre pagine sono stati creati con la massima cura. Tuttavia, non possiamo garantire l'accuratezza, la completezza o l'attualità dei contenuti. Secondo le disposizioni di legge, siamo responsabili dei nostri contenuti su queste pagine web.",
        all_rights_reserved: "Tutti i diritti riservati."
      }
    },
    checkout: {
      kyc: {
        camera: {
          selfie_title: "Scatta un selfie",
          document_title: "Cattura il documento d'identità",
          selfie_guide: "Posiziona il viso al centro",
          document_guide: "Posiziona il documento all'interno della cornice",
          selfie_instruction: "Guarda la fotocamera e resta fermo",
          document_instruction: "Assicurati che tutti i dettagli siano visibili",
          permission_denied: "Accesso alla fotocamera negato. Consenti l'accesso alla fotocamera nelle impostazioni del browser.",
          not_found: "Nessuna fotocamera trovata. Controlla il tuo dispositivo.",
          error: "Impossibile accedere alla fotocamera. Riprova.",
          capture_error: "Impossibile catturare l'immagine. Riprova.",
          retry: "Riprova",
          retake: "Rifai",
          use_photo: "Usa foto"
        }
      }
    },
    kyc: {
      camera: {
        selfie_title: "Scatta un selfie",
        document_title: "Cattura il documento d'identità",
        selfie_guide: "Posiziona il viso al centro",
        document_guide: "Posiziona il documento all'interno della cornice",
        selfie_instruction: "Guarda la fotocamera e resta fermo",
        document_instruction: "Assicurati che tutti i dettagli siano visibili",
        permission_denied: "Accesso alla fotocamera negato. Consenti l'accesso alla fotocamera nelle impostazioni del browser.",
        not_found: "Nessuna fotocamera trovata. Controlla il tuo dispositivo.",
        error: "Impossibile accedere alla fotocamera. Riprova.",
        capture_error: "Impossibile catturare l'immagine. Riprova."
      }
    },
    auth: {
      register: {
        secure_registration: "Registrazione sicura",
        trusted: "Più di 50.000 utenti",
        support_24_7: "Supporto 24/7"
      }
    }
  },
  nl: {
    dashboard: {
      seller: {
        add_vehicle: "Nieuw voertuig toevoegen",
        add_vehicle_desc: "Een voertuig te koop aanbieden"
      }
    },
    dealers: {
      independent: "Onafhankelijk",
      franchise: "Franchise",
      verifiedDealers: "Geverifieerde dealers",
      viewDetails: "Details bekijken",
      visitUs: "Bezoek ons",
      beTheFirstToReview: "Wees de eerste om een review te schrijven!",
      writeAReview: "Schrijf een review",
      verifiedDealer: "Geverifieerde dealer",
      verifiedDealerDescription: "Deze dealer is geverifieerd door ons team en voldoet aan alle kwaliteitsnormen."
    },
    pages: {
      imprint: {
        liability: "Aansprakelijkheid voor inhoud",
        liability_text: "De inhoud van onze pagina's is met de grootste zorg gemaakt. We kunnen echter niet garanderen dat de inhoud nauwkeurig, volledig of actueel is. Volgens de wettelijke bepalingen zijn wij verantwoordelijk voor onze eigen inhoud op deze webpagina's.",
        all_rights_reserved: "Alle rechten voorbehouden."
      }
    },
    checkout: {
      kyc: {
        camera: {
          selfie_title: "Neem een selfie",
          document_title: "Leg het identiteitsbewijs vast",
          selfie_guide: "Positioneer je gezicht in het midden",
          document_guide: "Plaats je ID binnen het kader",
          selfie_instruction: "Kijk naar de camera en blijf stilstaan",
          document_instruction: "Zorg ervoor dat alle details zichtbaar zijn",
          permission_denied: "Cameratoegang geweigerd. Sta cameratoegang toe in je browserinstellingen.",
          not_found: "Geen camera gevonden. Controleer je apparaat.",
          error: "Kan geen toegang krijgen tot de camera. Probeer het opnieuw.",
          capture_error: "Kan de afbeelding niet vastleggen. Probeer het opnieuw.",
          retry: "Opnieuw proberen",
          retake: "Opnieuw maken",
          use_photo: "Foto gebruiken"
        }
      }
    },
    kyc: {
      camera: {
        selfie_title: "Neem een selfie",
        document_title: "Leg het identiteitsbewijs vast",
        selfie_guide: "Positioneer je gezicht in het midden",
        document_guide: "Plaats je ID binnen het kader",
        selfie_instruction: "Kijk naar de camera en blijf stilstaan",
        document_instruction: "Zorg ervoor dat alle details zichtbaar zijn",
        permission_denied: "Cameratoegang geweigerd. Sta cameratoegang toe in je browserinstellingen.",
        not_found: "Geen camera gevonden. Controleer je apparaat.",
        error: "Kan geen toegang krijgen tot de camera. Probeer het opnieuw.",
        capture_error: "Kan de afbeelding niet vastleggen. Probeer het opnieuw."
      }
    },
    auth: {
      register: {
        secure_registration: "Veilige registratie",
        trusted: "Vertrouwd door 50.000+",
        support_24_7: "24/7 ondersteuning"
      }
    }
  }
};

// Deep merge function
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// Remove deprecated keys
function removeKeys(obj, keysToRemove) {
  const result = { ...obj };
  
  for (const key of keysToRemove) {
    const parts = key.split('.');
    let current = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) break;
      current = current[parts[i]];
    }
    
    const lastKey = parts[parts.length - 1];
    if (current && current[lastKey] !== undefined) {
      delete current[lastKey];
    }
  }
  
  return result;
}

// Keys to remove (old/deprecated)
const keysToRemove = [
  'dashboard.seller.add_new_vehicle',
  'dashboard.seller.add_new_vehicle_desc'
];

// Process each language
for (const [lang, updates] of Object.entries(translations)) {
  const filePath = path.join(messagesDir, `${lang}.json`);
  
  console.log(`Processing ${lang}...`);
  
  // Read current file
  let current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Remove deprecated keys
  current = removeKeys(current, keysToRemove);
  
  // Merge with new translations
  const merged = deepMerge(current, updates);
  
  // Write back
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  
  console.log(`  ✅ Updated ${lang}.json`);
}

console.log('\nDone! Run check-translations.js to verify.');
