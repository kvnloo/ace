import React from 'react';
import { Cloud, CloudRain, CloudSnow, Wind, Sun, CloudDrizzle } from 'lucide-react';
import { WeatherType } from './WeatherSystem';

interface WeatherControlsProps {
  currentWeather: WeatherType;
  onWeatherChange: (weather: WeatherType) => void;
  intensity: number;
  onIntensityChange: (intensity: number) => void;
}

/**
 * WeatherControls Component
 *
 * UI controls for testing and demonstrating the weather system.
 * Provides buttons to switch between different weather types
 * and a slider to control intensity.
 */
const WeatherControls: React.FC<WeatherControlsProps> = ({
  currentWeather,
  onWeatherChange,
  intensity,
  onIntensityChange
}) => {
  const weatherOptions = [
    { type: 'clear' as WeatherType, icon: Sun, label: 'Clear', color: '#fbbf24' },
    { type: 'rain' as WeatherType, icon: CloudRain, label: 'Rain', color: '#60a5fa' },
    { type: 'snow' as WeatherType, icon: CloudSnow, label: 'Snow', color: '#e0f2fe' },
    { type: 'windy' as WeatherType, icon: Wind, label: 'Windy', color: '#a3e635' },
    { type: 'storm' as WeatherType, icon: CloudDrizzle, label: 'Storm', color: '#6366f1' }
  ];

  return (
    <div className="absolute top-40 right-6 z-10 flex flex-col gap-4 pointer-events-none">
      {/* Weather Type Selector */}
      <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Cloud className="w-4 h-4 text-white/90" />
          <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
            Weather System
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {weatherOptions.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              onClick={() => onWeatherChange(type)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentWeather === type
                  ? 'bg-white/20 text-white shadow-lg scale-105'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
              style={{
                borderLeft: currentWeather === type ? `3px solid ${color}` : 'none'
              }}
            >
              <Icon
                className="w-4 h-4"
                style={{ color: currentWeather === type ? color : undefined }}
              />
              <span>{label}</span>
              {currentWeather === type && (
                <span className="ml-auto w-2 h-2 rounded-full bg-tennis-yellow animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Intensity Slider */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/80 uppercase tracking-wider">Intensity</span>
            <span className="text-xs text-white font-mono">{Math.round(intensity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={intensity * 100}
            onChange={(e) => onIntensityChange(Number(e.target.value) / 100)}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                     slider-thumb:appearance-none slider-thumb:w-4 slider-thumb:h-4
                     slider-thumb:rounded-full slider-thumb:bg-tennis-yellow
                     slider-thumb:cursor-pointer slider-thumb:shadow-lg"
            style={{
              background: `linear-gradient(to right, #DFFF4F ${intensity * 100}%, rgba(255,255,255,0.1) ${intensity * 100}%)`
            }}
          />
        </div>

        {/* Weather Impact Indicators */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/80 uppercase tracking-wider mb-2">
            Gameplay Impact
          </div>
          <div className="space-y-1 text-xs">
            {currentWeather === 'rain' || currentWeather === 'storm' ? (
              <>
                <div className="flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Surface: Slower, wet bounce
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Visibility: {currentWeather === 'storm' ? 'Reduced' : 'Moderate'}
                </div>
              </>
            ) : currentWeather === 'snow' ? (
              <>
                <div className="flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                  Surface: Slippery
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                  Ball tracking: Difficult
                </div>
              </>
            ) : currentWeather === 'windy' ? (
              <>
                <div className="flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Ball trajectory: Affected
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Serve difficulty: High
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                Optimal playing conditions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-white/10 pointer-events-auto text-xs text-white/85">
        <div className="flex items-start gap-2">
          <div className="w-1 h-1 rounded-full bg-tennis-yellow mt-1.5 flex-shrink-0" />
          <div>
            Weather effects include dynamic particles, lighting changes, and surface interactions.
            Adjust intensity for performance tuning.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherControls;
