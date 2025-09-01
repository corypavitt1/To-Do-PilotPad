import React from 'react'
import { Plane, CheckCircle, Clock, Shield, Star } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div 
        className="relative min-h-screen flex items-center bg-cover bg-top"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/25831581.jpg')`
        }}
      >
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
        
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plane className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white">PilotPad</span>
              </div>
              <button
  onClick={onGetStarted}
 className="bg-pilotRedDark text-white px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 rounded-full hover:bg-pilotRed transition-all duration-300 text-sm sm:text-base min-h-[44px] min-w-[44px]"

>
  <span className="hidden xs:inline">Get Started</span>
  <span className="xs:hidden">Start</span>
</button>

            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 flex items-center min-h-screen">
          <div className="text-left text-white max-w-2xl w-full">
          <h1
  className="inline-flex items-center whitespace-nowrap text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-5 lg:mb-6 leading-tight"
  style={{ fontFamily: 'Poppins, sans-serif' }}
>
  <span className="mr-2">PilotPad</span>
  <img 
    src="/PILOTPAD.png" 
    alt="PilotPad Logo" 
    className="h-8 xs:h-10 sm:h-12 md:h-14 lg:h-20" 
  />
</h1>

          <p className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-5 lg:mb-6 font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Stay on course, one task at a time.
          </p>
          <p className="text-sm xs:text-base sm:text-lg md:text-lg lg:text-xl mb-6 xs:mb-8 lg:mb-12 text-gray-100 leading-relaxed px-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            PilotPad is built for pilots who need clarity both in the cockpit and on the ground. From FAA-required checklists to personal pilot tasks, everything you need stays organized and accessible in one streamlined app. Keep your workflow sharp, reduce errors, and stay flight-ready—every time.
          </p>
         <button
  onClick={onGetStarted}
  className="bg-pilotRedDark text-white px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 rounded-full text-base sm:text-lg lg:text-xl font-semibold hover:bg-pilotRed transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 min-h-[44px] min-w-[44px] w-full sm:w-auto"

  style={{ fontFamily: 'Poppins, sans-serif' }}
>
Start Your To-Do List
         </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 lg:py-20 bg-pilotredDark">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 lg:mb-16">
            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Built for Aviation Professionals
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto px-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Everything you need to stay organized and compliant
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Task Management</h3>
              <p className="text-gray-200 text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Create, prioritize, and track all your aviation-related tasks in one place.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Smart Scheduling</h3>
              <p className="text-gray-200 text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Set due dates and get organized with maintenance and training deadlines.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700 sm:col-span-2 lg:col-span-1">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Secure & Private</h3>
              <p className="text-gray-200 text-sm sm:text-base" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Your data is protected with enterprise-grade security and privacy controls.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-8 sm:py-12 lg:py-20 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8 lg:mb-16">
            <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Trusted by Pilots Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-pilotRedDark fill-pilotRedDark" 
    fill="currentColor"  />
                ))}
              </div>
              <p className="text-gray-200 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                "PilotPad keeps me on top of my medical renewals and aircraft maintenance. 
                Simple, clean, and exactly what I needed."
              </p>
              <div className="text-white font-semibold text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>Captain Sarah Johnson</div>
              <div className="text-gray-400 text-xs sm:text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>Commercial Pilot, Delta Airlines</div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-pilotRedDark fill-pilotRedDark" 
    fill="currentColor"  />
                ))}
              </div>
              <p className="text-gray-200 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                "Finally, a task manager that understands aviation. Love the priority system 
                and clean interface."
              </p>
              <div className="text-white font-semibold text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>Mike Rodriguez</div>
              <div className="text-gray-400 text-xs sm:text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>Flight Instructor, CFI/CFII</div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-700 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-pilotRedDark fill-pilotRedDark" 
    fill="currentColor"  />
                ))}
              </div>
              <p className="text-gray-200 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                "Great for tracking recurrent training and keeping organized. 
                The scheduling feature is a game-changer."
              </p>
              <div className="text-white font-semibold text-sm sm:text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>Lisa Chen</div>
              <div className="text-gray-400 text-xs sm:text-sm" style={{ fontFamily: 'Roboto, sans-serif' }}>Corporate Pilot</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-gray-700 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center space-x-2">
            <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <span className="text-white font-semibold text-sm sm:text-base">PilotPad</span>
            <span className="text-gray-400 text-xs sm:text-sm">© 2025 All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  )
}