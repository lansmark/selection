import { useState, useEffect } from "react";

export default function useImageOrientation(imageUrl) {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setIsPortrait(img.height > img.width);
    };
  }, [imageUrl]);

  return isPortrait;
}
