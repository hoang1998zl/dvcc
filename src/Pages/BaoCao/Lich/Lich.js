import React from 'react'
import { useDispatch } from 'react-redux';
import { Calendar } from 'antd';
import { setNgay } from '../../../Redux-toolkit/reducer/baoCaoSlice';

export default function Lich() {
    let dispatch = useDispatch();
    let onPanelChange = (value,mode) => {
        dispatch(setNgay(value.format('YYYY-MM-DD')));
    }
  return (
    // xem file NS.css
    <div id='lich' className='w-full pl-4'>
        <div className='rounded-lg shadow-lg bg-white p-4'>
            <div>
                <Calendar fullscreen={false} onChange={onPanelChange} />
            </div>
        </div> 
    </div>
  )
}
