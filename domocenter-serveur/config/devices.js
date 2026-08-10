const devices = {
  climate: [
    {
      id: "exterieur",
      name: "Extérieur",
      temperatureEntityId:
        "sensor.temp_humidity_ext_temperature",
      humidityEntityId:
        "sensor.temp_humidity_ext_humidite",
      batteryEntityId:
        "sensor.temp_humidity_ext_batterie",
    },
    {
      id: "maison",
      name: "Maison",
      temperatureEntityId:
        "sensor.temp_humidity_home_temperature",
      humidityEntityId:
        "sensor.temp_humidity_home_humidite",
    },
    {
      id: "studio",
      name: "Studio",
      temperatureEntityId:
        "sensor.temp_humidity_studio_temperature",
      humidityEntityId:
        "sensor.temp_humidity_studio_humidite",
      batteryEntityId:
        "sensor.temp_humidity_studio_batterie",
    },
    {
      id: "local-technique",
      name: "Local technique",
      temperatureEntityId:
        "sensor.temp_humidity_lt_temperature",
      humidityEntityId:
        "sensor.temp_humidity_lt_humidite",
      batteryEntityId:
        "sensor.temp_humidity_lt_batterie",
    },
  ],

  openings: [
    {
      id: "entree",
      name: "Entrée",
      location: "Maison",
      entityId:
        "binary_sensor.porte_entree_porte",
      batteryEntityId:
        "sensor.porte_entree_batterie",
    },
    {
      id: "salon",
      name: "Salon / SAM",
      location: "Maison",
      entityId:
        "binary_sensor.porte_sam_porte",
      batteryEntityId:
        "sensor.porte_sam_batterie",
    },
    {
      id: "appentis",
      name: "Appentis",
      location: "Extérieur",
      entityId:
        "binary_sensor.appenti_porte",
      batteryEntityId:
        "sensor.appenti_batterie",
    },
    {
      id: "studio",
      name: "Studio",
      location: "Studio",
      entityId:
        "binary_sensor.porte_studio_porte",
      batteryEntityId:
        "sensor.porte_studio_batterie",
    },
    {
      id: "atelier",
      name: "Atelier",
      location: "Atelier",
      entityId:
        "binary_sensor.atelier_porte",
      batteryEntityId:
        "sensor.atelier_batterie",
    },
    {
      id: "chalet",
      name: "Chalet",
      location: "Chalet",
      entityId:
        "binary_sensor.chalet_lt_porte",
      batteryEntityId:
        "sensor.chalet_lt_batterie",
    },
  ],

  waterLeakSensors: [
    {
      id: "cuisine",
      name: "Cuisine",
      location: "Cuisine",
      entityId:
        "binary_sensor.capteur_cuisine_humidite",
      batteryEntityId:
        "sensor.capteur_cuisine_batterie",
    },
    {
      id: "studio",
      name: "Studio",
      location: "Studio",
      entityId:
        "binary_sensor.capteur_studio_humidite",
      batteryEntityId:
        "sensor.capteur_studio_batterie",
    },
    {
      id: "local-technique",
      name: "Local technique",
      location: "Local technique",
      entityId:
        "binary_sensor.capteur_lt_humidite",
      batteryEntityId:
        "sensor.capteur_lt_batterie",
    },
  ],

  smokeDetectors: [
    {
      id: "home",
      name: "Maison",
      location: "Maison",
      smokeEntityId:
        "binary_sensor.detecteur_de_fumee_home_fumee",
      tamperEntityId:
        "binary_sensor.detecteur_de_fumee_home_tamper",
      batteryEntityId:
        "sensor.detecteur_de_fumee_home_batterie",
    },
    {
      id: "studio",
      name: "Studio",
      location: "Studio",
      smokeEntityId:
        "binary_sensor.detecteur_de_fumee_studio_fumee",
      tamperEntityId:
        "binary_sensor.detecteur_de_fumee_studio_tamper",
      batteryEntityId:
        "sensor.detecteur_de_fumee_studio_batterie",
    },
  ],

  energyDevices: [
    {
      id: "ecs-maison",
      name: "ECS Maison",
      location: "Maison",
      switchEntityId:
        "switch.horloge_ecs_home_interrupteur",
      voltageEntityId:
        "sensor.horloge_ecs_home_tension",
      currentEntityId:
        "sensor.horloge_ecs_home_courant",
      powerEntityId:
        "sensor.horloge_ecs_home_puissance",
      totalEnergyEntityId:
        "sensor.horloge_ecs_home_energie_totale",
    },
    {
      id: "ecs-studio",
      name: "ECS Studio",
      location: "Studio",
      switchEntityId:
        "switch.horloge_ecs_studio_interrupteur",
      voltageEntityId:
        "sensor.horloge_ecs_studio_tension",
      currentEntityId:
        "sensor.horloge_ecs_studio_courant",
      powerEntityId:
        "sensor.horloge_ecs_studio_puissance",
      totalEnergyEntityId:
        "sensor.horloge_ecs_studio_energie_totale",
    },
    {
      id: "pompe-piscine",
      name: "Pompe piscine",
      location: "Piscine",
      switchEntityId:
        "switch.horloge_piscine_interrupteur",
      voltageEntityId:
        "sensor.horloge_piscine_tension",
      currentEntityId:
        "sensor.horloge_piscine_courant",
      powerEntityId:
        "sensor.horloge_piscine_puissance",
      totalEnergyEntityId:
        "sensor.horloge_piscine_energie_totale",
    },
  ],

  lightingDevices: [
    {
      id: "spot-piscine",
      name: "Spot piscine",
      location: "Piscine",
      group: "Piscine",
      entityId:
        "switch.eclairages_jardin_sonoff_100020aad1_1",
      icon: "lightbulb",
      displayType: "SONOFF 4CH Pro",
      order: 10,
      groupControl: true,
    },
    {
      id: "eclairage-piscine",
      name: "Éclairage piscine",
      location: "Piscine",
      group: "Piscine",
      entityId:
        "switch.eclairages_jardin_sonoff_100020aad1_2",
      icon: "lightbulb",
      displayType: "SONOFF 4CH Pro",
      order: 20,
      groupControl: true,
    },
    {
      id: "lampe-piscine",
      name: "Lampe piscine",
      location: "Piscine",
      group: "Piscine",
      entityId:
        "switch.prises_piscine_socket_2",
      icon: "outlet",
      displayType: "Prise Tuya",
      order: 30,
      groupControl: true,
    },
    {
      id: "hp-piscine",
      name: "HP Piscine",
      location: "Piscine",
      group: "Piscine",
      entityId:
        "switch.prises_piscine_socket_1",
      icon: "outlet",
      displayType: "Prise Tuya",
      order: 40,
      groupControl: false,
    },
    {
      id: "couloir",
      name: "Lumière couloir",
      location: "Maison",
      group: "Maison",
      entityId:
        "switch.lumiere_couloir_switch_1",
      icon: "lightbulb",
      displayType: "Interrupteur Tuya",
      order: 10,
      groupControl: true,
    },
    {
      id: "sam",
      name: "Lumière SAM",
      location: "Maison",
      group: "Maison",
      entityId:
        "switch.lumiere_sam_switch_1",
      icon: "lightbulb",
      displayType: "Interrupteur Tuya",
      order: 20,
      groupControl: true,
    },
    {
      id: "palmiers",
      name: "Éclairage palmiers",
      location: "Jardin",
      group: "Jardin",
      entityId:
        "switch.eclairages_jardin_sonoff_100020aad1_3",
      icon: "lightbulb",
      displayType: "SONOFF 4CH Pro",
      order: 10,
      groupControl: true,
    },
    {
      id: "olivier-allee",
      name: "Éclairage olivier allée",
      location: "Allée",
      group: "Jardin",
      entityId:
        "switch.eclairages_jardin_sonoff_100020aad1_4",
      icon: "lightbulb",
      displayType: "SONOFF 4CH Pro",
      order: 20,
      groupControl: true,
    },
    {
      id: "pergola",
      name: "Pergola",
      location: "Extérieur",
      group: "Extérieur",
      entityId:
        "switch.pergola_sonoff_10015a8233",
      icon: "lightbulb",
      displayType: "SONOFF MINI",
      order: 10,
      groupControl: true,
    },
  ],

  accessDevices: [
    {
      id: "portail",
      name: "Portail",
      location: "Entrée",
      entityId:
        "switch.portail_sonoff_1000ea498f",
      icon: "gate",
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

  cameraDevices: [
    {
      id: "portail",
      name: "Portail",
      location: "Portail",
      model: "ANRAN P3 Max",
      ipAddress: "192.168.1.199",
      entityId: "camera.portail_profile_000",
    },
    {
      id: "jardin",
      name: "Jardin",
      location: "Jardin",
      model: "ANRAN P3 Max",
      ipAddress: "192.168.1.25",
      entityId: "camera.jardin_profile_000",
    },
    {
      id: "entree",
      name: "Entrée",
      location: "Entrée",
      model: "ANRAN S02",
      ipAddress: "192.168.1.42",
      entityId: null,
    },
    {
      id: "allee",
      name: "Allée",
      location: "Allée",
      model: "ANRAN S02",
      ipAddress: "192.168.1.126",
      entityId: null,
    },
    {
      id: "studio",
      name: "Studio",
      location: "Studio",
      model: "ANRAN S02",
      ipAddress: "192.168.1.166",
      entityId: null,
    },
    {
      id: "salon",
      name: "Salon",
      location: "Salon",
      model: "iCam365",
      ipAddress: "192.168.1.61",
      entityId: null,
    },
    {
      id: "atelier",
      name: "Atelier",
      location: "Atelier",
      model: "HI3516EV100",
      ipAddress: "192.168.1.41",
      entityId: "camera.atelier_profile_000",
    },
  ],
};

module.exports = devices;
