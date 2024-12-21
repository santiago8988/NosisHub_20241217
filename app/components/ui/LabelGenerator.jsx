import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import Barcode from './Barcode';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 20,
    marginTop: 0,
  },
});

const Label = ({ width, height, barcodeValue, barcodeType }) => (
  <View style={[styles.label, { width, height }]}>
    <Barcode value={barcodeValue} type={barcodeType} width={width} height={height * 0.8} />
    <Text style={styles.text}>{barcodeValue}</Text>
  </View>
);

const LabelGenerator = ({ width, height, labels }) => (
  <PDFViewer width="100%" height={600}>
    <Document>
      <Page size={[width, height]} style={styles.page}>
        {labels.map((label, index) => (
          <Label 
            key={index} 
            width={width} 
            height={height} 
            barcodeValue={label.barcodeValue}
            barcodeType={label.barcodeType}
          />
        ))}
      </Page>
    </Document>
  </PDFViewer>
);

export default LabelGenerator;

