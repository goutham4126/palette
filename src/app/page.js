
export default function page() {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg_for_home.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >

      <header className="my-32 flex flex-col justify-center items-center text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4 relative z-10 animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to Pallette
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-semibold">
            Your ultimate platform for creating, customizing, and sharing dynamic website themes with ease.
          </p>

          <div className="mt-10">
            <a
              href="/projects"
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-xl hover:shadow-purple-500/20 transition-all transform hover:scale-105 inline-block"
            >
              Start Creating Templates
            </a>
            <a
              href="/market"
              className="px-10 py-4 ml-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-xl hover:shadow-purple-500/20 transition-all transform hover:scale-105 inline-block"
            >
               Buy or Sell Templates
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              color={feature.color}
              title={feature.title}
              description={feature.description}
              delay={index}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl border border-white/20 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your design workflow?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of designers and developers who are creating stunning templates with Pallete.
            </p>
            <a
              href="/projects"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/20 transition-all transform hover:scale-105 inline-block"
            >
              Create manual projects here
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 w-full text-center relative z-10 ">
        <div className="relative z-10">
          <p className="text-white/80">© 2023 Pallete. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-6">
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
const FeatureCard = ({ icon, color, title, description, delay }) => {
  return (
    <div
      className={`bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up-${delay}`}
    >
      <div className={`${color} mb-6 rounded-full w-16 h-16 flex items-center justify-center`}>{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}



// Feature cards data
const featureCards = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    color: "bg-gradient-to-r from-blue-400 to-blue-500",
    title: "Collaborative Project Creation",
    description: "Create and manage projects with your team in real-time using powerful collaboration tools.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    color: "bg-gradient-to-r from-green-400 to-green-500",
    title: "Manual Template Builder",
    description: "Build templates manually with full customization options for complete creative control.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    color: "bg-gradient-to-r from-orange-400 to-orange-500",
    title: "Component Library",
    description: "Access a highly customizable library of components to enhance your designs with ease.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: "bg-gradient-to-r from-pink-400 to-pink-500",
    title: "AI Template Generator",
    description: "Generate stunning templates with AI and customize them to perfectly match your brand needs.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    color: "bg-gradient-to-r from-teal-400 to-teal-500",
    title: "Subscription Model",
    description: "Choose a subscription plan that fits your needs with flexible pricing options for everyone.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    color: "bg-gradient-to-r from-indigo-400 to-indigo-500",
    title: "Marketplace",
    description: "Buy and sell templates in our vibrant marketplace to monetize your designs or find inspiration.",
  },
]