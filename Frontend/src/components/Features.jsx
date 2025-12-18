import { Brain, Workflow, BarChart3, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "User Can Read Public Stories",
    description:
      "Leverage advanced machine learning to understand user behavior, predict outcomes, and optimize journeys automatically.",
  },
  {
    icon: Workflow,
    title: "Journey Orchestration",
    description:
      "Design, manage, and automate complex customer journeys across channels from a single intuitive interface.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track performance with live dashboards and actionable metrics that update as users move through journeys.",
  },
  {
    icon: Sparkles,
    title: "Personalization Engine",
    description:
      "Deliver hyper-personalized experiences using AI-driven segmentation and dynamic content delivery.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    description:
      "Built with privacy-first architecture, compliance standards, and secure data handling at scale.",
  },
  {
    icon: Zap,
    title: "GROQ Api",
    description:
      "Integrate Journey AI quickly with your existing stack using APIs, SDKs, and popular third-party tools.",
  },
];

export default function Features() {
  return (
    <main className="bg-slate-900 text-gray-200" id="features">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-6"
        >
          Powerful Features for Smarter Journeys
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Journey AI equips your team with intelligent tools to design, analyze,
          and optimize customer journeys at every touchpoint.
        </p>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-slate-800 rounded-2xl p-6 shadow hover:shadow-lg transition"
            >
              <feature.icon className="text-sky-400 mb-4" size={28} />
              <h3 className="text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    
      
    </main>
  );
}
