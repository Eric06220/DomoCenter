const devices = {
  climate: [
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

  openings: [
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

  energyDevices: [
    {
      id: "ecs-maison",
      name: "ECS Maison",
      location: "Maison",
      switchEntityId: "switch.horloge_ecs_home_interrupteur",
      voltageEntityId: "sensor.horloge_ecs_home_tension",
      currentEntityId: "sensor.horloge_ecs_home_courant",
      powerEntityId: "sensor.horloge_ecs_home_puissance",
      totalEnergyEntityId: "sensor.horloge_ecs_home_energie_totale",
    },
    {
      id: "ecs-studio",
      name: "ECS Studio",
      location: "Studio",
      switchEntityId: "switch.horloge_ecs_studio_interrupteur",
      voltageEntityId: "sensor.horloge_ecs_studio_tension",
      currentEntityId: "sensor.horloge_ecs_studio_courant",
      powerEntityId: "sensor.horloge_ecs_studio_puissance",
      totalEnergyEntityId: "sensor.horloge_ecs_studio_energie_totale",
    },
    {
      id: "pompe-piscine",
      name: "Pompe piscine",
      location: "Piscine",
      switchEntityId: "switch.horloge_piscine_interrupteur",
      voltageEntityId: "sensor.horloge_piscine_tension",
      currentEntityId: "sensor.horloge_piscine_courant",
      powerEntityId: "sensor.horloge_piscine_puissance",
      totalEnergyEntityId: "sensor.horloge_piscine_energie_totale",
    },
  ],

  infrastructure: {
    cpuTemperatureEntityId:
      "sensor.system_monitor_temperature_du_processeur",

    cpuUsageEntityId:
      "sensor.system_monitor_utilisation_du_processeur",

    memoryUsageEntityId:
      "sensor.system_monitor_utilisation_de_la_memoire",

    diskFreeEntityId:
      "sensor.system_monitor_espace_libre",

    diskUsedEntityId:
      "sensor.system_monitor_espace_utilise",
  },
};

module.exports = devices;