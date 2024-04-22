import { Tabs } from 'antd';
import React from 'react'
import BangLuongTable from './BangLuongTable/BangLuongTable';
import TinhLuong from './TinhLuong/TinhLuong';
import '../../issets/scss/tab-antd.scss'
import { FaCalendarDays, FaMoneyCheckDollar } from 'react-icons/fa6';

export default function BangLuong() {

  const item = [
    {
      key: 1,
      id: 1,
      label: 'Bảng lương',
      icon: <FaCalendarDays />,
      children: <BangLuongTable />,
    },
    {
      key: 2,
      id: 2,
      label: 'Tính lương',
      icon: <FaMoneyCheckDollar />,
      children: <TinhLuong />,
    }
  ]

  return (
    <Tabs
      className='ms-4 my-4 text-orange-400'
      defaultActiveKey="1"
      items={item}
      tabBarGutter={0}
      tabBarStyle={{
        marginBottom: 0,
      }}
      style={{
        width: 'calc(100% - 2rem)',
      }}
    />
  )
}
