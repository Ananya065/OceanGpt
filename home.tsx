import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Map, Activity, LineChart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/chat?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 pb-12 animate-in fade-in zoom-in duration-500">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass mt-6 border-0 shadow-2xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5 -z-10" />
        <div className="px-6 py-16 md:py-24 text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Understand the <span className="text-gradient">Ocean</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            AI-powered insights, real-time digital twin simulations, and verifiable blockchain data for global ocean health.
          </p>

          <form 
            onSubmit={handleSearch}
            className="w-full max-w-2xl relative flex items-center"
          >
            <Search className="absolute left-4 w-6 h-6 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask OceanGPT about coral bleaching, temperature trends..."
              className="w-full pl-12 pr-32 py-8 text-lg rounded-2xl border-2 border-primary/20 bg-background/50 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary shadow-lg backdrop-blur-sm transition-all"
            />
            <Button 
              type="submit" 
              size="lg" 
              className="absolute right-2 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md h-12 px-6"
            >
              Ask AI
            </Button>
          </form>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" /> Quick Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover-elevate cursor-pointer border-primary/10 group" onClick={() => setLocation("/map")}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Map className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Pollution Map</CardTitle>
              <CardDescription>View real-time heatmaps of global ocean pollution levels.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate cursor-pointer border-accent/10 group" onClick={() => setLocation("/simulator")}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Climate Simulator</CardTitle>
              <CardDescription>Test how temperature changes impact fish populations.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate cursor-pointer border-green-500/10 group" onClick={() => setLocation("/blockchain")}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle>Verified Data</CardTitle>
              <CardDescription>Explore cryptographically verified ocean sensor datasets.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Sensors", value: "1,248" },
          { label: "Avg Temp Change", value: "+1.2°C" },
          { label: "Datasets Verified", value: "89,432" },
          { label: "AI Queries Today", value: "4,192" }
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
          </div>
        ))}
      </section>

    </div>
  );
}
