export const datasets = [
  {
    dataset: "gcamv7p0",
    params: {
      agProdByCrop: "agriculture",
      emissCO2BySector: "emissions",
      emissGHGByGasGWPAR5: "emissions",
      energyFinalByFuelEJ: "energy",
      energyFinalConsumBySecEJ: "energy",
      energyFinalSubsecByFuelIndusEJ: "energy",
      energyFinalSubsecByFuelTranspEJ: "energy",
      energyPrimaryByFuelEJ: "energy",
      gdp: "socioeconomic - gdp",
      landAlloc: "land",
      landIrrCrop: "land",
      landRfdCrop: "land",
      livestock_MeatDairybySubsector: "livestock",
      pop: "socioeconomic - population",
      tempGlobalMean: "climate",
      watSupRunoffBasin: "water",
      watWithdrawByCrop: "water",
      watWithdrawBySec: "water",
      waterWithdrawROGW: "water",
      watWithdrawByBasinRunoff: "water",
      elecByTechTWh: "electricity",
      elecCapByFuel: "electricity",
      energyFinalSubsecByFuelBuildEJ: "electricity"
    },
    defaults: [
      "agProdByCrop",
      "energyPrimaryByFuelEJ",
      "pop",
      "watWithdrawBySec",
      "emissCO2BySector"
    ]
  }
]
