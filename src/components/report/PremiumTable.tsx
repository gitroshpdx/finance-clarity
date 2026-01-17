import { motion } from 'framer-motion';

interface PremiumTableProps {
  headers: string[];
  rows: string[][];
}

const PremiumTable = ({ headers, rows }: PremiumTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="my-8 overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary/5 border-b border-border/50">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {rows.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: rowIndex * 0.05, duration: 0.3 }}
                className="hover:bg-primary/5 transition-colors duration-200"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-5 py-4 text-sm ${
                      cellIndex === 0 
                        ? 'font-medium text-foreground' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PremiumTable;
