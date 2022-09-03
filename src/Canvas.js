import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Stage, Layer, Image, Text } from "react-konva";
// import imageBg from "./bg.png";
// import {data} from './data'
import { frameData } from "./frameData";
import { doctorData } from "./doctorData";
import UrlImage from "./UrlImage";
import axios from "axios";
import {io} from "socket.io-client";

const socket = io('http://localhost:8080');
function Demo() {
  const [file, setFile] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [croppedFile, setCroppedFile] = useState();
  const [current, setCurrent] = useState(null);
  const [frame1List, setFrame1List] = useState([]);

  const [images, setImages] = useState(new window.Image());`ˀ`
  const [userimg, setUserimg] = useState(new window.Image());
  const [text, setText] = useState(null);
  // const [frameData, setFrameData] = useState(null);


  const stageRef = useRef();

  useEffect(() => {
    const bg = new window.Image();
    bg.src = frameData.frameImage;
    bg.crossOrigin = 'Anonymous';
    bg.onload = () => {
      setImages(bg);
    };

    const userbg = new window.Image();
    userbg.src = croppedFile;
    userbg.onload = () => {
      setUserimg(userbg);
    };
  }, [croppedFile]);


  const createImage = (image) => {
    return new Promise((resolve, reject) => {
      const custom = new window.Image();
      custom.src = image;
      custom.crossOrigin = 'Anonymous';
      custom.onload = () => {
        //console.log(custom);
        resolve(custom);
      };
      // return custom;
    });
  };

  const handleFileChange = (e) => {
    let files;
    files = e.target.files;
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const cropImage = () => {
    if (typeof cropper !== "undefined") {
      setCroppedFile(cropper.getCroppedCanvas().toDataURL());
    }
  };
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  const download = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
   
  const createAll = useCallback(() => {
    let total = doctorData.length;
    let index = 0;
    downloadOne() 
    function  downloadOne() {
      if (index < total) {
      //const image = await createImage(doctorData[index].userImageUrl)
      //console.log(image);
      
      setCurrent(doctorData[index]);
      setTimeout(() => {
        handleExport(`${doctorData[index]._id}`)
        index++
        downloadOne()
      }, 500);
    }else{
//call api  
      // const socket = io();
      socket.on('connect',function() {
        console.log('Client has connected to the server!');
      });
    }
  }
},[])
    

  const handleExport = (name) => {
    const uri = stageRef.current.toDataURL();
    //console.log(uri);
    fetch(uri)
    .then(res => res.blob())
    .then(blob => {
      const file = new File([blob], name,{ type: "image/png" });
      let a = frame1List;
      a.push(file);
      setFrame1List(a);
      // frame1List.push(file);
    })
    //download(uri,`${name}.png`);
    console.log(frame1List)
  };
  
  // const  finalUrl = async (file) => {
  //  const formdata = new FormData();
  // formdata.append('frame1', JSON.stringify(frame1List)); 
  // let payload = {
  //   formdata: formdata
  // };
  // axios({
  //   url: "https://dummy.restapiexample.com/api/v1/create",
  //   method: "POST",
  //   data: payload
  // })
  // .then(res => {console.log(res)})
  // .catch(err => {console.log(err)})
  // try{
  //   const response =  axios({
  //     method: 'POST',
  //     url: "https://dummy.restapiexample.com/api/v1/create",
  //     data: formdata,
  //     headers: { "Content-Type": "multipart/form-data" ,"Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  //     'Access-Control-Allow-Headers': '*'},
  //   })
  //   console.log(formdata);
  //   console.log(response)
  // }
  // catch(e){
  //   console.log(e);
  // }
  // }
useEffect(() => {
  console.log(frame1List)


}, [frame1List])

  return (
    <>
      <input type="text" onChange={handleTextChange} />
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <Cropper
        src={file}
        aspectRatio={1}
        style={{ height: 400, width: "100%" }}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
      />
      <button onClick={cropImage}>Crop Image</button>
      { frameData&& current &&
        <Stage width={frameData.width} height={frameData.height} >
          <Layer ref={stageRef} >
            {frameData.imageField.map((value, i) => {
               return (
                 <UrlImage 
                 value={value} src={current[value.field] || value.default} key={i}
                 />
                 );
            })}
            <Image image={images} />
            {frameData.textField.map((value, i) => {
              return (
                <Text
                text={current[value.field] || value.default}
                fontSize={value.fontSize}
                x={value.left}
                y={value.top}
                width={value.width} 
                align={value.align}
                key={i}
                />                
                );
              })}
            </Layer>
        </Stage>
      }
      <button onClick={handleExport}>Download as image</button>
      <button onClick={createAll}>create for all</button>
    </>
  );
}

export default Demo;
