import Footer from '@/components/footer'
import GradientBlinds from '@/components/ui/GradientBlinds'
import React from 'react'

function page() {
  return (
    <>
      <section className='w-full min-h-screen relative overflow-hidden text-white font-brcolage-grotesque flex items-center justify-center'>
        <div className='w-full h-full absolute inset-0'>
          <GradientBlinds
            gradientColors={['#E60000', '#622222']}
            angle={60}
            noise={0.3}
            blindCount={56}
            blindMinWidth={50}
            spotlightRadius={0.5}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.67}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
          />
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-6 text-center'>
          <div className='space-y-8'>
            <div className='space-y-4'>
              <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none'>
                <span className='block'>Unified Platform for</span>
                <span className='block bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent'>
                  Service Bussiness
                </span>
              </h1>

              <p className='text-xl  text-white/80 max-w-3xl mx-auto leading-relaxed'>
                The all-in-one suite for freelance developers and designers to win clients, manage projects, and get paid. No more scattered tools.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>

  )
}

export default page