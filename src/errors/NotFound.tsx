const NotFound = () => {
  return (
    <main className="h-screen w-screen">
      <div className="flex items-center justify-center h-full space-x-8">
        <h1 className="text-9xl text-slate-900">:(</h1>
        <div className="flex flex-col space-y-7">
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold text-slate-800">404 - Page Not Found</h1>
            <p className="text-slate-700 font-light">The page you are trying to access does not exist</p>
          </div>
          <div>
            <span className="text-slate-700 font-extralight">NOT_FOUND</span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NotFound