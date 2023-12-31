import FilterBtn from './FilterBtn'

function SearchDocs() {
  return (
    <form className="m-2 flex items-center justify-around">
      <FilterBtn />
      <input
        type="text"
        placeholder="Search Docs"
        className="input input-bordered input-primary w-full"
      />
      <button type="submit" className="btn btn-accent ml-1">
        Search
      </button>
    </form>
  )
}

export default SearchDocs
