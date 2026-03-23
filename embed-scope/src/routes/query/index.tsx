import ImagePicker from '@/components/ImagePicker';
import { createFileRoute } from '@tanstack/react-router'
import { rpc } from 'pyloid-js';
import { useState } from 'react';


export const Route = createFileRoute('/query/')({
  component: Query,
})

function Query() {
  const [imagePath, setImagePath] = useState<string|null>(null);
const [imageBase64, setImageBase64] = useState<string|null>(null);

  const handleChange=async (path: string|null) => {
    setImagePath(path);

    try{
      if(path) {
        const base64 =await rpc.call<{path:string|null},string>('read_image',{path});

        console.log({base64});
        
        setImageBase64(base64);
      }
    } catch (error) {
      console.error('Error reading image:', error);
      console.dir(error);
    }
  };

  return <div>
    <ImagePicker value={imagePath}onChange={handleChange} />
    <div className=' aspect-square   bg-accent '>
      {imageBase64? <img src={imageBase64} className='' /> : 'No image selected'}
    </div>
  </div>
}
