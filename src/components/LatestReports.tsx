import { motion } from 'framer-motion';
import ReportCard from './ReportCard';

// Mock data for reports
const mockReports = [
  {
    title: "Fed's Next Move: Reading Between the Lines of Powell's Latest Remarks",
    teaser: "The Federal Reserve's communication strategy reveals more than monetary policy—it signals a profound shift in how central banks manage market expectations in an era of unprecedented uncertainty.",
    readTime: 5,
    topic: "Macroeconomics",
    publishedAt: "2h ago",
  },
  {
    title: "The Great Rotation: Why Institutional Money Is Flowing to Emerging Markets",
    teaser: "A seismic shift in global capital allocation is underway. Here's what's driving the biggest portfolio rebalancing since 2008.",
    readTime: 4,
    topic: "Markets",
    publishedAt: "5h ago",
  },
  {
    title: "Energy Transition Paradox: Oil Majors' $500B Bet on Both Sides",
    teaser: "The world's largest energy companies are playing a complex game of hedging their bets while reshaping the future of global energy infrastructure.",
    readTime: 6,
    topic: "Energy & Commodities",
    publishedAt: "8h ago",
  },
  {
    title: "Dollar Dynamics: Why Currency Markets Are Ignoring the Deficit",
    teaser: "Traditional models predicted dollar weakness years ago. Understanding why they failed reveals deeper truths about modern monetary mechanics.",
    readTime: 5,
    topic: "Currencies",
    publishedAt: "12h ago",
  },
  {
    title: "AI's Real Economic Impact: Beyond the Hype Cycle",
    teaser: "Separating genuine productivity gains from speculative excess. A framework for understanding AI's macroeconomic implications over the next decade.",
    readTime: 7,
    topic: "Tech & Innovation",
    publishedAt: "1d ago",
  },
  {
    title: "The New Cold War Economics: Trade Blocs and Supply Chain Realignment",
    teaser: "Geopolitical fractures are redrawing the map of global commerce. Winners and losers are emerging from this historic restructuring.",
    readTime: 6,
    topic: "Geopolitics",
    publishedAt: "1d ago",
  },
];

const LatestReports = () => {
  return (
    <section id="reports" className="relative py-24 md:py-32">
      <div className="container px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-display font-sans mb-4">Latest Intelligence</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fresh insights from global markets, economies, and policy developments—
            distilled for clarity.
          </p>
        </motion.div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mockReports.map((report, index) => (
            <ReportCard
              key={index}
              {...report}
              index={index}
            />
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <button className="group flex items-center gap-2 px-6 py-3 rounded-full glass-card text-muted-foreground hover:text-foreground transition-colors">
            <span className="font-medium">Load more reports</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-5"
            >
              ↓
            </motion.div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestReports;
