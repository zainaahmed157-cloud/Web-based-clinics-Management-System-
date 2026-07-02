import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          <div className="flex justify-center">
            <img
              src="https://medaura-pi.vercel.app/_next/image?url=%2Fimages%2Faboutus.png&w=3840&q=75"
              alt="About Medaura"
              className="w-full max-w-md rounded-3xl"
            />
          </div>

          <div>
            <p className="text-[#0B4DBB] font-semibold text-sm mb-2">
              Medaura
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              About Us
            </h1>

            <p className="text-gray-700 leading-8 mb-6">
              At Medaura, we believe that access to healthcare should be simple
              and fast. We connect patients with the best doctors and clinics,
              helping them choose the right specialty and book appointments with
              confidence, without complexity or waiting.
            </p>

            <p className="text-gray-700 leading-8 mb-8">
              Our goal is to make the search and booking experience more clear,
              from comparing reviews and consultation fees to confirming
              appointments, while maintaining service quality and patient
              comfort at every step.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="border border-blue-200 rounded-lg px-5 py-2 text-[#0B4DBB] font-medium">
                Trusted Care
              </div>

              <div className="border border-blue-200 rounded-lg px-5 py-2 text-[#0B4DBB] font-medium">
                Faster Booking
              </div>

              <div className="border border-blue-200 rounded-lg px-5 py-2 text-[#0B4DBB] font-medium">
                Certified Doctors
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;