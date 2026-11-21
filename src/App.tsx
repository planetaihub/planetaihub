/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CompanyMarquee } from './components/CompanyMarquee';
import { Footer } from './components/Footer';
import { InstallAppModal } from './components/InstallAppModal';
import { Navigation } from './components/Navigation';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PostJobModal } from './components/PostJobModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { ShareToast } from './components/ShareToast';
import { AIAssistantsTab } from './components/tabs/AIAssistantsTab';
import { CareerStudioTab } from './components/tabs/CareerStudioTab';
import { DevToolsTab } from './components/tabs/DevToolsTab';
import { FinanceDocsTab } from './components/tabs/FinanceDocsTab';
import { HealthWeatherTab } from './components/tabs/HealthWeatherTab';
import { JobsBoard } from './components/tabs/JobsBoard';
import { LiveEarningTab } from './components/tabs/LiveEarningTab';
import { ProductivityTab } from './components/tabs/ProductivityTab';
import type { JobListing, TabId } from './types';
import {
  STORAGE_KEYS,
  loadJobNotes,
  loadSavedJobIds,
  readJson,
  saveJobNote,
  saveSavedJobIds,
  writeJson,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('jobs');
  const [jobViewMode, setJobViewMode] = useState<'all' | 'saved'>('all');
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() =>
    loadSavedJobIds()
  );
  const [postedJobs, setPostedJobs] = useState<JobListing[]>(() =>
    readJson<JobListing[]>(STORAGE_KEYS.POSTED_JOBS, [])
  );
  const [jobNotes, setJobNotes] = useState<Record<string, string>>(() =>
    loadJobNotes()
  );
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const next = exists
        ? prev.filter((id) => id !== jobId)
        : [jobId, ...prev];
      saveSavedJobIds(next);
      return next;
    });
  };

  const handleUpdateJobNote = (jobId: string, note: string) => {
    const updated = saveJobNote(jobId, note);
    setJobNotes(updated);
  };

  const handlePublishJob = (newJob: JobListing) => {
    setPostedJobs((prev) => {
      const next = [newJob, ...prev];
      writeJson(STORAGE_KEYS.POSTED_JOBS, next);
      return next;
    });
    setActiveTab('jobs');
    setJobViewMode('all');
  };

  const handleOpenSavedJobs = () => {
    setActiveTab('jobs');
    setJobViewMode('saved');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <JobsBoard
            savedJobIds={savedJobIds}
            postedJobs={postedJobs}
            jobNotes={jobNotes}
            viewMode={jobViewMode}
            onChangeViewMode={setJobViewMode}
            onToggleSave={handleToggleSaveJob}
            onUpdateJobNote={handleUpdateJobNote}
            onOpenPostJob={() => setIsPostJobOpen(true)}
          />
        );
      case 'career-studio':
        return <CareerStudioTab />;
      case 'ai-assistants':
        return <AIAssistantsTab />;
      case 'dev-tools':
        return <DevToolsTab />;
      case 'finance-docs':
        return <FinanceDocsTab />;
      case 'productivity':
        return <ProductivityTab />;
      case 'health-weather':
        return <HealthWeatherTab />;
      case 'live-earning':
        return <LiveEarningTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100">
      <Navigation
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        savedCount={savedJobIds.length}
        onOpenSavedJobs={handleOpenSavedJobs}
      />

      <CompanyMarquee />

      <OfflineIndicator />

      <main className="mx-auto max-w-7xl px-4 pt-6 pb-28 sm:px-6 lg:pt-8">
        <div className="no-print">
          <PWAInstallBanner />
        </div>

        {renderTabContent()}

        <Footer
          onSelectTab={handleSelectTab}
          onOpenPostJob={() => setIsPostJobOpen(true)}
        />
      </main>

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onPublishJob={handlePublishJob}
      />

      <InstallAppModal />

      <ShareToast />
    </div>
  );
}
