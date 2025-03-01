"use client"

import { useEffect, useRef } from "react"

// Accept user as a prop from the server component
export default function HomeClient({ user }) {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg_for_home.jpg')", // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Animated Background Elements */}
      <BackgroundElements />

      {/* Header - Full Screen Height */}
      <header className="h-screen flex flex-col justify-center items-center text-center relative z-10">
        <div className="max-w-4xl mx-auto px-4 relative z-10 animate-fade-in">
          {/* Directly display the title and description without the card */}
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to{" "}
            <span className="text-purple-400 relative">
              Pallete
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-purple-400/70 rounded-full"></span>
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your ultimate platform for creating, customizing, and sharing dynamic website themes with ease.
          </p>

          {/* Start Creating Templates Button */}
          <div className="mt-10">
            <a
              href="/projects"
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-xl hover:shadow-purple-500/20 transition-all transform hover:scale-105 inline-block"
            >
              Start Creating Templates
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-24 relative z-10">
        <h2 className="text-4xl font-bold text-center text-white mb-16 animate-fade-in-up">
          Why Choose <span className="text-purple-400">Pallete</span>?
        </h2>

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
              href="/signup"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/20 transition-all transform hover:scale-105 inline-block"
            >
              Get Started for Free
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

// Background Elements Component
const BackgroundElements = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationFrameId

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
        this.color = this.getRandomColor()
      }

      getRandomColor() {
        const colors = [
          "rgba(191, 219, 254, 0.3)", // blue-200
          "rgba(216, 180, 254, 0.3)", // purple-200
          "rgba(251, 207, 232, 0.3)", // pink-200
          "rgba(254, 215, 170, 0.3)", // orange-200
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.01

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particle array
    const particleArray = []
    const numberOfParticles = 100

    for (let i = 0; i < numberOfParticles; i++) {
      particleArray.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update()
        particleArray[i].draw()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Gradient Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-300/30 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-300/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-300/30 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-yellow-300/20 rounded-full filter blur-3xl animate-blob animation-delay-6000"></div>
      </div>
    </>
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