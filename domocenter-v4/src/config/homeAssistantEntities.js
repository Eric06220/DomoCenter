const homeAssistantEntities = {
  climateZones: [
    {
      id: "exterieur",
      name: "Extérieur",
      temperatureEntityId: "sensor.temp_humidity_ext_temperature",
      humidityEntityId: "sensor.temp_humidity_ext_humidite",
    },
    {
      id: "maison",
      name: "Maison",
      temperatureEntityId: "sensor.temp_humidity_home_temperature",
      humidityEntityId: "sensor.temp_humidity_home_humidite",
    },
    {
      id: "studio",
      name: "Studio",
      temperatureEntityId: "sensor.temp_humidity_studio_temperature",
      humidityEntityId: "sensor.temp_humidity_studio_humidite",
    },
    {
      id: "local-technique",
      name: "Local technique",
      temperatureEntityId: "sensor.temp_humidity_lt_temperature",
      humidityEntityId: "sensor.temp_humidity_lt_humidite",
    },
  ],

  openingSensors: [
    {
      id: "entree",
      name: "Entrée",
      location: "Maison",
      entityId: "binary_sensor.porte_entree_porte",
    },
    {
      id: "salon",
      name: "Salon / SAM",
      location: "Maison",
      entityId: "binary_sensor.porte_sam_porte",
    },
    {
      id: "appentis",
      name: "Appentis",
      location: "Extérieur",
      entityId: "binary_sensor.appenti_porte",
    },
    {
      id: "studio",
      name: "Studio",
      location: "Studio",
      entityId: "binary_sensor.porte_studio_porte",
    },
    {
      id: "atelier",
      name: "Atelier",
      location: "Atelier",
      entityId: "binary_sensor.atelier_porte",
    },
    {
      id: "chalet",
      name: "Chalet",
      location: "Chalet",
      entityId: "binary_sensor.chalet_lt_porte",
    },
  ],
};

export default homeAssistantEntities;