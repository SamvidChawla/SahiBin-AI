import { MapPin, Phone, Clock, Star, Navigation, Crosshair, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { InteractiveMap } from './InteractiveMap';

// -------------------------------------------------------
// FETCH COLLECTION CENTERS FROM REAL API
// -------------------------------------------------------
async function fetchCollectionCenters(userLat: number, userLng: number, searchRadius: number, selectedMaterial: string) {
  try {
    const url = `https://sahibin-ai.onrender.com/api/collection-centers?lat=${userLat}&lng=${userLng}&radius=${searchRadius}&material=${selectedMaterial}`;

    const response = await fetch(url, { method: 'GET' });
    const raw = await response.text();
    //console.log('API RAW RESPONSE:', raw);

    if (!response.ok) {
      throw new Error('API request failed: ' + raw);
    }

    const data = JSON.parse(raw);

    if (!Array.isArray(data.centers)) {
      throw new Error('Invalid data format: centers array missing');
    }

    return data.centers;
  } catch (err) {
    console.error('FETCH COLLECTION CENTERS ERROR:', err);
    return [];
  }
}

export function CollectionCentersPageNew() {
  const [searchRadius, setSearchRadius] = useState(5);
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [userLocation] = useState<[number, number]>([28.6294, 77.0998]); // Delhi coordinates
  const [centers, setCenters] = useState<any[]>([]);

  // Fetch centers whenever user location, radius, or material filter changes
  useEffect(() => {
    fetchCollectionCenters(userLocation[0], userLocation[1], searchRadius, selectedMaterial)
      .then((data) => setCenters(data))
      .catch(() => setCenters([]));
  }, [userLocation, searchRadius, selectedMaterial]);

  const materialColors: Record<string, string> = {
    Plastic: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
    Paper: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
    Metal: 'bg-slate-100 text-slate-700 dark:bg-slate-950/50 dark:text-slate-400',
    Glass: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400',
    Cardboard: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
    Organic: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
    Battery: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400'
  };

  return (
    <div className="py-8 px-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Search Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-white rounded-[20px] shadow-lg p-8">
          <h2 className="text-[28px] text-slate-900 dark:text-slate-900 mb-6 flex items-center gap-2">
            <MapPin className="w-7 h-7 text-sky-600 dark:text-sky-400" />
            Find Nearby Collection Centers
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-[14px] text-slate-600 dark:text-slate-400 mb-2 block">Search Radius (km)</label>
              <Input type="number" value={searchRadius} onChange={(e) => setSearchRadius(Number(e.target.value))} className="h-[48px]" min="1" max="50" />
            </div>

            <div>
              <label className="text-[14px] text-slate-600 dark:text-slate-400 mb-2 block">Filter by Material</label>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger className="h-[48px]"><SelectValue placeholder="All materials" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="paper">Paper</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="cardboard">Cardboard</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="battery">Battery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="h-[48px] w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
                <Crosshair className="w-5 h-5 mr-2" />
                Update Location
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[13px] text-slate-500 dark:text-slate-400">
              📍 Current location: {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
            </p>
            {selectedMaterial !== 'all' && (
              <p className="text-[13px] text-sky-600 dark:text-sky-400">
                <Filter className="w-3 h-3 inline mr-1" />
                Filtered by: {selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)}
              </p>
            )}
          </div>
        </motion.div>

        {/* Map and Side Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-white rounded-[20px] shadow-lg overflow-hidden">
          <div className="p-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] text-slate-900 dark:text-white">Interactive Collection Centers Map</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>Click markers for details</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 p-8">
              <InteractiveMap centers={centers} userLocation={userLocation} searchRadius={searchRadius} onCenterClick={(center) => {
                console.log('Center clicked:', center);
                const element = document.getElementById(`center-${center.id}`);
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }} />
            </div>

            <div className="lg:col-span-1 bg-slate-50 dark:bg-slate-900/50 p-6 border-l border-slate-200 dark:border-slate-700 max-h-[600px] overflow-y-auto">
              <h4 className="text-[16px] text-slate-900 dark:text-white mb-4 sticky top-0 bg-slate-50 dark:bg-slate-900/50 pb-2 z-10">
                Centers List ({centers.length})
              </h4>

              <div className="space-y-4">
                {centers.map((center, index) => (
                  <motion.div key={center.id} id={`center-${center.id}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.05 }} className="bg-white dark:bg-white rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer" onClick={() => console.log('Center card clicked:', center)}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{center.id}</div>
                        <h5 className="text-[14px] text-slate-900 dark:text-white font-medium">{center.name}</h5>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs">{center.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-3 h-3" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{center.distance}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span className="truncate">{center.hours?.split(",")[0] || "Hours not available"}</span>
                      </div>
                    </div>

                    {/* Materials badges — safe when API doesn't provide acceptedMaterials */}
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        const materials: string[] = Array.isArray(center.acceptedMaterials) ? center.acceptedMaterials : [];
                        if (materials.length === 0) {
                          return <Badge className="px-2 py-0.5 text-[10px] rounded-full border-0 bg-slate-200 text-slate-600">No info</Badge>;
                        }

                        return (
                          <>
                            {materials.slice(0, 3).map((material) => {
                              // normalize material string to match your materialColors keys
                              const colorKey = material.charAt(0).toUpperCase() + material.slice(1).toLowerCase();
                              const colorClass = materialColors[colorKey] || 'bg-slate-100 text-slate-700';

                              return (
                                <Badge
                                  key={material}
                                  className={`${colorClass} px-2 py-0.5 text-[10px] rounded-full border-0`}
                                >
                                  {material}
                                </Badge>
                              );
                            })}

                            {materials.length > 3 && (
                              <Badge className="px-2 py-0.5 text-[10px] rounded-full border-0 bg-slate-200 text-slate-600">
                                +{materials.length - 3}
                              </Badge>
                            )}
                          </>
                        );
                      })()}
                    </div>

                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-r from-sky-500 to-cyan-500 rounded-[20px] shadow-lg p-8 text-center">
          <h3 className="text-white text-[24px] mb-2">Find the right way</h3>
          <p className="text-white/90 mb-6">Our team can help you identify the best course of action for your specific waste type</p>
          <div className="flex flex-wrap gap-4 justify-center">
          </div>
        </motion.div>
      </div>
    </div>
  );
}
