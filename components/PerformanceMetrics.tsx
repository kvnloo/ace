import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
}

interface CourtUtilization {
  courtId: number;
  status: 'active' | 'reserved' | 'available';
  currentPlayers: number;
  duration: number;
  nextReservation?: string;
}

interface PlayerStats {
  activeUsers: number;
  peakHour: string;
  averageSessionTime: number;
  memberVsGuest: { members: number; guests: number };
}

interface EnergyMetrics {
  currentUsage: number;
  peakUsage: number;
  efficiency: number;
  costPerHour: number;
}

interface PredictiveAnalytics {
  nextPeakTime: string;
  expectedOccupancy: number;
  maintenanceAlert?: string;
  weatherImpact?: string;
}

const PerformanceMetrics: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'courts' | 'players' | 'energy' | 'analytics'>('courts');

  // Simulated real-time data
  const [courtData, setCourtData] = useState<CourtUtilization[]>([
    { courtId: 1, status: 'active', currentPlayers: 4, duration: 45 },
    { courtId: 2, status: 'active', currentPlayers: 2, duration: 30 },
    { courtId: 3, status: 'reserved', currentPlayers: 0, duration: 0, nextReservation: '14:30' },
    { courtId: 4, status: 'available', currentPlayers: 0, duration: 0 },
    { courtId: 5, status: 'active', currentPlayers: 4, duration: 60 },
    { courtId: 6, status: 'available', currentPlayers: 0, duration: 0 },
  ]);

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    activeUsers: 12,
    peakHour: '18:00-19:00',
    averageSessionTime: 52,
    memberVsGuest: { members: 65, guests: 35 },
  });

  const [energyMetrics, setEnergyMetrics] = useState<EnergyMetrics>({
    currentUsage: 145.8,
    peakUsage: 220.5,
    efficiency: 87.3,
    costPerHour: 12.45,
  });

  const [analytics, setAnalytics] = useState<PredictiveAnalytics>({
    nextPeakTime: '18:30',
    expectedOccupancy: 92,
    maintenanceAlert: 'Court 3 - Net tension check due',
    weatherImpact: 'Clear conditions - 15% above avg',
  });

  // Streaming data animation
  const [streamingData, setStreamingData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update court durations
      setCourtData(prev => prev.map(court =>
        court.status === 'active'
          ? { ...court, duration: court.duration + 1 }
          : court
      ));

      // Update streaming data for visualization
      setStreamingData(prev => {
        const newData = [...prev, Math.random() * 100];
        return newData.slice(-50); // Keep last 50 points
      });

      // Randomly update player stats
      if (Math.random() > 0.8) {
        setPlayerStats(prev => ({
          ...prev,
          activeUsers: Math.max(0, prev.activeUsers + (Math.random() > 0.5 ? 1 : -1)),
        }));
      }

      // Update energy metrics
      setEnergyMetrics(prev => ({
        ...prev,
        currentUsage: Math.max(50, Math.min(250, prev.currentUsage + (Math.random() - 0.5) * 10)),
        efficiency: Math.max(70, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 2)),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Canvas visualization for streaming data
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || streamingData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw data line
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();

    streamingData.forEach((value, index) => {
      const x = (index / streamingData.length) * width;
      const y = height - (value / 100) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw glow effect
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [streamingData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00ff88';
      case 'reserved': return '#ffd700';
      case 'available': return '#888';
      default: return '#888';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '';
    }
  };

  const MetricCard: React.FC<{ metric: MetricData }> = ({ metric }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-md border border-[#00ff88]/30 rounded-lg p-4"
    >
      <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">{metric.label}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#00ff88]">{metric.value}</span>
        {metric.unit && <span className="text-sm text-gray-400">{metric.unit}</span>}
        {metric.trend && (
          <span className={`text-sm ${metric.trend === 'up' ? 'text-green-400' : metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
            {getTrendIcon(metric.trend)} {metric.change}%
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50"
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute top-4 right-4 pointer-events-auto bg-black/50 backdrop-blur-md border border-[#00ff88]/30 rounded-lg px-4 py-2 text-[#00ff88] hover:bg-black/70 transition-all"
          >
            {isVisible ? 'Hide Metrics' : 'Show Metrics'}
          </button>

          {/* Main HUD Container */}
          <div className="absolute top-20 right-4 w-96 pointer-events-auto">
            {/* Tab Navigation */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-black/50 backdrop-blur-md border border-[#00ff88]/30 rounded-t-lg flex overflow-hidden"
            >
              {(['courts', 'players', 'energy', 'analytics'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-sm uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? 'bg-[#00ff88]/20 text-[#00ff88] border-b-2 border-[#00ff88]'
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </motion.div>

            {/* Content Panels */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-black/50 backdrop-blur-md border border-[#00ff88]/30 border-t-0 rounded-b-lg p-4 max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              {/* Courts Tab */}
              {activeTab === 'courts' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard metric={{ label: 'Utilization', value: 50, unit: '%', trend: 'up', change: 5 }} />
                    <MetricCard metric={{ label: 'Active Courts', value: courtData.filter(c => c.status === 'active').length, unit: '/ 6' }} />
                  </div>

                  <div className="space-y-2">
                    {courtData.map((court, index) => (
                      <motion.div
                        key={court.courtId}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-black/30 backdrop-blur-sm border border-[#00ff88]/20 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getStatusColor(court.status), boxShadow: `0 0 10px ${getStatusColor(court.status)}` }}
                            />
                            <span className="text-white font-semibold">Court {court.courtId}</span>
                          </div>
                          <span className="text-xs uppercase tracking-wider" style={{ color: getStatusColor(court.status) }}>
                            {court.status}
                          </span>
                        </div>

                        {court.status === 'active' && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Players: {court.currentPlayers}</span>
                            <span className="text-gray-400">Duration: {Math.floor(court.duration / 60)}h {court.duration % 60}m</span>
                          </div>
                        )}

                        {court.status === 'reserved' && court.nextReservation && (
                          <div className="text-sm text-gray-400">Next: {court.nextReservation}</div>
                        )}

                        {/* Progress bar for active courts */}
                        {court.status === 'active' && (
                          <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(court.duration / 120) * 100}%` }}
                              className="h-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a]"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Players Tab */}
              {activeTab === 'players' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard metric={{ label: 'Active Users', value: playerStats.activeUsers, trend: 'up', change: 8 }} />
                    <MetricCard metric={{ label: 'Avg Session', value: playerStats.averageSessionTime, unit: 'min' }} />
                  </div>

                  <div className="bg-black/30 backdrop-blur-sm border border-[#00ff88]/20 rounded-lg p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Peak Hours</div>
                    <div className="text-xl font-bold text-[#00ff88]">{playerStats.peakHour}</div>
                  </div>

                  <div className="bg-black/30 backdrop-blur-sm border border-[#00ff88]/20 rounded-lg p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Member vs Guest</div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Members</span>
                          <span className="text-[#00ff88]">{playerStats.memberVsGuest.members}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${playerStats.memberVsGuest.members}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-[#00ff88] to-[#00cc6a]"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">Guests</span>
                          <span className="text-gray-400">{playerStats.memberVsGuest.guests}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${playerStats.memberVsGuest.guests}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Activity Stream */}
                  <div className="bg-black/30 backdrop-blur-sm border border-[#00ff88]/20 rounded-lg p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Live Activity</div>
                    <canvas ref={canvasRef} width={320} height={100} className="w-full h-24" />
                  </div>
                </div>
              )}

              {/* Energy Tab */}
              {activeTab === 'energy' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard metric={{ label: 'Current Usage', value: energyMetrics.currentUsage.toFixed(1), unit: 'kWh', trend: 'stable' }} />
                    <MetricCard metric={{ label: 'Efficiency', value: energyMetrics.efficiency.toFixed(1), unit: '%', trend: 'up', change: 2 }} />
                  </div>

                  <div className="bg-black/30 backdrop-blur-sm border border-[#00ff88]/20 rounded-lg p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Usage vs Peak</div>
                    <div className="relative h-32">
                      <div className="absolute inset-0 flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(energyMetrics.currentUsage / energyMetrics.peakUsage) * 100}%` }}
                          className="w-1/2 bg-gradient-to-t from-[#00ff88] to-[#00cc6a] rounded-t-lg mr-2"
                        />
                        <div className="w-1/2 bg-gray-800 rounded-t-lg opacity-30" style={{ height: '100%' }} />
                      </div>
                      <div className="absolute inset-0 flex items-end justify-between text-xs text-gray-400 px-2 pb-2">
                        <span>Current<br/>{energyMetrics.currentUsage.toFixed(1)} kWh</span>
                        <span className="text-right">Peak<br/>{energyMetrics.peakUsage} kWh</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 backdrop-blur-sm border border-[#00ff88]/20 rounded-lg p-4">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Cost/Hour</div>
                      <div className="text-2xl font-bold text-[#00ff88]">${energyMetrics.costPerHour.toFixed(2)}</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm border border-[#00ff88]/20 rounded-lg p-4">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Daily Est.</div>
                      <div className="text-2xl font-bold text-white">${(energyMetrics.costPerHour * 12).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  <div className="bg-black/30 backdrop-blur-sm border border-[#00ff88]/20 rounded-lg p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Next Peak Time</div>
                    <div className="text-2xl font-bold text-[#00ff88]">{analytics.nextPeakTime}</div>
                    <div className="text-sm text-gray-400 mt-1">Expected occupancy: {analytics.expectedOccupancy}%</div>
                    <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${analytics.expectedOccupancy}%` }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-gradient-to-r from-[#00ff88] to-[#ffd700]"
                      />
                    </div>
                  </div>

                  {analytics.maintenanceAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-yellow-500 text-xl">⚠</div>
                        <div>
                          <div className="text-yellow-500 text-xs uppercase tracking-wider mb-1">Maintenance Alert</div>
                          <div className="text-white text-sm">{analytics.maintenanceAlert}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {analytics.weatherImpact && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-blue-400 text-xl">☀</div>
                        <div>
                          <div className="text-blue-400 text-xs uppercase tracking-wider mb-1">Weather Impact</div>
                          <div className="text-white text-sm">{analytics.weatherImpact}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="bg-black/30 backdrop-blur-sm border border-[#00ff88]/20 rounded-lg p-4">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Predictive Trends</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">Weekend Booking</span>
                        <span className="text-[#00ff88]">↗ +24%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">Evening Sessions</span>
                        <span className="text-[#00ff88]">↗ +18%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">Avg Court Time</span>
                        <span className="text-gray-400">→ Stable</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Floating Mini Stats (Bottom Left) */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-4 pointer-events-auto"
          >
            <div className="bg-black/50 backdrop-blur-md border border-[#00ff88]/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00ff88]/20 rounded-lg flex items-center justify-center">
                  <span className="text-[#00ff88] text-xl">⚡</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400">System Status</div>
                  <div className="text-sm text-[#00ff88] font-semibold">All Systems Operational</div>
                </div>
              </div>

              <div className="h-px bg-[#00ff88]/20" />

              <div className="flex gap-4 text-xs">
                <div>
                  <div className="text-gray-400">Uptime</div>
                  <div className="text-white font-semibold">99.8%</div>
                </div>
                <div>
                  <div className="text-gray-400">Response</div>
                  <div className="text-white font-semibold">12ms</div>
                </div>
                <div>
                  <div className="text-gray-400">Load</div>
                  <div className="text-white font-semibold">42%</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pulse Animation Overlay */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.05, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/10 via-transparent to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerformanceMetrics;
