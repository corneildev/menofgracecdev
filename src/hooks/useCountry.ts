import { useState, useEffect } from "react";

export type CountryInfo = {
  country: string; // ISO code (e.g., 'CI', 'BJ', 'FR')
  country_name: string;
  city: string;
};

export function useCountry() {
  const [data, setData] = useState<CountryInfo | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("user_country_info");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(!data);

  // Manual selection setter
  const setCountryPreference = (country: string, country_name: string) => {
    const info = { country, country_name, city: "" };
    setData(info);
    localStorage.setItem("user_country_info", JSON.stringify(info));
    localStorage.setItem("country_selected_manually", "true");
  };

  useEffect(() => {
    // If we already have data or it was selected manually, don't auto-fetch
    const isManual = localStorage.getItem("country_selected_manually") === "true";
    if (data || isManual) {
      setLoading(false);
      return;
    }

    async function fetchCountry() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Failed to fetch location");
        const json = await res.json();
        const info = {
          country: json.country_code,
          country_name: json.country_name,
          city: json.city || "",
        };
        setData(info);
        localStorage.setItem("user_country_info", JSON.stringify(info));
      } catch (error) {
        console.error("Error detecting country:", error);
        // Default fallback if detection fails
        if (!data) {
          setData({ country: "OTHER", country_name: "Other", city: "" });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCountry();
  }, [data]);

  const isCODCountry = data?.country === "CI" || data?.country === "BJ";
  const hasSelectedCountry = !!data && localStorage.getItem("country_selected_manually") === "true";

  return { ...data, loading, isCODCountry, setCountryPreference, hasSelectedCountry };
}
