import { v4 as uuidv4 } from "uuid";

export const maskAccountNumber = (accountNumber) => {
  if (typeof accountNumber !== "string" || accountNumber.length < 12) {
    return accountNumber;
  }



  const firstFour = accountNumber.substring(0, 4);
  const lastFour = accountNumber.substring(accountNumber.length - 4);

  const maskedDigits = "*".repeat(accountNumber.length - 8);

  return `${firstFour}${maskedDigits}${lastFour}`;
};

export const formatCurrency = (value) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (isNaN(value)) {
    return "Invalid input";
  }

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: user?.currency || "USD",
    minimumFractionDigits: 2,
  }).format(numberValue);
};

export const getDateSevenDaysAgo = () => {
  const today = new Date();

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  return sevenDaysAgo.toISOString().split("T")[0];
};

export async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const countries = data.map((country) => {
      const currencyCode = Object.keys(country.currencies || {})[0] || "";
      return {
        country: country.name?.common || "",
        flag: country.flags?.png || "",
        currency: currencyCode,
      };
    });

    if (!countries.length) {
      throw new Error("No countries returned from API.");
    }

    return countries.sort((a, b) => a.country.localeCompare(b.country));
  } catch (error) {
    console.error("Failed to fetch countries, using fallback data:", error);

    // Fallback countries list
    const fallbackCountries = [
      {
        country: "Nepal",
        flag: "https://flagcdn.com/w320/np.png",
        currency: "NPR",
      },
      {
        country: "United States",
        flag: "https://flagcdn.com/w320/us.png",
        currency: "USD",
      },
      {
        country: "India",
        flag: "https://flagcdn.com/w320/in.png",
        currency: "INR",
      },
      {
        country: "Japan",
        flag: "https://flagcdn.com/w320/jp.png",
        currency: "JPY",
      },
    ];

    return fallbackCountries;
  }
}


// export function generateAccountNumber() {
//   let accountNumber = "";
//   while (accountNumber.length < 13) {
//     const uuid = uuidv4().replace(/-/g, "");
//     accountNumber += uuid.replace(/\D/g, "");
//   }
//   return accountNumber.substr(0, 13);
// }

// let accountSequence = 0; // Start counting from 0 (first call will return 1)

// export function generateAccountNumber() {
//   accountSequence += 1;
//   return accountSequence;
// }