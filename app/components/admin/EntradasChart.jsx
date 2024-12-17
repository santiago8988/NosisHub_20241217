'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

const EntradasChart = ({  vencidas, enProceso }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')

      // Destruir el gráfico existente si hay uno
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Crear un nuevo gráfico
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [ 'Vencidas', 'En Proceso'],
          datasets: [{
            data: [ vencidas, enProceso],
            backgroundColor: [ '#EF4444', '#F59E0B']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: `Estado de Entradas`
            }
          }
        }
      })
    }

    // Limpiar el gráfico cuando el componente se desmonte
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [ vencidas, enProceso])

  return (
    <div className="w-full max-w-md mx-auto">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default EntradasChart