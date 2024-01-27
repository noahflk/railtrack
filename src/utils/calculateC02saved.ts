export const calculateCO2Savings = (distance: number): number => {
  // sources
  //https://www.sncf-connect.com/en-en/help/calculation-co2-emissions-your-train-journey
  //https://www.eea.europa.eu/en/analysis/indicators/co2-performance-of-new-passenger#:~:text=Compared%20to%202020%2C%202021%20saw,2%2Fkm%20(WLTP).
  const co2EmissionCar = 114.1; // CO2 emissions per km for car in g/km
  const co2EmissionTrain = 11.8; // CO2 emissions per km for train in g/km

  const savingsPerKm = co2EmissionCar - co2EmissionTrain;
  const totalSavings = savingsPerKm * distance;

  // Convert to kg
  return totalSavings / 1000;
};
