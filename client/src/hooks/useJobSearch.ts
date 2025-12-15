import { useState, useMemo } from 'react';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  budget: number;
  skills: string[];
  deadline: string;
  status: 'Open' | 'Assigned' | 'Completed';
  applicants: number;
  postedDate: string;
}

export interface FilterState {
  searchQuery: string;
  selectedSkills: string[];
  budgetMin: number;
  budgetMax: number;
  statusFilter: string[];
}

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Mobile App UI Design',
    company: 'TechStartup Inc',
    description: 'Design a modern, user-friendly mobile application interface for our fitness tracking app. We need 5-8 screens including onboarding, dashboard, and settings.',
    budget: 800,
    skills: ['UI Design', 'Figma', 'Mobile Design'],
    deadline: '2025-01-15',
    status: 'Open',
    applicants: 3,
    postedDate: '2025-01-02',
  },
  {
    id: '2',
    title: 'React Component Library',
    company: 'Digital Agency Co',
    description: 'Build a reusable React component library with 20+ components. Must include documentation and Storybook integration.',
    budget: 1500,
    skills: ['React', 'JavaScript', 'CSS'],
    deadline: '2025-02-01',
    status: 'Open',
    applicants: 5,
    postedDate: '2025-01-01',
  },
  {
    id: '3',
    title: 'Content Writing - Blog Posts',
    company: 'Marketing Hub',
    description: 'Write 10 SEO-optimized blog posts (1000-1500 words each) on technology trends. Topics will be provided.',
    budget: 500,
    skills: ['Content Writing', 'SEO', 'Research'],
    deadline: '2025-01-20',
    status: 'Open',
    applicants: 8,
    postedDate: '2024-12-28',
  },
  {
    id: '4',
    title: 'Database Optimization',
    company: 'Enterprise Solutions',
    description: 'Optimize our PostgreSQL database queries and schema. Performance improvement target: 40% faster queries.',
    budget: 1200,
    skills: ['SQL', 'PostgreSQL', 'Database Design'],
    deadline: '2025-01-25',
    status: 'Assigned',
    applicants: 2,
    postedDate: '2024-12-30',
  },
  {
    id: '5',
    title: 'Logo & Branding Design',
    company: 'Startup Studio',
    description: 'Create a complete brand identity including logo, color palette, and typography guidelines for a new fintech startup.',
    budget: 600,
    skills: ['Graphic Design', 'Branding', 'Adobe Creative Suite'],
    deadline: '2025-01-18',
    status: 'Open',
    applicants: 4,
    postedDate: '2025-01-03',
  },
  {
    id: '6',
    title: 'Python Data Analysis Project',
    company: 'Analytics Firm',
    description: 'Analyze customer behavior data using Python. Create visualizations and a comprehensive report with insights.',
    budget: 900,
    skills: ['Python', 'Data Analysis', 'Pandas', 'Matplotlib'],
    deadline: '2025-02-05',
    status: 'Open',
    applicants: 6,
    postedDate: '2024-12-29',
  },
  {
    id: '7',
    title: 'WordPress Theme Development',
    company: 'Web Design Studio',
    description: 'Develop a custom WordPress theme with WooCommerce integration. Must be responsive and SEO-friendly.',
    budget: 1100,
    skills: ['WordPress', 'PHP', 'JavaScript'],
    deadline: '2025-02-10',
    status: 'Open',
    applicants: 3,
    postedDate: '2025-01-02',
  },
  {
    id: '8',
    title: 'Video Editing - Product Demo',
    company: 'SaaS Company',
    description: 'Edit and produce a 3-5 minute product demo video. Must include motion graphics and background music.',
    budget: 700,
    skills: ['Video Editing', 'Motion Graphics', 'Adobe Premiere'],
    deadline: '2025-01-22',
    status: 'Completed',
    applicants: 1,
    postedDate: '2024-12-25',
  },
  {
    id: '9',
    title: 'API Development - REST API',
    company: 'FinTech Startup',
    description: 'Build a RESTful API for payment processing. Must include authentication, error handling, and comprehensive documentation.',
    budget: 1400,
    skills: ['Node.js', 'Express', 'REST API', 'MongoDB'],
    deadline: '2025-02-15',
    status: 'Open',
    applicants: 7,
    postedDate: '2024-12-31',
  },
  {
    id: '10',
    title: 'Social Media Strategy',
    company: 'E-commerce Brand',
    description: 'Create a 3-month social media strategy and content calendar for Instagram and TikTok. Include competitor analysis.',
    budget: 450,
    skills: ['Social Media Marketing', 'Content Strategy', 'Analytics'],
    deadline: '2025-01-17',
    status: 'Open',
    applicants: 9,
    postedDate: '2025-01-03',
  },
];

const ALL_SKILLS = Array.from(
  new Set(MOCK_JOBS.flatMap(job => job.skills))
).sort();

export function useJobSearch() {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedSkills: [],
    budgetMin: 0,
    budgetMax: 2000,
    statusFilter: ['Open'],
  });

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      // Search query filter
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Skills filter
      if (filters.selectedSkills.length > 0) {
        const hasSkill = filters.selectedSkills.some(skill =>
          job.skills.includes(skill)
        );
        if (!hasSkill) return false;
      }

      // Budget filter
      if (job.budget < filters.budgetMin || job.budget > filters.budgetMax) {
        return false;
      }

      // Status filter
      if (filters.statusFilter.length > 0) {
        if (!filters.statusFilter.includes(job.status)) return false;
      }

      return true;
    });
  }, [filters]);

  const updateSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const toggleSkill = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill],
    }));
  };

  const updateBudgetRange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      budgetMin: min,
      budgetMax: max,
    }));
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      statusFilter: prev.statusFilter.includes(status)
        ? prev.statusFilter.filter(s => s !== status)
        : [...prev.statusFilter, status],
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedSkills: [],
      budgetMin: 0,
      budgetMax: 2000,
      statusFilter: ['Open'],
    });
  };

  return {
    jobs: filteredJobs,
    filters,
    allSkills: ALL_SKILLS,
    updateSearchQuery,
    toggleSkill,
    updateBudgetRange,
    toggleStatus,
    resetFilters,
    totalJobs: MOCK_JOBS.length,
  };
}
