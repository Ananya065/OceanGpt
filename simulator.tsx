import { useState, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Activity, ThermometerSun, Anchor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useSimulationMutation } from "@/hooks/use-ocean";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";

export default function Simulator() {
  const [tempIncrease, setTempIncrease] = useState<number[]>([1.5]);
  const [fishingActivity, setFishingActivity] = useState<number[]>([50]);
  
  // Debounce values to prevent API spam
  const [debouncedTemp] = useDebounceValue(tempIncrease[0], 500);
  const [debouncedFishing] = useDebounceValue(fishingActivity[0], 500);

  const simulationMutation = useSimulationMutation();

  // Mock data fallback to make it beautiful immediately
  const mockTimeline = Array.from({ length: 10 }, (_, i) => ({
    year: 2024 + i,
    fish: Math.max(10, 100 - (debouncedTemp * 15) - (debouncedFishing * 0.4) - (i * 5)),
    pollution: Math.min(100, 20 + (debouncedTemp * 8) + (i * 3))
  }));

  const data = simulationMutation.data?.timeline || mockTimeline;

  useEffect(() => {
    simulationMutation.mutate({
      temperatureIncrease: debouncedTemp,
      fishingActivity: debouncedFishing
    });
  }, [debouncedTemp, debouncedFishing]);

  return (
    <div className="max-w-6xl mx-auto mt-6 space-y-8 animate-in fade-in duration-500 pb-12">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
          <Activity className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Digital Twin Simulator</h1>
          <p className="text-muted-foreground">Adjust environmental variables to predict future ocean health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="glass shadow-xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThermometerSun className="w-5 h-5 text-red-500" />
                Temperature Rise
              </CardTitle>
              <CardDescription>Global average increase (°C)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex justify-between items-center">
                <span className="text-2xl font-bold text-red-500">+{tempIncrease[0]}°C</span>
              </div>
              <Slider 
                value={tempIncrease} 
                onValueChange={setTempIncrease} 
                max={5} 
                step={0.1}
                className="py-4"
              />
            </CardContent>
          </Card>

          <Card className="glass shadow-xl border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-blue-500" />
                Fishing Activity
              </CardTitle>
              <CardDescription>Industrial fishing intensity (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-500">{fishingActivity[0]}%</span>
              </div>
              <Slider 
                value={fishingActivity} 
                onValueChange={setFishingActivity} 
                max={100} 
                step={1}
                className="py-4"
              />
            </CardContent>
          </Card>

          {/* Quick Result Summary */}
          <Card className={`border-l-4 shadow-md ${
            data[data.length-1]?.fish < 30 ? 'border-l-destructive' : 'border-l-green-500'
          }`}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">10-Year Outlook</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Based on current parameters, the projected ecosystem stability is:
              </p>
              <div className={`text-2xl font-bold ${
                data[data.length-1]?.fish < 30 ? 'text-destructive' : 'text-green-500'
              }`}>
                {data[data.length-1]?.fish < 30 ? 'Critical Danger' : 'Sustainable'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass shadow-xl border-border/50">
            <CardHeader>
              <CardTitle>Fish Population Projection</CardTitle>
              <CardDescription>Estimated relative population index over the next decade.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorFish" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="fish" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorFish)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass shadow-xl border-border/50">
            <CardHeader>
              <CardTitle>Pollution & Coral Bleaching Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                    />
                    <Legend />
                    <Line type="monotone" name="Pollution Spread" dataKey="pollution" stroke="#a855f7" strokeWidth={3} dot={false} />
                    <Line type="monotone" name="Bleaching Risk" dataKey={(d) => Math.min(100, (d.pollution * 0.5) + (debouncedTemp * 20))} stroke="#ef4444" strokeWidth={3} dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
