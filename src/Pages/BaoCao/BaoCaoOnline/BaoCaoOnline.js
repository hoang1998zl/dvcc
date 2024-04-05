import React, { useEffect, useState } from 'react'
import { localStorageService } from '../../../services/localStorageService';
import { useSelector } from 'react-redux';
import { baoCaoService } from '../../../services/baoCaoService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { map } from 'lodash';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BaoCaoOnline() {
    let token = localStorageService.getItem("token");
    let ngay = useSelector((state) => state.BaoCaoSlice.ngay);
    let [content,setContent] = useState([]);
    let [baoCao,setBaoCao] = useState([
        {
            data: [],
            backgroundColor:[]
        }
    ]);
    
    let [labels,setLabels] = useState([]);
    useEffect(() => {
        baoCaoService.layBaoCaoPhongBan(token,ngay).then((res) => {
          xulyData(res.data.content);
          setContent(res.data.content);
        }).catch((err) => {
          console.log(err);
        })
    },[ngay])
    // tạo mảng màu ngẫu nhiên
    let randomColors = (length) => {
        const getRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
        return randomColors = Array.from({ length }, getRandomColor);
    }
    let xulyData = (content) => {
        let label_array = [];
        let datasets = [{
            data: [],
            backgroundColor:[]
        }];
        let data = [];
        content?.map((item,index) => {
            label_array.push(item.danhmuc_name);
            data.push(item.data[0]);
        })
        datasets[0].data = data;
        let backgroundColor = randomColors(content.length);
        datasets[0].backgroundColor = backgroundColor
        setBaoCao(datasets);
        setLabels(label_array);
    }
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              font: {
                size: 14,
              },
            }
          },
        },
    };
    let renderePercent = () => {
      let online = 0;
      let total = 0;
      content.map((item) => {
        online+= item.data[0];
        total+= (item.data[0] + item.data[1]);
      })
      return online + "/" + total;
    }
    let renderContent = () => {
      if(content.length > 0) {
        return <div className=''>
            <Doughnut options={options} 
            data={{
              labels,
              datasets: baoCao
            }}
          />
          <p className='font-semibold text-3xl text-center'>
                  {
                    (renderePercent())
                  }
              </p>
        </div>
      }
    }
 return (
    <div className='w-full p-4 pr-0'>
        <div className='rounded-lg shadow-lg bg-white p-4'> 
            <p
                className='text-xl font-bold text-orange-400'
            >
                Online
            </p>
            {renderContent()}
        </div>
        
    </div>
  )
}
