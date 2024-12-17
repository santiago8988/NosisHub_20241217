'use client'
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import InputForm from "@/app/components/entries/InputForm"

export default function ViewOnlyEntrie({ entrie }) {
  return (
    <Card className="mt-8 mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Ver medición</CardTitle>
      </CardHeader>
      <CardContent>
        {entrie.record && Object.entries(entrie.record.own).map(([campo, props]) => (
          <InputForm
            key={campo}
            campo={props}
            label={campo}
            type={props.tipo}
            action='view'
            values={entrie.values[campo]}
            identifier={[]}
            formValues={entrie.values}
            onInputChange={() => {}}
          />
        ))}
        {entrie.comment && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Comentario:</h4>
            <textarea
              readOnly
              value={entrie.comment}
              className="w-full p-2 border rounded-md bg-gray-50"
              rows="4"
            />
          </div>
        )}
        <div className="mt-6">
          <Link
            href={`/record/${entrie.record._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Volver al registro
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}