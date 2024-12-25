'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { createIngresoMateriaPrimaAction, updateIngresoMateriaPrimaAction } from '@/app/actions/ingresoMateriasPrimasActions'

export function IngresoMateriaPrimaForm({ ingresoMateriaPrima, materiasPrimas, onSuccess, onError }) {
  const {data:session} = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      materiaPrima: ingresoMateriaPrima?.materiaPrima._id || "",
      lote: ingresoMateriaPrima?.lote || "",
      cantidad: ingresoMateriaPrima?.cantidad || "",
      unidad: ingresoMateriaPrima?.unidad || "",
      fechaIngreso: ingresoMateriaPrima?.fechaIngreso ? new Date(ingresoMateriaPrima.fechaIngreso).toISOString().split('T')[0] : "",
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  async function onSubmit(values) {
    setIsSubmitting(true)
    try {
      const formattedValues = {
        ...values,
        organization: session?.user?.organization,
        fechaIngreso: new Date(values.fechaIngreso).toISOString(),
      }
      if (ingresoMateriaPrima) {
        await updateIngresoMateriaPrimaAction(ingresoMateriaPrima._id, formattedValues)
      } else {
        await createIngresoMateriaPrimaAction(formattedValues)
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
          name="materiaPrima"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Materia Prima</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una materia prima" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {materiasPrimas.map((mp) => (
                    <SelectItem key={mp._id} value={mp._id}>
                      {mp.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Seleccione la materia prima ingresada.
              </FormDescription>
              <FormMessage>{errors.materiaPrima?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lote</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Número de lote" 
                  {...register("lote", { 
                    required: "El número de lote es requerido.",
                  })}
                />
              </FormControl>
              <FormDescription>
                Ingrese el número de lote de la materia prima.
              </FormDescription>
              <FormMessage>{errors.lote?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cantidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Cantidad ingresada" 
                  {...register("cantidad", { 
                    required: "La cantidad es requerida.",
                    min: { value: 0, message: "La cantidad debe ser mayor a 0." }
                  })}
                />
              </FormControl>
              <FormDescription>
                Ingrese la cantidad de materia prima.
              </FormDescription>
              <FormMessage>{errors.cantidad?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidad</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Unidad de medida" 
                  {...register("unidad", { 
                    required: "La unidad de medida es requerida.",
                  })}
                />
              </FormControl>
              <FormDescription>
                Ingrese la unidad de medida (ej. kg, l, unidades).
              </FormDescription>
              <FormMessage>{errors.unidad?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fechaIngreso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Ingreso</FormLabel>
              <FormControl>
                <Input 
                  type="date"
                  {...register("fechaIngreso", { 
                    required: "La fecha de ingreso es requerida.",
                  })}
                />
              </FormControl>
              <FormDescription>
                Seleccione la fecha de ingreso de la materia prima.
              </FormDescription>
              <FormMessage>{errors.fechaIngreso?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : ingresoMateriaPrima ? 'Actualizar' : 'Crear'}
        </Button>
      </form>
    </Form>
  )
}

