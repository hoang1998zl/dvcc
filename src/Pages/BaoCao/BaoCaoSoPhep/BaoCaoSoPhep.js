import React from 'react';
import baocaosophepjson from '../../../issets/json/BaoCaoSoPhep.json';

import { FaPersonRunning, FaPersonSwimming, FaPersonWalkingLuggage, FaPlane } from "react-icons/fa6";
import { LuClock3 } from "react-icons/lu";


export default function BaoCaoSoPhep() {

  const renderBaoCao = () => {
    return baocaosophepjson?.map((item, index) => {
      return (
        <div
          key={index}
          className='p-4 rounded-lg shadow-lg bg-white flex gap-4'
        >
          {
            item.bc_id == 1 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-sky-100 text-sky-500 text-2xl`}
              >
                <FaPersonRunning />
              </div>
            )
          }
          {
            item.bc_id == 2 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-purple-100 text-purple-500 text-2xl`}
              >
                <FaPersonWalkingLuggage />
              </div>
            )
          }
          {
            item.bc_id == 3 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-red-100 text-red-500 text-2xl`}
              >
                <FaPersonSwimming />
              </div>
            )
          }
          {
            item.bc_id == 4 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-green-100 text-green-500 text-2xl`}
              >
                <FaPlane className='-rotate-45' />
              </div>
            )
          }
          {
            item.bc_id == 5 && (
              <div
                className={`h-full aspect-square rounded-full flex justify-center items-center bg-orange-100 text-orange-500 text-2xl relative`}
              >
                <LuClock3 />
              </div>
            )
          }

          <div
            className={`w-full flex-1 text-center`}
          >
            <p className='text-lg font-bold'>
              {item.bc_total}
            </p>
            <p className={`${item.bc_color} text-sm font-semibold`}>
              {item.bc_name}
            </p>
          </div>
        </div>
      )
    })
  };

  return (
    <div
    id='BaoCaoSoPhep'
      className='w-full lg:grid lg:grid-cols-5 gap-4'
    >
      {renderBaoCao()}
    </div>
  )
}
