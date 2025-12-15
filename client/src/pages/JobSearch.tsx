import { useState } from 'react';
import { useJobSearch } from '@/hooks/useJobSearch';
import { JobCard } from '@/components/JobCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, X, Search, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



export default function JobSearch() {
  const {
    jobs,
    filters,
    allSkills,
    updateSearchQuery,
    toggleSkill,
    updateBudgetRange,
    toggleStatus,
    resetFilters,
  } = useJobSearch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'budget' | 'deadline'>('recent');

  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case 'budget':
        return b.budget - a.budget;
      case 'deadline':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'recent':
      default:
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    }
  });

  const handleApply = (jobId: string) => {
    // In a real app, this would send data to the backend
    console.log(`Applied for job: ${jobId}`);
  };

  const activeFilterCount =
    filters.selectedSkills.length +
    (filters.statusFilter.length > 0 ? 1 : 0) +
    (filters.budgetMin > 0 || filters.budgetMax < 2000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground font-display">
                  Job Marketplace
                </h1>
                <p className="text-sm text-muted-foreground">
                  Find freelance opportunities that match your skills
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search jobs by title, company, or skills..."
              value={filters.searchQuery}
              onChange={e => updateSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 md:hidden z-30"
            />
          )}
        </AnimatePresence>

        {/* Filter Sidebar */}
        <FilterSidebar
          allSkills={allSkills}
          selectedSkills={filters.selectedSkills}
          budgetMin={filters.budgetMin}
          budgetMax={filters.budgetMax}
          statusFilter={filters.statusFilter}
          onSkillToggle={toggleSkill}
          onBudgetChange={updateBudgetRange}
          onStatusToggle={toggleStatus}
          onReset={resetFilters}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 container py-8">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                {sortedJobs.length} {sortedJobs.length === 1 ? 'Job' : 'Jobs'} Found
              </h2>
              {activeFilterCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied
                </p>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex gap-2 flex-wrap">
              {(['recent', 'budget', 'deadline'] as const).map(option => (
                <Button
                  key={option}
                  variant={sortBy === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy(option)}
                  className="capitalize"
                >
                  {option === 'recent' && 'Most Recent'}
                  {option === 'budget' && 'Highest Budget'}
                  {option === 'deadline' && 'Urgent'}
                </Button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          {sortedJobs.length > 0 ? (
            <div className="grid gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {sortedJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                  >
                    <JobCard job={job} onApply={handleApply} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No jobs found
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Try adjusting your filters or search query to find more opportunities.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Reset Filters
              </Button>
            </motion.div>
          )}

          {/* Load More / Pagination Info */}
          {sortedJobs.length > 0 && (
            <div className="mt-12 text-center text-sm text-muted-foreground">
              <p>Showing all {sortedJobs.length} available jobs</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
