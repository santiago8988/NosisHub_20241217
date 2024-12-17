
import { getEntriesByRecordIdAction, getRecordByIdAction } from "@/app/_actions";
import ButtonAddEntrie from "@/app/components/entries/ButtonAddEntrie";
import EntriesTable from "@/app/components/entries/EntriesTable";
import { convertToPlainObject } from "@/lib/utils/utils";

const entries = async ({params}) => {
  const data = await getRecordByIdAction(params.id);
  const entries=await getEntriesByRecordIdAction(params.id);

  return (
    <section className="flex-1 overflow-y-auto bg-white p-5">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">Lista</h1>
          <div className="flex items-center">
              {data?.record?.isActive && <ButtonAddEntrie record={convertToPlainObject(data?.record)}/>}
          </div>
      </div>
      <EntriesTable record={convertToPlainObject(data?.record)} entries={convertToPlainObject(entries)}/>
    </section>
  )
}

export default entries