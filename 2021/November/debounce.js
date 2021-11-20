// How to execute a function only after the user stops typing?
// But on second though it turned out the simplest solution is to use 
// good old friend "setTimeout" combined with "clearTimeout".

import React, { useState, useEffect } from 'react';

export const App = () => {
  const [value, setValue] = useState("");

  const handleOnChange = (event) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => console.log(`I can see you're not typing. I can use "${value}" now!`), 1000);
    return () => clearTimeout(timeoutId);
  }, [value]);

  return(
    <>
      <h1>{value}</h1>
      <input onChange={handleOnChange} value={value} />
    </>
  );
};