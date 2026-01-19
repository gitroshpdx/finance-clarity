import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.toLowerCase().trim() });

    setIsLoading(false);

    if (error) {
      if (error.code === '23505') {
        toast({
          title: 'Already Subscribed',
          description: 'This email is already on our list!',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Could not subscribe. Please try again.',
          variant: 'destructive',
        });
      }
      return;
    }

    setIsSubmitted(true);
    toast({
      title: 'Welcome!',
      description: 'You\'ve been successfully subscribed.',
    });
  };

  return (
    <section id="newsletter" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-gradient-primary flex items-center justify-center"
          >
            <Mail className="w-8 h-8 text-primary-foreground" />
          </motion.div>

          <h2 className="text-display font-sans mb-4">
            Daily Clarity, Delivered
          </h2>
          
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Join 50,000+ decision-makers receiving our morning intelligence brief. 
            No noise—just signal.
          </p>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <div className="flex-1 relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-card border-border/50 focus:border-primary pl-4 pr-4 rounded-xl"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 bg-gradient-primary text-primary-foreground hover:opacity-90 px-6 rounded-xl font-medium group"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-lg font-medium text-foreground">
                  Welcome to Macro Finance Report
                </p>
                <p className="text-muted-foreground">
                  Check your inbox for your first briefing.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-muted-foreground/60"
          >
            <span>✓ Free forever</span>
            <span>✓ Unsubscribe anytime</span>
            <span>✓ No spam, ever</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
