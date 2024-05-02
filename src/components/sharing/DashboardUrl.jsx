//Updates the URL hash for single parameter hashes. Takes in the name and value of the hash.
//Does not guarentee order of placement.
export const updateHash = (name, value) => {
    var searchParams = new URLSearchParams(window.location.hash.substring(1));
    if (!searchParams.has(name))
      searchParams.append(name, value);
    else
      searchParams.set(name, value);
    window.location.hash = searchParams.toString();
  }
  
  //Updates the URL hash for a hash comprising of a list. Each element of the list must be added
  //through this function and will be seperated by commas.
  export const updateListHash = (name, index, value) => {
    var searchParams = new URLSearchParams(window.location.hash.substring(1));
    if (searchParams.has(name)) {
      let arr = searchParams.get(name).toString().split(",");
      arr[index] = value;
      searchParams.set(name, arr.join(","));
      window.location.hash = searchParams.toString();
    }
  }