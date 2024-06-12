import audio from "../../issets/sound/low_spring_open.mp3"

const hoveringAudio = new Audio(audio);
let stopTimeOut = setTimeout(()=>{});

export function stopHoveringAudio(){
  if(hoveringAudio.ended){
    hoveringAudio.pause();
    hoveringAudio.currentTime = 0;
  }else{
    stopTimeOut = setTimeout(()=>{
      stopHoveringAudio();
    },hoveringAudio.duration*1000 - hoveringAudio.currentTime*1000);
  }
}
export function playHoveringAudio(){
  if(!navigator.userActivation.hasBeenActive){
    return;
  }
  clearTimeout(stopTimeOut);
  hoveringAudio.currentTime = 0;
  hoveringAudio.play();
}
export function HoveringAudio(){
  hoveringAudio.load();
}
