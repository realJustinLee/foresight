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
      scenarios:[
        'GCAM_SSP1',
        'GCAM_SSP2',
        'GCAM_SSP3',
        'GCAM_SSP4',
        'GCAM_SSP5',
        'Reference'
      ],
      params: {
        agProdByCrop: {units: "Agricultural Production by Crop (MT)", group:"agriculture", region:"region"},
        tempGlobalMean: {units: "Global Mean Temperature (Degrees C)", group:"climate", region:"global"},
        elecCapByFuel: {units: "Electricity Capacity by Fuel (GW)", group:"electricity", region:"region"},
        elecByTechTWh: {units: "Electricity Generation by Fuel (TWh)", group:"electricity", region:"region"},
        energyFinalSubsecByFuelBuildEJ: {units: "Building Final Energy by Fuel (EJ)", group:"electricity", region:"region"},
        emissCO2BySector: {units: "CO2 Emissions by Sector (MTCO2)", group:"emissions", region:"region"},
        emissCO2ByAggSector: {units: "CO2 Emissions by Aggregated Sector (MTCO2)", group:"emissions", region:"region"},
        emissGHGByGasGWPAR5: {units: "Greenhouse Gas Emissions by Gas [GWP - AR5] (MTCO2eq)", group:"emissions", region:"region"},
        energyFinalByFuelEJ: {units: "Final Energy by Fuel (EJ)", group:"energy", region:"region"},
        energyFinalConsumBySecEJ: {units: "Final Energy Consumption by Sector (EJ)", group:"energy", region:"region"},
        energyFinalSubsecByFuelIndusEJ: {units: "Industry Final Energy by Fuel (EJ)", group:"energy", region:"region"},
        energyFinalSubsecByFuelTranspEJ: {units: "Transportation Final Energy by Fuel (EJ)", group:"energy", region:"region"},
        energyPrimaryByFuelEJ: {units: "Primary Energy Consumption by Fuel (EJ)", group:"energy", region:"region"},
        landAlloc: {units: "Land Allocation (1000 km2)", group:"land", region:"region"},
        pop: {units: "Population (Million)", group:"socioeconomic - population", region:"region"},
        gdp: {units: "GDP (Million 1990$)", group:"socioeconomic - gdp", region:"region"},
        landIrrCrop: {units: "Irrigated Crop Land (1000 km2)", group:"land", region:"region"},
        landRfdCrop: {units: "Rainfed Crop Land (1000 km2)", group:"land", region:"region"},
        livestock_MeatDairybySubsector: {units: "Livestock Production (Mt)", group:"livestock", region:"region"},
        watSupRunoffBasin: {units: "Runoff (km3)", group:"water", region:"region"},
        watWithdrawByBasinRunoff: {units: "Water Withdrawals by Basin [Runoff] (km3)", group:"water", region:"glu"},
        watWithdrawByCrop: {units: "Water Withdrawals by Crop (km3)", group:"water", region:"region"},
        watWithdrawBySec: {units: "Water Withdrawals by Sector (km3)", group:"water", region:"region"},
        waterWithdrawROGW: {units: "Water Withdrawals [Runoff - Groundwater] (km3)", group:"water", region:"glu"}
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