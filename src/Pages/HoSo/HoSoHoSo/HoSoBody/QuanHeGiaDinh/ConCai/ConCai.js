import React from 'react'

function ConCai() {
  return (
    
    <div className='w-full grid gap-y-4'>
      <div className='w-full'>
        <p className='text-gray-400 font-bold flex items-center gap-2'>
          <i className='fa-solid fa-star text-xl'></i>
          <span>
            Quan hệ:
          </span>
          <span className='text-orange-400'>
            Con
          </span>
        </p>
        <ul className='ps-12 text-gray-400'>
          <li>
            <p>
              <span>Họ và tên: </span>
              <strong className='text-black'>
                Nguyễn Văn A
              </strong>
            </p>
          </li>
          <li>
            <p>
              <span>Ngày sinh: </span>
              <strong className='text-black'>
                01-05-2000
              </strong>
            </p>
          </li>
          <li>
            <p>
              <span>Liên hệ: </span>
              <strong className='text-black'>
                0930 123 456
              </strong>
            </p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ConCai