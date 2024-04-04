import React, { useEffect, useState } from 'react'
import { localStorageService } from '../../../services/localStorageService';
import { useSelector } from 'react-redux';
import { baoCaoService } from '../../../services/baoCaoService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BaoCaoOnline() {
    let token = localStorageService.getItem("token");
    let ngay = useSelector((state) => state.BaoCaoSlice.ngay);
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
        let datasets = [];
        let data = [];
        content?.map((item,index) => {
            label_array.push(item.danhmuc_name);
            data.push(item.data[0]);
        })
        datasets.push({data});
        // let backgroundColor = randomColors(content.length);
        let backgroundColor = ["#6be6e8","#d9d9d9"]
        datasets.push({backgroundColor})
        
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
 return (
    <div className='w-full p-4 pr-0'>
        <div className='rounded-lg shadow-lg bg-white p-4'> 
            <p
                className='text-xl font-bold text-orange-400'
            >
                Online
            </p>
            <Doughnut options={options} data={{
                labels,
                datasets: baoCao
            }}/>
        </div>
        
    </div>
  )
}
