import React from 'react'
import Herosection from '../component/Herosection'
import SpecialtiesSection from '../component/SpecialtiesSection'
import Structure from '../component/Structure'
import Commint from '../component/commint'
import BestClinics from '../component/BestClinics'
import MostBookedDoctors from '../component/MostBookedDoctors'
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
