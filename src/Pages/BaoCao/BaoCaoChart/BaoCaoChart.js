import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import jsonChart from '../../../issets/json/BaoCaoChart.json'
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BaoCaoChart() {

  const { mainHeight } = useSelector(state => state.PageSlice);

  const [baocaosophepHeight, setBaoCaoSoPhepHeight] = useState(0);

  useEffect(() => {
    setBaoCaoSoPhepHeight(document.getElementById('BaoCaoSoPhep').offsetHeight);

    window.addEventListener('resize', () => {
      setBaoCaoSoPhepHeight(document.getElementById('BaoCaoSoPhep').offsetHeight);
    });

    return () => {
      window.removeEventListener('resize', () => {
        setBaoCaoSoPhepHeight(document.getElementById('BaoCaoSoPhep').offsetHeight);
      });
    }
  }, [baocaosophepHeight])

  const data = {
    labels: jsonChart.labels,
    datasets: [
      {
        data: jsonChart.data,
        backgroundColor: jsonChart.backgroundColor,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          font: {
            size: 14,
          },
        }
      },
    },
  };

  const renderChart = () => {
    return (
      <div className='w-full p-4 rounded-lg shadow-lg bg-white'>
        <p
          className='text-xl font-bold text-orange-400'
        >
          Tên phòng ban
        </p>
        <Doughnut
          data={data}
          options={options}
        />
        <p className='text-gray-400 text-center -mt-4'>
          {jsonChart.data[0]} / {jsonChart.data[0] + jsonChart.data[1]}
          <span className='ml-2'>nhân sự</span>
        </p>
      </div>
    )
  }

  return (
    <div
      className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto customScrollbar'
      style={{
        maxHeight: `calc(${mainHeight}px - 3rem - ${baocaosophepHeight}px - 2rem)`,
      }}
    >
      {renderChart()}
    </div>
  )
}
