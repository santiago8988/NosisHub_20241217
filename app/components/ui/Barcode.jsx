import React, { useEffect } from 'react';
import { View, Image } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode';

const Barcode = ({ value, type, width, height }) => {
  const [barcodeImage, setBarcodeImage] = React.useState('');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, value, {
      format: type,
      width: 2,
      height: height * 0.5,
      displayValue: false
    });
    const dataUrl = canvas.toDataURL('image/png');
    setBarcodeImage(dataUrl);
  }, [value, type, height]);

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      {barcodeImage && <Image src={barcodeImage} style={{ width: width * 0.9, height: height * 0.5 }} />}
    </View>
  );
};

export default Barcode;

