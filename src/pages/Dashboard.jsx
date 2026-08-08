import React from "react";
import { useCRM } from "../context/CRMContext";
import { IoPulseOutline } from "react-icons/io5";

// Component imports
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import LeadPieChart from "../components/dashboard/LeadPieChart";
import SentimentPieChart from "../components/dashboard/SentimentPieChart";
import IntentBarChart from "../components/dashboard/IntentBarChart";
import MessagesLineChart from "../components/dashboard/MessagesLineChart";
import RecentInsights from "../components/dashboard/RecentInsights";
import HotLeads from "../components/dashboard/HotLeads";
import TopProducts from "../components/dashboard/TopProducts";
import SalesSuggestions from "../components/dashboard/SalesSuggestions";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import DashboardFooter from "../components/dashboard/DashboardFooter";

export default function Dashboard() {
  const { 
    dashboardData, 
    customers, 
    loading, 
    lastRefreshTime, 
    activityEvents,
    refreshCRM 
  } = useCRM();

  const {
    stats,
    leads,
    sentiments,
    intents,
    messagesPerDay,
    topProducts,
    recentInsights
  } = dashboardData;

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-whatsapp-dark text-whatsapp-text p-6 flex flex-col justify-between select-none">
      
      <div className="space-y-6">
        
        {/* PHASE 1 - Professional Dashboard Header with LIVE sync indicator */}
        <div className="relative">
          <DashboardHeader 
            onRefresh={refreshCRM}
            loading={loading}
            refreshing={loading}
            lastUpdated={lastRefreshTime}
          />
          {/* Live Sync Status indicator */}
          <div className="absolute right-0 top-[-10px] hidden sm:flex items-center gap-1 text-[9px] text-whatsapp-green font-mono uppercase tracking-wider select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-whatsapp-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-whatsapp-green"></span>
            </span>
            <span>Live Sync Active</span>
          </div>
        </div>

        {/* Loading / Content State */}
        {loading && !stats.totalCustomers ? (
          <div className="space-y-6">
            {/* Skeleton Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-whatsapp-panel border border-whatsapp-border/20 rounded-xl p-4 animate-pulse h-24 animate-pulse"></div>
              ))}
            </div>
            {/* Skeleton Charts */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-whatsapp-panel border border-whatsapp-border/20 rounded-xl p-4 animate-pulse h-[320px] animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards Stats Grid */}
            <StatsGrid stats={stats} />

            {/* Recharts Distributions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <LeadPieChart data={leads} loading={loading} />
              <SentimentPieChart data={sentiments} loading={loading} />
              <IntentBarChart data={intents} loading={loading} />
              <MessagesLineChart data={messagesPerDay} loading={loading} />
            </div>

            {/* Bottom Row: Recent AI Insights (2/3 width) and Products/Hot Leads (1/3 width) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentInsights insights={recentInsights} loading={loading} />
              </div>
              <div className="flex flex-col gap-6">
                <TopProducts products={topProducts} loading={loading} />
                <HotLeads customers={customers} loading={loading} />
              </div>
            </div>

            {/* AI Actionable Insights Row: Playbook Suggestions & Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesSuggestions customers={customers} loading={loading} />
              <ActivityFeed events={activityEvents} loading={loading} />
            </div>
          </>
        )}
      </div>

      {/* PHASE 8 - Dashboard Footer */}
      <DashboardFooter lastUpdated={lastRefreshTime} />

    </div>
  );
}
