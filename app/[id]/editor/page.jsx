import { getDocumentByIdAction } from '@/app/_actions'
import MyPDFEditor from '@/app/components/documents/MyPDFEditor'



const editor = async ({params}) => {
    const document = await getDocumentByIdAction(params.id)
  return (
    <MyPDFEditor documentContent={document.document.content}/>
  )
}

export default editor