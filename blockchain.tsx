import { Database, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { useDatasets } from "@/hooks/use-ocean";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Blockchain() {
  const { data: datasets, isLoading } = useDatasets();

  // Mock data to ensure the table looks populated even if API is empty
  const mockDatasets = [
    { id: 1, name: "Pacific Temperature Read", type: "json", source: "NOAA Buoy 44", status: "verified", hash: "0x8f4d...3b2a", createdAt: new Date().toISOString() },
    { id: 2, name: "Atlantic Salinity Sample", type: "csv", source: "Research Vessel A", status: "verified", hash: "0xa12e...9c4f", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, name: "Coral Bleaching Drone Images", type: "image", source: "Drone Fleet X", status: "pending", hash: "0x...", createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 4, name: "Baltic Sea Microplastics", type: "json", source: "Autonomous Sub 2", status: "verified", hash: "0x77dd...11ef", createdAt: new Date(Date.now() - 259200000).toISOString() },
  ];

  const displayData = datasets?.length ? datasets : mockDatasets;

  return (
    <div className="max-w-6xl mx-auto mt-6 space-y-8 animate-in fade-in duration-500 pb-12">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Data Proofs</h1>
          <p className="text-muted-foreground">Cryptographically verified datasets ensuring trust and immutability.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1,204,492</div>
          </CardContent>
        </Card>
        
        <Card className="glass hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verification Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">99.8%</div>
          </CardContent>
        </Card>

        <Card className="glass hover-elevate bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4" /> Latest Block
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono tracking-tight text-foreground truncate">
              #18,442,109
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass shadow-xl border-border/50 overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-background/50">
          <CardTitle>Recent Datasets</CardTitle>
          <CardDescription>Live feed of data payloads logged onto the immutable ledger.</CardDescription>
        </CardHeader>
        <div className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="pl-6">Dataset Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ledger Hash</TableHead>
                <TableHead className="pr-6 text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 font-medium">{row.name}</TableCell>
                  <TableCell>{row.source}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase text-xs font-mono">
                      {row.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {row.status === "verified" ? (
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 flex w-fit items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex w-fit items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{row.hash}</TableCell>
                  <TableCell className="pr-6 text-right text-sm text-muted-foreground">
                    {new Date(row.createdAt!).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Loading blockchain data...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
