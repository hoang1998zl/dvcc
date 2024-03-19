import React, { useEffect } from 'react';
import '../issets/scss/scrollbar.scss';
import '../issets/scss/table.scss';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { localStorageService } from '../services/localStorageService';
import { setCongTy } from '../Redux-toolkit/reducer/UserSlice';
import { setLoading } from '../Redux-toolkit/reducer/PageSlice';
import { chamCongService } from '../services/chamCongService';


export default function HOC({ Component }) {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  let token = searchParams.get("key");
  if(token){
    localStorageService.setItem(token,"token");
  }else{
    token = localStorageService.getItem("token");
  }
  useEffect(() => {
    chamCongService.layCongTy(token).then((res) => {
            dispatch(setLoading(false));
            dispatch(setCongTy(res.data.content));
            navigate("/");
          })
          .catch((err) => {
            if(window.confirm("phiên đăng hập đã hết hạn!")){
              window.location.href = "https://weos.vn";
            }else{
              window.location.href = "https://weos.vn";
            }
          });
  },[])

  return (
    <div className='h-screen flex flex-col relative select-none'>
      <Component></Component>
    </div>
  )
}