export default function DocumentationPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Documentación</h1>

      <section id="introduccion" className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Introducción</h2>
        
        <div id="bienvenida" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Bienvenida</h3>
          <p className="text-gray-600 leading-relaxed">
            Bienvenido a la documentación de nuestra plataforma. Aquí encontrarás toda la información necesaria para 
            utilizar nuestro sistema de manera efectiva.
          </p>
        </div>

        <div id="como-empezar" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Cómo empezar</h3>
          <p className="text-gray-600 mb-3">Para comenzar a utilizar nuestra plataforma, sigue estos pasos simples:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
            <li>Regístrate en la plataforma</li>
            <li>Verifica tu cuenta de correo electrónico</li>
            <li>Completa tu perfil</li>
            <li>Explora las diferentes funcionalidades</li>
          </ol>
        </div>
      </section>

      <section id="registros" className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Registros</h2>
        
        <div id="crear-registro" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Crear registro</h3>
          <p className="text-gray-600 mb-3">Para crear un nuevo registro, sigue estos pasos:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
            <li>Navega a la sección de registros</li>
            <li>Haz clic en el botón "Nuevo registro"</li>
            <li>Completa todos los campos requeridos</li>
            <li>Haz clic en "Guardar" para crear el registro</li>
          </ol>
        </div>

        <div id="editar-registro" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Editar registro</h3>
          <p className="text-gray-600 mb-3">Para editar un registro existente:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
            <li>Encuentra el registro que deseas editar</li>
            <li>Haz clic en el botón "Editar"</li>
            <li>Modifica los campos necesarios</li>
            <li>Haz clic en "Guardar cambios"</li>
          </ol>
        </div>

        <div id="eliminar-registro" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Eliminar registro</h3>
          <p className="text-gray-600 mb-3">Si necesitas eliminar un registro:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
            <li>Localiza el registro que deseas eliminar</li>
            <li>Haz clic en el botón "Eliminar"</li>
            <li>Confirma la acción en el cuadro de diálogo</li>
          </ol>
          <p className="mt-4 text-red-500 text-sm">
            Nota: Esta acción no se puede deshacer. Asegúrate de querer eliminar el registro permanentemente.
          </p>
        </div>
      </section>

      <section id="entradas" className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Entradas</h2>
        
        <div id="tipos-entradas" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Tipos de entradas</h3>
          <p className="text-gray-600 mb-3">Nuestra plataforma admite varios tipos de entradas:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 pl-4">
            <li>Texto simple</li>
            <li>Números</li>
            <li>Fechas</li>
            <li>Selección múltiple</li>
            <li>Archivos adjuntos</li>
          </ul>
        </div>

        <div id="gestionar-entradas" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Gestionar entradas</h3>
          <p className="text-gray-600 mb-3">Para gestionar tus entradas:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
            <li>Accede a la sección de entradas</li>
            <li>Utiliza los filtros para encontrar entradas específicas</li>
            <li>Haz clic en una entrada para ver sus detalles</li>
            <li>Utiliza las opciones de edición o eliminación según sea necesario</li>
          </ol>
        </div>
      </section>

      <section id="documentos" className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Documentos</h2>
        
        <div id="subir-documentos" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Subir documentos</h3>
          <p className="text-gray-600 mb-3">Para subir un nuevo documento:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
            <li>Ve a la sección de documentos</li>
            <li>Haz clic en "Subir documento"</li>
            <li>Selecciona el archivo de tu dispositivo</li>
            <li>Añade metadatos relevantes (título, descripción, etiquetas)</li>
            <li>Haz clic en "Subir" para finalizar el proceso</li>
          </ol>
        </div>

        <div id="organizar-documentos" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Organizar documentos</h3>
          <p className="text-gray-600 mb-3">Para mantener tus documentos organizados:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 pl-4">
            <li>Utiliza carpetas para agrupar documentos relacionados</li>
            <li>Asigna etiquetas para facilitar la búsqueda</li>
            <li>Usa la función de búsqueda avanzada para encontrar documentos específicos</li>
            <li>Ordena los documentos por fecha, nombre o tamaño según tus necesidades</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

