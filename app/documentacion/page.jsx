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
            <li>Haz clic en el botón &quot;Nuevo registro&quot;</li>
            <li>Completa todos los campos requeridos</li>
            <li>Haz clic en &quot;Guardar&quot; para crear el registro</li>
          </ol>
        </div>

        <div id="editar-registro" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Editar registro</h3>
          <p className="text-gray-600 mb-3">Para editar un registro existente:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
            <li>Encuentra el registro que deseas editar</li>
            <li>Haz clic en el botón &quot;Editar&quot;</li>
            <li>Modifica los campos necesarios</li>
            <li>Haz clic en &quot;Guardar cambios&quot;</li>
          </ol>
        </div>

        <div id="eliminar-registro" className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Eliminar registro</h3>
          <p className="text-gray-600 mb-3">Si necesitas eliminar un registro:</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 pl-4">
            <li>Localiza el registro que deseas eliminar</li>
            <li>Haz clic en el botón &quot;Eliminar&quot;</li>
            <li>Confirma la acción en el cuadro de diálogo</li>
          </ol>
          <p className="mt-4 text-red-500 text-sm">
            Nota: Esta acción no se puede deshacer. Asegúrate de querer eliminar el registro permanentemente.
          </p>
        </div>
      </section>

      {/* Rest of the component remains unchanged */}
    </div>
  )
}

