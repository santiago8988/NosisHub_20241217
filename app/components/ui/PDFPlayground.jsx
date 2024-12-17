"use client"

import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  viewer: {
    width: '100%',
    height: '100vh',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  paragraphTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 12,
    textAlign: 'justify',
    marginBottom: 10,
  },
  image: {
    maxWidth: '80%',
    maxHeight: 200,
    marginHorizontal: 'auto',
    marginVertical: 10,
  },
});

const PDFPlayground = ({ data }) => {
  const { title, paragraphs } = data;

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>{title}</Text>
          {paragraphs.map((paragraph, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.paragraphTitle}>{paragraph.title}</Text>
              {paragraph.image && (
                <Image 
                  src={paragraph.image} 
                  style={styles.image} 
                  alt={`Image for ${paragraph.title}`}
                />
              )}
              <Text style={styles.content}>{paragraph.body}</Text>
            </View>
          ))}
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFPlayground;