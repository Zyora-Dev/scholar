import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, ShieldAlert, Sparkles, Building2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// Leaflet default icon fix for bundlers
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface TribalHub {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  majorTribes: string[];
  activeSchemes: number;
  supportCenter: string;
}

const TRIBAL_HUBS: TribalHub[] = [
  {
    id: "hub-1",
    name: "Nilgiris Biosphere",
    state: "Tamil Nadu",
    lat: 11.4102,
    lng: 76.695,
    majorTribes: ["Irula", "Kurumba", "Toda", "Kota", "Paniyan"],
    activeSchemes: 6,
    supportCenter: "Tribal Welfare Special Nodal Center, Ooty"
  },
  {
    id: "hub-2",
    name: "Koraput & Rayagada",
    state: "Odisha",
    lat: 18.8135,
    lng: 82.7126,
    majorTribes: ["Kondh", "Paroja", "Bhatra", "Saora"],
    activeSchemes: 8,
    supportCenter: "Integrated Tribal Development Agency (ITDA) Koraput"
  },
  {
    id: "hub-3",
    name: "Bastar & Dantewada",
    state: "Chhattisgarh",
    lat: 19.074,
    lng: 82.029,
    majorTribes: ["Maria", "Muria", "Gond", "Halba"],
    activeSchemes: 7,
    supportCenter: "ITDA Jagdalpur, Bastar"
  },
  {
    id: "hub-4",
    name: "Ranchi & Khunti",
    state: "Jharkhand",
    lat: 23.3441,
    lng: 85.3096,
    majorTribes: ["Munda", "Oraon", "Ho", "Santhal"],
    activeSchemes: 9,
    supportCenter: "Birsa Munda Tribal Research Institute, Ranchi"
  },
  {
    id: "hub-5",
    name: "Wayanad Hills",
    state: "Kerala",
    lat: 11.6854,
    lng: 76.132,
    majorTribes: ["Paniyan", "Kurichiyan", "Kuruman"],
    activeSchemes: 5,
    supportCenter: "Model Residential School Support Cell, Kalpetta"
  },
  {
    id: "hub-6",
    name: "Gadchiroli Tribal Belt",
    state: "Maharashtra",
    lat: 20.1849,
    lng: 79.9948,
    majorTribes: ["Madia Gond", "Pradhan"],
    activeSchemes: 6,
    supportCenter: "Tribal Development Project Office, Gadchiroli"
  },
  {
    id: "hub-7",
    name: "Adilabad Forest Division",
    state: "Telangana",
    lat: 19.6641,
    lng: 78.532,
    majorTribes: ["Gond", "Kolam", "Pardhan"],
    activeSchemes: 5,
    supportCenter: "ITDA Utnoor, Adilabad"
  }
];

export const TribalOpportunityMap: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<TribalHub>(TRIBAL_HUBS[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-tribal/10 text-tribal">
              <MapPin className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase text-tribal">
              Geographic Opportunity Distribution
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            Tribal Region Opportunity & Scheme Map
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Geographic visualization of Integrated Tribal Development Agencies (ITDA), tribal settlements, and applicable state/central schemes.
          </p>
        </div>

        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300">
          Demo Geographic Dataset
        </span>
      </div>

      {/* Map and Details Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map (2 Columns) */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-gray-200 overflow-hidden shadow-xs h-[480px]">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ width: "100%", height: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {TRIBAL_HUBS.map((hub) => (
              <Marker
                key={hub.id}
                position={[hub.lat, hub.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => setSelectedHub(hub)
                }}
              >
                <Popup>
                  <div className="text-xs font-['Inter',sans-serif]">
                    <strong className="text-gray-900 block font-bold">{hub.name}</strong>
                    <span className="text-tribal font-semibold">{hub.state}</span>
                    <p className="text-[11px] text-gray-600 mt-1">
                      Tribes: {hub.majorTribes.join(", ")}
                    </p>
                    <p className="text-[11px] font-bold text-saffron mt-1">
                      {hub.activeSchemes} Active Schemes
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Selected Hub Details Card (1 Column) */}
        <div className="bg-surface p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-tribal/10 text-tribal">
              Selected Region Focus
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 mt-1.5">
              {selectedHub.name}
            </h2>
            <p className="text-xs font-semibold text-tribal">{selectedHub.state}</p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-500 text-[10px] block font-semibold">Scheduled Tribe Communities:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedHub.majorTribes.map((tribe, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-800 text-[11px] font-semibold"
                    >
                      {tribe}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-gray-500 text-[10px] block font-semibold">Nodal Welfare Support Facility:</span>
                <strong className="text-gray-900 block mt-0.5">{selectedHub.supportCenter}</strong>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="text-[10px] block font-semibold text-emerald-700">Scheme Availability:</span>
                <strong className="text-base font-extrabold block">
                  {selectedHub.activeSchemes} Schemes Active
                </strong>
                <span className="text-[11px] text-emerald-800">
                  Includes Central Post-Matric, State Higher Education, and Merit Grants.
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/student/scholarships?state=${encodeURIComponent(selectedHub.state)}`}
            className="w-full py-2.5 bg-saffron hover:bg-saffron-dark text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            Explore Schemes in {selectedHub.state} <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
