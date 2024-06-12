import { useEffect } from 'react';
import audio from "../../issets/sound/low_spring_open.mp3"

const hoveringAudio = new Audio(audio);
export function playHoveringAudio(){
    clearTimeout();
    hoveringAudio.currentTime = 0;
    hoveringAudio.play();
}
export function stopHoveringAudio(){
    if(hoveringAudio.ended){
      hoveringAudio.pause();
      hoveringAudio.currentTime = 0;
    }else{
      setTimeout(()=>{
        stopHoveringAudio();
      },hoveringAudio.duration*1000 - hoveringAudio.currentTime*1000);
    }
  }
export function HoveringAudio(){
    hoveringAudio.load();
}
