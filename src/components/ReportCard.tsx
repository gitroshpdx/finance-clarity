import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, TrendingUp, Globe, Building2, Bitcoin, 
  Gem, Landmark, Cpu, BarChart3 
} from 'lucide-react';
import { formatPublishedDate } from '@/types/report';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReportCardProps {
  slug: string;
  title: string;
  teaser: string;
  readTime: number;
  topic: string;
  publishedAt: string;
  index?: number;
}

const topicIcons: Record<string, typeof TrendingUp> = {
  'Markets': TrendingUp,
  'Economy': Globe,
  'Technology': Cpu,
  'Real Estate': Building2,
  'Crypto': Bitcoin,
  'Commodities': Gem,
  'Banking': Landmark,
  'Central Banks': Landmark,
  'Macroeconomics': Globe,
  'Geopolitics': Globe,
  'Currencies': BarChart3,
  'Energy & Commodities': Gem,
  'Tech & Innovation': Cpu,
};

const topicColors: Record<string, string> = {
  'Markets': 'from-emerald-500/40 to-teal-600/30',
  'Economy': 'from-blue-500/40 to-indigo-600/30',
  'Technology': 'from-violet-500/40 to-purple-600/30',
  'Real Estate': 'from-amber-500/40 to-orange-600/30',
  'Crypto': 'from-pink-500/40 to-rose-600/30',
  'Commodities': 'from-yellow-500/40 to-amber-600/30',
  'Banking': 'from-slate-400/40 to-zinc-500/30',
  'Central Banks': 'from-cyan-500/40 to-blue-600/30',
  'Macroeconomics': 'from-blue-500/40 to-indigo-600/30',
  'Geopolitics': 'from-red-500/40 to-orange-600/30',
  'Currencies': 'from-green-500/40 to-emerald-600/30',
  'Energy & Commodities': 'from-yellow-500/40 to-orange-600/30',
  'Tech & Innovation': 'from-purple-500/40 to-pink-600/30',
};

const ReportCard = ({ slug, title, teaser, readTime, topic, publishedAt, index = 0 }: ReportCardProps) => {
  const Icon = topicIcons[topic] || TrendingUp;
  const gradientClass = topicColors[topic] || 'from-primary/30 to-primary-glow/30';
  const isMobile = useIsMobile();

  return (
    <Link to={`/report/${slug}`}>
      <motion.article
        initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: isMobile ? 0 : index * 0.1,
          ease: [0.16, 1, 0.3, 1] as const,
        }}
        whileHover={isMobile ? undefined : { y: -8 }}
        className="group cursor-pointer h-full"
      >
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-card-hover group-hover:border-primary/20 h-full flex flex-col">
          {/* Thumbnail / Visual */}
          <div className={`relative h-48 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
            {/* Grid pattern overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-background/20 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-2xl transition-transform duration-300 group-hover:scale-110">
                <Icon className="w-12 h-12 text-foreground/70" />
              </div>
            </div>
            
            {/* Decorative elements - only on desktop */}
            {!isMobile && (
              <>
                <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-white/5 blur-xl" />
              </>
            )}
            
            {/* Topic badge */}
            <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-semibold rounded-full bg-background/90 backdrop-blur-sm text-foreground shadow-lg">
              {topic}
            </span>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 flex-1 flex flex-col">
            <h3 className="font-serif text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1">
              {teaser}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{readTime} min read</span>
                </span>
                <span>{formatPublishedDate(publishedAt)}</span>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default ReportCard;
