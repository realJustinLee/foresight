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
        agProdByCrop: {units: "Agricultural Production by Crop ", group:"agriculture"},
        emissCO2BySector: {units: "CO2 Emission by Sector", group:"emissions"},
        emissGHGByGasGWPAR5: {units: "Greenhouse Gas Emissions by Gas - GWP - AR5", group:"emissions"},
        energyFinalByFuelEJ: {units: "Final Energy by Fuel", group:"energy"},
        energyFinalConsumBySecEJ: {units: "Final Energy Consumption by Sector", group:"energy"},
        energyFinalSubsecByFuelIndusEJ: {units: "Final Energy by Fuel - Industry", group:"energy"},
        energyFinalSubsecByFuelTranspEJ: {units: "Final Energy by Fuel - Transportation", group:"energy"},
        energyPrimaryByFuelEJ: {units: "Primary Energy by Fuel", group:"energy"},
        gdp: {units: "GDP", group:"socioeconomic - gdp"},
        landAlloc: {units: "Land Allocation", group:"land"},
        landIrrCrop: {units: "Irr Crop Volume", group:"land"},
        landRfdCrop: {units: "Rfd Crop Volume", group:"land"},
        livestock_MeatDairybySubsector: {units: "Meat and Dairy by Subsector", group:"livestock"},
        pop: {units: "Population", group:"socioeconomic - population"},
        tempGlobalMean: {units: "Global Mean Temperature", group:"climate"},
        watSupRunoffBasin: {units: "Runoff", group:"water"},
        watWithdrawByCrop: {units: "Water Withdrawls by Crop", group:"water"},
        watWithdrawBySec: {units: "Water Withdrawls by Sector", group:"water"},
        waterWithdrawROGW: {units: "Water Withdrawls ROGW", group:"water"},
        watWithdrawByBasinRunoff: {units: "Runoff by Basin", group:"water"},
        elecByTechTWh: {units: "Electricity by Technology", group:"electricity"},
        elecCapByFuel: {units: "Electric Capacity by Fuel", group:"electricity"},
        energyFinalSubsecByFuelBuildEJ: {units: "Final Energy by FUel - Buildings", group:"electricity"}
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