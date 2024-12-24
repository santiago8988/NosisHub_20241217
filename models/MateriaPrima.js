import mongoose from 'mongoose';

const materiaPrimaSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  sinonimos: [String],
  codigoInterno: String,
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }
}, {
  timestamps: true
});

export default mongoose.models.MateriaPrima || mongoose.model('MateriaPrima', materiaPrimaSchema);

