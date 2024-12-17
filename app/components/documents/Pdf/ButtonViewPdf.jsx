'use client'
import { useRouter } from 'next/navigation'
import {Button} from '@/components/ui/button'

const ButtonViewPdf = ({documentid}) => {
  
    const router = useRouter();
  
    const handleViewPDF = () => {
   
    
        // Redirigimos al playground de react-pdf con los datos
        router.push(`/pdf-playground?data=${documentid}`);
    };
  return (
    <Button onClick={handleViewPDF} variant="secondary">
                            Ver PDF
    </Button>
  )
}

export default ButtonViewPdf
