import React from 'react';
import '../issets/scss/scrollbar.scss';
import '../issets/scss/table.scss';


export default function HOC({ Component }) {


  return (
    <div className='h-screen flex flex-col relative select-none'>
      <Component></Component>
    </div>
  )
}