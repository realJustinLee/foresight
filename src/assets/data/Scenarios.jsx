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
        agProdByCrop: {units: "Agricultural Production by Crop (MT)", group:"agriculture"},
        tempGlobalMean: {units: "Global Mean Temperature (Degrees C)", group:"climate"},
        elecCapByFuel: {units: "Electricity Capacity by Fuel (GW)", group:"electricity"},
        elecByTechTWh: {units: "Electricity Generation by Fuel (TWh)", group:"electricity"},
        energyFinalSubsecByFuelBuildEJ: {units: "Building Final Energy by Fuel (EJ)", group:"electricity"},
        emissCO2BySector: {units: "CO2 Emissions by Sector (MTCO2)", group:"emissions"},
        emissGHGByGasGWPAR5: {units: "Greenhouse Gas Emissions by Gas [GWP - AR5] (MTCO2eq)", group:"emissions"},
        energyFinalByFuelEJ: {units: "Final Energy by Fuel (EJ)", group:"energy"},
        energyFinalConsumBySecEJ: {units: "Final Energy Consumption by Sector (EJ)", group:"energy"},
        energyFinalSubsecByFuelIndusEJ: {units: "Industry Final Energy by Fuel (EJ)", group:"energy"},
        energyFinalSubsecByFuelTranspEJ: {units: "Transportation Final Energy by Fuel (EJ)", group:"energy"},
        energyPrimaryByFuelEJ: {units: "Primary Energy Consumption by Fuel (EJ)", group:"energy"},
        landAlloc: {units: "Land Allocation (1000 km2)", group:"land"},
        pop: {units: "Population (Million)", group:"socioeconomic - population"},
        gdp: {units: "GDP (Million 1990$)", group:"socioeconomic - gdp"},
        landIrrCrop: {units: "Irrigated Crop Land (1000 km2)", group:"land"},
        landRfdCrop: {units: "Rainfed Crop Land (1000 km2)", group:"land"},
        livestock_MeatDairybySubsector: {units: "Livestock Production (Mt)", group:"livestock"},
        watSupRunoffBasin: {units: "Runoff (km3)", group:"water"},
        watWithdrawByBasinRunoff: {units: "Water Withdrawals by Basin [Runoff] (km3)", group:"water"},
        watWithdrawByCrop: {units: "Water Withdrawals by Crop (km3)", group:"water"},
        watWithdrawBySec: {units: "Water Withdrawals by Sector (km3)", group:"water"},
        waterWithdrawROGW: {units: "Water Withdrawals [ROGW] (km3)", group:"water"}
      },
      defaults: [
        "pop",
        "gdp",
        "agProdByCrop",
        "energyPrimaryByFuelEJ",
        "watWithdrawBySec",
        "emissCO2BySector"
      ]
    }
  ]