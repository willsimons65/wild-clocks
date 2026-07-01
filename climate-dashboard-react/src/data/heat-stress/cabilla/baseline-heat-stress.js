export const cabillaBaselineHeatStress = {
  categories: [
    {
        "key": "warm",
        "label": "Warm day",
        "range": "> 25°C",
        "days": 2.5
    },
    {
        "key": "heatStress",
        "label": "Heat stress",
        "range": "> 28°C",
        "days": 0.3
    },
    {
        "key": "highHeatStress",
        "label": "High heat stress",
        "range": "> 30°C",
        "days": 0.1
    },
    {
        "key": "extremeHeat",
        "label": "Extreme heat",
        "range": "> 32°C",
        "days": 0
    }
],
};
