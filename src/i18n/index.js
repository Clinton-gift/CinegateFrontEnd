// src/i18n/index.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "app_lang";

const DICT = {
  fr: {
    lang: {
      fr: "Français",
      en: "English",
    },

    home: {
      verified: "Vérifié",
      officialControl: "Contrôle officiel",
    },

    modal: {
      enterSecretCode: "Entrer le code secret",
      placeholder: "••••••",
      wrongCode: "Code incorrect.",
    },

    common: {
      back: "Retour",
      cancel: "Annuler",
      confirm: "Confirmer",
    },

    errors: {
      backendNotReady: "Backend pas encore prêt (affichage des valeurs vides).",
    },

    official: {
      statusAuthorized: "VÉHICULE AUTORISÉ",
      statusNotAuthorized: "VÉHICULE NON AUTORISÉ",

      vehicle: {
        title: "Identification du véhicule",
        subtitle: "Carte grise",
        plate: "Immatriculation",
        model: "Marque & Modèle",
        owner: "Propriétaire",
      },
      licence: {
        title: "Autorisation d'exercer",
        subtitle: "Licence",
        number: "Numéro de licence",
        validity: "Validité",
        zone: "Zone",
        doorNumber: "Numéro de portière",
      },
      driver: {
        title: "Profil du chauffeur",
        subtitle: "Permis & CNI",
        permit: "Numéro Permis",
        category: "Catégorie",
        cni: "Numéro CNI",
      },
      insurance: {
        title: "Couverture Risques",
        subtitle: "Assurance",
        company: "Compagnie",
        expiry: "Expiration",
        status: "Statut",
      },
    },
  },

  en: {
    lang: {
      fr: "French",
      en: "English",
    },

    home: {
      verified: "Verified",
      officialControl: "Official control",
    },

    modal: {
      enterSecretCode: "Enter Secret code",
      placeholder: "••••••",
      wrongCode: "Wrong code.",
    },

    common: {
      back: "Back",
      cancel: "Cancel",
      confirm: "Confirm",
    },

    errors: {
      backendNotReady: "Backend not ready yet (showing placeholders).",
    },

    official: {
      statusAuthorized: "AUTHORIZED VEHICLE",
      statusNotAuthorized: "NOT AUTHORIZED",

      vehicle: {
        title: "Vehicle identification",
        subtitle: "Registration",
        plate: "Plate number",
        model: "Brand & model",
        owner: "Owner",
      },
      licence: {
        title: "Operating authorization",
        subtitle: "Licence",
        number: "Licence number",
        validity: "Validity",
        zone: "Zone",
        doorNumber: "Door number",
      },
      driver: {
        title: "Driver profile",
        subtitle: "Permit & ID",
        permit: "Permit number",
        category: "Category",
        cni: "ID number",
      },
      insurance: {
        title: "Risk coverage",
        subtitle: "Insurance",
        company: "Company",
        expiry: "Expiry",
        status: "Status",
      },
    },
  },
};

const LanguageContext = createContext(null);

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

async function storageGet(key) {
  try {
    if (Platform.OS === "web") return window.localStorage.getItem(key);
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

async function storageSet(key, value) {
  try {
    if (Platform.OS === "web") window.localStorage.setItem(key, value);
    else await AsyncStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("fr");

  useEffect(() => {
    (async () => {
      const saved = await storageGet(STORAGE_KEY);
      if (saved === "fr" || saved === "en") setLang(saved);
    })();
  }, []);

  useEffect(() => {
    storageSet(STORAGE_KEY, lang);
  }, [lang]);

  const t = useMemo(() => {
    return (key) => {
      const value = getByPath(DICT[lang], key);
      return value ?? key;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used inside <LanguageProvider>");
  return ctx; // { lang, setLang, t }
}
