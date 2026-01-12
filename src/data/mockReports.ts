export interface ChartData {
  type: 'line' | 'bar' | 'area';
  title: string;
  data: { date: string; value: number; label?: string }[];
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  pullQuote?: string;
  chart?: ChartData;
}

export interface Report {
  id: string;
  slug: string;
  title: string;
  teaser: string;
  content: ArticleSection[];
  topic: string;
  readTime: number;
  publishedAt: string;
  author?: { name: string; title?: string };
  relatedReportIds: string[];
}

export const mockReports: Report[] = [
  {
    id: '1',
    slug: 'fed-next-move-powell-remarks',
    title: "Fed's Next Move: Reading Between the Lines of Powell's Latest Remarks",
    teaser: "The Federal Reserve's communication strategy reveals more than monetary policy—it signals a profound shift in how central banks manage market expectations in an era of unprecedented uncertainty.",
    topic: "Macroeconomics",
    readTime: 5,
    publishedAt: "2h ago",
    author: { name: "Marcus Chen", title: "Chief Macro Strategist" },
    relatedReportIds: ['2', '4', '5'],
    content: [
      {
        id: 'intro',
        title: 'The Art of Central Bank Communication',
        content: `The Federal Reserve's latest policy statement wasn't just about interest rates—it was a masterclass in managed ambiguity. In a world where every comma in a Fed statement can move billions in capital, Jerome Powell's careful word choices carry weight far beyond their literal meaning.

Markets have become increasingly sophisticated at parsing Fed-speak, yet the central bank continues to evolve its communication strategy. The shift from forward guidance to "data dependency" represents more than a tactical adjustment; it signals a fundamental rethinking of how monetary policy operates in an information-rich environment.

What makes this moment particularly fascinating is the convergence of multiple economic crosscurrents: persistent inflation in services, cooling goods prices, and a labor market that refuses to follow traditional patterns. The Fed finds itself navigating without reliable maps.`,
        pullQuote: "In a world where every comma in a Fed statement can move billions in capital, Powell's word choices carry weight far beyond their literal meaning."
      },
      {
        id: 'market-reaction',
        title: 'Market Reaction Patterns',
        content: `The initial market response to Powell's remarks followed a now-familiar pattern: equity futures spiked, treasury yields compressed, and the dollar weakened. But the more interesting story lies in what happened in the hours that followed.

Algorithmic trading systems, trained on years of Fed communications, have become adept at extracting the immediate signal from Powell's words. Yet the secondary reaction—driven by human analysis and reflection—often moves in different directions as markets digest the fuller implications.

This two-stage reaction pattern has become increasingly pronounced over the past year. The gap between algorithmic first movers and thoughtful second movers creates opportunities for those patient enough to wait for the noise to settle.`,
        chart: {
          type: 'line',
          title: 'S&P 500 Response to Fed Announcements (% Change)',
          data: [
            { date: 'Jan', value: 0.8 },
            { date: 'Mar', value: -0.3 },
            { date: 'May', value: 1.2 },
            { date: 'Jul', value: -0.5 },
            { date: 'Sep', value: 0.4 },
            { date: 'Nov', value: 0.9 },
            { date: 'Dec', value: 1.1 },
          ]
        }
      },
      {
        id: 'policy-implications',
        title: 'Policy Implications for 2025',
        content: `Looking ahead, the Fed faces a delicate balancing act. The economy has proven more resilient than many expected, yet pockets of stress are emerging in commercial real estate and regional banking. The path forward requires threading a needle between premature easing and unnecessary tightening.

Our analysis suggests the Fed will maintain its current stance through at least the first quarter, with the option value of patience increasingly attractive in an uncertain environment. The key variable to watch isn't inflation—it's the labor market.

Specifically, we're monitoring wage growth in the services sector, where pricing power remains strongest. A sustained deceleration here would give the Fed the cover it needs to begin normalizing policy without declaring victory prematurely.`,
        pullQuote: "The key variable to watch isn't inflation—it's the labor market."
      },
      {
        id: 'investment-strategy',
        title: 'Strategic Positioning',
        content: `For investors, this environment calls for a barbell approach: maintain exposure to quality assets that benefit from lower rates while keeping powder dry for opportunities that emerge as policy evolves.

Fixed income markets are particularly interesting here. The yield curve's recent steepening suggests the market is beginning to price in a more normalized rate environment, though the timing remains uncertain.

Equity markets, meanwhile, continue to reward companies with pricing power and strong balance sheets. The era of "growth at any price" has given way to a more discerning environment where fundamentals matter again.

In our model portfolios, we've increased duration in high-quality fixed income while maintaining a tilt toward value factors in equities. This positioning should benefit from a gradual normalization scenario while providing downside protection if conditions deteriorate.`,
        chart: {
          type: 'area',
          title: 'Treasury Yield Curve Evolution',
          data: [
            { date: '3M', value: 5.3 },
            { date: '6M', value: 5.2 },
            { date: '1Y', value: 4.9 },
            { date: '2Y', value: 4.5 },
            { date: '5Y', value: 4.2 },
            { date: '10Y', value: 4.3 },
            { date: '30Y', value: 4.5 },
          ]
        }
      }
    ]
  },
  {
    id: '2',
    slug: 'great-rotation-emerging-markets',
    title: "The Great Rotation: Why Institutional Money Is Flowing to Emerging Markets",
    teaser: "A seismic shift in global capital allocation is underway. Here's what's driving the biggest portfolio rebalancing since 2008.",
    topic: "Markets",
    readTime: 4,
    publishedAt: "5h ago",
    author: { name: "Sarah Williams", title: "Head of Global Equities" },
    relatedReportIds: ['1', '3', '6'],
    content: [
      {
        id: 'intro',
        title: 'A Structural Shift Emerges',
        content: `For the first time in over a decade, institutional investors are making a decisive move toward emerging markets. This isn't the tactical allocation shift we've seen before—it represents a fundamental reassessment of where value lies in a changing global economy.

The numbers tell the story: over $47 billion has flowed into emerging market equity funds this year alone, the strongest inflow since the post-financial crisis recovery. But unlike previous EM rallies driven by commodity supercycles or carry trades, this rotation is built on more durable foundations.

Demographics, technology adoption, and rising middle-class consumption are creating structural tailwinds that developed market investors can no longer ignore. The question isn't whether to allocate to emerging markets—it's how much and where.`,
        pullQuote: "This isn't tactical—it represents a fundamental reassessment of where value lies in a changing global economy."
      },
      {
        id: 'drivers',
        title: 'Three Forces Driving the Rotation',
        content: `Three interconnected forces are compelling this shift. First, valuation disparities have reached extreme levels. Emerging market equities trade at roughly half the P/E multiple of their developed market counterparts, the widest gap in two decades.

Second, currency dynamics have shifted favorably. After years of dollar strength, the greenback appears to have peaked, creating a powerful tailwind for EM assets denominated in local currencies.

Third, and perhaps most importantly, the technology gap is closing. Emerging market companies are no longer merely low-cost manufacturers—they're innovation leaders in areas from fintech to electric vehicles to e-commerce.`,
        chart: {
          type: 'bar',
          title: 'P/E Ratio: EM vs DM Markets',
          data: [
            { date: 'EM Asia', value: 12.4 },
            { date: 'EM LATAM', value: 9.8 },
            { date: 'EM EMEA', value: 8.2 },
            { date: 'US', value: 21.5 },
            { date: 'Europe', value: 14.2 },
            { date: 'Japan', value: 16.8 },
          ]
        }
      },
      {
        id: 'risks',
        title: 'Understanding the Risks',
        content: `Of course, emerging markets carry distinct risks that investors must navigate carefully. Geopolitical tensions, currency volatility, and governance concerns remain real considerations.

China's property sector challenges and regulatory environment continue to weigh on sentiment, though we believe the worst is priced in. India's premium valuation reflects genuine growth potential but leaves less margin for error.

The key is selective positioning. Not all emerging markets will benefit equally from these structural shifts. We favor markets with strong domestic consumption stories, improving governance, and technology-forward economies.`,
        pullQuote: "The key is selective positioning. Not all emerging markets will benefit equally."
      }
    ]
  },
  {
    id: '3',
    slug: 'energy-transition-paradox',
    title: "Energy Transition Paradox: Oil Majors' $500B Bet on Both Sides",
    teaser: "The world's largest energy companies are playing a complex game of hedging their bets while reshaping the future of global energy infrastructure.",
    topic: "Energy & Commodities",
    readTime: 6,
    publishedAt: "8h ago",
    author: { name: "David Park", title: "Energy Sector Analyst" },
    relatedReportIds: ['2', '5', '6'],
    content: [
      {
        id: 'intro',
        title: 'The $500 Billion Question',
        content: `The world's largest energy companies face an existential paradox: how do you transition away from the very products that generate your profits? Their answer, increasingly, is to bet on both sides.

Over the past three years, the major integrated oil companies have committed over $500 billion to renewable energy, hydrogen, and carbon capture projects. Yet in the same period, they've approved nearly as much in new hydrocarbon developments.

This isn't cognitive dissonance—it's strategic hedging on an unprecedented scale. The energy transition will take decades, and these companies are positioning to profit regardless of how fast it unfolds.`,
        pullQuote: "This isn't cognitive dissonance—it's strategic hedging on an unprecedented scale."
      },
      {
        id: 'economics',
        title: 'The Economics of Transition',
        content: `Understanding this strategy requires examining the economics of energy transition. Renewable projects offer lower but more stable returns, typically in the 6-10% range. Traditional oil and gas projects, while riskier, can generate returns exceeding 20% in favorable price environments.

For companies managing this transition, the calculus is clear: use high-return hydrocarbon cash flows to fund the transition to a more sustainable but lower-return future. It's a generational arbitrage play.

The question is timing. Move too fast and you sacrifice near-term profits. Move too slow and you risk being left behind as the transition accelerates.`,
        chart: {
          type: 'line',
          title: 'Major Oil Companies: Renewable Investment ($B)',
          data: [
            { date: '2019', value: 12 },
            { date: '2020', value: 18 },
            { date: '2021', value: 35 },
            { date: '2022', value: 52 },
            { date: '2023', value: 78 },
            { date: '2024', value: 95 },
          ]
        }
      }
    ]
  },
  {
    id: '4',
    slug: 'dollar-dynamics-deficit',
    title: "Dollar Dynamics: Why Currency Markets Are Ignoring the Deficit",
    teaser: "Traditional models predicted dollar weakness years ago. Understanding why they failed reveals deeper truths about modern monetary mechanics.",
    topic: "Currencies",
    readTime: 5,
    publishedAt: "12h ago",
    author: { name: "Elena Rodriguez", title: "FX Strategy Lead" },
    relatedReportIds: ['1', '2', '5'],
    content: [
      {
        id: 'intro',
        title: 'The Deficit Puzzle',
        content: `The U.S. federal deficit has ballooned to levels that would have been unimaginable a decade ago. According to conventional economic theory, this should have crushed the dollar. Instead, the greenback has remained remarkably resilient.

Understanding this apparent paradox requires rethinking how currency markets actually work in a world of abundant global liquidity and dollar-denominated debt. The traditional models aren't wrong—they're just incomplete.

The dollar's role as the world's reserve currency creates self-reinforcing dynamics that traditional deficit analysis fails to capture. Every global stress event increases dollar demand, regardless of underlying U.S. fiscal conditions.`,
        pullQuote: "The traditional models aren't wrong—they're just incomplete."
      }
    ]
  },
  {
    id: '5',
    slug: 'ai-real-economic-impact',
    title: "AI's Real Economic Impact: Beyond the Hype Cycle",
    teaser: "Separating genuine productivity gains from speculative excess. A framework for understanding AI's macroeconomic implications over the next decade.",
    topic: "Tech & Innovation",
    readTime: 7,
    publishedAt: "1d ago",
    author: { name: "James Liu", title: "Technology & Macro Research" },
    relatedReportIds: ['2', '3', '6'],
    content: [
      {
        id: 'intro',
        title: 'Cutting Through the Noise',
        content: `The discourse around artificial intelligence has become almost impossible to parse. Bulls predict a productivity revolution exceeding the internet age. Bears warn of a speculative bubble rivaling the dot-com era. As usual, the truth lies somewhere in between—but exactly where matters enormously for investors.

Our analysis suggests AI will indeed drive meaningful productivity gains, but the timeline and distribution of those gains will surprise many observers. The companies best positioned to benefit aren't always the ones making headlines.

What we're witnessing isn't a single technology wave but a platform shift that will reshape competitive dynamics across virtually every industry. Understanding which sectors will see benefits first—and which will face disruption—is crucial for portfolio positioning.`,
        pullQuote: "What we're witnessing isn't a single technology wave but a platform shift that will reshape competitive dynamics across virtually every industry."
      },
      {
        id: 'productivity',
        title: 'Measuring Real Productivity Impact',
        content: `Early data on AI-driven productivity gains is encouraging but requires careful interpretation. Studies show 20-40% improvements in specific tasks like code generation, content creation, and customer service. But translating task-level gains into economy-wide productivity is far more complex.

The historical pattern of technology adoption suggests a J-curve: initial productivity actually declines as organizations invest in new systems and retrain workers, followed by accelerating gains as the technology matures and best practices emerge.

We estimate the inflection point for AI productivity—where gains become clearly visible in macro data—will arrive around 2026-2027. Until then, expect continued investment with limited measurable returns.`,
        chart: {
          type: 'area',
          title: 'Projected AI Productivity Impact (% GDP Growth Contribution)',
          data: [
            { date: '2024', value: 0.1 },
            { date: '2025', value: 0.2 },
            { date: '2026', value: 0.4 },
            { date: '2027', value: 0.8 },
            { date: '2028', value: 1.2 },
            { date: '2029', value: 1.6 },
            { date: '2030', value: 2.0 },
          ]
        }
      }
    ]
  },
  {
    id: '6',
    slug: 'new-cold-war-economics',
    title: "The New Cold War Economics: Trade Blocs and Supply Chain Realignment",
    teaser: "Geopolitical fractures are redrawing the map of global commerce. Winners and losers are emerging from this historic restructuring.",
    topic: "Geopolitics",
    readTime: 6,
    publishedAt: "1d ago",
    author: { name: "Michael Torres", title: "Geopolitical Risk Advisor" },
    relatedReportIds: ['2', '3', '5'],
    content: [
      {
        id: 'intro',
        title: 'The Fracturing of Globalization',
        content: `The era of frictionless global trade is ending. Not with a dramatic rupture, but through the steady accumulation of tariffs, sanctions, and strategic decoupling. The world is reorganizing into competing economic blocs, and the implications for investors are profound.

This isn't deglobalization—global trade volumes continue to grow. It's reglobalization: the restructuring of supply chains along geopolitical rather than purely economic lines. Companies are learning that the cheapest supplier isn't always the best choice when political risk is factored in.

The winners in this new environment will be countries that can serve as neutral bridges between blocs, and companies with the flexibility to adapt their supply chains to this shifting landscape.`,
        pullQuote: "It's reglobalization: the restructuring of supply chains along geopolitical rather than purely economic lines."
      }
    ]
  }
];

export const getReportBySlug = (slug: string): Report | undefined => {
  return mockReports.find(report => report.slug === slug);
};

export const getRelatedReports = (reportIds: string[]): Report[] => {
  return mockReports.filter(report => reportIds.includes(report.id));
};
