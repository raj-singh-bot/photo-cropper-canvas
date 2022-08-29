import React, { useEffect, useRef, useState } from 'react';
import { Cropper } from 'react-cropper';
import "cropperjs/dist/cropper.css";
//import CanvasDraw from 'react-canvas-draw';
import { Stage, Layer, Image, Text} from 'react-konva';
import imageBg from './bg.png'


function Demo() {
  const [file, setFile] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [croppedFile, setCroppedFile] = useState();
  const [images, setImages] = useState(new window.Image());
  const [userimg, setUserimg] = useState(new window.Image());
  const [text, setText] = useState(null);

  useEffect(() => {
    const bg = new window.Image();
    bg.src =imageBg
    bg.onload = () => {
      setImages(bg);
    } 

    const userbg = new window.Image();
    userbg.src =croppedFile
    userbg.onload = () => {

      setUserimg(userbg);
    }
    
  },[croppedFile])
  


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
    if (typeof cropper !== 'undefined') {
      setCroppedFile(cropper.getCroppedCanvas().toDataURL());
    }
    
  };
  const handleTextChange = (e) => {
    setText(e.target.value);
  }
const download = (uri, name) => {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

  const stageRef = useRef();

  const handleExport = (e) => {
    const uri = stageRef.current.toDataURL();
    download(uri);
  }
  return (
    <>
      <input type="text" onChange={handleTextChange}/>
      <input type="file" accept='image/*' onChange={handleFileChange} />
      <Cropper
        src={file}
        aspectRatio={1}
        style={{ height: 400, width: "100%" }}
        onInitialized={(instance) => {
          setCropper(instance);
        } } />
      <button onClick={cropImage}>Crop Image</button>
      
        <Stage width={1080} height={1080}>
          <Layer ref={stageRef}>
            <Image image={userimg} x={140}  y={220} width={450} height={460} />
            <Image image={images} />
            <Text text={text} fontSize={46} x={70} y={730} width={600} align="center" />
          </Layer>
        </Stage>

        <button onClick={handleExport}>Download as image</button>
    </>
  );
}

export default Demo;
