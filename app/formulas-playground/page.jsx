'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { toast } from "react-toastify"

const DynamicEditableMathField = dynamic(() => import('./DynamicEditableMathField'), {
  ssr: false,
  loading: () => <p>Cargando editor de fórmulas...</p>
})

const MathExample = ({ latex, description }) => (
  <div className="mb-4">
    <p className="text-sm text-gray-600 mb-1">{description}:</p>
    <DynamicEditableMathField
      latex={latex}
      readOnly={true}
      className="w-full border p-2 rounded-md bg-gray-50"
    />
    <p className="text-xs text-gray-500 mt-1">LaTeX: {latex}</p>
  </div>
)

export default function FormulasPlayground() {
  const [latex, setLatex] = useState('')

  const handleLatexChange = (mathField) => {
    setLatex(mathField.latex())
  }

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latex).then(() => {
      toast.success("LaTeX copiado al portapapeles")
    }, (err) => {
      toast.error("Error al copiar LaTeX")
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Formulas Playground</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ingrese su fórmula</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="formula-input">Fórmula</Label>
            <DynamicEditableMathField
              latex={latex}
              onChange={handleLatexChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="latex-output">LaTeX</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="latex-output"
                type="text"
                value={latex}
                readOnly
                className="flex-grow"
              />
              <Button onClick={handleCopyLatex}>Copiar LaTeX</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ejemplos de Fórmulas LaTeX</CardTitle>
        </CardHeader>
        <CardContent>
          <MathExample 
            latex="\sum_{i=1}^{5} x_i"
            description="Sumatoria de 5 campos"
          />
          <MathExample 
            latex="a^b"
            description="Potenciación"
          />
          <MathExample 
            latex="\sqrt{x}"
            description="Raíz cuadrada"
          />
          <MathExample 
            latex="\frac{\sum_{i=1}^{5} x_i^2}{\sqrt{n-1}}"
            description="Fórmula combinada (sumatoria, potenciación y raíz cuadrada)"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Utilice el campo de entrada para escribir su fórmula. Puede usar la sintaxis de LaTeX o los controles proporcionados por MathQuill.</p>
          <p>La fórmula se renderizará automáticamente a medida que escriba.</p>
          <p>El código LaTeX correspondiente se mostrará en el campo de texto debajo del área de entrada.</p>
          <p>Haga clic en {"\""}Copiar LaTeX{"\""} para copiar el código LaTeX al portapapeles.</p>
          <p>Consulte los ejemplos proporcionados para ver cómo se escriben diferentes tipos de fórmulas en LaTeX.</p>
        </CardContent>
      </Card>
    </div>
  )
}




/*'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { toast } from "react-toastify"

const DynamicEditableMathField = dynamic(() => import('./DynamicEditableMathField'), {
  ssr: false,
  loading: () => <p>Cargando editor de fórmulas...</p>
})

const MathExample = ({ latex, description }) => (
  <div className="mb-4">
    <p className="text-sm text-gray-600 mb-1">{description}:</p>
    <DynamicEditableMathField
      latex={latex}
      readOnly={true}
      className="w-full border p-2 rounded-md bg-gray-50"
    />
    <p className="text-xs text-gray-500 mt-1">LaTeX: {latex}</p>
  </div>
)

export default function FormulasPlayground() {
  const [latex, setLatex] = useState('')

  const handleLatexChange = (mathField) => {
    setLatex(mathField.latex())
  }

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(latex).then(() => {
      toast.success("LaTeX copiado al portapapeles")
    }, (err) => {
      toast.error("Error al copiar LaTeX")
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Formulas Playground</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ingrese su fórmula</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="formula-input">Fórmula</Label>
            <DynamicEditableMathField
              latex={latex}
              onChange={handleLatexChange}
              className="w-full border p-2 rounded-md"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="latex-output">LaTeX</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="latex-output"
                type="text"
                value={latex}
                readOnly
                className="flex-grow"
              />
              <Button onClick={handleCopyLatex}>Copiar LaTeX</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ejemplos de Fórmulas LaTeX</CardTitle>
        </CardHeader>
        <CardContent>
          <MathExample 
            latex="\sum_{i=1}^{5} x_i"
            description="Sumatoria de 5 campos"
          />
          <MathExample 
            latex="a^b"
            description="Potenciación"
          />
          <MathExample 
            latex="\sqrt{x}"
            description="Raíz cuadrada"
          />
          <MathExample 
            latex="\frac{\sum_{i=1}^{5} x_i^2}{\sqrt{n-1}}"
            description="Fórmula combinada (sumatoria, potenciación y raíz cuadrada)"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Utilice el campo de entrada para escribir su fórmula. Puede usar la sintaxis de LaTeX o los controles proporcionados por MathQuill.</p>
          <p>La fórmula se renderizará automáticamente a medida que escriba.</p>
          <p>El código LaTeX correspondiente se mostrará en el campo de texto debajo del área de entrada.</p>
          <p>Haga clic en "Copiar LaTeX" para copiar el código LaTeX al portapapeles.</p>
          <p>Consulte los ejemplos proporcionados para ver cómo se escriben diferentes tipos de fórmulas en LaTeX.</p>
        </CardContent>
      </Card>
    </div>
  )
}*/



