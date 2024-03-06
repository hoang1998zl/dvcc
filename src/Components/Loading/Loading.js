import React from 'react'
import { PropagateLoader } from 'react-spinners'

export default function Loading() {
  return (
    <div className='w-screen h-screen absolute top-0 left-0 bg-slate-100 z-[100]'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <PropagateLoader
          color={"rgb(254 215 170)"}
          loading={true}
          size={40}
          speedMultiplier={1}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  )
}
