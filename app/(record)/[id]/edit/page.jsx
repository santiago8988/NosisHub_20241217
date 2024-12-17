import { getRecordByIdAction } from "@/app/_actions";
import NewRecordForm from "@/app/components/records/NewRecordForm"
import { convertToPlainObject } from "@/lib/utils/utils";


const edit = async ({params}) => {
  const data = await getRecordByIdAction(params.id);
  return (
    <section className='py-2'>
        <div className='container'>
            <div className='container'>
              <h1 className='text-3xl font-bold'>Formulario de Creación</h1>
              <NewRecordForm initialRecord={data?.record}/>
            </div>
        </div>
    </section>
  )
}

export default edit