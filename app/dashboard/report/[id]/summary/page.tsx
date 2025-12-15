'use client'
import { useState } from "react";

import { useTimeHorizon } from "@/hooks/use-time-horizon";
import { RunHeader } from "./ui/RunHeader";
import { DeltaSummary } from "./ui/DeltaSummary";
import { ExecutiveSummary } from "./ui/ExecutiveSummary";
import { TimeSeriesSection } from "./ui/TimeSeriesSection";
import { AIInsightsPanel } from "./ui/AIInsightsPanel";
import { FinancialsGrid } from "./ui/FinancialsGrid";
import { EventsTimeline } from "./ui/EventsTimeline";
import { ScenariosPanel } from "./ui/ScenariosPanel";
import { RisksPanel } from "./ui/RisksPanel";
import { DataLineage } from "./ui/DataLineage";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { InvestorDashboard } from "@/lib/seo-schema";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/clerk-react";




export function InvestorDashboard() {
    const {id} = useParams<{id: string}>();
  const {user} = useUser();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const job = useQuery(api.scrapingJobs.getJobBySnapshotId, {
    snapshotId: id || "skip",
    userId: user?.id || "skip"
  });
  
  const data = job?.seoReport as InvestorDashboard | undefined;
  const [mode, setMode] = useState<"public" | "private">(data!.run_metadata.mode);

  // Time horizon state management
  const { 
    horizon, 
    setHorizon, 
    horizonData, 
    isTransitioning 
  } = useTimeHorizon(data!);

  return (
    <div className="min-h-screen bg-background">
      <RunHeader
        metadata={data!.run_metadata}
        mode={mode}
        onModeChange={setMode}
      />

      <main>
        <DeltaSummary delta={data!.delta_summary} />
        <ExecutiveSummary summary={data!.executive_summary} />
        
        {/* Time-Series Section with functional horizon controls */}
        {mode === "public" && horizonData && (
          <TimeSeriesSection
            horizonData={horizonData}
            horizon={horizon}
            onHorizonChange={setHorizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        {/* AI Insights Panel - stubbed for future AI integration */}
        {horizonData?.ai_insights && (
          <AIInsightsPanel
            insights={horizonData.ai_insights}
            horizon={horizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        <FinancialsGrid data={data!} mode={mode} />
        <EventsTimeline events={data!.events} />
        <ScenariosPanel scenarios={data!.scenarios} />
        <RisksPanel risks={data!.risks} />
        <DataLineage lineage={data!.data_lineage} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="flex items-center justify-between text-micro text-muted-foreground">
          <span>
            Decision-Grade Dashboard • {data!.run_metadata.entity} •{" "}
            {data!.run_metadata.run_id}
          </span>
          <span className="font-mono">
            Hash: {data!.run_metadata.immutable_hash}
          </span>
        </div>
      </footer>
    </div>
  );
}