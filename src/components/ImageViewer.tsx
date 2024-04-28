import { useState } from 'react'

type Props = {
    images: string[];
}

function ImageViewer({ images }: Props) {
    const [currentImage, setCurrentImage] = useState<string>(images[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const selectImage = (index: number) => {
        setCurrentImage(images[index]);
        setCurrentImageIndex(index);
    }

    return (
        <div className='flex items-center justify-center flex-col space-y-2'>
            {/* Current Image */}
            <img src={currentImage} className="h-96 w-full object-cover" />
            {/* Other Images */}
            <div className="flex space-x-3">
                {images.map((image, index) => (
                    <div onClick={() => selectImage(index)} key={index} className={`h-20 w-20 hover:cursor-pointer items-center flex justify-center bg-gray-100 rounded-lg ${index === currentImageIndex && "border border-blue-500"}`}>
                        <img key={index} src={image} className="h-10 w-10 object-cover" onClick={() => setCurrentImage(image)} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImageViewer