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
  let [currentIndex,setCurrentIndex] = useState({
    index: null,
    danhmuc_id: 0
  });
  let [onlList,setOnlList] = useState({});
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
    if(currentIndex.danhmuc_id == 0){
      return;
    }
    baoCaoService.layNhanVienOnline(token,{danhmuc_id: currentIndex.danhmuc_id,ngay}).then((res) => {
      setOnlList(res.data.content);
    }).catch((err) => {
      console.log(err);
    })
  },[ngay,currentIndex])
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

  let renderOnline = () => {
    return onlList?.online?.map((online,index) => {
      return <p key={index} className=''>- {online?.nv_name}</p>
    })
  }
  let renderOffline = () => {
    return onlList?.offline?.map((offline,index) => {
      return <p key={index} className=''>- {offline?.nv_name}</p>
    })
  }
  const renderChart = () => {
    return baoCao?.map((item,index) => {
      return (
        <div key={index}
          onMouseEnter={() => {setCurrentIndex({danhmuc_id: item?.danhmuc_id,index})}}
          onMouseLeave={() => {setCurrentIndex({danhmuc_id: 0,index: null})}}
          className='w-full p-4 rounded-lg shadow-lg bg-white relative overflow-hidden'>
          
          <div className={`p-2 delay-500 w-full transform ${currentIndex.index == index ?"translate-y-0":"translate-y-full"} h-full
           bg-white absolute left-0 top-0 z-50 rounded-lg transition-all duration-300`}>
            <div className='w-full h-full overflow-y-auto customScrollbar'>
              <h2 className='text-gray-500 font-medium'>Offline: </h2>
              {renderOffline()}
              <h2 className='text-blue-500 font-medium'>Online: </h2>
              {renderOnline()}
            </div>
          </div> 
          <p
            className='text-xl font-bold text-orange-400'
          >
            {item?.danhmuc_name}
          </p>
          <div className='relative'>
            {/* sửa lại tỉ lệ trên mobile để tránh bị lệch nhé */}
            <div  className='absolute md:top-[41%] md:left-[24%] top-[45%] left-[32%]'>
              <p className='text-2xl font-semibold'>
                {Math.round(item?.data[0]/(item?.data[0] + item?.data[1]) * 100)}%
              </p>
            </div>
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
            />
          </div>
          
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
