import React from 'react'
import Herosection from '../components/Herosection'
import SpecialtiesSection from '../components/SpecialtiesSection'
import Structure from '../components/Structure'
import Commint from '../components/commint'
import BestClinics from '../components/BestClinics'
import MostBookedDoctors from '../components/MostBookedDoctors'
export default function Home() {
  return (
    <div>
      
      <Herosection/>
      <SpecialtiesSection/>
      <Structure/>
      <MostBookedDoctors/>
      <BestClinics/>
      <Commint/>
    </div>
  )
}
