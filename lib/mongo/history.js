import connectToDB from '@/config/connectToDB';
import { NextResponse } from 'next/server';
import History from '@/models/history';
import mongoose from 'mongoose';

export async function createHistory(userid, newaction, newcomment, documentid) {
  try {
    await connectToDB();
    const history = new History({
      user: userid,
      action: newaction,
      comment: newcomment,
      document: documentid, 
    });

    const savedHistory = await history.save();
    return NextResponse.json({ msg: 'Historia creada', history: savedHistory, status: 200 });
  } catch (error) {
    console.error('Error al crear la historia:', error);
    return NextResponse.json({ msg: error.message, status: 500 });
  }
}

export async function getHistoryByDocumentId(documentid){
    try {
        await connectToDB()
        const documentHistory = await History.find({ document: documentid })
                                             .populate('user')
                                             .populate('document')
                                             .sort({ timestamp: -1 }); // Ordenar por fecha descendente (más reciente primero)
        if(!documentHistory){
            return NextResponse.json({ msg: 'Historia no encontrada', status: 404});
        }
        return NextResponse.json({ msg: 'Historia encontrada',data:documentHistory, status: 200 });
    } catch (error) {
        console.error('Error al crear la historia:', error);
        return NextResponse.json({ msg: error.message, status: 500 });
      }
}
