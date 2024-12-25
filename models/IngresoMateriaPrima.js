import mongoose from 'mongoose';

const ingresoMateriaPrimaSchema = new mongoose.Schema({
  materiaPrima: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MateriaPrima',
    required: true
  },
  lote: {
    type: String,
    required: true
  },
    cantidad: {
    type: Number,
    required: true
  },
  unidad: {
    type: String,
    required: true
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }
}, {
  timestamps: true
});

export default mongoose.models.IngresoMateriaPrima || mongoose.model('IngresoMateriaPrima', ingresoMateriaPrimaSchema);

