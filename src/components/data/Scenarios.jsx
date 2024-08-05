export const scenarios = [
  {
    title: "Reference",
  },
  {
    title: "GCAM_SSP1",
  },
  {
    title: "GCAM_SSP2",
  },
  {
    title: "GCAM_SSP3",
  },
  {
    title: "GCAM_SSP4",
  },
  {
    title: "GCAM_SSP5",
  }
];

export const datasets = [
  {
    dataset: "gcamv7p0",
    scenarios: [
      'GCAM_SSP1',
      'GCAM_SSP2',
      'GCAM_SSP3',
      'GCAM_SSP4',
      'GCAM_SSP5',
      'Reference'
    ],
    params: {
      agProdByCrop: { units: "Agricultural Production by Crop (MT)", group: "agriculture", region: "region", description: ""},
      elecByTechTWh: { units: "Electricity Generation by Fuel (TWh)", group: "electricity", region: "region", description: ""},
      elecCapByFuel: { units: "Electricity Capacity by Fuel (GW)", group: "electricity", region: "region", description: ""},
      emissCO2ByAggSector: { units: "CO2 Emissions by Aggregated Sector (MTCO2)", group: "emissions", region: "region", description: ""},
      emissCO2BySector: { units: "CO2 Emissions by Sector (MTCO2)", group: "emissions", region: "region", description: "" },
      emissGHGByGasGWPAR5: { units: "Greenhouse Gas Emissions by Gas [GWP - AR5] (MTCO2eq)", group: "emissions", region: "region", description: "" },
      energyFinalByFuelEJ: { units: "Final Energy by Fuel (EJ)", group: "energy", region: "region", description: "" },
      energyFinalConsumBySecEJ: { units: "Final Energy Consumption by Sector (EJ)", group: "energy", region: "region", description: "" },
      energyFinalSubsecByFuelBuildEJ: { units: "Building Final Energy by Fuel (EJ)", group: "energy", region: "region", description: "" },
      energyFinalSubsecByFuelIndusEJ: { units: "Industry Final Energy by Fuel (EJ)", group: "energy", region: "region", description: "" },
      energyFinalSubsecByFuelTranspEJ: { units: "Transportation Final Energy by Fuel (EJ)", group: "energy", region: "region", description: "" },
      energyPrimaryByFuelEJ: { units: "Primary Energy Consumption by Fuel (EJ)", group: "energy", region: "region", description: "" },
      gdp: { units: "GDP (Million 1990$)", group: "socioeconomic - gdp", region: "region", description: "Total gross domestic product [Market exchange rate] by GCAM region given in units of 1 million 1990 U.S. dollars." },
      landAlloc: { units: "Land Allocation (1000 km2)", group: "land", region: "region", description: "" },
      landIrrCrop: { units: "Irrigated Crop Land (1000 km2)", group: "land", region: "region", description: "" },
      landRfdCrop: { units: "Rainfed Crop Land (1000 km2)", group: "land", region: "region", description: "" },
      livestock_MeatDairybySubsector: { units: "Livestock Production (Mt)", group: "livestock", region: "region", description: "Total live" },
      pop: { units: "Population (Million)", group: "socioeconomic - population", region: "region", description: "Total population by GCAM region given in units of 1 million people." },
      tempGlobalMean: { units: "Global Mean Temperature (Degrees C)", group: "climate", region: "global", description:  "Global mean surface temperature anomaly relative to the 1850 - 1900's mean in degrees celcius." },
      watSupRunoffBasin: { units: "Runoff (km3)", group: "water", region: "region", description: "" },
      watWithdrawByBasinRunoff: { units: "Water Withdrawals by Basin [Runoff] (km3)", group: "water", region: "glu", description: "Water withdrawals from runoff by GCAM basin in kilometers cubed." },
      watWithdrawByCrop: { units: "Water Withdrawals by Crop (km3)", group: "water", region: "region", description: "Water withdrawals by crop for each GCAM region in kilometers cubed." },
      watWithdrawBySec: { units: "Water Withdrawals by Sector (km3)", group: "water", region: "region", description: "Water withdrawals by sector for each GCAM region in kilometers cubed." },
      watWithdrawROGW: { units: "Water Withdrawals by Water Source [Runoff vs Groundwater] (km3)", group: "water", region: "glu", description: "Water withdrawals by groundwater vs. water withdrawals by runoff in kilometers cubed." }
    },
    defaults: [
      "pop",
      "gdp",
      "agProdByCrop",
      "energyPrimaryByFuelEJ",
      "watWithdrawBySec",
      "emissCO2ByAggSector"
    ]
  }
]