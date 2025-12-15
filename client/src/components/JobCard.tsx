import { useState } from 'react';
import { Job } from '@/hooks/useJobSearch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DollarSign,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      setHasApplied(true);
      onApply?.(job.id);
      // Reset after 3 seconds
      setTimeout(() => setHasApplied(false), 3000);
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'status-open';
      case 'Assigned':
        return 'status-assigned';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-open';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="w-3 h-3" />;
      case 'Assigned':
        return <Clock className="w-3 h-3" />;
      case 'Completed':
        return <CheckCircle2 className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01] cursor-pointer group">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 border-b border-border">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">{job.company}</p>
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${getStatusColor(job.status)}`}>
                {getStatusIcon(job.status)}
                <span>{job.status}</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map(skill => (
                <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium transition-all duration-150 hover:bg-primary hover:text-primary-foreground">
                  {skill}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4 text-accent" />
                <span className="font-semibold text-foreground">Kshs {job.budget}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className={`w-4 h-4 ${isUrgent ? 'text-orange-500' : 'text-accent'}`} />
                <span className={isUrgent ? 'font-semibold text-orange-600' : 'font-semibold text-foreground'}>
                  {daysUntilDeadline}d left
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4 text-accent" />
                <span className="font-semibold text-foreground">{job.applicants}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-accent" />
                <span className="font-semibold text-foreground">
                  {new Date(job.postedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={job.status !== 'Open'}
            >
              View Details
            </Button>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{job.title}</DialogTitle>
              <DialogDescription className="text-base">{job.company}</DialogDescription>
            </div>
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(job.status)}`}>
                {getStatusIcon(job.status)}
                <span>{job.status}</span>
              </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h4 className="font-semibold mb-2 text-foreground">Job Description</h4>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-foreground">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(skill => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Budget</p>
              <p className="text-lg font-bold text-accent">${job.budget}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Deadline</p>
              <p className="text-lg font-bold text-foreground">
                {new Date(job.deadline).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Applicants</p>
              <p className="text-lg font-bold text-foreground">{job.applicants}</p>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Posted</p>
              <p className="text-lg font-bold text-foreground">
                {new Date(job.postedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={handleApply}
              disabled={job.status !== 'Open' || hasApplied}
              className="w-full"
              size="lg"
            >
              {hasApplied ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Application Submitted!
                </span>
              ) : isApplying ? (
                'Submitting...'
              ) : job.status !== 'Open' ? (
                'Job Not Available'
              ) : (
                'Apply Now'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
