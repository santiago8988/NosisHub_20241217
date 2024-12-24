'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from "../../../../components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../components/ui/form"
import { Input } from "../../../../components/ui/input"
import { X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { createMateriaPrimaAction, updateMateriaPrimaAction } from '@/app/actions/materiasPrimasActions'

export function MateriaPrimaForm({ materiaPrima, onSuccess, onError }) {
  const {data:session} = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      codigo: materiaPrima?.codigo || "",
      nombre: materiaPrima?.nombre || "",
      sinonimos: materiaPrima?.sinonimos || [""],
      codigoInterno: materiaPrima?.codigoInterno || "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sinonimos",
  })

  const { register, handleSubmit, formState: { errors } } = form

  async function onSubmit(values) {


    setIsSubmitting(true)
    try {
      const formattedValues = {
        ...values,
        sinonimos: values.sinonimos.filter(s => s.trim() !== ""),
        organization: session?.user?.organization
      }
      if (materiaPrima) {
        await updateMateriaPrimaAction(materiaPrima._id, formattedValues)
      } else {
        await createMateriaPrimaAction(formattedValues)
      }
      onSuccess()
    } catch (error) {
      onError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Código de la materia prima" 
                  {...register("codigo", { 
                    required: "El código es requerido.",
                  })}
                />
              </FormControl>
              <FormDescription>
                Ingrese el código único de la materia prima.
              </FormDescription>
              <FormMessage>{errors.codigo?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nombre de la materia prima" 
                  {...register("nombre", { 
                    required: "El nombre es requerido.",
                    minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres." }
                  })}
                />
              </FormControl>
              <FormDescription>
                Ingrese el nombre de la materia prima.
              </FormDescription>
              <FormMessage>{errors.nombre?.message}</FormMessage>
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Sinónimos</FormLabel>
          <FormDescription>
            Ingrese sinónimos para la materia prima.
          </FormDescription>
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`sinonimos.${index}`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mt-2">
                  <FormControl>
                    <Input 
                      placeholder="Sinónimo"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append("")}
          >
            Agregar sinónimo
          </Button>
        </div>
        <FormField
          control={form.control}
          name="codigoInterno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código Interno</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Código interno (opcional)" 
                  {...register("codigoInterno")}
                />
              </FormControl>
              <FormDescription>
                Ingrese el código interno si es aplicable.
              </FormDescription>
              <FormMessage>{errors.codigoInterno?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : materiaPrima ? 'Actualizar' : 'Crear'}
        </Button>
      </form>
    </Form>
  )
}

