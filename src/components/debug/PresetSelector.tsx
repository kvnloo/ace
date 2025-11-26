import React, { useState } from 'react';
import { ChevronDown, Save, Trash2, Check } from 'lucide-react';
import type { DebugPreset } from './types';

interface PresetSelectorProps {
    presets: DebugPreset[];
    currentPreset?: string;
    onPresetSelect: (presetId: string) => void;
    onPresetSave: (name: string, description: string) => void;
    onPresetDelete: (presetId: string) => void;
    canSave?: boolean;
}

/**
 * Preset configuration selector with save/load functionality
 */
export const PresetSelector: React.FC<PresetSelectorProps> = ({
    presets,
    currentPreset,
    onPresetSelect,
    onPresetSave,
    onPresetDelete,
    canSave = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [presetName, setPresetName] = useState('');
    const [presetDescription, setPresetDescription] = useState('');

    const selectedPreset = presets.find(p => p.id === currentPreset);

    const handleSave = () => {
        if (presetName.trim()) {
            onPresetSave(presetName.trim(), presetDescription.trim());
            setPresetName('');
            setPresetDescription('');
            setShowSaveDialog(false);
        }
    };

    return (
        <div className="relative">
            {/* Preset Selector Dropdown */}
            <div className="bg-slate-900/50 rounded-lg border border-slate-700">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors"
                >
                    <div className="flex items-center gap-2 text-left flex-1">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Preset:</span>
                        <span className="text-white font-medium">
                            {selectedPreset?.name || 'Custom'}
                        </span>
                    </div>
                    <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto">
                        {presets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => {
                                    onPresetSelect(preset.id);
                                    setIsOpen(false);
                                }}
                                className={`
                  w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800 last:border-b-0
                  ${preset.id === currentPreset ? 'bg-slate-800/30' : ''}
                `}
                            >
                                <div className="text-left flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">{preset.name}</span>
                                        {preset.id === currentPreset && (
                                            <Check className="w-4 h-4 text-green-400" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{preset.description}</p>
                                </div>

                                {/* Delete button for custom presets */}
                                {!['baseline', 'one-by-one', 'production', 'performance-test'].includes(preset.id) && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPresetDelete(preset.id);
                                        }}
                                        className="ml-2 p-1 hover:bg-red-500/20 rounded transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3 text-red-400" />
                                    </button>
                                )}
                            </button>
                        ))}

                        {/* Save Current as Preset */}
                        {canSave && (
                            <button
                                onClick={() => {
                                    setShowSaveDialog(true);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-2 p-3 hover:bg-slate-800/50 transition-colors border-t border-slate-700 text-green-400"
                            >
                                <Save className="w-4 h-4" />
                                <span className="font-medium">Save Current as Preset</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Save Preset Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 rounded-lg border border-slate-700 p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-white mb-4">Save Preset</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Preset Name</label>
                                <input
                                    type="text"
                                    value={presetName}
                                    onChange={(e) => setPresetName(e.target.value)}
                                    placeholder="My Custom Preset"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Description (optional)</label>
                                <textarea
                                    value={presetDescription}
                                    onChange={(e) => setPresetDescription(e.target.value)}
                                    placeholder="Describe this preset configuration..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={handleSave}
                                disabled={!presetName.trim()}
                                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium py-2 rounded-lg transition-colors"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowSaveDialog(false);
                                    setPresetName('');
                                    setPresetDescription('');
                                }}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
