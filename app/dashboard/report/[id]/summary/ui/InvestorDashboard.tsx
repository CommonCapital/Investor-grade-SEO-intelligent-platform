import { useTimeHorizon } from "@/hooks/use-time-horizon";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { DataLineage } from "./DataLineage";
import { EventsTimeline } from "./EventsTimeline";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { FinancialsGrid } from "./FinancialsGrid";
import { RisksPanel } from "./RisksPanel";
import { RunHeader } from "./RunHeader";
import { ScenariosPanel } from "./ScenariosPanel";
import { TimeSeriesSection } from "./TimeSeriesSection";
import { useState } from "react";
import { InvestorDashboard as InvestorDashboardType } from "@/lib/seo-schema";
import { Loader2Icon } from "lucide-react";
interface Props {
    job: any;
}
export const InvestorDashboardComponent = ({job}:Props)  => {
 

const data = job?.seoReport as InvestorDashboardType | any;
const [mode, setMode] = useState(data?.run_metadata.mode);

  const { 
    horizon, 
    setHorizon, 
    horizonData, 
    isTransitioning 
  } = useTimeHorizon(data);
 
  return (
    <div className="min-h-screen bg-background">
      <RunHeader
        metadata={data.run_metadata}
        mode={mode}
        onModeChange={setMode}
      />

      <main>
        <ExecutiveSummary summary={data.executive_summary} />
        
        {/* Time-Series Section with functional horizon controls */}
        {mode === "public" && horizonData && (
          <TimeSeriesSection
            horizonData={horizonData}
            horizon={horizon}
            onHorizonChange={setHorizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        {/* AI Insights Panel */}
        {horizonData?.ai_insights && (
          <AIInsightsPanel
            insights={horizonData.ai_insights}
            horizon={horizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        <FinancialsGrid data={data} mode={mode} />
        <EventsTimeline events={data.events} />
        <ScenariosPanel scenarios={data.scenarios} />
        <RisksPanel risks={data.risks} />
        <DataLineage sources={data.sources} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="flex items-center justify-between text-micro text-muted-foreground">
          <span>
            Decision-Grade Dashboard • {data.run_metadata.entity} •{" "}
            {data.run_metadata.run_id}
          </span>
          <span className="font-mono">
            {new Date(data.run_metadata.timestamp).toLocaleString()}
          </span>
        </div>
      </footer>
    </div>
  );
}