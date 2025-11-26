import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Building2, Users, Server, Car, Wifi, Zap, Database } from 'lucide-react';

const Specifications: React.FC = () => {
  const facilitySections = [
    {
      category: "Section A: Primary Entrance",
      icon: <Building2 className="w-6 h-6 text-tennis-yellow" />,
      items: [
        { label: "Floor Area", value: "12.0m × 8.0m" },
        { label: "Ceiling Height", value: "4.5m" },
        { label: "Capacity", value: "150 persons" },
        { label: "Access Control", value: "Biometric + NFC" },
        { label: "Reception Desk", value: "5.0m × 1.2m" }
      ]
    },
    {
      category: "Section B: Locker Facilities",
      icon: <Users className="w-6 h-6 text-blue-400" />,
      items: [
        { label: "Floor Area", value: "10.0m × 15.0m" },
        { label: "Ceiling Height", value: "3.6m" },
        { label: "Total Lockers", value: "210 units" },
        { label: "Changing Rooms", value: "8 private stalls" },
        { label: "Showers", value: "16 stalls total" }
      ]
    },
    {
      category: "Section C: Spectator Seating",
      icon: <Users className="w-6 h-6 text-purple-400" />,
      items: [
        { label: "Ground Floor Seats", value: "480 seats" },
        { label: "Accessible Seating", value: "24 positions" },
        { label: "VIP Boxes", value: "4 suites" },
        { label: "Concessions", value: "2 counters" },
        { label: "Restrooms", value: "16 total stalls" }
      ]
    },
    {
      category: "Section E: Control Room",
      icon: <Server className="w-6 h-6 text-orange-400" />,
      items: [
        { label: "Control Room Area", value: "120 m²" },
        { label: "Display Wall", value: "4× 65\" 4K" },
        { label: "Operator Stations", value: "3 workstations" },
        { label: "Server Room", value: "40 m²" },
        { label: "UPS Capacity", value: "60 kVA N+1" }
      ]
    },
    {
      category: "Section F: Parking Structure",
      icon: <Car className="w-6 h-6 text-cyan-400" />,
      items: [
        { label: "Total Spaces", value: "334 vehicular" },
        { label: "EV Charging (L2)", value: "36 stalls @ 7.4kW" },
        { label: "DC Fast Chargers", value: "4 stalls @ 150kW" },
        { label: "Accessible Spaces", value: "12 ADA compliant" },
        { label: "Bicycle Parking", value: "60 secure spaces" }
      ]
    }
  ];

  const infrastructureSections = [
    {
      category: "Compute Infrastructure",
      icon: <Database className="w-6 h-6 text-red-400" />,
      items: [
        { label: "Edge Cluster", value: "3-node hyperconverged" },
        { label: "RAM per Node", value: "512GB DDR5" },
        { label: "GPU", value: "2× NVIDIA A40/node" },
        { label: "Storage Pool", value: "Ceph distributed" },
        { label: "IOPS", value: "1M random reads" }
      ]
    },
    {
      category: "Network Infrastructure",
      icon: <Wifi className="w-6 h-6 text-green-400" />,
      items: [
        { label: "Backbone", value: "10GbE fiber" },
        { label: "Uplinks", value: "Dual redundant" },
        { label: "IoT Sensors", value: "1000+ devices" },
        { label: "WiFi", value: "Wi-Fi 6E APs" },
        { label: "Segmentation", value: "VLAN isolation" }
      ]
    },
    {
      category: "Power & Cooling",
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      items: [
        { label: "Main Service", value: "400A dedicated" },
        { label: "UPS System", value: "60kVA N+1" },
        { label: "Battery Runtime", value: "30min full load" },
        { label: "Total Load", value: "50kW design" },
        { label: "Cooling", value: "25kW server room" }
      ]
    },
    {
      category: "Digital Twin & Autonomy",
      icon: <Server className="w-6 h-6 text-indigo-400" />,
      items: [
        { label: "Visualization", value: "Unity + Three.js" },
        { label: "Multi-Agent System", value: "Autonomous scheduling" },
        { label: "Control Modes", value: "Normal/Active/Emergency" },
        { label: "VM Platform", value: "Proxmox VE cluster" },
        { label: "Integration", value: "MCP server architecture" }
      ]
    },
    {
      category: "Security & Compliance",
      icon: <CheckCircle2 className="w-6 h-6 text-teal-400" />,
      items: [
        { label: "Access Control", value: "Biometric + NFC" },
        { label: "Surveillance", value: "32× 4K (30-day)" },
        { label: "Network Security", value: "Firewall + EDR" },
        { label: "Compliance", value: "ADA / IBC 2021" }
      ]
    },
    {
      category: "Autonomous Systems",
      icon: <Server className="w-6 h-6 text-pink-400" />,
      items: [
        { label: "Orchestration", value: "Multi-agent system" },
        { label: "Sensor Integration", value: "1000+ devices" },
        { label: "Digital Twin", value: "Unity + Three.js" },
        { label: "Thermal Mgmt", value: "Hot/cold aisle" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">Technical <span className="text-tennis-yellow">Specifications</span></h2>
        <p className="text-xl text-gray-200 max-w-3xl mx-auto">
          Engineering specifications for building infrastructure, compute systems, and autonomous control architecture
        </p>
      </div>

      {/* Facility Sections */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold mb-8">Facility <span className="text-tennis-yellow">Sections</span></h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {facilitySections.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                <div className="p-3 bg-slate-900 rounded-xl border border-white/10">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold">{category.category}</h3>
              </div>

              <ul className="space-y-4">
                {category.items.map((item, i) => (
                  <li key={i} className="grid grid-cols-[1.5fr_1fr] items-center border-b border-white/5 pb-2 last:border-0 gap-4">
                    <span className="text-gray-200 flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0" />
                      {item.label}
                    </span>
                    <span className="font-mono font-bold text-white text-sm text-right">{item.value}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Infrastructure */}
      <div className="mb-16">
        <h3 className="text-3xl font-bold mb-8"><span className="text-tennis-yellow">Infrastructure</span></h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {infrastructureSections.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
                <div className="p-3 bg-slate-900 rounded-xl border border-white/10">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold">{category.category}</h3>
              </div>

              <ul className="space-y-4">
                {category.items.map((item, i) => (
                  <li key={i} className="grid grid-cols-[1.5fr_1fr] items-center border-b border-white/5 pb-2 last:border-0 gap-4">
                    <span className="text-gray-200 flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-white/80 shrink-0" />
                      {item.label}
                    </span>
                    <span className="font-mono font-bold text-white text-sm text-right">{item.value}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Specifications;
