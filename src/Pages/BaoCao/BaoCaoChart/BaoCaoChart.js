import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { localStorageService } from '../../../services/localStorageService';
import { baoCaoService } from '../../../services/baoCaoService';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BaoCaoChart() {
  let token = localStorageService.getItem("token");
  let ngay = useSelector((state) => state.BaoCaoSlice.ngay);
  let [baoCao,setBaoCao] = useState([]);
  let labels = [
    "Online",
    "Offline"
  ]
  let backgroundColor = [
    "#6be6e8",
    "#d9d9d9"
  ]
  const { mainHeight } = useSelector(state => state.PageSlice);
  const [baocaosophepHeight, setBaoCaoSoPhepHeight] = useState(0);

  useEffect(() => {
    baoCaoService.layBaoCaoPhongBan(token,ngay).then((res) => {
      setBaoCao(res.data.content);
    }).catch((err) => {
      console.log(err);
    })
  },[ngay])
  useEffect(() => {
    setBaoCaoSoPhepHeight(document.getElementById('BaoCaoSoPhep')?.offsetHeight);

    window.addEventListener('resize', () => {
      setBaoCaoSoPhepHeight(document.getElementById('BaoCaoSoPhep')?.offsetHeight);
    });

    return () => {
      window.removeEventListener('resize', () => {
        setBaoCaoSoPhepHeight(document.getElementById('BaoCaoSoPhep')?.offsetHeight);
      });
    }
  }, [baocaosophepHeight])

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
    return baoCao?.map((item,index) => {
      return (
        <div key={index} className='w-full p-4 rounded-lg shadow-lg bg-white'>
          <p
            className='text-xl font-bold text-orange-400'
          >
            {item?.danhmuc_name}
          </p>
          <Doughnut
            data={{
              labels,
              datasets: [
                {
                  data: item?.data,
                  backgroundColor: backgroundColor,
                },
              ],
            }}
            options={options}
            plugins={[{
              beforeDraw: function (chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
        
                ctx.restore();
        
                const fontSize = (height / 160).toFixed(2);
                ctx.font = `${fontSize}em sans-serif`;
                ctx.textBaseline = "top";
        
                let percent = (online,total) => {
                  return Math.round(online/total*100);
                }
                const text = `${percent(item.data[0],item.data[0] + item.data[1])}%`; // Văn bản bạn muốn hiển thị
                const textX = Math.round((width - ctx.measureText(text).width) / 3.3);
                const textY = height / 2.2;
        
                ctx.fillText(text, textX, textY);
                ctx.save();
              },
            },
          ]}
          />
          <p className='text-gray-400 text-center -mt-4'>
            {item.data[0]} / {item.data[0] + item.data[1]}
            <span className='ml-2'>nhân sự</span>
          </p>
        </div>
      )
    })
  }

  return (
    <div
      // className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto customScrollbar'
      className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'
      // style={{
      //   maxHeight: `calc(${mainHeight}px - 3rem - ${baocaosophepHeight}px - 2rem)`,
      // }}
    >
      {renderChart()}
    </div>
  )
}
