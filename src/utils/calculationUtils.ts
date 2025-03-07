
// Electricity consumption for electric vehicles per km in kWh
const CONSUMPTION_PER_KM = 0.2; // kWh/km (average EV consumption)

// Public charging price (fixed at 0.60€ per kWh)
const PUBLIC_CHARGING_PRICE = 0.60; // €/kWh for public charging

// Initial installation cost for different Wallbox types
export const WALLBOX_INSTALLATION_COSTS = {
  basic: 800, // Basic Wallbox installation
  smart: 1200, // Smart Wallbox with app control
  premium: 1800, // Premium Wallbox with advanced features
  complete: 2200, // Complete Wallbox installation (new default)
};

// Default calculation parameters
export const DEFAULT_PARAMS = {
  kmPerYear: 15000,
  electricityCost: 0.30, // €/kWh
  wallboxCost: WALLBOX_INSTALLATION_COSTS.complete, // Updated to the new default
  yearsOfUse: 10,
};

// Interface for calculator input
export interface CalculatorInput {
  kmPerYear: number;
  electricityCost: number; // in € per kWh
  wallboxCost: number; // in €
  yearsToProject?: number; // optional, defaults to 10
}

// Interface for calculator results
export interface CalculatorResult {
  savingsPerYear: number;
  savingsPerMonth: number; // Added monthly savings
  breakEvenYear: number;
  totalSavings: number;
  homeCosts: number[];
  publicCosts: number[];
  cumulativeSavings: number[];
  yearsData: number[];
}

/**
 * Calculate ROI and savings for Wallbox installation
 */
export const calculateROI = (input: CalculatorInput): CalculatorResult => {
  const {
    kmPerYear,
    electricityCost,
    wallboxCost,
    yearsToProject = 10
  } = input;

  // Calculate annual consumption
  const annualConsumption = kmPerYear * CONSUMPTION_PER_KM; // kWh per year
  
  // Calculate annual cost for home charging
  const homeCostPerYear = annualConsumption * electricityCost;
  
  // Calculate annual cost for public charging
  const publicCostPerYear = annualConsumption * PUBLIC_CHARGING_PRICE;
  
  // Calculate annual savings
  const savingsPerYear = publicCostPerYear - homeCostPerYear;
  
  // Calculate monthly savings
  const savingsPerMonth = savingsPerYear / 12;
  
  // Calculate break-even point (in years)
  const breakEvenYear = wallboxCost / savingsPerYear;
  
  // Generate yearly data for charts
  const homeCosts: number[] = [];
  const publicCosts: number[] = [];
  const cumulativeSavings: number[] = [];
  const yearsData: number[] = [];
  
  let cumulativeSaving = -wallboxCost; // Start with negative due to initial investment
  
  for (let year = 1; year <= yearsToProject; year++) {
    yearsData.push(year);
    homeCosts.push(homeCostPerYear * year);
    publicCosts.push(publicCostPerYear * year);
    
    cumulativeSaving += savingsPerYear;
    cumulativeSavings.push(cumulativeSaving);
  }
  
  // Calculate total savings over the projection period
  const totalSavings = cumulativeSavings[cumulativeSavings.length - 1];
  
  return {
    savingsPerYear,
    savingsPerMonth,
    breakEvenYear,
    totalSavings,
    homeCosts,
    publicCosts,
    cumulativeSavings,
    yearsData
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('de-DE').format(value);
};
