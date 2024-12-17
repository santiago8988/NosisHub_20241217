import mongoose, { model, models, Schema } from "mongoose";

delete mongoose.connection.models['History'];

const HistorySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AllowedUser'
  },
  action: {
    type: String,
    required: true,
    enum: ['creado', 'editado', 'enviado', 'aprobado', 'rechazado','archivado' ,'otro'],
    minlength: 1,
    maxlength: 50 // Ejemplo de validación
  },
  comment: {
    type: String,
    maxlength: 500 // Ejemplo de validación
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userImage: {
    type: String,
    default: null
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  }
});

HistorySchema.index({ document: 1 });

const History = models.History || model('History', HistorySchema); // Usar 'History' en lugar de 'HistorySchema'

export default History;
