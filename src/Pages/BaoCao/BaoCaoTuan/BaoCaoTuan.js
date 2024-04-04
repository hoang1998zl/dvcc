import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { localStorageService } from '../../../services/localStorageService';
import { baoCaoService } from '../../../services/baoCaoService';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
export default function BaoCaoTuan() {
    let token = localStorageService.getItem("token");
    let ngay = useSelector((state) => state.BaoCaoSlice.ngay);
    let [labels,setLabels] = useState([]);
    let [datasets,setDatasets] = useState([]);
    useEffect(() => {
        baoCaoService.layBaoCaoTuan(token,ngay).then((res) => {
            setLabels(res.data?.content?.labels);
            setDatasets(res.data?.content?.data);
        }).catch((err) => {
          console.log(err);
        })
    },[ngay])
    let options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: "Tuần Suất Làm Việc",
            color: "#ed8936",
            font:{
                size: 18
            }
          },
        },
    };
    let data = {
        labels,
        datasets
      };
  return (
    <div className='w-full p-4 rounded-lg shadow-lg bg-white'>
        <Bar style={{height:"300px"}} options={options} data={data}></Bar>
    </div>
  )
}
