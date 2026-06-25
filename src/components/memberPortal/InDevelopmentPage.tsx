import { Wrench, type LucideIcon } from 'lucide-react';

interface InDevelopmentPageProps {
  title: string;
  icon?: LucideIcon;
}

export default function InDevelopmentPage({ title, icon: Icon = Wrench }: InDevelopmentPageProps) {
  return (
    <section className="performance-in-dev">
      <div className="performance-in-dev-icon">
        <Icon size={40} strokeWidth={1.6} />
      </div>
      <h2>{title}</h2>
      <p>This section is currently in development. Check back soon.</p>
    </section>
  );
}
