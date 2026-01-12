import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, TrendingUp, Globe, DollarSign, Zap, BarChart3 } from 'lucide-react';

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
  'Macroeconomics': Globe,
  'Markets': TrendingUp,
  'Geopolitics': Globe,
  'Currencies': DollarSign,
  'Energy & Commodities': Zap,
  'Tech & Innovation': BarChart3,
};

const topicColors: Record<string, string> = {
  'Macroeconomics': 'from-blue-500/20 to-indigo-500/20',
  'Markets': 'from-emerald-500/20 to-teal-500/20',
  'Geopolitics': 'from-orange-500/20 to-red-500/20',
  'Currencies': 'from-green-500/20 to-emerald-500/20',
  'Energy & Commodities': 'from-yellow-500/20 to-orange-500/20',
  'Tech & Innovation': 'from-purple-500/20 to-pink-500/20',
};

const ReportCard = ({ slug, title, teaser, readTime, topic, publishedAt, index = 0 }: ReportCardProps) => {
  const Icon = topicIcons[topic] || TrendingUp;
  const gradientClass = topicColors[topic] || 'from-primary/20 to-primary-glow/20';

  return (
    <Link to={`/report/${slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ y: -8 }}
        className="group cursor-pointer"
      >
      <div className="glass-card rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-card-hover group-hover:border-primary/20">
        {/* Thumbnail / Visual */}
        <div className={`relative h-48 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-background/10 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon className="w-10 h-10 text-foreground/60" />
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-primary-glow opacity-10 blur-xl" />
          
          {/* Topic badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full bg-background/80 backdrop-blur-sm text-foreground"
          >
            {topic}
          </motion.span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h3 className="font-serif text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {teaser}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {readTime} min read
                </motion.span>
              </span>
              <span>{publishedAt}</span>
            </div>
            
            <motion.div
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <TrendingUp className="w-4 h-4 text-primary" />
            </motion.div>
          </div>
        </div>
      </div>
      </motion.article>
    </Link>
  );
};

export default ReportCard;
