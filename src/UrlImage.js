import React, { useEffect, useState } from "react";
import { Image } from "react-konva";
const UrlImage = ({value , src}) => {
  const [image, setImage] = useState(null);

  // useEffect(() => {
    const imageComp = () => {
      return new Promise((resolve, reject) =>{
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      resolve(img);
      setImage(img);
    }
    
    });
    };
    imageComp();
  
    //console.log(value);
  // }, [src]);
  return (
    <Image
      image={image}
      x={value.left}
      y={value.top}
      width={value.width}
      height={value.height}
      //key={key}
    />
  );
};

export default UrlImage;
