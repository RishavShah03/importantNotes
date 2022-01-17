<div className="mt-3 flex items-center">
  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
  <label className="font-primary-light mb-1">Radius:</label>
  <div>
    <input
      className="w-full text-md font-primary-light appearance-none p-4 text-black border-none focus:outline-none focus:ring-0 primary-light flex-grow"
      type="number"
      defaultValue={filter.radius || DEFAULT_RADIUS}
      onChange={(e) => updateRadius(+e.target.value)}
    />
  </div>
</div>;

//To remove above eslint disable commented

//use -> label with htmlFOR='radius' and input with id='radius'
