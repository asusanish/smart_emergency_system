import L from "leaflet";

export const patientIcon = new L.Icon({

    iconUrl: "/icons/patient.png",

    iconSize: [48,48],

    iconAnchor: [24,48],

    popupAnchor:[0,-40]

});

export const ambulanceIcon = new L.Icon({

    iconUrl:"/icons/ambulance.png",

    iconSize:[48,48],

    iconAnchor:[24,48],

    popupAnchor:[0,-40]

});

export const hospitalIcon = new L.Icon({

    iconUrl:"/icons/hospital.png",

    iconSize:[48,48],

    iconAnchor:[24,48],

    popupAnchor:[0,-40]

});